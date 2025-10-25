// ========== CourseDetailResponse.java ==========
package com.imad.physics_api.dto.response;


import com.imad.physics_api.model.enums.AcademicLevel;
import com.imad.physics_api.model.enums.Branch;
import com.imad.physics_api.model.enums.ContentStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class CourseDetailResponse {

    private UUID id;
    private String title;
    private String description;
    private String latexContent;
    private AcademicLevel academicLevel;
    private Branch branch;
    private Integer chapterNumber;
    private ContentStatus status;
    private LocalDateTime publishedAt;
    private String authorName;
    private UUID authorId;
    private Long viewCount;
    private Integer estimatedReadingTime;
    private String tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CourseSectionResponse> sections;
    private List<ImageInfo> images;

    // Classe interne pour les infos d'image
    public static class ImageInfo {
        private String filename;
        private String url;
        private boolean available;
        private String caption;

        public String getFilename() { return filename; }
        public void setFilename(String filename) { this.filename = filename; }

        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }

        public boolean isAvailable() { return available; }
        public void setAvailable(boolean available) { this.available = available; }

        public String getCaption() { return caption; }
        public void setCaption(String caption) { this.caption = caption; }
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLatexContent() { return latexContent; }
    public void setLatexContent(String latexContent) { this.latexContent = latexContent; }

    public AcademicLevel getAcademicLevel() { return academicLevel; }
    public void setAcademicLevel(AcademicLevel academicLevel) { this.academicLevel = academicLevel; }

    public Branch getBranch() { return branch; }
    public void setBranch(Branch branch) { this.branch = branch; }

    public Integer getChapterNumber() { return chapterNumber; }
    public void setChapterNumber(Integer chapterNumber) { this.chapterNumber = chapterNumber; }

    public ContentStatus getStatus() { return status; }
    public void setStatus(ContentStatus status) { this.status = status; }

    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public UUID getAuthorId() { return authorId; }
    public void setAuthorId(UUID authorId) { this.authorId = authorId; }

    public Long getViewCount() { return viewCount; }
    public void setViewCount(Long viewCount) { this.viewCount = viewCount; }

    public Integer getEstimatedReadingTime() { return estimatedReadingTime; }
    public void setEstimatedReadingTime(Integer estimatedReadingTime) { this.estimatedReadingTime = estimatedReadingTime; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<CourseSectionResponse> getSections() { return sections; }
    public void setSections(List<CourseSectionResponse> sections) { this.sections = sections; }

    public List<ImageInfo> getImages() { return images; }
    public void setImages(List<ImageInfo> images) { this.images = images; }
}