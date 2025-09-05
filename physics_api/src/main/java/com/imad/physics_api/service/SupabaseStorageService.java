// Version améliorée avec la méthode generateSignedUrl corrigée
package com.imad.physics_api.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class SupabaseStorageService {

    private static final Logger logger = LoggerFactory.getLogger(SupabaseStorageService.class);

    @Value("${app.supabase.url}")
    private String supabaseUrl;

    @Value("${app.supabase.service-role-key}")
    private String serviceRoleKey;

    @Value("${app.supabase.bucket-name}")
    private String bucketName;

    @Value("${app.supabase.signed-url-expiry:300}") // 5 minutes default
    private int signedUrlExpirySeconds;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "application/pdf"
    );

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    public SupabaseStorageService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Upload a PDF file to Supabase Storage
     */
    public SupabaseUploadResult uploadFile(MultipartFile file, String folder) {
        try {
            // Validate file
            validateFile(file);

            // Generate unique filename
            String fileName = generateFileName(file.getOriginalFilename());
            String filePath = folder + "/" + fileName;

            logger.info("Uploading file: {} to path: {}", file.getOriginalFilename(), filePath);

            // Prepare headers with proper authorization
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + serviceRoleKey);
            headers.set("Content-Type", file.getContentType());
            headers.set("x-upsert", "true"); // Allow overwrite if file exists

            // Create request entity with file bytes directly
            HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);

            // Correct Supabase upload URL format
            String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + filePath;

            logger.debug("Upload URL: {}", uploadUrl);
            logger.debug("File size: {} bytes", file.getSize());

            ResponseEntity<String> response = restTemplate.exchange(
                    uploadUrl,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("File uploaded successfully: {}", filePath);
                return new SupabaseUploadResult(true, filePath, fileName, file.getSize(), null);
            } else {
                String error = "Upload failed with status: " + response.getStatusCode();
                logger.error(error);
                return new SupabaseUploadResult(false, null, null, 0L, error);
            }

        } catch (RestClientException e) {
            String error = "REST client error during upload: " + e.getMessage();
            logger.error(error, e);
            return new SupabaseUploadResult(false, null, null, 0L, error);
        } catch (Exception e) {
            String error = "Unexpected error during upload: " + e.getMessage();
            logger.error(error, e);
            return new SupabaseUploadResult(false, null, null, 0L, error);
        }
    }



    /**
     * Final corrected generateSignedUrl method
     */
    public String generateSignedUrl(String filePath) {
        try {
            String cleanPath = cleanFilePath(filePath);
            String requestBody = String.format("{\"expiresIn\": %d}", signedUrlExpirySeconds);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + serviceRoleKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);
            String signedUrlEndpoint = supabaseUrl + "/storage/v1/object/sign/" + bucketName + "/" + cleanPath;

            ResponseEntity<String> response = restTemplate.exchange(
                    signedUrlEndpoint, HttpMethod.POST, requestEntity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                JsonNode jsonResponse = objectMapper.readTree(response.getBody());
                String signedUrlFromSupabase = jsonResponse.get("signedURL").asText();

                logger.debug("Raw signedURL from Supabase: {}", signedUrlFromSupabase);

                // Ensure we have the complete path with /storage/v1
                String fullAccessUrl;
                if (signedUrlFromSupabase.startsWith("/storage/v1/")) {
                    // Already has the full path
                    fullAccessUrl = supabaseUrl + signedUrlFromSupabase;
                } else if (signedUrlFromSupabase.startsWith("/object/sign/")) {
                    // Missing /storage/v1 prefix
                    fullAccessUrl = supabaseUrl + "/storage/v1" + signedUrlFromSupabase;
                } else {
                    // Fallback
                    fullAccessUrl = supabaseUrl + "/storage/v1/object/sign/" + signedUrlFromSupabase;
                }

                logger.debug("Final access URL: {}", fullAccessUrl);
                return fullAccessUrl;
            }

            return null;
        } catch (Exception e) {
            logger.error("Error generating signed URL: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Nettoie le chemin du fichier pour éviter les doubles slashes
     */
    private String cleanFilePath(String filePath) {
        if (filePath == null) {
            return "";
        }

        // Supprimer les slashes en début et fin
        String cleaned = filePath.trim();
        if (cleaned.startsWith("/")) {
            cleaned = cleaned.substring(1);
        }
        if (cleaned.endsWith("/")) {
            cleaned = cleaned.substring(0, cleaned.length() - 1);
        }

        // Remplacer les doubles slashes par des slashes simples
        cleaned = cleaned.replaceAll("/+", "/");

        return cleaned;
    }

    /**
     * Delete a file from Supabase Storage
     */
    public boolean deleteFile(String filePath) {
        try {
            String cleanPath = cleanFilePath(filePath);
            logger.info("Deleting file: {}", cleanPath);

            // Prepare headers
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + serviceRoleKey);

            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

            // Delete from Supabase
            String deleteUrl = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + cleanPath;
            ResponseEntity<String> response = restTemplate.exchange(
                    deleteUrl,
                    HttpMethod.DELETE,
                    requestEntity,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("File deleted successfully: {}", cleanPath);
                return true;
            } else {
                logger.error("Delete failed with status: {} for file: {}", response.getStatusCode(), cleanPath);
                return false;
            }

        } catch (Exception e) {
            logger.error("Error deleting file {}: {}", filePath, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Check if file exists in Supabase Storage
     */
    public boolean fileExists(String filePath) {
        try {
            String cleanPath = cleanFilePath(filePath);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + serviceRoleKey);

            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

            String checkUrl = supabaseUrl + "/storage/v1/object/info/" + bucketName + "/" + cleanPath;
            ResponseEntity<String> response = restTemplate.exchange(
                    checkUrl,
                    HttpMethod.GET,
                    requestEntity,
                    String.class
            );

            return response.getStatusCode().is2xxSuccessful();

        } catch (Exception e) {
            logger.debug("File does not exist or error checking: {}", filePath);
            return false;
        }
    }

    /**
     * Create bucket if it doesn't exist (for development)
     */
    public void createBucketIfNotExists() {
        try {
            logger.info("Checking if bucket exists: {}", bucketName);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + serviceRoleKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Check if bucket exists
            String listUrl = supabaseUrl + "/storage/v1/bucket";
            HttpEntity<Void> checkEntity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    listUrl,
                    HttpMethod.GET,
                    checkEntity,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                JsonNode buckets = objectMapper.readTree(response.getBody());
                boolean bucketExists = false;

                for (JsonNode bucket : buckets) {
                    if (bucketName.equals(bucket.get("id").asText())) {
                        bucketExists = true;
                        break;
                    }
                }

                if (!bucketExists) {
                    // Create bucket
                    String createBucketBody = String.format(
                            "{\"id\": \"%s\", \"name\": \"%s\", \"public\": false}",
                            bucketName, bucketName
                    );

                    HttpEntity<String> createEntity = new HttpEntity<>(createBucketBody, headers);
                    restTemplate.exchange(listUrl, HttpMethod.POST, createEntity, String.class);
                    logger.info("Created bucket: {}", bucketName);
                }
            }

        } catch (Exception e) {
            logger.warn("Could not create bucket (might already exist): {}", e.getMessage());
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be null or empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size of " + (MAX_FILE_SIZE / 1024 / 1024) + "MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Only PDF files are allowed. Received: " + contentType);
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("File must have .pdf extension");
        }
    }

    private String generateFileName(String originalFilename) {
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        return UUID.randomUUID().toString() + fileExtension;
    }

    // Inner classes for request/response
    public static class SupabaseUploadResult {
        private final boolean success;
        private final String filePath;
        private final String fileName;
        private final Long fileSize;
        private final String errorMessage;

        public SupabaseUploadResult(boolean success, String filePath, String fileName, Long fileSize, String errorMessage) {
            this.success = success;
            this.filePath = filePath;
            this.fileName = fileName;
            this.fileSize = fileSize;
            this.errorMessage = errorMessage;
        }

        // Getters
        public boolean isSuccess() { return success; }
        public String getFilePath() { return filePath; }
        public String getFileName() { return fileName; }
        public Long getFileSize() { return fileSize; }
        public String getErrorMessage() { return errorMessage; }
    }
}