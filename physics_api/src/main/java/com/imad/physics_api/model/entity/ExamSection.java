// ========== ExamSection.java ==========
package com.imad.physics_api.model.entity;

import com.imad.physics_api.model.enums.SectionType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "exam_sections", indexes = {
        @Index(name = "idx_exam_section_exam", columnList = "exam_id"),
        @Index(name = "idx_exam_section_type", columnList = "section_type"),
        @Index(name = "idx_exam_section_order", columnList = "order_index")
})
public class ExamSection extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "section_type", nullable = false, length = 30)
    private SectionType sectionType;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @Column(name = "points")
    private Double points; // Points attribués à cette section

    @Column(name = "level", nullable = false)
    private Integer level = 1;

    @Column(name = "parent_section_id")
    private String parentSectionId;

    @Column(name = "has_equations", nullable = false)
    private Boolean hasEquations = false;

    @Column(name = "has_figures", nullable = false)
    private Boolean hasFigures = false;

    @Column(name = "equation_count")
    private Integer equationCount = 0;

    @Column(name = "figure_count")
    private Integer figureCount = 0;

    // Constructors
    public ExamSection() {}

    public ExamSection(Exam exam, String title, SectionType sectionType, String content, Integer orderIndex) {
        this.exam = exam;
        this.title = title;
        this.sectionType = sectionType;
        this.content = content;
        this.orderIndex = orderIndex;
        analyzeContent();
    }

    // Helper methods (similar to CourseSection)
    public void analyzeContent() {
        if (content != null) {
            this.hasEquations = content.contains("$") || content.contains("\\[") ||
                    content.contains("\\begin{equation");
            this.hasFigures = content.contains("\\includegraphics") ||
                    content.contains("\\begin{figure");

            this.equationCount = countOccurrences(content, "\\begin{equation") +
                    countOccurrences(content, "\\[");
            this.figureCount = countOccurrences(content, "\\includegraphics");
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
    public Exam getExam() { return exam; }
    public void setExam(Exam exam) { this.exam = exam; }

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

    public Double getPoints() { return points; }
    public void setPoints(Double points) { this.points = points; }

    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }

    public String getParentSectionId() { return parentSectionId; }
    public void setParentSectionId(String parentSectionId) { this.parentSectionId = parentSectionId; }

    public Boolean getHasEquations() { return hasEquations; }
    public void setHasEquations(Boolean hasEquations) { this.hasEquations = hasEquations; }

    public Boolean getHasFigures() { return hasFigures; }
    public void setHasFigures(Boolean hasFigures) { this.hasFigures = hasFigures; }

    public Integer getEquationCount() { return equationCount; }
    public void setEquationCount(Integer equationCount) { this.equationCount = equationCount; }

    public Integer getFigureCount() { return figureCount; }
    public void setFigureCount(Integer figureCount) { this.figureCount = figureCount; }
}

