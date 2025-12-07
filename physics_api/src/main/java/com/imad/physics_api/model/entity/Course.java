package com.imad.physics_api.model.entity;

import com.imad.physics_api.model.enums.AcademicLevel;
import com.imad.physics_api.model.enums.Branch;
import com.imad.physics_api.model.enums.ContentStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courses", indexes = {
        @Index(name = "idx_course_academic_level", columnList = "academic_level"),
        @Index(name = "idx_course_branch", columnList = "branch"),
        @Index(name = "idx_course_status", columnList = "status"),
        @Index(name = "idx_course_published", columnList = "published_at")
})
public class Course extends BaseEntity {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "latex_content", columnDefinition = "TEXT", nullable = false)
    private String latexContent;

    @Column(name = "raw_latex_content", columnDefinition = "TEXT")
    private String rawLatexContent; // Contenu LaTeX original avant traitement

    @Enumerated(EnumType.STRING)
    @Column(name = "academic_level", length = 20)
    private AcademicLevel academicLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "branch", length = 30)
    private Branch branch;

    @Column(name = "chapter_number")
    private Integer chapterNumber;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ContentStatus status = ContentStatus.DRAFT;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(name = "view_count", nullable = false)
    private Long viewCount = 0L;

    @Column(name = "estimated_reading_time")
    private Integer estimatedReadingTime; // en minutes

    @Column(name = "tags", length = 500)
    private String tags; // Tags séparés par des virgules

    // Relations
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("orderIndex ASC")
    private List<CourseSection> sections = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CourseImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "course", fetch = FetchType.LAZY)
    private List<StudentProgress> studentProgress = new ArrayList<>();

    // Constructors
    public Course() {}

    public Course(String title, String latexContent, User author) {
        this.title = title;
        this.latexContent = latexContent;
        this.rawLatexContent = latexContent;
        this.author = author;
    }

    // Helper methods
    public void publish() {
        this.status = ContentStatus.PUBLISHED;
        this.publishedAt = LocalDateTime.now();
    }

    public void archive() {
        this.status = ContentStatus.ARCHIVED;
    }

    public void incrementViewCount() {
        this.viewCount++;
    }

    public boolean isPublished() {
        return status == ContentStatus.PUBLISHED;
    }

    public void addSection(CourseSection section) {
        sections.add(section);
        section.setCourse(this);
    }

    public void removeSection(CourseSection section) {
        sections.remove(section);
        section.setCourse(null);
    }

    public void addImage(CourseImage image) {
        images.add(image);
        image.setCourse(this);
    }

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLatexContent() { return latexContent; }
    public void setLatexContent(String latexContent) { this.latexContent = latexContent; }

    public String getRawLatexContent() { return rawLatexContent; }
    public void setRawLatexContent(String rawLatexContent) { this.rawLatexContent = rawLatexContent; }

    public AcademicLevel getAcademicLevel() { return academicLevel; }
    public void setAcademicLevel(AcademicLevel academicLevel) { this.academicLevel = academicLevel; }

    public Branch getBranch() { return branch; }
    public void setBranch(Branch branch) { this.branch = branch; }

    public Integer getChapterNumber() { return chapterNumber; }
    public void setChapterNumber(Integer chapterNumber) { this.chapterNumber = chapterNumber; }

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }

    public ContentStatus getStatus() { return status; }
    public void setStatus(ContentStatus status) { this.status = status; }

    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }

    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }

    public Long getViewCount() { return viewCount; }
    public void setViewCount(Long viewCount) { this.viewCount = viewCount; }

    public Integer getEstimatedReadingTime() { return estimatedReadingTime; }
    public void setEstimatedReadingTime(Integer estimatedReadingTime) { this.estimatedReadingTime = estimatedReadingTime; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public List<CourseSection> getSections() { return sections; }
    public void setSections(List<CourseSection> sections) { this.sections = sections; }

    public List<CourseImage> getImages() { return images; }
    public void setImages(List<CourseImage> images) { this.images = images; }

    public List<StudentProgress> getStudentProgress() { return studentProgress; }
    public void setStudentProgress(List<StudentProgress> studentProgress) { this.studentProgress = studentProgress; }
}