package com.imad.physics_api.model.entity;

import com.imad.physics_api.model.enums.SectionType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "course_sections", indexes = {
        @Index(name = "idx_section_course", columnList = "course_id"),
        @Index(name = "idx_section_type", columnList = "section_type"),
        @Index(name = "idx_section_order", columnList = "order_index")
})
public class CourseSection extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "section_type", nullable = false, length = 30)
    private SectionType sectionType;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content; // Contenu LaTeX de cette section

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @Column(name = "level", nullable = false)
    private Integer level = 1; // Niveau de hiérarchie (1 pour section, 2 pour subsection, etc.)

    @Column(name = "parent_section_id")
    private String parentSectionId; // Pour les sous-sections

    @Column(name = "has_equations", nullable = false)
    private Boolean hasEquations = false;

    @Column(name = "has_figures", nullable = false)
    private Boolean hasFigures = false;

    @Column(name = "has_tables", nullable = false)
    private Boolean hasTables = false;

    @Column(name = "has_code", nullable = false)
    private Boolean hasCode = false;

    // Metadata pour optimisation du rendu
    @Column(name = "equation_count")
    private Integer equationCount = 0;

    @Column(name = "figure_count")
    private Integer figureCount = 0;

    @Column(name = "estimated_reading_time")
    private Integer estimatedReadingTime; // en secondes

    // Constructors
    public CourseSection() {}

    public CourseSection(Course course, String title, SectionType sectionType, String content, Integer orderIndex) {
        this.course = course;
        this.title = title;
        this.sectionType = sectionType;
        this.content = content;
        this.orderIndex = orderIndex;
        analyzeContent();
    }

    // Helper methods
    public void analyzeContent() {
        if (content != null) {
            // Détection des équations
            this.hasEquations = content.contains("$") || content.contains("\\[") || content.contains("\\begin{equation");

            // Détection des figures
            this.hasFigures = content.contains("\\includegraphics") || content.contains("\\begin{figure");

            // Détection des tables
            this.hasTables = content.contains("\\begin{table") || content.contains("\\begin{tabular");

            // Détection de code
            this.hasCode = content.contains("\\begin{lstlisting") || content.contains("\\begin{verbatim");

            // Compter les équations
            this.equationCount = countOccurrences(content, "\\begin{equation") +
                    countOccurrences(content, "\\[");

            // Compter les figures
            this.figureCount = countOccurrences(content, "\\includegraphics");

            // Estimer le temps de lecture (environ 200 mots par minute)
            int wordCount = content.split("\\s+").length;
            this.estimatedReadingTime = (wordCount * 60) / 200;
        }
    }

    private int countOccurrences(String text, String pattern) {
        int count = 0;
        int index = 0;
        while ((index = text.indexOf(pattern, index)) != -1) {
            count++;
            index += pattern.length();
        }
        return count;
    }

    // Getters and Setters
    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public SectionType getSectionType() { return sectionType; }
    public void setSectionType(SectionType sectionType) { this.sectionType = sectionType; }

    public String getContent() { return content; }
    public void setContent(String content) {
        this.content = content;
        analyzeContent();
    }

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }

    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }

    public String getParentSectionId() { return parentSectionId; }
    public void setParentSectionId(String parentSectionId) { this.parentSectionId = parentSectionId; }

    public Boolean getHasEquations() { return hasEquations; }
    public void setHasEquations(Boolean hasEquations) { this.hasEquations = hasEquations; }

    public Boolean getHasFigures() { return hasFigures; }
    public void setHasFigures(Boolean hasFigures) { this.hasFigures = hasFigures; }

    public Boolean getHasTables() { return hasTables; }
    public void setHasTables(Boolean hasTables) { this.hasTables = hasTables; }

    public Boolean getHasCode() { return hasCode; }
    public void setHasCode(Boolean hasCode) { this.hasCode = hasCode; }

    public Integer getEquationCount() { return equationCount; }
    public void setEquationCount(Integer equationCount) { this.equationCount = equationCount; }

    public Integer getFigureCount() { return figureCount; }
    public void setFigureCount(Integer figureCount) { this.figureCount = figureCount; }

    public Integer getEstimatedReadingTime() { return estimatedReadingTime; }
    public void setEstimatedReadingTime(Integer estimatedReadingTime) { this.estimatedReadingTime = estimatedReadingTime; }
}