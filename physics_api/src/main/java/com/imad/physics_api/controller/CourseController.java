package com.imad.physics_api.controller;

import com.imad.physics_api.model.enums.AcademicLevel;
import com.imad.physics_api.model.enums.Branch;
import com.imad.physics_api.model.enums.ContentStatus;
import com.imad.physics_api.dto.request.CreateCourseRequest;
import com.imad.physics_api.dto.request.UpdateCourseRequest;
import com.imad.physics_api.dto.response.ApiResponse;
import com.imad.physics_api.dto.response.CourseDetailResponse;
import com.imad.physics_api.dto.response.CourseListResponse;
import com.imad.physics_api.service.CourseService;
import com.imad.physics_api.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/courses")
@Tag(name = "Courses", description = "Gestion des cours")
@SecurityRequirement(name = "Bearer Authentication")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Créer un nouveau cours (Admin uniquement)
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Créer un nouveau cours", description = "Crée un nouveau cours avec traitement du contenu LaTeX")
    public ResponseEntity<ApiResponse> createCourse(
            @Valid @RequestBody CreateCourseRequest request,
            @RequestHeader("Authorization") String token) {

        UUID userId = getUserIdFromToken(token);
        CourseDetailResponse course = courseService.createCourse(request, userId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Course created successfully", course));
    }

    /**
     * Mettre à jour un cours existant (Admin uniquement)
     */
    @PutMapping("/{courseId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Mettre à jour un cours", description = "Met à jour un cours existant")
    public ResponseEntity<ApiResponse> updateCourse(
            @PathVariable UUID courseId,
            @Valid @RequestBody UpdateCourseRequest request,
            @RequestHeader("Authorization") String token) {

        UUID userId = getUserIdFromToken(token);
        CourseDetailResponse course = courseService.updateCourse(courseId, request, userId);

        return ResponseEntity.ok(ApiResponse.success("Course updated successfully", course));
    }

    /**
     * Publier un cours (Admin uniquement)
     */
    @PostMapping("/{courseId}/publish")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Publier un cours", description = "Rend un cours visible aux étudiants")
    public ResponseEntity<ApiResponse> publishCourse(
            @PathVariable UUID courseId,
            @RequestHeader("Authorization") String token) {

        UUID userId = getUserIdFromToken(token);
        CourseDetailResponse course = courseService.publishCourse(courseId, userId);

        return ResponseEntity.ok(ApiResponse.success("Course published successfully", course));
    }

    /**
     * Récupérer un cours par ID
     */
    @GetMapping("/{courseId}")
    @Operation(summary = "Récupérer un cours", description = "Récupère les détails complets d'un cours avec ses sections")
    public ResponseEntity<ApiResponse> getCourse(
            @PathVariable UUID courseId,
            @RequestHeader(value = "Authorization", required = false) String token) {

        UUID userId = token != null ? getUserIdFromToken(token) : null;
        CourseDetailResponse course = courseService.getCourse(courseId, userId);

        return ResponseEntity.ok(ApiResponse.success("Course retrieved successfully", course));
    }

    /**
     * Lister les cours avec pagination et filtres
     */
    @GetMapping
    @Operation(summary = "Lister les cours", description = "Récupère la liste des cours avec pagination et filtres optionnels")
    public ResponseEntity<ApiResponse> getCourses(
            @Parameter(description = "Niveau académique")
            @RequestParam(required = false) AcademicLevel level,

            @Parameter(description = "Branche d'étude")
            @RequestParam(required = false) Branch branch,

            @Parameter(description = "Statut du cours")
            @RequestParam(required = false) ContentStatus status,

            @Parameter(description = "Numéro de page (commence à 0)")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Nombre d'éléments par page")
            @RequestParam(defaultValue = "10") int size,

            @Parameter(description = "Champ de tri")
            @RequestParam(defaultValue = "createdAt") String sortBy,

            @Parameter(description = "Direction du tri (ASC ou DESC)")
            @RequestParam(defaultValue = "DESC") Sort.Direction sortDirection) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<CourseListResponse> courses = courseService.getCourses(level, branch, status, pageable);

        return ResponseEntity.ok(ApiResponse.success("Courses retrieved successfully", courses));
    }

    /**
     * Rechercher des cours
     */
    @GetMapping("/search")
    @Operation(summary = "Rechercher des cours", description = "Recherche des cours par titre ou description")
    public ResponseEntity<ApiResponse> searchCourses(
            @Parameter(description = "Terme de recherche")
            @RequestParam String query,

            @Parameter(description = "Numéro de page")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Taille de page")
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<CourseListResponse> courses = courseService.searchCourses(query, pageable);

        return ResponseEntity.ok(ApiResponse.success("Search completed successfully", courses));
    }

    /**
     * Récupérer les cours d'un auteur
     */
    @GetMapping("/author/{authorId}")
    @Operation(summary = "Cours par auteur", description = "Récupère tous les cours créés par un auteur spécifique")
    public ResponseEntity<ApiResponse> getCoursesByAuthor(
            @PathVariable UUID authorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<CourseListResponse> courses = courseService.getCoursesByAuthor(authorId, pageable);

        return ResponseEntity.ok(ApiResponse.success("Author courses retrieved successfully", courses));
    }

    /**
     * Récupérer mes cours (pour l'auteur connecté)
     */
    @GetMapping("/my-courses")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Mes cours", description = "Récupère les cours créés par l'utilisateur connecté")
    public ResponseEntity<ApiResponse> getMyCourses(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        UUID userId = getUserIdFromToken(token);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<CourseListResponse> courses = courseService.getCoursesByAuthor(userId, pageable);

        return ResponseEntity.ok(ApiResponse.success("Your courses retrieved successfully", courses));
    }

    /**
     * Supprimer un cours (Admin uniquement)
     */
    @DeleteMapping("/{courseId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Supprimer un cours", description = "Supprime (soft delete) un cours")
    public ResponseEntity<ApiResponse> deleteCourse(
            @PathVariable UUID courseId,
            @RequestHeader("Authorization") String token) {

        UUID userId = getUserIdFromToken(token);
        courseService.deleteCourse(courseId, userId);

        return ResponseEntity.ok(ApiResponse.success("Course deleted successfully", null));
    }

    /**
     * Récupérer le progrès d'un étudiant sur un cours
     */
    @GetMapping("/{courseId}/progress")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Progrès du cours", description = "Récupère le progrès de l'étudiant connecté sur un cours")
    public ResponseEntity<ApiResponse> getStudentProgress(
            @PathVariable UUID courseId,
            @RequestHeader("Authorization") String token) {

        UUID userId = getUserIdFromToken(token);
        var progress = courseService.getStudentProgress(userId, courseId);

        if (progress == null) {
            return ResponseEntity.ok(ApiResponse.success("No progress found", null));
        }

        return ResponseEntity.ok(ApiResponse.success("Progress retrieved successfully", progress));
    }

    /**
     * Récupérer les cours populaires
     */
    @GetMapping("/popular")
    @Operation(summary = "Cours populaires", description = "Récupère les cours les plus consultés")
    public ResponseEntity<ApiResponse> getPopularCourses(
            @RequestParam(defaultValue = "10") int limit) {

        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "viewCount"));
        Page<CourseListResponse> courses = courseService.getCourses(null, null, ContentStatus.PUBLISHED, pageable);

        return ResponseEntity.ok(ApiResponse.success("Popular courses retrieved successfully", courses.getContent()));
    }

    /**
     * Récupérer les cours récents
     */
    @GetMapping("/recent")
    @Operation(summary = "Cours récents", description = "Récupère les cours récemment publiés")
    public ResponseEntity<ApiResponse> getRecentCourses(
            @RequestParam(defaultValue = "10") int limit) {

        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "publishedAt"));
        Page<CourseListResponse> courses = courseService.getCourses(null, null, ContentStatus.PUBLISHED, pageable);

        return ResponseEntity.ok(ApiResponse.success("Recent courses retrieved successfully", courses.getContent()));
    }

    // Méthode helper pour extraire l'ID utilisateur du token
    private UUID getUserIdFromToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return jwtUtil.extractUserId(token); // Changed from UUID.fromString(jwtUtil.extractUserId(token))
    }
}