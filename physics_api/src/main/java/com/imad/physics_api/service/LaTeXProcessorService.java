package com.imad.physics_api.service;

import com.imad.physics_api.model.entity.CourseSection;
import com.imad.physics_api.model.entity.ExamSection;
import com.imad.physics_api.model.enums.SectionType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class LaTeXProcessorService {

    private static final Logger logger = LoggerFactory.getLogger(LaTeXProcessorService.class);

    // Patterns pour détecter les structures LaTeX
    private static final Pattern SECTION_PATTERN = Pattern.compile(
            "\\\\(section|subsection|subsubsection|chapter|part)\\*?\\{([^}]+)\\}",
            Pattern.MULTILINE
    );

    private static final Pattern IMAGE_PATTERN = Pattern.compile(
            "\\\\includegraphics(?:\\[[^\\]]*\\])?\\{([^}]+)\\}",
            Pattern.MULTILINE
    );

    private static final Pattern FIGURE_PATTERN = Pattern.compile(
            "\\\\begin\\{figure\\}.*?\\\\end\\{figure\\}",
            Pattern.DOTALL
    );

    private static final Pattern EQUATION_PATTERN = Pattern.compile(
            "\\$\\$.*?\\$\\$|\\\\\\[.*?\\\\\\]|\\\\begin\\{equation\\}.*?\\\\end\\{equation\\}",
            Pattern.DOTALL
    );

    private static final Pattern ENVIRONMENT_PATTERN = Pattern.compile(
            "\\\\begin\\{(theorem|definition|lemma|corollary|proposition|example|proof|remark)\\}(.*?)\\\\end\\{\\1\\}",
            Pattern.DOTALL
    );

    /**
     * Traite le contenu LaTeX et le découpe en sections
     */
    public ProcessedLatexContent processLatexContent(String latexContent) {
        ProcessedLatexContent result = new ProcessedLatexContent();
        result.setRawContent(latexContent);

        // Extraire les métadonnées
        result.setMetadata(extractMetadata(latexContent));

        // Détecter et extraire les images
        result.setImages(extractImages(latexContent));

        // Découper en sections
        result.setSections(splitIntoSections(latexContent));

        // Analyser le contenu
        result.setStatistics(analyzeContent(latexContent));

        return result;
    }

    /**
     * Découpe le contenu LaTeX en sections logiques
     */
    public List<SectionData> splitIntoSections(String latexContent) {
        List<SectionData> sections = new ArrayList<>();
        Matcher matcher = SECTION_PATTERN.matcher(latexContent);

        int lastEnd = 0;
        int orderIndex = 0;

        // Ajouter le préambule s'il existe
        if (matcher.find()) {
            if (matcher.start() > 0) {
                String preamble = latexContent.substring(0, matcher.start()).trim();
                if (!preamble.isEmpty()) {
                    SectionData introSection = new SectionData();
                    introSection.setTitle("Introduction");
                    introSection.setContent(preamble);
                    introSection.setSectionType(SectionType.INTRODUCTION);
                    introSection.setLevel(0);
                    introSection.setOrderIndex(orderIndex++);
                    sections.add(introSection);
                }
            }
            matcher.reset();
        }

        // Traiter chaque section
        while (matcher.find()) {
            // Ajouter le contenu avant cette section (si ce n'est pas la première)
            if (lastEnd > 0 && matcher.start() > lastEnd) {
                String content = latexContent.substring(lastEnd, matcher.start()).trim();
                if (!content.isEmpty() && !sections.isEmpty()) {
                    sections.get(sections.size() - 1).setContent(
                            sections.get(sections.size() - 1).getContent() + "\n" + content
                    );
                }
            }

            // Créer la nouvelle section
            SectionData section = new SectionData();
            section.setTitle(matcher.group(2).trim());
            section.setLevel(getLevelFromType(matcher.group(1)));
            section.setSectionType(detectSectionType(matcher.group(2)));
            section.setOrderIndex(orderIndex++);

            // Trouver le contenu de cette section
            int nextSectionStart = findNextSectionStart(latexContent, matcher.end());
            String sectionContent = latexContent.substring(matcher.end(),
                    nextSectionStart != -1 ? nextSectionStart : latexContent.length()).trim();

            section.setContent(sectionContent);

            // Analyser le contenu de la section
            section.setHasEquations(EQUATION_PATTERN.matcher(sectionContent).find());
            section.setHasFigures(IMAGE_PATTERN.matcher(sectionContent).find());
            section.setEquationCount(countMatches(EQUATION_PATTERN, sectionContent));
            section.setFigureCount(countMatches(IMAGE_PATTERN, sectionContent));

            sections.add(section);
            lastEnd = matcher.end();
        }

        // Ajouter le contenu restant
        if (lastEnd < latexContent.length()) {
            String remainingContent = latexContent.substring(lastEnd).trim();
            if (!remainingContent.isEmpty()) {
                if (!sections.isEmpty()) {
                    SectionData lastSection = sections.get(sections.size() - 1);
                    lastSection.setContent(lastSection.getContent() + "\n" + remainingContent);
                } else {
                    // Tout le contenu est sans sections
                    SectionData fullSection = new SectionData();
                    fullSection.setTitle("Contenu");
                    fullSection.setContent(remainingContent);
                    fullSection.setSectionType(SectionType.CUSTOM);
                    fullSection.setLevel(1);
                    fullSection.setOrderIndex(0);
                    sections.add(fullSection);
                }
            }
        }

        // Post-traitement : détecter les environnements spéciaux
        for (SectionData section : sections) {
            processSpecialEnvironments(section);
        }

        return sections;
    }

    /**
     * Extrait toutes les références d'images du contenu LaTeX
     */
    public List<ImageReference> extractImages(String latexContent) {
        List<ImageReference> images = new ArrayList<>();
        Matcher matcher = IMAGE_PATTERN.matcher(latexContent);

        while (matcher.find()) {
            ImageReference img = new ImageReference();
            String imagePath = matcher.group(1).trim();

            // Nettoyer le chemin
            imagePath = imagePath.replace("\\", "/");
            if (imagePath.startsWith("./")) {
                imagePath = imagePath.substring(2);
            }

            img.setOriginalPath(imagePath);
            img.setLatexReference(matcher.group(0));
            img.setFilename(extractFilename(imagePath));

            // Déterminer l'extension si elle n'est pas présente
            if (!hasFileExtension(img.getFilename())) {
                img.setFilename(img.getFilename() + ".png"); // Extension par défaut
            }

            images.add(img);
        }

        // Extraire aussi les images dans les environnements figure
        Matcher figureMatcher = FIGURE_PATTERN.matcher(latexContent);
        while (figureMatcher.find()) {
            String figureContent = figureMatcher.group(0);

            // Extraire la légende si présente
            Pattern captionPattern = Pattern.compile("\\\\caption\\{([^}]+)\\}");
            Matcher captionMatcher = captionPattern.matcher(figureContent);
            String caption = captionMatcher.find() ? captionMatcher.group(1) : null;

            // Mettre à jour les images correspondantes avec la légende
            Matcher imgInFigure = IMAGE_PATTERN.matcher(figureContent);
            if (imgInFigure.find() && caption != null) {
                String imgPath = imgInFigure.group(1).trim();
                for (ImageReference img : images) {
                    if (img.getOriginalPath().equals(imgPath)) {
                        img.setCaption(caption);
                        break;
                    }
                }
            }
        }

        return images;
    }

    /**
     * Extrait les métadonnées du document LaTeX
     */
    private Map<String, String> extractMetadata(String latexContent) {
        Map<String, String> metadata = new HashMap<>();

        // Extraire le titre
        Pattern titlePattern = Pattern.compile("\\\\title\\{([^}]+)\\}");
        Matcher titleMatcher = titlePattern.matcher(latexContent);
        if (titleMatcher.find()) {
            metadata.put("title", titleMatcher.group(1));
        }

        // Extraire l'auteur
        Pattern authorPattern = Pattern.compile("\\\\author\\{([^}]+)\\}");
        Matcher authorMatcher = authorPattern.matcher(latexContent);
        if (authorMatcher.find()) {
            metadata.put("author", authorMatcher.group(1));
        }

        // Extraire la date
        Pattern datePattern = Pattern.compile("\\\\date\\{([^}]+)\\}");
        Matcher dateMatcher = datePattern.matcher(latexContent);
        if (dateMatcher.find()) {
            metadata.put("date", dateMatcher.group(1));
        }

        // Détecter le type de document
        Pattern docClassPattern = Pattern.compile("\\\\documentclass(?:\\[[^\\]]*\\])?\\{([^}]+)\\}");
        Matcher docClassMatcher = docClassPattern.matcher(latexContent);
        if (docClassMatcher.find()) {
            metadata.put("documentClass", docClassMatcher.group(1));
        }

        return metadata;
    }

    /**
     * Analyse statistique du contenu
     */
    private ContentStatistics analyzeContent(String latexContent) {
        ContentStatistics stats = new ContentStatistics();

        stats.setTotalCharacters(latexContent.length());
        stats.setTotalWords(countWords(latexContent));
        stats.setEquationCount(countMatches(EQUATION_PATTERN, latexContent));
        stats.setFigureCount(countMatches(IMAGE_PATTERN, latexContent));
        stats.setTableCount(countMatches(Pattern.compile("\\\\begin\\{table\\}"), latexContent));
        stats.setTheoremCount(countMatches(Pattern.compile("\\\\begin\\{theorem\\}"), latexContent));
        stats.setExampleCount(countMatches(Pattern.compile("\\\\begin\\{example\\}"), latexContent));

        // Estimation du temps de lecture (200 mots par minute)
        stats.setEstimatedReadingTime((stats.getTotalWords() / 200) + 1);

        return stats;
    }

    /**
     * Traite les environnements spéciaux dans une section
     */
    private void processSpecialEnvironments(SectionData section) {
        String content = section.getContent();
        Matcher envMatcher = ENVIRONMENT_PATTERN.matcher(content);

        List<SpecialEnvironment> environments = new ArrayList<>();
        while (envMatcher.find()) {
            SpecialEnvironment env = new SpecialEnvironment();
            env.setType(envMatcher.group(1));
            env.setContent(envMatcher.group(2).trim());
            env.setFullLatex(envMatcher.group(0));
            environments.add(env);
        }

        section.setSpecialEnvironments(environments);
    }

    // Méthodes utilitaires
    private int getLevelFromType(String type) {
        switch (type.toLowerCase()) {
            case "part": return 0;
            case "chapter": return 1;
            case "section": return 2;
            case "subsection": return 3;
            case "subsubsection": return 4;
            default: return 2;
        }
    }

    private SectionType detectSectionType(String title) {
        String lowerTitle = title.toLowerCase();

        if (lowerTitle.contains("introduction")) return SectionType.INTRODUCTION;
        if (lowerTitle.contains("théorème") || lowerTitle.contains("theorem")) return SectionType.THEOREM;
        if (lowerTitle.contains("définition") || lowerTitle.contains("definition")) return SectionType.DEFINITION;
        if (lowerTitle.contains("exemple") || lowerTitle.contains("example")) return SectionType.EXAMPLE;
        if (lowerTitle.contains("exercice") || lowerTitle.contains("exercise")) return SectionType.EXERCISE;
        if (lowerTitle.contains("solution")) return SectionType.SOLUTION;
        if (lowerTitle.contains("conclusion")) return SectionType.CONCLUSION;
        if (lowerTitle.contains("résumé") || lowerTitle.contains("summary")) return SectionType.SUMMARY;
        if (lowerTitle.contains("démonstration") || lowerTitle.contains("proof")) return SectionType.PROOF;
        if (lowerTitle.contains("application")) return SectionType.APPLICATION;
        if (lowerTitle.contains("expérience") || lowerTitle.contains("experiment")) return SectionType.EXPERIMENT;

        return SectionType.THEORY;
    }

    private int findNextSectionStart(String content, int fromIndex) {
        Matcher matcher = SECTION_PATTERN.matcher(content);
        if (matcher.find(fromIndex)) {
            return matcher.start();
        }
        return -1;
    }

    private String extractFilename(String path) {
        int lastSlash = path.lastIndexOf('/');
        int lastBackslash = path.lastIndexOf('\\');
        int lastSeparator = Math.max(lastSlash, lastBackslash);

        if (lastSeparator >= 0) {
            return path.substring(lastSeparator + 1);
        }
        return path;
    }

    private boolean hasFileExtension(String filename) {
        return filename.contains(".") &&
                filename.lastIndexOf(".") > filename.lastIndexOf("/") &&
                filename.lastIndexOf(".") > filename.lastIndexOf("\\");
    }

    private int countMatches(Pattern pattern, String text) {
        Matcher matcher = pattern.matcher(text);
        int count = 0;
        while (matcher.find()) {
            count++;
        }
        return count;
    }

    private int countWords(String text) {
        // Enlever les commandes LaTeX pour un compte plus précis
        String cleanText = text.replaceAll("\\\\[a-zA-Z]+\\{[^}]*\\}", " ")
                .replaceAll("\\\\[a-zA-Z]+", " ")
                .replaceAll("[\\$\\{\\}\\[\\]]", " ");

        String[] words = cleanText.split("\\s+");
        return words.length;
    }

    // Classes internes pour les résultats
    public static class ProcessedLatexContent {
        private String rawContent;
        private Map<String, String> metadata;
        private List<SectionData> sections;
        private List<ImageReference> images;
        private ContentStatistics statistics;

        // Getters and Setters
        public String getRawContent() { return rawContent; }
        public void setRawContent(String rawContent) { this.rawContent = rawContent; }

        public Map<String, String> getMetadata() { return metadata; }
        public void setMetadata(Map<String, String> metadata) { this.metadata = metadata; }

        public List<SectionData> getSections() { return sections; }
        public void setSections(List<SectionData> sections) { this.sections = sections; }

        public List<ImageReference> getImages() { return images; }
        public void setImages(List<ImageReference> images) { this.images = images; }

        public ContentStatistics getStatistics() { return statistics; }
        public void setStatistics(ContentStatistics statistics) { this.statistics = statistics; }
    }

    public static class SectionData {
        private String title;
        private String content;
        private SectionType sectionType;
        private Integer level;
        private Integer orderIndex;
        private Boolean hasEquations = false;
        private Boolean hasFigures = false;
        private Integer equationCount = 0;
        private Integer figureCount = 0;
        private List<SpecialEnvironment> specialEnvironments;

        // Getters and Setters
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

        public List<SpecialEnvironment> getSpecialEnvironments() { return specialEnvironments; }
        public void setSpecialEnvironments(List<SpecialEnvironment> specialEnvironments) {
            this.specialEnvironments = specialEnvironments;
        }
    }

    public static class ImageReference {
        private String originalPath;
        private String filename;
        private String latexReference;
        private String caption;
        private boolean found = false;

        // Getters and Setters
        public String getOriginalPath() { return originalPath; }
        public void setOriginalPath(String originalPath) { this.originalPath = originalPath; }

        public String getFilename() { return filename; }
        public void setFilename(String filename) { this.filename = filename; }

        public String getLatexReference() { return latexReference; }
        public void setLatexReference(String latexReference) { this.latexReference = latexReference; }

        public String getCaption() { return caption; }
        public void setCaption(String caption) { this.caption = caption; }

        public boolean isFound() { return found; }
        public void setFound(boolean found) { this.found = found; }
    }

    public static class ContentStatistics {
        private int totalCharacters;
        private int totalWords;
        private int equationCount;
        private int figureCount;
        private int tableCount;
        private int theoremCount;
        private int exampleCount;
        private int estimatedReadingTime;

        // Getters and Setters
        public int getTotalCharacters() { return totalCharacters; }
        public void setTotalCharacters(int totalCharacters) { this.totalCharacters = totalCharacters; }

        public int getTotalWords() { return totalWords; }
        public void setTotalWords(int totalWords) { this.totalWords = totalWords; }

        public int getEquationCount() { return equationCount; }
        public void setEquationCount(int equationCount) { this.equationCount = equationCount; }

        public int getFigureCount() { return figureCount; }
        public void setFigureCount(int figureCount) { this.figureCount = figureCount; }

        public int getTableCount() { return tableCount; }
        public void setTableCount(int tableCount) { this.tableCount = tableCount; }

        public int getTheoremCount() { return theoremCount; }
        public void setTheoremCount(int theoremCount) { this.theoremCount = theoremCount; }

        public int getExampleCount() { return exampleCount; }
        public void setExampleCount(int exampleCount) { this.exampleCount = exampleCount; }

        public int getEstimatedReadingTime() { return estimatedReadingTime; }
        public void setEstimatedReadingTime(int estimatedReadingTime) {
            this.estimatedReadingTime = estimatedReadingTime;
        }
    }

    public static class SpecialEnvironment {
        private String type;
        private String content;
        private String fullLatex;

        // Getters and Setters
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }

        public String getFullLatex() { return fullLatex; }
        public void setFullLatex(String fullLatex) { this.fullLatex = fullLatex; }
    }
}