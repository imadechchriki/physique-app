// ========== CourseImage.java ==========
package com.imad.physics_api.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "course_images", indexes = {
        @Index(name = "idx_course_image_course", columnList = "course_id"),
        @Index(name = "idx_course_image_filename", columnList = "filename")
})
public class CourseImage extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @NotBlank(message = "Filename is required")
    @Size(max = 255, message = "Filename must not exceed 255 characters")
    @Column(name = "filename", nullable = false, length = 255)
    private String filename; // Nom du fichier sur le serveur

    @Size(max = 255, message = "Original filename must not exceed 255 characters")
    @Column(name = "original_filename", length = 255)
    private String originalFilename; // Nom original dans le LaTeX

    @Column(name = "latex_reference", length = 500)
    private String latexReference; // Référence complète dans le LaTeX (ex: \includegraphics{...})

    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath; // Chemin complet sur le serveur

    @Column(name = "mime_type", length = 50)
    private String mimeType; // Type MIME (image/png, image/jpeg, etc.)

    @Column(name = "file_size")
    private Long fileSize; // Taille en octets

    @Column(name = "width")
    private Integer width; // Largeur en pixels

    @Column(name = "height")
    private Integer height; // Hauteur en pixels

    @Column(name = "alt_text", length = 500)
    private String altText; // Texte alternatif pour accessibilité

    @Column(name = "caption", length = 500)
    private String caption; // Légende de l'image

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true; // Indique si le fichier existe sur le serveur

    @Column(name = "checksum", length = 64)
    private String checksum; // Hash SHA-256 pour vérifier l'intégrité

    // Constructors
    public CourseImage() {}

    public CourseImage(Course course, String filename, String filePath) {
        this.course = course;
        this.filename = filename;
        this.filePath = filePath;
    }

    // Getters and Setters
    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public String getOriginalFilename() { return originalFilename; }
    public void setOriginalFilename(String originalFilename) { this.originalFilename = originalFilename; }

    public String getLatexReference() { return latexReference; }
    public void setLatexReference(String latexReference) { this.latexReference = latexReference; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public Integer getWidth() { return width; }
    public void setWidth(Integer width) { this.width = width; }

    public Integer getHeight() { return height; }
    public void setHeight(Integer height) { this.height = height; }

    public String getAltText() { return altText; }
    public void setAltText(String altText) { this.altText = altText; }

    public String getCaption() { return caption; }
    public void setCaption(String caption) { this.caption = caption; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }

    public String getChecksum() { return checksum; }
    public void setChecksum(String checksum) { this.checksum = checksum; }
}