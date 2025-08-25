using physics_api.Data;
using physics_api.Services;
using physics_api.Services.Interfaces;
using DotNetEnv;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using Serilog.Events;
using System.Text;
using System.IO;
using System.Data;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Information)
    .MinimumLevel.Override("System", LogEventLevel.Warning)
    // ↓ Réduit le bruit EF Core (les SELECT sur __EFMigrationsHistory)
    .MinimumLevel.Override("Microsoft.EntityFrameworkCore.Database.Command", LogEventLevel.Error)
    .Enrich.FromLogContext()
    .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {SourceContext}: {Message:lj}{NewLine}{Exception}")
    .WriteTo.File("logs/app-.log",
        rollingInterval: RollingInterval.Day,
        outputTemplate: "[{Timestamp:yyyy-MM-dd HH:mm:ss} {Level:u3}] {SourceContext}: {Message:lj}{NewLine}{Exception}",
        retainedFileCountLimit: 30)
    .CreateLogger();

try
{
    Log.Information("=== PhysicsLab Backend Starting ===");

    var builder = WebApplication.CreateBuilder(args);

    // Charge .env
    Env.Load();

    // Serilog
    builder.Host.UseSerilog();

    // Crée wwwroot si absent pour éviter le warning StaticFileMiddleware
    var webRootPath = Path.Combine(builder.Environment.ContentRootPath, "wwwroot");
    if (!Directory.Exists(webRootPath))
    {
        Directory.CreateDirectory(webRootPath);
    }
    builder.Environment.WebRootPath = webRootPath;

    // MVC + Validation
    builder.Services.AddControllers();
    builder.Services.AddFluentValidationAutoValidation();
    builder.Services.AddValidatorsFromAssemblyContaining<UserProfileCreateDTOValidator>();
    builder.Services.AddValidatorsFromAssemblyContaining<UserProfileUpdateDTOValidator>();

    // Swagger + JWT
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(options =>
    {
        options.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "PhysicsLab API",
            Version = "v1",
            Description = "Backend API for PhysicsLab - Educational Physics Platform",
            Contact = new OpenApiContact { Name = "PhysicsLab Support", Email = "support@physicslab.ma" }
        });

        var jwtScheme = new OpenApiSecurityScheme
        {
            Scheme = "bearer",
            BearerFormat = "JWT",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.Http,
            Description = "Enter 'Bearer' [space] and then your token",
            Reference = new OpenApiReference
            {
                Id = JwtBearerDefaults.AuthenticationScheme,
                Type = ReferenceType.SecurityScheme
            }
        };

        options.AddSecurityDefinition(jwtScheme.Reference.Id, jwtScheme);
        options.AddSecurityRequirement(new OpenApiSecurityRequirement { { jwtScheme, Array.Empty<string>() } });
    });

    // Connexion Postgres via variables d'env
    var connectionString =
        $"Host={Environment.GetEnvironmentVariable("DB_HOST") ?? "localhost"};" +
        $"Port={Environment.GetEnvironmentVariable("DB_PORT") ?? "5432"};" +
        $"Database={Environment.GetEnvironmentVariable("DB_NAME") ?? "physicslab_db"};" +
        $"Username={Environment.GetEnvironmentVariable("DB_USER") ?? "postgres"};" +
        $"Password={Environment.GetEnvironmentVariable("DB_PASSWORD") ?? "postgres"};";

    builder.Services.AddDbContext<UserDbContext>(options =>
        options.UseNpgsql(connectionString, npgsqlOptions =>
        {
            // ⚠️ Assurez-vous que cet assembly contient bien vos classes de migration
            npgsqlOptions.MigrationsAssembly("physics_api");
            npgsqlOptions.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null);
        }));

    // DI
    builder.Services.AddScoped<IAuthService, AuthService>();
    builder.Services.AddScoped<IAccountService, AccountService>();
    builder.Services.AddScoped<IUserProfileService, UserProfileService>();
    builder.Services.AddScoped<IErrorHandler, ErrorHandler>();
    builder.Services.AddScoped<IEmailService, SmtpEmailService>();
    builder.Services.AddScoped<ITokenService, TokenService>();

    // Background service
    builder.Services.AddHostedService<physics_api.Services.RefreshTokenCleanupService>();

    // JWT
    var jwtKey = Environment.GetEnvironmentVariable("JWT_TOKEN");
    var issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "PhysicsLabAPI";
    var audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "PhysicsLabClient";

    if (string.IsNullOrEmpty(jwtKey))
        throw new InvalidOperationException("La variable d'environnement JWT_TOKEN n'est pas définie. Vérifiez votre fichier .env.");

    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.SaveToken = true;
        options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.Zero,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                if (!string.IsNullOrEmpty(accessToken)) context.Token = accessToken;
                return Task.CompletedTask;
            },
            OnAuthenticationFailed = context =>
            {
                if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                    context.Response.Headers.Add("Token-Expired", "true");
                return Task.CompletedTask;
            }
        };
    });

    builder.Services.AddAuthorization(options =>
    {
        options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
        options.AddPolicy("StudentOnly", policy => policy.RequireRole("Student"));
        options.AddPolicy("AdminOrStudent", policy => policy.RequireRole("Admin", "Student"));
    });

    // CORS
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontendDev", policy =>
        {
            policy.WithOrigins(
                    "http://localhost:5173",
                    "http://localhost:3000",
                    "http://localhost:4200")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
                .WithExposedHeaders("Token-Expired");
        });

        options.AddPolicy("ProductionPolicy", policy =>
        {
            policy.WithOrigins(Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "https://physicslab.ma")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
                .WithExposedHeaders("Token-Expired");
        });
    });

    var app = builder.Build();

    Log.Information("🔧 === INITIALISATION AUTOMATIQUE DE LA BASE DE DONNÉES ===");
    await InitializeDatabaseAsync(app);

    // Serilog HTTP
    app.UseSerilogRequestLogging(options =>
    {
        options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
        options.GetLevel = (httpContext, elapsed, ex) =>
            ex != null ? LogEventLevel.Error :
            httpContext.Response.StatusCode > 499 ? LogEventLevel.Error : LogEventLevel.Information;

        options.EnrichDiagnosticContext = (diag, ctx) =>
        {
            diag.Set("RequestHost", ctx.Request.Host.Value);
            diag.Set("RequestScheme", ctx.Request.Scheme);
            diag.Set("UserAgent", ctx.Request.Headers["User-Agent"].FirstOrDefault());
        };
    });

    // Pipeline
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "PhysicsLab API v1");
            options.RoutePrefix = "swagger";
            options.DocumentTitle = "PhysicsLab API Documentation";
        });
        app.UseCors("AllowFrontendDev");
    }
    else
    {
        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "PhysicsLab API v1");
            options.RoutePrefix = "api-docs";
        });
        app.UseCors("ProductionPolicy");
        app.UseHsts();
    }

    app.UseHttpsRedirection();
    app.UseStaticFiles(); // wwwroot est garanti existant
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

    // Health
    app.MapGet("/", () => Results.Redirect("/swagger")).AllowAnonymous();

    app.MapGet("/health", () => new
    {
        status = "healthy",
        service = "PhysicsLab API",
        timestamp = DateTime.UtcNow,
        urls = app.Urls,
        database_initialized = true
    }).AllowAnonymous();

    app.MapGet("/health/db", async (UserDbContext context) =>
    {
        try
        {
            var canConnect = await context.Database.CanConnectAsync();
            var appliedMigrations = await context.Database.GetAppliedMigrationsAsync();
            var pendingMigrations = await context.Database.GetPendingMigrationsAsync();

            return Results.Ok(new
            {
                status = "healthy",
                database = canConnect ? "connected" : "unreachable",
                migrations_applied = appliedMigrations.Count(),
                migrations_pending = pendingMigrations.Count(),
                last_migration = appliedMigrations.LastOrDefault()
            });
        }
        catch (Exception ex)
        {
            return Results.Problem($"Database connection failed: {ex.Message}", statusCode: 503);
        }
    }).AllowAnonymous();

    // Endpoint dev : migration forcée
    if (app.Environment.IsDevelopment())
    {
        app.MapPost("/dev/migrate", async (UserDbContext context) =>
        {
            try
            {
                Log.Information("🔧 Migration forcée demandée via API...");
                await context.Database.MigrateAsync();
                await UserDbContext.SeedAsync(context);
                return Results.Ok(new { status = "success", message = "Migration forcée terminée", timestamp = DateTime.UtcNow });
            }
            catch (Exception ex)
            {
                Log.Error(ex, "❌ Erreur lors de la migration forcée");
                return Results.Problem($"Migration failed: {ex.Message}", statusCode: 500);
            }
        }).AllowAnonymous();
    }

    Log.Information("🚀 PhysicsLab API démarré avec succès sur {Urls}",
        string.Join(", ", app.Urls.Any() ? app.Urls : new[] { "ports configurés" }));

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "💥 L'application a échoué au démarrage");
}
finally
{
    Log.CloseAndFlush();
}

