// ========== ExamImage.java ==========
package com.imad.physics_api.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "exam_images", indexes = {
        @Index(name = "idx_exam_image_exam", columnList = "exam_id"),
        @Index(name = "idx_exam_image_filename", columnList = "filename")
})
public class ExamImage extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @NotBlank(message = "Filename is required")
    @Size(max = 255, message = "Filename must not exceed 255 characters")
    @Column(name = "filename", nullable = false, length = 255)
    private String filename;

    @Size(max = 255, message = "Original filename must not exceed 255 characters")
    @Column(name = "original_filename", length = 255)
    private String originalFilename;

    @Column(name = "latex_reference", length = 500)
    private String latexReference;

    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    @Column(name = "mime_type", length = 50)
    private String mimeType;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "width")
    private Integer width;

    @Column(name = "height")
    private Integer height;

    @Column(name = "alt_text", length = 500)
    private String altText;

    @Column(name = "caption", length = 500)
    private String caption;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    @Column(name = "checksum", length = 64)
    private String checksum;

    // Constructors and Getters/Setters similar to CourseImage
    public ExamImage() {}

    public ExamImage(Exam exam, String filename, String filePath) {
        this.exam = exam;
        this.filename = filename;
        this.filePath = filePath;
    }

    // All getters and setters...
    public Exam getExam() { return exam; }
    public void setExam(Exam exam) { this.exam = exam; }

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