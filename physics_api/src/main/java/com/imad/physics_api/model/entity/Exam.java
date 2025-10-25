// ========== Exam.java ==========
package com.imad.physics_api.model.entity;

import com.imad.physics_api.model.enums.AcademicLevel;
import com.imad.physics_api.model.enums.Branch;
import com.imad.physics_api.model.enums.ContentStatus;
import com.imad.physics_api.model.enums.ExamType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "exams", indexes = {
        @Index(name = "idx_exam_academic_level", columnList = "academic_level"),
        @Index(name = "idx_exam_branch", columnList = "branch"),
        @Index(name = "idx_exam_type", columnList = "exam_type"),
        @Index(name = "idx_exam_status", columnList = "status")
})
public class Exam extends BaseEntity {

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
    private String rawLatexContent;

    @Column(name = "solution_latex", columnDefinition = "TEXT")
    private String solutionLatex; // Correction de l'examen

    @Enumerated(EnumType.STRING)
    @Column(name = "exam_type", nullable = false, length = 30)
    private ExamType examType;

    @Enumerated(EnumType.STRING)
    @Column(name = "academic_level", length = 20)
    private AcademicLevel academicLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "branch", length = 30)
    private Branch branch;

    @Column(name = "academic_year", length = 20)
    private String academicYear; // ex: "2023-2024"

    @Column(name = "session", length = 50)
    private String session; // ex: "Session Normale", "Session Rattrapage"

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "total_points")
    private Double totalPoints;

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

    @Column(name = "download_count", nullable = false)
    private Long downloadCount = 0L;

    // Relations
    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("orderIndex ASC")
    private List<ExamSection> sections = new ArrayList<>();

    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ExamImage> images = new ArrayList<>();

    // Constructors
    public Exam() {}

    public Exam(String title, String latexContent, ExamType examType, User author) {
        this.title = title;
        this.latexContent = latexContent;
        this.rawLatexContent = latexContent;
        this.examType = examType;
        this.author = author;
    }

    // Helper methods
    public void publish() {
        this.status = ContentStatus.PUBLISHED;
        this.publishedAt = LocalDateTime.now();
    }

    public void incrementViewCount() {
        this.viewCount++;
    }

    public void incrementDownloadCount() {
        this.downloadCount++;
    }

    // Getters and Setters (générés automatiquement par l'IDE)
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLatexContent() { return latexContent; }
    public void setLatexContent(String latexContent) { this.latexContent = latexContent; }

    public String getRawLatexContent() { return rawLatexContent; }
    public void setRawLatexContent(String rawLatexContent) { this.rawLatexContent = rawLatexContent; }

    public String getSolutionLatex() { return solutionLatex; }
    public void setSolutionLatex(String solutionLatex) { this.solutionLatex = solutionLatex; }

    public ExamType getExamType() { return examType; }
    public void setExamType(ExamType examType) { this.examType = examType; }

    public AcademicLevel getAcademicLevel() { return academicLevel; }
    public void setAcademicLevel(AcademicLevel academicLevel) { this.academicLevel = academicLevel; }

    public Branch getBranch() { return branch; }
    public void setBranch(Branch branch) { this.branch = branch; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public String getSession() { return session; }
    public void setSession(String session) { this.session = session; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public Double getTotalPoints() { return totalPoints; }
    public void setTotalPoints(Double totalPoints) { this.totalPoints = totalPoints; }

    public ContentStatus getStatus() { return status; }
    public void setStatus(ContentStatus status) { this.status = status; }

    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }

    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }

    public Long getViewCount() { return viewCount; }
    public void setViewCount(Long viewCount) { this.viewCount = viewCount; }

    public Long getDownloadCount() { return downloadCount; }
    public void setDownloadCount(Long downloadCount) { this.downloadCount = downloadCount; }

    public List<ExamSection> getSections() { return sections; }
    public void setSections(List<ExamSection> sections) { this.sections = sections; }

    public List<ExamImage> getImages() { return images; }
    public void setImages(List<ExamImage> images) { this.images = images; }
}