// ========== CourseListResponse.java ==========
package com.imad.physics_api.dto.response;

import com.imad.physics_api.model.enums.AcademicLevel;
import com.imad.physics_api.model.enums.Branch;
import com.imad.physics_api.model.enums.ContentStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public class CourseListResponse {

    private UUID id;
    private String title;
    private String description;
    private AcademicLevel academicLevel;
    private Branch branch;
    private Integer chapterNumber;
    private ContentStatus status;
    private LocalDateTime publishedAt;
    private String authorName;
    private Long viewCount;
    private Integer estimatedReadingTime;
    private String tags;
    private Integer sectionCount;

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

    public Integer getChapterNumber() { return chapterNumber; }
    public void setChapterNumber(Integer chapterNumber) { this.chapterNumber = chapterNumber; }

    public ContentStatus getStatus() { return status; }
    public void setStatus(ContentStatus status) { this.status = status; }

    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public Long getViewCount() { return viewCount; }
    public void setViewCount(Long viewCount) { this.viewCount = viewCount; }

    public Integer getEstimatedReadingTime() { return estimatedReadingTime; }
    public void setEstimatedReadingTime(Integer estimatedReadingTime) { this.estimatedReadingTime = estimatedReadingTime; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public Integer getSectionCount() { return sectionCount; }
    public void setSectionCount(Integer sectionCount) { this.sectionCount = sectionCount; }
}
