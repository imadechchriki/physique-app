package com.imad.physics_api.controller;

import com.imad.physics_api.dto.response.ApiResponse;
import com.imad.physics_api.service.SecureImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/images")
@Tag(name = "Images", description = "Gestion et service des images")
public class ImageController {

    @Autowired
    private SecureImageService imageService;

    /**
     * Servir une image de cours
     */
    @GetMapping("/course/{filename:.+}")
    @Operation(summary = "Récupérer une image de cours",
            description = "Récupère et sert une image associée à un cours")
    public ResponseEntity<Resource> getCourseImage(
            @Parameter(description = "Nom du fichier image")
            @PathVariable String filename) {

        try {
            Resource resource = imageService.loadImageAsResource(filename, SecureImageService.ImageContext.COURSE);

            // Déterminer le content type
            String contentType = "application/octet-stream";
            try {
                Path path = resource.getFile().toPath();
                contentType = Files.probeContentType(path);
            } catch (IOException ex) {
                // Utiliser le type par défaut si on ne peut pas le déterminer
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=3600") // Cache pour 1 heure
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Servir une image d'examen
     */
    @GetMapping("/exam/{filename:.+}")
    @Operation(summary = "Récupérer une image d'examen",
            description = "Récupère et sert une image associée à un examen")
    public ResponseEntity<Resource> getExamImage(
            @Parameter(description = "Nom du fichier image")
            @PathVariable String filename) {

        try {
            Resource resource = imageService.loadImageAsResource(filename, SecureImageService.ImageContext.EXAM);

            String contentType = "application/octet-stream";
            try {
                Path path = resource.getFile().toPath();
                contentType = Files.probeContentType(path);
            } catch (IOException ex) {
                // Utiliser le type par défaut
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=3600")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Upload d'images pour un cours (Admin uniquement)
     */
    @PostMapping("/course/upload")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Uploader des images de cours",
            description = "Upload multiple d'images pour les cours")
    public ResponseEntity<ApiResponse> uploadCourseImages(
            @Parameter(description = "Fichiers images à uploader")
            @RequestParam("files") List<MultipartFile> files) {

        Map<String, Object> results = new HashMap<>();
        Map<String, String> uploaded = new HashMap<>();
        Map<String, String> failed = new HashMap<>();

        for (MultipartFile file : files) {
            try {
                SecureImageService.ImageInfo info = imageService.storeImage(
                        file,
                        SecureImageService.ImageContext.COURSE,
                        null
                );
                uploaded.put(file.getOriginalFilename(), info.getFilename());
            } catch (Exception e) {
                failed.put(file.getOriginalFilename(), e.getMessage());
            }
        }

        results.put("uploaded", uploaded);
        results.put("failed", failed);
        results.put("totalUploaded", uploaded.size());
        results.put("totalFailed", failed.size());

        if (failed.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.success("All images uploaded successfully", results));
        } else if (uploaded.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to upload images", results));
        } else {
            return ResponseEntity.ok(ApiResponse.success("Some images uploaded successfully", results));
        }
    }

    /**
     * Upload d'images pour un examen (Admin uniquement)
     */
    @PostMapping("/exam/upload")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Uploader des images d'examen",
            description = "Upload multiple d'images pour les examens")
    public ResponseEntity<ApiResponse> uploadExamImages(
            @Parameter(description = "Fichiers images à uploader")
            @RequestParam("files") List<MultipartFile> files) {

        Map<String, Object> results = new HashMap<>();
        Map<String, String> uploaded = new HashMap<>();
        Map<String, String> failed = new HashMap<>();

        for (MultipartFile file : files) {
            try {
                SecureImageService.ImageInfo info = imageService.storeImage(
                        file,
                        SecureImageService.ImageContext.EXAM,
                        null
                );
                uploaded.put(file.getOriginalFilename(), info.getFilename());
            } catch (Exception e) {
                failed.put(file.getOriginalFilename(), e.getMessage());
            }
        }

        results.put("uploaded", uploaded);
        results.put("failed", failed);
        results.put("totalUploaded", uploaded.size());
        results.put("totalFailed", failed.size());

        if (failed.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.success("All images uploaded successfully", results));
        } else if (uploaded.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to upload images", results));
        } else {
            return ResponseEntity.ok(ApiResponse.success("Some images uploaded successfully", results));
        }
    }

    /**
     * Vérifier la disponibilité d'images (Admin uniquement)
     */
    @PostMapping("/validate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Valider la disponibilité des images",
            description = "Vérifie si les images référencées existent sur le serveur")
    public ResponseEntity<ApiResponse> validateImages(
            @RequestBody ValidateImagesRequest request) {

        SecureImageService.ValidationResult result = imageService.validateImagesAvailability(
                request.getFilenames(),
                SecureImageService.ImageContext.valueOf(request.getContext().toUpperCase())
        );

        return ResponseEntity.ok(ApiResponse.success("Validation completed", result));
    }

    /**
     * Obtenir les informations d'une image
     */
    @GetMapping("/info/{context}/{filename:.+}")
    @Operation(summary = "Informations d'une image",
            description = "Récupère les métadonnées d'une image")
    public ResponseEntity<ApiResponse> getImageInfo(
            @PathVariable String context,
            @PathVariable String filename) {

        try {
            SecureImageService.ImageContext imageContext =
                    SecureImageService.ImageContext.valueOf(context.toUpperCase());

            SecureImageService.ImageInfo info = imageService.findImage(filename, imageContext);

            if (info != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("filename", info.getFilename());
                response.put("mimeType", info.getMimeType());
                response.put("fileSize", info.getFileSize());
                response.put("width", info.getWidth());
                response.put("height", info.getHeight());
                response.put("lastModified", info.getLastModified());
                response.put("url", "/images/" + context + "/" + filename);

                return ResponseEntity.ok(ApiResponse.success("Image info retrieved", response));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Image not found", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Invalid context or error: " + e.getMessage(), null));
        }
    }

    /**
     * Nettoyer les images non utilisées (Admin uniquement)
     */
    @PostMapping("/cleanup")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Nettoyer les images non utilisées",
            description = "Supprime les images qui ne sont plus référencées")
    public ResponseEntity<ApiResponse> cleanupUnusedImages(
            @RequestBody CleanupImagesRequest request) {

        try {
            SecureImageService.ImageContext imageContext =
                    SecureImageService.ImageContext.valueOf(request.getContext().toUpperCase());

            imageService.cleanupUnusedImages(request.getUsedFilenames(), imageContext);

            return ResponseEntity.ok(ApiResponse.success("Cleanup completed successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Cleanup failed: " + e.getMessage(), null));
        }
    }

    // Classes de requête internes

    public static class ValidateImagesRequest {
        private List<String> filenames;
        private String context; // "course" ou "exam"

        public List<String> getFilenames() { return filenames; }
        public void setFilenames(List<String> filenames) { this.filenames = filenames; }

        public String getContext() { return context; }
        public void setContext(String context) { this.context = context; }
    }

    public static class CleanupImagesRequest {
        private Set<String> usedFilenames;
        private String context;

        public Set<String> getUsedFilenames() { return usedFilenames; }
        public void setUsedFilenames(Set<String> usedFilenames) { this.usedFilenames = usedFilenames; }

        public String getContext() { return context; }
        public void setContext(String context) { this.context = context; }
    }
}