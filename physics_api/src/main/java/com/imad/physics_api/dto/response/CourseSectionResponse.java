// ========== CourseSectionResponse.java ==========
package com.imad.physics_api.dto.response;

import com.imad.physics_api.model.enums.SectionType;

import java.util.UUID;

public class CourseSectionResponse {

    private UUID id;
    private String title;
    private String content;
    private SectionType sectionType;
    private Integer level;
    private Integer orderIndex;
    private Boolean hasEquations;
    private Boolean hasFigures;
    private Integer equationCount;
    private Integer figureCount;
    private Integer estimatedReadingTime;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public SectionType getSectionType() { return sectionType; }
    public void setSectionType(SectionType sectionType) { this.sectionType = sectionType; }

    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }

    public Boolean getHasEquations() { return hasEquations; }
    public void setHasEquations(Boolean hasEquations) { this.hasEquations = hasEquations; }

    public Boolean getHasFigures() { return hasFigures; }
    public void setHasFigures(Boolean hasFigures) { this.hasFigures = hasFigures; }

    public Integer getEquationCount() { return equationCount; }
    public void setEquationCount(Integer equationCount) { this.equationCount = equationCount; }

    public Integer getFigureCount() { return figureCount; }
    public void setFigureCount(Integer figureCount) { this.figureCount = figureCount; }

    public Integer getEstimatedReadingTime() { return estimatedReadingTime; }
    public void setEstimatedReadingTime(Integer estimatedReadingTime) { this.estimatedReadingTime = estimatedReadingTime; }
}