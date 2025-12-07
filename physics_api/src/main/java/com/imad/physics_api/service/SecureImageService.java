package com.imad.physics_api.service;

import com.imad.physics_api.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;  // Fixed import for Jakarta EE
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

@Service
public class SecureImageService {

    private static final Logger logger = LoggerFactory.getLogger(SecureImageService.class);

    @Value("${app.upload.images.dir:uploads/images}")
    private String imageStorageDir;

    @Value("${app.upload.images.courses.dir:uploads/images/courses}")
    private String courseImagesDir;

    @Value("${app.upload.images.exams.dir:uploads/images/exams}")
    private String examImagesDir;

    @Value("${app.upload.images.max-size:5242880}") // 5MB par défaut
    private long maxFileSize;

    private Path rootLocation;
    private Path courseImagesLocation;
    private Path examImagesLocation;

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "jpg", "jpeg", "png", "gif", "svg", "webp"
    );

    private static final Map<String, String> MIME_TYPE_MAP = Map.of(
            "jpg", "image/jpeg",
            "jpeg", "image/jpeg",
            "png", "image/png",
            "gif", "image/gif",
            "svg", "image/svg+xml",
            "webp", "image/webp"
    );

    @PostConstruct
    public void init() {
        try {
            this.rootLocation = Paths.get(imageStorageDir).toAbsolutePath().normalize();
            this.courseImagesLocation = Paths.get(courseImagesDir).toAbsolutePath().normalize();
            this.examImagesLocation = Paths.get(examImagesDir).toAbsolutePath().normalize();

            // Créer les répertoires s'ils n'existent pas
            Files.createDirectories(this.rootLocation);
            Files.createDirectories(this.courseImagesLocation);
            Files.createDirectories(this.examImagesLocation);

            logger.info("Image storage initialized at: {}", rootLocation);
        } catch (IOException e) {
            logger.error("Could not initialize image storage", e);
            throw new RuntimeException("Could not initialize image storage", e);
        }
    }

    /**
     * Recherche une image dans les répertoires configurés
     */
    public ImageInfo findImage(String filename, ImageContext context) {
        String cleanFilename = cleanFilename(filename);

        // Déterminer le répertoire de recherche selon le contexte
        Path searchPath = getSearchPath(context);

        // Essayer avec le nom de fichier tel quel
        Path imagePath = searchPath.resolve(cleanFilename);
        if (Files.exists(imagePath) && Files.isReadable(imagePath)) {
            return createImageInfo(imagePath, cleanFilename);
        }

        // Essayer avec différentes extensions si aucune n'est spécifiée
        if (!hasExtension(cleanFilename)) {
            for (String ext : ALLOWED_EXTENSIONS) {
                Path pathWithExt = searchPath.resolve(cleanFilename + "." + ext);
                if (Files.exists(pathWithExt) && Files.isReadable(pathWithExt)) {
                    return createImageInfo(pathWithExt, cleanFilename + "." + ext);
                }
            }
        }

        // Recherche récursive dans les sous-dossiers
        try {
            Optional<Path> found = Files.walk(searchPath, 3) // Limiter la profondeur
                    .filter(Files::isRegularFile)
                    .filter(path -> {
                        String name = path.getFileName().toString();
                        return name.equalsIgnoreCase(cleanFilename) ||
                                (name.startsWith(cleanFilename + ".") && hasAllowedExtension(name));
                    })
                    .findFirst();

            if (found.isPresent()) {
                return createImageInfo(found.get(), found.get().getFileName().toString());
            }
        } catch (IOException e) {
            logger.error("Error searching for image: {}", cleanFilename, e);
        }

        return null;
    }

    /**
     * Récupère une image de manière sécurisée
     */
    public Resource loadImageAsResource(String filename, ImageContext context) {
        ImageInfo imageInfo = findImage(filename, context);

        if (imageInfo == null) {
            throw new ResourceNotFoundException("Image not found: " + filename);
        }

        try {
            Resource resource = new UrlResource(imageInfo.getPath().toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("Could not read image: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Malformed URL for image: " + filename, e);
        }
    }

    /**
     * Stocke une image uploadée
     */
    public ImageInfo storeImage(MultipartFile file, ImageContext context, String targetFilename) {
        validateImageFile(file);

        String filename = targetFilename != null ? targetFilename : generateUniqueFilename(file);
        Path targetPath = getSearchPath(context).resolve(filename);

        try {
            // Copier le fichier
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // Générer les métadonnées
            ImageInfo info = createImageInfo(targetPath, filename);

            // Calculer le checksum
            info.setChecksum(calculateChecksum(targetPath));

            // Lire les dimensions de l'image
            BufferedImage img = ImageIO.read(targetPath.toFile());
            if (img != null) {
                info.setWidth(img.getWidth());
                info.setHeight(img.getHeight());
            }

            logger.info("Stored image: {} in {}", filename, context);
            return info;

        } catch (IOException e) {
            logger.error("Failed to store image: {}", filename, e);
            throw new RuntimeException("Failed to store image", e);
        }
    }

    /**
     * Associe les images détectées dans le LaTeX avec les fichiers sur le serveur
     */
    public List<ImageMapping> mapLatexImages(List<LaTeXProcessorService.ImageReference> latexImages,
                                             ImageContext context) {
        List<ImageMapping> mappings = new ArrayList<>();

        for (LaTeXProcessorService.ImageReference ref : latexImages) {
            ImageMapping mapping = new ImageMapping();
            mapping.setLatexReference(ref.getLatexReference());
            mapping.setOriginalPath(ref.getOriginalPath());

            ImageInfo found = findImage(ref.getFilename(), context);
            if (found != null) {
                mapping.setServerPath(found.getPath().toString());
                mapping.setFilename(found.getFilename());
                mapping.setAvailable(true);
                mapping.setUrl(generateSecureUrl(found.getFilename(), context));
            } else {
                mapping.setAvailable(false);
                logger.warn("Image not found: {} for context {}", ref.getFilename(), context);
            }

            mappings.add(mapping);
        }

        return mappings;
    }

    /**
     * Vérifie la disponibilité des images pour un contenu
     */
    public ValidationResult validateImagesAvailability(List<String> imageFilenames, ImageContext context) {
        ValidationResult result = new ValidationResult();
        List<String> missing = new ArrayList<>();
        List<String> found = new ArrayList<>();

        for (String filename : imageFilenames) {
            if (findImage(filename, context) != null) {
                found.add(filename);
            } else {
                missing.add(filename);
            }
        }

        result.setTotalImages(imageFilenames.size());
        result.setFoundImages(found);
        result.setMissingImages(missing);
        result.setAllImagesAvailable(missing.isEmpty());

        return result;
    }

    /**
     * Nettoie les images non utilisées
     */
    public void cleanupUnusedImages(Set<String> usedFilenames, ImageContext context) {
        Path searchPath = getSearchPath(context);

        try {
            Files.walk(searchPath)
                    .filter(Files::isRegularFile)
                    .filter(this::isImageFile)
                    .forEach(path -> {
                        String filename = path.getFileName().toString();
                        if (!usedFilenames.contains(filename)) {
                            try {
                                Files.delete(path);
                                logger.info("Deleted unused image: {}", filename);
                            } catch (IOException e) {
                                logger.error("Failed to delete unused image: {}", filename, e);
                            }
                        }
                    });
        } catch (IOException e) {
            logger.error("Error during image cleanup", e);
        }
    }

    // Méthodes utilitaires privées

    private Path getSearchPath(ImageContext context) {
        switch (context) {
            case COURSE:
                return courseImagesLocation;
            case EXAM:
                return examImagesLocation;
            default:
                return rootLocation;
        }
    }

    private String cleanFilename(String filename) {
        // Nettoyer le nom de fichier de caractères dangereux
        String cleaned = StringUtils.cleanPath(filename);
        cleaned = cleaned.replaceAll("\\.\\.", "");
        cleaned = cleaned.replaceAll("/", "");
        cleaned = cleaned.replaceAll("\\\\", "");
        return cleaned;
    }

    private boolean hasExtension(String filename) {
        return filename.contains(".") && filename.lastIndexOf(".") < filename.length() - 1;
    }

    private boolean hasAllowedExtension(String filename) {
        String extension = getFileExtension(filename).toLowerCase();
        return ALLOWED_EXTENSIONS.contains(extension);
    }

    private String getFileExtension(String filename) {
        int lastDot = filename.lastIndexOf(".");
        if (lastDot > 0 && lastDot < filename.length() - 1) {
            return filename.substring(lastDot + 1);
        }
        return "";
    }

    private void validateImageFile(MultipartFile file) {
        // Vérifier la taille
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size");
        }

        // Vérifier l'extension
        String filename = StringUtils.cleanPath(file.getOriginalFilename());
        if (!hasAllowedExtension(filename)) {
            throw new IllegalArgumentException("File type not allowed");
        }

        // Vérifier le contenu réel (magic numbers)
        try {
            String mimeType = file.getContentType();
            if (mimeType == null || !mimeType.startsWith("image/")) {
                throw new IllegalArgumentException("File is not an image");
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid image file", e);
        }
    }

    private String generateUniqueFilename(MultipartFile file) {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = getFileExtension(originalFilename);
        String nameWithoutExt = originalFilename.substring(0, originalFilename.lastIndexOf("."));

        return nameWithoutExt + "_" + System.currentTimeMillis() + "." + extension;
    }

    private ImageInfo createImageInfo(Path path, String filename) {
        ImageInfo info = new ImageInfo();
        info.setPath(path);
        info.setFilename(filename);

        try {
            info.setFileSize(Files.size(path));
            info.setMimeType(Files.probeContentType(path));
            info.setLastModified(Files.getLastModifiedTime(path).toMillis());
        } catch (IOException e) {
            logger.error("Error reading image info for: {}", filename, e);
        }

        return info;
    }

    private String calculateChecksum(Path path) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            try (InputStream fis = Files.newInputStream(path)) {
                byte[] buffer = new byte[8192];
                int bytesRead;
                while ((bytesRead = fis.read(buffer)) != -1) {
                    digest.update(buffer, 0, bytesRead);
                }
            }

            byte[] hashBytes = digest.digest();
            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();

        } catch (NoSuchAlgorithmException | IOException e) {
            logger.error("Error calculating checksum", e);
            return null;
        }
    }

    private String generateSecureUrl(String filename, ImageContext context) {
        // Générer une URL sécurisée pour accéder à l'image
        return "/api/images/" + context.toString().toLowerCase() + "/" + filename;
    }

    private boolean isImageFile(Path path) {
        String filename = path.getFileName().toString();
        return hasAllowedExtension(filename);
    }

    // Classes internes

    public enum ImageContext {
        COURSE, EXAM, GENERAL
    }

    public static class ImageInfo {
        private Path path;
        private String filename;
        private String mimeType;
        private long fileSize;
        private long lastModified;
        private Integer width;
        private Integer height;
        private String checksum;

        // Getters and Setters
        public Path getPath() { return path; }
        public void setPath(Path path) { this.path = path; }

        public String getFilename() { return filename; }
        public void setFilename(String filename) { this.filename = filename; }

        public String getMimeType() { return mimeType; }
        public void setMimeType(String mimeType) { this.mimeType = mimeType; }

        public long getFileSize() { return fileSize; }
        public void setFileSize(long fileSize) { this.fileSize = fileSize; }

        public long getLastModified() { return lastModified; }
        public void setLastModified(long lastModified) { this.lastModified = lastModified; }

        public Integer getWidth() { return width; }
        public void setWidth(Integer width) { this.width = width; }

        public Integer getHeight() { return height; }
        public void setHeight(Integer height) { this.height = height; }

        public String getChecksum() { return checksum; }
        public void setChecksum(String checksum) { this.checksum = checksum; }
    }

    public static class ImageMapping {
        private String latexReference;
        private String originalPath;
        private String serverPath;
        private String filename;
        private String url;
        private boolean available;

        // Getters and Setters
        public String getLatexReference() { return latexReference; }
        public void setLatexReference(String latexReference) { this.latexReference = latexReference; }

        public String getOriginalPath() { return originalPath; }
        public void setOriginalPath(String originalPath) { this.originalPath = originalPath; }

        public String getServerPath() { return serverPath; }
        public void setServerPath(String serverPath) { this.serverPath = serverPath; }

        public String getFilename() { return filename; }
        public void setFilename(String filename) { this.filename = filename; }

        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }

        public boolean isAvailable() { return available; }
        public void setAvailable(boolean available) { this.available = available; }
    }

    public static class ValidationResult {
        private int totalImages;
        private List<String> foundImages;
        private List<String> missingImages;
        private boolean allImagesAvailable;

        // Getters and Setters
        public int getTotalImages() { return totalImages; }
        public void setTotalImages(int totalImages) { this.totalImages = totalImages; }

        public List<String> getFoundImages() { return foundImages; }
        public void setFoundImages(List<String> foundImages) { this.foundImages = foundImages; }

        public List<String> getMissingImages() { return missingImages; }
        public void setMissingImages(List<String> missingImages) { this.missingImages = missingImages; }

        public boolean isAllImagesAvailable() { return allImagesAvailable; }
        public void setAllImagesAvailable(boolean allImagesAvailable) {
            this.allImagesAvailable = allImagesAvailable;
        }
    }
}