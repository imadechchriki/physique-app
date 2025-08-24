using backend_physique_app.Data;
using backend_physique_app.Services;
using backend_physique_app.Services.Interfaces;
using DotNetEnv;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Serilog;
using Serilog.Events;

// Configure Serilog early
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Information)
    .MinimumLevel.Override("System", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {SourceContext}: {Message:lj}{NewLine}{Exception}")
    .WriteTo.File("logs/app-.log",
        rollingInterval: RollingInterval.Day,
        outputTemplate: "[{Timestamp:yyyy-MM-dd HH:mm:ss} {Level:u3}] {SourceContext}: {Message:lj}{NewLine}{Exception}",
        retainedFileCountLimit: 30) // Garde 30 jours de logs
    .CreateLogger();

try
{
    Log.Information("=== PhysicsLab Backend Starting ===");

    var builder = WebApplication.CreateBuilder(args);

    // Load environment variables from .env file
    Env.Load();

    // Configure Serilog as the logging provider
    builder.Host.UseSerilog();

    // Add controllers
    builder.Services.AddControllers();

    // Add FluentValidation
    builder.Services.AddFluentValidationAutoValidation();
    builder.Services.AddValidatorsFromAssemblyContaining<UserProfileCreateDTOValidator>();
    builder.Services.AddValidatorsFromAssemblyContaining<UserProfileUpdateDTOValidator>();

    // Add Swagger and configure JWT security for Swagger UI
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(options =>
    {
        options.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "PhysicsLab API",
            Version = "v1",
            Description = "Backend API for PhysicsLab - Educational Physics Platform",
            Contact = new OpenApiContact
            {
                Name = "PhysicsLab Support",
                Email = "support@physicslab.ma"
            }
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
        options.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            { jwtScheme, Array.Empty<string>() }
        });
    });

    // Database configuration with environment variables
    var connectionString = $"Host={Environment.GetEnvironmentVariable("DB_HOST") ?? "localhost"};" +
                           $"Port={Environment.GetEnvironmentVariable("DB_PORT") ?? "5432"};" +
                           $"Database={Environment.GetEnvironmentVariable("DB_NAME") ?? "physicslab_db"};" +
                           $"Username={Environment.GetEnvironmentVariable("DB_USER") ?? "postgres"};" +
                           $"Password={Environment.GetEnvironmentVariable("DB_PASSWORD") ?? "postgres"};";

    // Configure PostgreSQL database context
    builder.Services.AddDbContext<UserDbContext>(options =>
        options.UseNpgsql(connectionString, npgsqlOptions =>
        {
            npgsqlOptions.MigrationsAssembly("backend_physique_app");
            npgsqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(10),
                errorCodesToAdd: null);
        }));

    // Core Services - Dependency Injection
    builder.Services.AddScoped<IAuthService, AuthService>();
    builder.Services.AddScoped<IAccountService, AccountService>();
    builder.Services.AddScoped<IUserProfileService, UserProfileService>();
    builder.Services.AddScoped<IErrorHandler, ErrorHandler>();
    builder.Services.AddScoped<IEmailService, SmtpEmailService>();
    builder.Services.AddScoped<ITokenService, TokenService>();

    // Background Services
    builder.Services.AddHostedService<backend_physique_app.Services.RefreshTokenCleanupService>();

    // Get JWT environment variables
    var jwtKey = Environment.GetEnvironmentVariable("JWT_TOKEN");
    var issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "PhysicsLabAPI";
    var audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "PhysicsLabClient";

    // Validate JWT key
    if (string.IsNullOrEmpty(jwtKey))
    {
        throw new InvalidOperationException("La variable d'environnement JWT_TOKEN n'est pas définie. Vérifiez votre fichier .env.");
    }

    // Configure JWT Authentication
    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.SaveToken = true;
        options.RequireHttpsMetadata = false; // Set to true in production

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
                // Allow JWT token from query string for SignalR or other scenarios
                var accessToken = context.Request.Query["access_token"];
                if (!string.IsNullOrEmpty(accessToken))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            },
            OnAuthenticationFailed = context =>
            {
                if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                {
                    context.Response.Headers.Add("Token-Expired", "true");
                }
                return Task.CompletedTask;
            }
        };
    });

    // Add Authorization
    builder.Services.AddAuthorization(options =>
    {
        // Define policies for different roles
        options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
        options.AddPolicy("StudentOnly", policy => policy.RequireRole("Student"));
        options.AddPolicy("AdminOrStudent", policy => policy.RequireRole("Admin", "Student"));
    });

    // CORS Configuration
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontendDev", policy =>
        {
            policy.WithOrigins(
                    "http://localhost:5173",  // Vite default
                    "http://localhost:3000",  // React default
                    "http://localhost:4200"   // Angular default
                )
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });

        // Production CORS policy
        options.AddPolicy("ProductionPolicy", policy =>
        {
            policy.WithOrigins(
                    Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "https://physicslab.ma"
                )
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
    });

    var app = builder.Build();

    // Add Serilog HTTP request logging
    app.UseSerilogRequestLogging(options =>
    {
        // Customize the message template
        options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";

        // Emit debug-level events instead of the defaults
        options.GetLevel = (httpContext, elapsed, ex) => ex != null
            ? LogEventLevel.Error
            : httpContext.Response.StatusCode > 499
                ? LogEventLevel.Error
                : LogEventLevel.Information;

        // Attach additional properties to the request completion event
        options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
        {
            diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value);
            diagnosticContext.Set("RequestScheme", httpContext.Request.Scheme);
            diagnosticContext.Set("UserAgent", httpContext.Request.Headers["User-Agent"].FirstOrDefault());
        };
    });

    // Database Migration and Seeding
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;

        try
        {
            var dbContext = services.GetRequiredService<UserDbContext>();

            // Check database connection
            Log.Information("Vérification de la connexion à la base de données...");
            if (await dbContext.Database.CanConnectAsync())
            {
                Log.Information("? Connexion à la base de données réussie");
            }
            else
            {
                throw new Exception("Impossible de se connecter à la base de données.");
            }

            // Apply migrations
            Log.Information("Application des migrations...");
            var pendingMigrations = await dbContext.Database.GetPendingMigrationsAsync();

            if (pendingMigrations.Any())
            {
                Log.Information("Migrations en attente: {PendingMigrations}", string.Join(", ", pendingMigrations));
                await dbContext.Database.MigrateAsync();
                Log.Information("? Migrations appliquées avec succès");
            }
            else
            {
                Log.Information("? Aucune migration en attente");
            }

            // Seed initial data
            Log.Information("Initialisation des données de base...");
            await UserDbContext.SeedAsync(dbContext);
            Log.Information("? Données initiales créées/vérifiées");

            Log.Information("=== Base de données initialisée avec succès ===");
        }
        catch (Exception ex)
        {
            Log.Error(ex, "? Erreur lors de l'initialisation de la base de données: {Message}", ex.Message);

            if (!app.Environment.IsDevelopment())
            {
                throw; // Stop application in production
            }

            Log.Warning("?? L'application continue malgré l'erreur (mode développement)");
        }
    }

    // Configure the HTTP request pipeline
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "PhysicsLab API v1");
            options.RoutePrefix = "swagger"; // Access via /swagger
            options.DocumentTitle = "PhysicsLab API Documentation";
        });

        app.UseCors("AllowFrontendDev");
    }
    else
    {
        // Production configuration
        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "PhysicsLab API v1");
            options.RoutePrefix = "api-docs"; // Access via /api-docs in production
        });

        app.UseCors("ProductionPolicy");
        app.UseHsts();
    }

    // Middleware pipeline order is important!
    app.UseHttpsRedirection();
    app.UseStaticFiles();

    // Authentication & Authorization
    app.UseAuthentication();
    app.UseAuthorization();

    // Map controllers
    app.MapControllers();

    // Health check endpoints
    app.MapGet("/", () => Results.Redirect("/swagger")).AllowAnonymous();
    app.MapGet("/health", () => new
    {
        status = "healthy",
        service = "PhysicsLab API",
        timestamp = DateTime.UtcNow
    }).AllowAnonymous();

    app.MapGet("/health/db", async (UserDbContext context) =>
    {
        try
        {
            await context.Database.CanConnectAsync();
            return Results.Ok(new { status = "healthy", database = "connected" });
        }
        catch
        {
            return Results.Problem("Database connection failed", statusCode: 503);
        }
    }).AllowAnonymous();

    Log.Information("?? PhysicsLab API démarré sur {Url}", app.Urls.FirstOrDefault() ?? "http://localhost:5000");

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "? L'application a échoué au démarrage");
}
finally
{
    Log.CloseAndFlush();
}