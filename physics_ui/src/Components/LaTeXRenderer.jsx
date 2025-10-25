// src/components/LaTeXRenderer.jsx
import React, { useMemo, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import './LaTeXRenderer.css';

const LaTeXRenderer = ({ content, images = [], onSectionView, className = '' }) => {
  const containerRef = useRef(null);
  const sectionRefs = useRef({});

  // Prétraitement du contenu LaTeX
  const processedContent = useMemo(() => {
    if (!content) return '';
    
    let processed = content;
    
    // Nettoyer les commandes de document LaTeX
    processed = processed
      .replace(/\\documentclass[^}]*\}/, '')
      .replace(/\\usepackage[^}]*\}/, '')
      .replace(/\\title\{([^}]+)\}/, '# $1\n')
      .replace(/\\author\{[^}]*\}/, '')
      .replace(/\\date\{[^}]*\}/, '')
      .replace(/\\begin\{document\}/, '')
      .replace(/\\end\{document\}/, '')
      .replace(/\\maketitle/, '');
    
    // Convertir les sections LaTeX
    processed = processed
      .replace(/\\section\*?\{([^}]+)\}/g, '\n## $1\n')
      .replace(/\\subsection\*?\{([^}]+)\}/g, '\n### $1\n')
      .replace(/\\subsubsection\*?\{([^}]+)\}/g, '\n#### $1\n')
      .replace(/\\paragraph\{([^}]+)\}/g, '\n##### $1\n');
    
    // Environnements mathématiques
    processed = processed
      .replace(/\\\[([^\]]+)\\\]/g, '\n$$\n$1\n$$\n')
      .replace(/\\begin\{equation\}([\s\S]*?)\\end\{equation\}/g, '\n$$\n$1\n$$\n')
      .replace(/\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g, '\n$$\n\\begin{align}\n$1\n\\end{align}\n$$\n')
      .replace(/\\begin\{gather\*?\}([\s\S]*?)\\end\{gather\*?\}/g, '\n$$\n\\begin{gather}\n$1\n\\end{gather}\n$$\n');
    
    // Environnements spéciaux
    processed = processed
      .replace(/\\begin\{theorem\}([\s\S]*?)\\end\{theorem\}/g, 
        '<div class="latex-env theorem"><strong>Théorème:</strong>$1</div>')
      .replace(/\\begin\{definition\}([\s\S]*?)\\end\{definition\}/g, 
        '<div class="latex-env definition"><strong>Définition:</strong>$1</div>')
      .replace(/\\begin\{proof\}([\s\S]*?)\\end\{proof\}/g, 
        '<div class="latex-env proof"><strong>Démonstration:</strong>$1</div>')
      .replace(/\\begin\{example\}([\s\S]*?)\\end\{example\}/g, 
        '<div class="latex-env example"><strong>Exemple:</strong>$1</div>')
      .replace(/\\begin\{remark\}([\s\S]*?)\\end\{remark\}/g, 
        '<div class="latex-env remark"><strong>Remarque:</strong>$1</div>');
    
    // Listes
    processed = processed
      .replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, (match, items) => {
        const processedItems = items
          .replace(/\\item\s*/g, '\n- ')
          .trim();
        return '\n' + processedItems + '\n';
      })
      .replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, (match, items) => {
        let counter = 1;
        const processedItems = items
          .replace(/\\item\s*/g, () => `\n${counter++}. `)
          .trim();
        return '\n' + processedItems + '\n';
      });
    
    // Mise en forme du texte
    processed = processed
      .replace(/\\textbf\{([^}]+)\}/g, '**$1**')
      .replace(/\\textit\{([^}]+)\}/g, '*$1*')
      .replace(/\\emph\{([^}]+)\}/g, '*$1*')
      .replace(/\\underline\{([^}]+)\}/g, '<u>$1</u>')
      .replace(/\\texttt\{([^}]+)\}/g, '`$1`');
    
    // Commandes mathématiques supplémentaires
    processed = processed
      .replace(/\\tfrac/g, '\\frac')
      .replace(/\\vec\{([^}]+)\}/g, '\\overrightarrow{$1}');
    
    // Espacement et sauts de ligne
    processed = processed
      .replace(/\\\\/g, '\n')
      .replace(/\\newline/g, '\n')
      .replace(/\\par/g, '\n\n')
      .replace(/\\vspace\{[^}]+\}/g, '\n')
      .replace(/\\hspace\{[^}]+\}/g, ' ');
    
    // Traiter les images
    images.forEach(img => {
      if (img.latexReference && img.url) {
        const imageMarkdown = `\n![${img.caption || img.filename}](${img.url})\n`;
        processed = processed.replace(img.latexReference, imageMarkdown);
      }
    });
    
    // Traiter les références d'images génériques
    processed = processed.replace(
      /\\includegraphics(?:\[[^\]]*\])?\{([^}]+)\}/g,
      (match, filename) => {
        const image = images.find(img => 
          img.filename === filename || 
          img.originalPath === filename
        );
        if (image && image.url) {
          return `\n![${image.caption || filename}](${image.url})\n`;
        }
        return `\n[Image: ${filename} - Non disponible]\n`;
      }
    );
    
    // Nettoyer les espaces multiples
    processed = processed.replace(/\n{3,}/g, '\n\n');
    
    return processed;
  }, [content, images]);

  // Observer pour le tracking de progression
  useEffect(() => {
    if (!onSectionView) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section-id');
            if (sectionId) {
              onSectionView(sectionId);
            }
          }
        });
      },
      { threshold: 0.5 }
    );
    
    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });
    
    return () => observer.disconnect();
  }, [onSectionView]);

  // Composants personnalisés pour le rendu
  const components = {
    h1: ({ children, ...props }) => (
      <h1 {...props} className="latex-title">{children}</h1>
    ),
    h2: ({ children, ...props }) => {
      const id = `section-${children.toString().toLowerCase().replace(/\s+/g, '-')}`;
      return (
        <h2 
          {...props}
          id={id}
          data-section-id={id}
          ref={el => {
            if (el) sectionRefs.current[id] = el;
          }}
          className="latex-section-title"
        >
          {children}
        </h2>
      );
    },
    h3: ({ children, ...props }) => (
      <h3 {...props} className="latex-subsection-title">{children}</h3>
    ),
    h4: ({ children, ...props }) => (
      <h4 {...props} className="latex-subsubsection-title">{children}</h4>
    ),
    img: ({ src, alt, ...props }) => {
      const image = images.find(img => img.url === src);
      return (
        <figure className="latex-figure">
          <img 
            src={src} 
            alt={alt} 
            {...props}
            className="latex-image"
            loading="lazy"
            onError={(e) => {
              e.target.src = '/assets/placeholder-image.png';
              e.target.alt = 'Image non disponible';
            }}
          />
          {image?.caption && (
            <figcaption className="latex-caption">{image.caption}</figcaption>
          )}
        </figure>
      );
    },
    div: ({ className: divClass, children, ...props }) => {
      if (divClass?.includes('latex-env')) {
        return (
          <div className={divClass} {...props}>
            {children}
          </div>
        );
      }
      return <div className={divClass} {...props}>{children}</div>;
    },
    code: ({ inline, className: codeClass, children, ...props }) => {
      const match = /language-(\w+)/.exec(codeClass || '');
      if (!inline && match) {
        return (
          <pre className="latex-code-block">
            <code className={codeClass} {...props}>
              {children}
            </code>
          </pre>
        );
      }
      return (
        <code className={inline ? "latex-inline-code" : "latex-block-code"} {...props}>
          {children}
        </code>
      );
    },
    p: ({ children, ...props }) => (
      <p {...props} className="latex-paragraph">{children}</p>
    ),
    ul: ({ children, ...props }) => (
      <ul {...props} className="latex-list">{children}</ul>
    ),
    ol: ({ children, ...props }) => (
      <ol {...props} className="latex-list latex-numbered-list">{children}</ol>
    ),
  };

  return (
    <div 
      className={`latex-renderer ${className}`} 
      ref={containerRef}
    >
      <ReactMarkdown
        children={processedContent}
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={components}
      />
    </div>
  );
};

export default LaTeXRenderer;

