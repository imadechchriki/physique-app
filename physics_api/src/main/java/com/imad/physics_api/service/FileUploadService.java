package com.imad.physics_api.service;

import com.imad.physics_api.exception.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileUploadService {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadService.class);

    // Allowed image types
    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    );

    // Maximum file size (5MB)
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${server.servlet.context-path:/api}")
    private String contextPath;

    public String uploadAvatar(MultipartFile file) {
        validateFile(file);

        try {
            // Create upload directory if it doesn't exist
            String avatarDir = uploadDir + "/avatars";
            createDirectoryIfNotExists(avatarDir);

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = getFileExtension(originalFilename);
            String uniqueFilename = "avatar_" + UUID.randomUUID().toString() + fileExtension;

            // Save file
            Path filePath = Paths.get(avatarDir, uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Return URL path (relative to application root)
            String avatarUrl = contextPath + "/uploads/avatars/" + uniqueFilename;

            logger.info("Avatar uploaded successfully: {}", avatarUrl);
            return avatarUrl;

        } catch (IOException e) {
            logger.error("Failed to upload avatar: {}", e.getMessage());
            throw new BadRequestException("Failed to upload file: " + e.getMessage());
        }
    }

    public void deleteAvatar(String avatarUrl) {
        if (avatarUrl == null || avatarUrl.isEmpty()) {
            return;
        }

        try {
            // Extract filename from URL
            String filename = avatarUrl.substring(avatarUrl.lastIndexOf("/") + 1);
            Path filePath = Paths.get(uploadDir + "/avatars", filename);

            if (Files.exists(filePath)) {
                Files.delete(filePath);
                logger.info("Avatar file deleted: {}", filename);
            }
        } catch (IOException e) {
            logger.error("Failed to delete avatar file: {}", e.getMessage());
            // Don't throw exception here - we don't want to fail the operation
            // if file deletion fails
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is required");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("File size must be less than 5MB");
        }

        String contentType = file.getContentType();
        if (!ALLOWED_IMAGE_TYPES.contains(contentType)) {
            throw new BadRequestException("Only image files (JPEG, PNG, GIF, WebP) are allowed");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            throw new BadRequestException("File must have a valid name");
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return ".jpg"; // Default extension
        }
        return filename.substring(filename.lastIndexOf("."));
    }

    private void createDirectoryIfNotExists(String dirPath) throws IOException {
        Path path = Paths.get(dirPath);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
            logger.info("Created directory: {}", dirPath);
        }
    }
}