// ===================== INIT DB =====================
static async Task InitializeDatabaseAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var services = scope.ServiceProvider;

    try
    {
        var dbContext = services.GetRequiredService<UserDbContext>();
        var environment = services.GetRequiredService<IWebHostEnvironment>();

        dbContext.Database.SetCommandTimeout(TimeSpan.FromMinutes(5));

        Log.Information("🔗 Test de connexion à la base de données...");
        await TestDatabaseConnectionWithRetryAsync(dbContext);

        Log.Information("🔍 Analyse de l'état de la base de données...");
        var databaseExists = await DatabaseExistsAsync(dbContext);
        var migrationsTableExists = await MigrationsTableExistsAsync(dbContext);

        Log.Information("📊 État DB - Existe: {DatabaseExists}, Table migrations: {MigrationsTableExists}",
            databaseExists, migrationsTableExists);

        if (!databaseExists)
        {
            Log.Information("🏗️ Création de la base de données avec migrations...");
            await dbContext.Database.MigrateAsync();
            Log.Information("✅ Base de données créée avec migrations");
        }
        else if (!migrationsTableExists)
        {
            Log.Warning("⚠️ Base de données existe mais table migrations manquante");
            Log.Information("🔧 Création de la table migrations et application des migrations...");
            await dbContext.Database.MigrateAsync();
            Log.Information("✅ Table migrations créée et migrations appliquées");
        }
        else
        {
            Log.Information("🔄 Vérification des migrations...");
            var allMigrations = await GetAllMigrationsAsync(dbContext);

            if (!allMigrations.Any())
            {
                Log.Warning("⚠️ Aucune migration EF Core trouvée dans l'assembly !");
                Log.Warning("💡 Créez votre première migration avec: dotnet ef migrations add InitialCreate");
                Log.Warning("💡 Puis redémarrez l'application pour appliquer automatiquement");
            }
            else
            {
                var pendingMigrations = await GetPendingMigrationsAsync(dbContext);
                var appliedMigrations = await GetAppliedMigrationsAsync(dbContext);

                Log.Information("📊 Migrations appliquées: {AppliedCount}", appliedMigrations.Count);
                Log.Information("📋 Migrations en attente: {PendingCount}", pendingMigrations.Count);

                if (pendingMigrations.Any())
                {
                    Log.Information("⏳ Application des migrations: {PendingMigrations}",
                        string.Join(", ", pendingMigrations));
                    var migrationStart = DateTime.UtcNow;
                    await dbContext.Database.MigrateAsync();
                    var migrationDuration = DateTime.UtcNow - migrationStart;
                    Log.Information("✅ Migrations appliquées avec succès en {Duration}ms",
                        migrationDuration.TotalMilliseconds);
                }
                else
                {
                    Log.Information("✅ Aucune migration en attente");
                }
            }
        }

        Log.Information("🌱 Initialisation des données de base...");
        try
        {
            await UserDbContext.SeedAsync(dbContext);
            Log.Information("✅ Données initiales vérifiées/créées");
        }
        catch (Exception seedEx)
        {
            Log.Error(seedEx, "❌ Erreur lors du seeding des données");
            if (environment.IsDevelopment())
                Log.Information("🔧 Pour résoudre: dotnet ef migrations add InitialCreate && dotnet ef database update");
            Log.Warning("⚠️ Application continue sans données initiales");
        }

        var finalMigrations = await GetAppliedMigrationsAsync(dbContext);
        Log.Information("🎯 Initialisation terminée - {TotalMigrations} migrations appliquées", finalMigrations.Count);

        if (environment.IsDevelopment())
        {
            var lastMigration = finalMigrations.LastOrDefault();
            if (!string.IsNullOrEmpty(lastMigration))
                Log.Information("🏷️ Dernière migration: {LastMigration}", lastMigration);
        }

        Log.Information("🎉 === BASE DE DONNÉES INITIALISÉE AVEC SUCCÈS ===");
    }
    catch (Exception ex)
    {
        Log.Error(ex, "❌ ERREUR CRITIQUE lors de l'initialisation de la base de données: {Message}", ex.Message);
        if (app.Environment.IsProduction())
        {
            Log.Fatal("🛑 Arrêt de l'application - Base de données inaccessible en production");
            throw;
        }
        Log.Warning("⚠️ L'application continue malgré l'erreur (mode développement)");
        Log.Warning("💡 Vérifiez que PostgreSQL est démarré et accessible");
    }
}

