// ========== StudentProgress.java ==========
package com.imad.physics_api.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_progress",
        indexes = {
                @Index(name = "idx_progress_student", columnList = "student_id"),
                @Index(name = "idx_progress_course", columnList = "course_id"),
                @Index(name = "idx_progress_section", columnList = "last_section_id")
        },
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"student_id", "course_id"})
        }
)
public class StudentProgress extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "last_section_id")
    private String lastSectionId; // ID de la dernière section consultée

    @Column(name = "progress_percentage", nullable = false)
    private Double progressPercentage = 0.0;

    @Column(name = "sections_completed", nullable = false)
    private Integer sectionsCompleted = 0;

    @Column(name = "total_sections", nullable = false)
    private Integer totalSections = 0;

    @Column(name = "time_spent_seconds", nullable = false)
    private Long timeSpentSeconds = 0L;

    @Column(name = "last_accessed")
    private LocalDateTime lastAccessed;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "is_completed", nullable = false)
    private Boolean isCompleted = false;

    @Column(name = "is_favorite", nullable = false)
    private Boolean isFavorite = false;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes; // Notes personnelles de l'étudiant

    // Constructors
    public StudentProgress() {}

    public StudentProgress(User student, Course course) {
        this.student = student;
        this.course = course;
        this.startedAt = LocalDateTime.now();
        this.lastAccessed = LocalDateTime.now();
    }

    // Helper methods
    public void updateProgress(int sectionsCompleted, int totalSections) {
        this.sectionsCompleted = sectionsCompleted;
        this.totalSections = totalSections;
        if (totalSections > 0) {
            this.progressPercentage = (sectionsCompleted * 100.0) / totalSections;
            if (sectionsCompleted >= totalSections) {
                this.isCompleted = true;
                this.completedAt = LocalDateTime.now();
            }
        }
        this.lastAccessed = LocalDateTime.now();
    }

    public void addTimeSpent(long seconds) {
        this.timeSpentSeconds += seconds;
    }

    // Getters and Setters
    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public String getLastSectionId() { return lastSectionId; }
    public void setLastSectionId(String lastSectionId) { this.lastSectionId = lastSectionId; }

    public Double getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(Double progressPercentage) { this.progressPercentage = progressPercentage; }

    public Integer getSectionsCompleted() { return sectionsCompleted; }
    public void setSectionsCompleted(Integer sectionsCompleted) { this.sectionsCompleted = sectionsCompleted; }

    public Integer getTotalSections() { return totalSections; }
    public void setTotalSections(Integer totalSections) { this.totalSections = totalSections; }

    public Long getTimeSpentSeconds() { return timeSpentSeconds; }
    public void setTimeSpentSeconds(Long timeSpentSeconds) { this.timeSpentSeconds = timeSpentSeconds; }

    public LocalDateTime getLastAccessed() { return lastAccessed; }
    public void setLastAccessed(LocalDateTime lastAccessed) { this.lastAccessed = lastAccessed; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public Boolean getIsCompleted() { return isCompleted; }
    public void setIsCompleted(Boolean isCompleted) { this.isCompleted = isCompleted; }

    public Boolean getIsFavorite() { return isFavorite; }
    public void setIsFavorite(Boolean isFavorite) { this.isFavorite = isFavorite; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}