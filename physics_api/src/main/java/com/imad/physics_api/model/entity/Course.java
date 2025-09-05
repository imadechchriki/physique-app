package com.imad.physics_api.model.entity;

import com.imad.physics_api.model.enums.AcademicLevel;
import com.imad.physics_api.model.enums.Branch;
import com.imad.physics_api.model.enums.CourseStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courses", indexes = {
        @Index(name = "idx_course_status", columnList = "status"),
        @Index(name = "idx_course_level", columnList = "academic_level"),
        @Index(name = "idx_course_branch", columnList = "branch"),
        @Index(name = "idx_course_created_by", columnList = "created_by")
})
public class Course extends BaseEntity {

    @NotBlank(message = "Course title is required")
    @Size(max = 200, message = "Course title must not exceed 200 characters")
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Size(max = 1000, message = "Course description must not exceed 1000 characters")
    @Column(name = "description", length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "academic_level", nullable = false, length = 20)
    private AcademicLevel academicLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "branch", nullable = false, length = 30)
    private Branch branch;

    @NotBlank(message = "File path is required")
    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath; // Supabase storage path

    @NotBlank(message = "Original filename is required")
    @Column(name = "original_filename", nullable = false, length = 255)
    private String originalFilename;

    @Column(name = "file_size", nullable = false)
    private Long fileSize; // in bytes

    @Column(name = "mime_type", nullable = false, length = 100)
    private String mimeType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private CourseStatus status = CourseStatus.ACTIVE;

    @Column(name = "view_count", nullable = false)
    private Long viewCount = 0L;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Size(max = 100, message = "Tags must not exceed 100 characters")
    @Column(name = "tags", length = 100)
    private String tags; // Comma-separated tags

    // Relationships
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CourseAccess> courseAccesses = new ArrayList<>();

    // Constructors
    public Course() {}

    public Course(String title, String description, AcademicLevel academicLevel,
                  Branch branch, String filePath, String originalFilename,
                  Long fileSize, String mimeType) {
        this.title = title;
        this.description = description;
        this.academicLevel = academicLevel;
        this.branch = branch;
        this.filePath = filePath;
        this.originalFilename = originalFilename;
        this.fileSize = fileSize;
        this.mimeType = mimeType;
        this.publishedAt = LocalDateTime.now();
    }

    // Helper methods
    public void incrementViewCount() {
        this.viewCount++;
    }

    public boolean isPublished() {
        return status == CourseStatus.ACTIVE && publishedAt != null;
    }

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public AcademicLevel getAcademicLevel() { return academicLevel; }
    public void setAcademicLevel(AcademicLevel academicLevel) { this.academicLevel = academicLevel; }

    public Branch getBranch() { return branch; }
    public void setBranch(Branch branch) { this.branch = branch; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public String getOriginalFilename() { return originalFilename; }
    public void setOriginalFilename(String originalFilename) { this.originalFilename = originalFilename; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }

    public CourseStatus getStatus() { return status; }
    public void setStatus(CourseStatus status) { this.status = status; }

    public Long getViewCount() { return viewCount; }
    public void setViewCount(Long viewCount) { this.viewCount = viewCount; }

    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public List<CourseAccess> getCourseAccesses() { return courseAccesses; }
    public void setCourseAccesses(List<CourseAccess> courseAccesses) { this.courseAccesses = courseAccesses; }
}