// ===================== HELPERS =====================
static async Task<bool> DatabaseExistsAsync(UserDbContext dbContext)
{
    try { return await dbContext.Database.CanConnectAsync(); }
    catch { return false; }
}

// Check sûr de la présence de __EFMigrationsHistory (sans provoquer les erreurs bruyantes)
static async Task<bool> MigrationsTableExistsAsync(UserDbContext dbContext)
{
    try
    {
        var conn = dbContext.Database.GetDbConnection();
        if (conn.State != ConnectionState.Open) await conn.OpenAsync();
        using var cmd = conn.CreateCommand();
        // Postgres: renvoie null si l'objet n'existe pas
        cmd.CommandText = "select to_regclass('public.\"__EFMigrationsHistory\"')";
        var result = await cmd.ExecuteScalarAsync();
        return result != null && result != DBNull.Value;
    }
    catch
    {
        return false;
    }
}

static async Task<List<string>> GetAppliedMigrationsAsync(UserDbContext dbContext)
{
    try
    {
        var migrations = await dbContext.Database.GetAppliedMigrationsAsync();
        return migrations.ToList();
    }
    catch
    {
        Log.Warning("⚠️ Impossible de récupérer les migrations appliquées");
        return new List<string>();
    }
}

static async Task<List<string>> GetPendingMigrationsAsync(UserDbContext dbContext)
{
    try
    {
        var migrations = await dbContext.Database.GetPendingMigrationsAsync();
        return migrations.ToList();
    }
    catch
    {
        Log.Warning("⚠️ Impossible de récupérer les migrations en attente");
        return new List<string>();
    }
}

static async Task<List<string>> GetAllMigrationsAsync(UserDbContext dbContext)
{
    try
    {
        var migrations = dbContext.Database.GetMigrations();
        return migrations.ToList();
    }
    catch
    {
        Log.Warning("⚠️ Impossible de récupérer la liste des migrations");
        return new List<string>();
    }
}

static async Task TestDatabaseConnectionWithRetryAsync(UserDbContext dbContext, int maxRetries = 3)
{
    for (int attempt = 1; attempt <= maxRetries; attempt++)
    {
        try
        {
            var canConnect = await dbContext.Database.CanConnectAsync();
            if (canConnect)
            {
                Log.Information("✅ Connexion à la base de données réussie");
                return;
            }
            throw new Exception("La méthode CanConnectAsync a retourné false");
        }
        catch (Exception ex) when (attempt < maxRetries)
        {
            Log.Warning("⚠️ Tentative de connexion {Attempt}/{MaxRetries} échouée: {Error}",
                attempt, maxRetries, ex.Message);
            Log.Information("⏳ Attente de 2 secondes avant retry...");
            await Task.Delay(2000);
        }
    }
    throw new Exception($"Impossible de se connecter à la base de données après {maxRetries} tentatives");
}
