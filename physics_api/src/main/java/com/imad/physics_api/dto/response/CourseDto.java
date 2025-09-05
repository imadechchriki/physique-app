package com.imad.physics_api.dto.response;

import com.imad.physics_api.model.entity.Course;
import com.imad.physics_api.model.enums.AcademicLevel;
import com.imad.physics_api.model.enums.Branch;
import com.imad.physics_api.model.enums.CourseStatus;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.UUID;

public class CourseDto {
    private UUID id;
    private String title;
    private String description;
    private AcademicLevel academicLevel;
    private Branch branch;
    private String originalFilename;
    private Long fileSize;
    private String mimeType;
    private CourseStatus status;
    private Long viewCount;
    private String tags;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime publishedAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    // Constructors
    public CourseDto() {}

    public static CourseDto fromEntity(Course course) {
        CourseDto dto = new CourseDto();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setAcademicLevel(course.getAcademicLevel());
        dto.setBranch(course.getBranch());
        dto.setOriginalFilename(course.getOriginalFilename());
        dto.setFileSize(course.getFileSize());
        dto.setMimeType(course.getMimeType());
        dto.setStatus(course.getStatus());
        dto.setViewCount(course.getViewCount());
        dto.setTags(course.getTags());
        dto.setPublishedAt(course.getPublishedAt());
        dto.setCreatedAt(course.getCreatedAt());
        dto.setUpdatedAt(course.getUpdatedAt());
        return dto;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public AcademicLevel getAcademicLevel() { return academicLevel; }
    public void setAcademicLevel(AcademicLevel academicLevel) { this.academicLevel = academicLevel; }

    public Branch getBranch() { return branch; }
    public void setBranch(Branch branch) { this.branch = branch; }

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

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}