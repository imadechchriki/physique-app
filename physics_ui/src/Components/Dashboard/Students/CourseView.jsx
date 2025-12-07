import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
  Breadcrumbs,
  Link,
  IconButton,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Divider
} from '@mui/material';
import {
  NavigateNext,
  BookmarkBorder,
  BookmarkAdded,
  Print,
  AccessTime,
  School,
  Category,
  MenuBook,
  CheckCircle,
  RadioButtonUnchecked,
  ExpandLess,
  ExpandMore,
  Person,
  CalendarToday,
  Visibility
} from '@mui/icons-material';
import LaTeXRenderer from '../../LaTeXRenderer';
import { courseService } from '../../../services/courseService';
import { useAuth } from '../../../contexts/AuthContext';

const StudentCourseView = () => {
  const { courseId: rawCourseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Debug et nettoyage de l'ID
  console.log('Raw courseId from URL params:', rawCourseId);
  
  const courseId = rawCourseId?.startsWith(':') ? rawCourseId.slice(1) : rawCourseId;
  
  console.log('Cleaned courseId:', courseId);
  
  // Vérification de sécurité
  if (!courseId) {
    console.error('No courseId found in URL params');
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">ID du cours manquant dans l'URL</Alert>
        <Button onClick={() => navigate('/student/courses')} sx={{ mt: 2 }}>
          Retour aux cours
        </Button>
      </Container>
    );
  }

  // États
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [completedSections, setCompletedSections] = useState(new Set());
  const [currentSection, setCurrentSection] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set());

  // Charger le progrès avec useCallback
  const fetchProgress = useCallback(async () => {
    if (!courseId) return;
    
    try {
      console.log('Fetching progress for course:', courseId);
      const response = await courseService.getCourseProgress(courseId);
      if (response.success && response.data) {
        console.log('Progress data received:', response.data);
        setProgress(response.data);
        setIsFavorite(response.data.isFavorite);
        
        // Restaurer les sections complétées
        if (response.data.completedSectionIds) {
          setCompletedSections(new Set(response.data.completedSectionIds));
        }
      }
    } catch (err) {
      console.error('Erreur progrès:', err);
    }
  }, [courseId]);

  // Charger le cours avec gestion des doublons
  useEffect(() => {
    let isCancelled = false;
    
    const fetchCourse = async () => {
      if (!courseId || isCancelled) return;
      
      try {
        console.log('Fetching course with ID:', courseId);
        setLoading(true);
        setError(null);
        
        const response = await courseService.getCourse(courseId);
        
        if (isCancelled) return;
        
        console.log('Course service response:', response);
        
        if (response.success && response.data) {
          console.log('Course data structure:', {
            title: response.data.title,
            description: response.data.description,
            hasLatexContent: !!response.data.latexContent,
            sectionsCount: response.data.sections?.length || 0,
            imagesCount: response.data.images?.length || 0,
            latexPreview: response.data.latexContent?.substring(0, 100) + '...'
          });
          
          setCourse(response.data);
          
          // Charger le progrès si étudiant
          if (user?.role === 'STUDENT') {
            fetchProgress();
          }
        } else {
          console.error('API returned success=false:', response);
          setError(response.message || 'Erreur lors du chargement du cours');
        }
      } catch (err) {
        if (isCancelled) return;
        
        console.error('Error fetching course:', err);
        setError('Erreur de connexion au serveur');
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchCourse();
    
    return () => {
      isCancelled = true;
    };
  }, [courseId, user?.role, fetchProgress]);

  // Log quand le cours change
  useEffect(() => {
    if (course) {
      console.log('Course state updated:', {
        id: course.id,
        title: course.title,
        hasContent: !!course.latexContent,
        sectionsLength: course.sections?.length
      });
    }
  }, [course]);

  // Marquer une section comme vue
  const handleSectionView = useCallback((sectionId) => {
    setCurrentSection(sectionId);
  }, []);

  // Marquer une section comme complétée
  const toggleSectionComplete = useCallback(async (sectionId) => {
    const newSet = new Set(completedSections);
    const wasCompleted = newSet.has(sectionId);
    
    if (wasCompleted) {
      newSet.delete(sectionId);
    } else {
      newSet.add(sectionId);
    }
    
    setCompletedSections(newSet);
    
    // Envoyer au backend
    try {
      await courseService.markSectionComplete(courseId, sectionId);
    } catch (err) {
      console.error('Erreur:', err);
      // Reverser en cas d'erreur
      if (wasCompleted) {
        newSet.add(sectionId);
      } else {
        newSet.delete(sectionId);
      }
      setCompletedSections(newSet);
    }
  }, [courseId, completedSections]);

  // Calculer le pourcentage de progression
  const calculateProgress = useCallback(() => {
    if (!course?.sections) return 0;
    return Math.round((completedSections.size / course.sections.length) * 100);
  }, [course?.sections, completedSections.size]);

  // Formater la date
  const formatDate = useCallback((date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  // Navigation par sections
  const scrollToSection = useCallback((index) => {
    const element = document.getElementById(`course-section-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setDrawerOpen(false);
    }
  }, []);

  // Gestion des sections expandables
  const toggleExpandedSection = useCallback((sectionId) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate('/student/courses')} sx={{ mt: 2 }}>
          Retour aux cours
        </Button>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">Cours non trouvé</Alert>
        <Button onClick={() => navigate('/student/courses')} sx={{ mt: 2 }}>
          Retour aux cours
        </Button>
      </Container>
    );
  }

  return (
    <>
      {/* Drawer de navigation */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 320,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Navigation du cours
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={calculateProgress()} 
            sx={{ mb: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            {completedSections.size}/{course.sections?.length || 0} sections complétées
          </Typography>
        </Box>
        <Divider />
        <List>
          {course.sections?.map((section, index) => (
            <React.Fragment key={section.id}>
              <ListItem 
                button 
                onClick={() => scrollToSection(index)}
                selected={currentSection === `section-${index}`}
              >
                <ListItemIcon>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSectionComplete(section.id);
                    }}
                  >
                    {completedSections.has(section.id) ? 
                      <CheckCircle color="success" fontSize="small" /> : 
                      <RadioButtonUnchecked fontSize="small" />
                    }
                  </IconButton>
                </ListItemIcon>
                <ListItemText 
                  primary={section.title}
                  secondary={`${section.sectionType || 'Section'}`}
                />
                {(section.hasEquations || section.hasFigures) && (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpandedSection(section.id);
                    }}
                  >
                    {expandedSections.has(section.id) ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                )}
              </ListItem>
              <Collapse in={expandedSections.has(section.id)}>
                <List component="div" disablePadding>
                  {section.hasEquations && (
                    <ListItem sx={{ pl: 9 }}>
                      <ListItemText 
                        secondary={`${section.equationCount || 0} équation(s)`}
                      />
                    </ListItem>
                  )}
                  {section.hasFigures && (
                    <ListItem sx={{ pl: 9 }}>
                      <ListItemText 
                        secondary={`${section.figureCount || 0} figure(s)`}
                      />
                    </ListItem>
                  )}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </Drawer>

      {/* Contenu principal */}
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Fil d'Ariane */}
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 2 }}>
          <Link 
            underline="hover" 
            color="inherit" 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/student/dashboard');
            }}
          >
            Dashboard
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/student/courses');
            }}
          >
            Mes Cours
          </Link>
          <Typography color="text.primary">{course.title}</Typography>
        </Breadcrumbs>

        {/* En-tête du cours */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="start">
            <Box flex={1}>
              <Typography variant="h4" gutterBottom>
                {course.title}
              </Typography>
              
              {course.description && (
                <Typography variant="body1" color="text.secondary" paragraph>
                  {course.description}
                </Typography>
              )}

              {/* Métadonnées */}
              <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
                {course.academicLevel && (
                  <Chip 
                    icon={<School />} 
                    label={course.academicLevel} 
                    variant="outlined"
                    size="small"
                  />
                )}
                {course.branch && (
                  <Chip 
                    icon={<Category />} 
                    label={course.branch} 
                    variant="outlined"
                    size="small"
                  />
                )}
                {course.chapterNumber && (
                  <Chip 
                    label={`Chapitre ${course.chapterNumber}`} 
                    color="primary" 
                    variant="outlined"
                    size="small"
                  />
                )}
              </Box>

              {/* Informations */}
              <Box display="flex" flexWrap="wrap" gap={3}>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Person fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {course.authorName}
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center" gap={0.5}>
                  <CalendarToday fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(course.publishedAt)}
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center" gap={0.5}>
                  <AccessTime fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    ~{course.estimatedReadingTime} min
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Visibility fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {course.viewCount} vues
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Actions */}
            <Box display="flex" gap={1}>
              <Tooltip title="Navigation">
                <IconButton onClick={() => setDrawerOpen(true)}>
                  <MenuBook />
                </IconButton>
              </Tooltip>
              
              <Tooltip title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}>
                <IconButton onClick={() => setIsFavorite(!isFavorite)}>
                  {isFavorite ? <BookmarkAdded color="primary" /> : <BookmarkBorder />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Imprimer">
                <IconButton onClick={() => window.print()}>
                  <Print />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Barre de progression */}
          <Box sx={{ mt: 3 }}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">Votre progression</Typography>
              <Typography variant="body2" color="primary">
                {calculateProgress()}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={calculateProgress()} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        </Paper>

        {/* Contenu du cours */}
        <Paper elevation={1} sx={{ p: 3 }}>
          {course.latexContent ? (
            <LaTeXRenderer 
              content={course.latexContent}
              images={course.images}
              onSectionView={handleSectionView}
            />
          ) : (
            <Alert severity="info">
              Aucun contenu LaTeX disponible pour ce cours.
            </Alert>
          )}
          
          {/* Debug temporaire - à supprimer en production */}
          {process.env.NODE_ENV === 'development' && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="caption" component="div">
                Debug Info:
              </Typography>
              <pre style={{ fontSize: '10px', maxHeight: '200px', overflow: 'auto' }}>
                {JSON.stringify({
                  hasLatexContent: !!course.latexContent,
                  latexContentLength: course.latexContent?.length,
                  imagesCount: course.images?.length,
                  sectionsCount: course.sections?.length,
                }, null, 2)}
              </pre>
            </Box>
          )}
          
          {/* Sections avec boutons de complétion */}
          {course.sections?.map((section, index) => (
            <Box 
              key={section.id} 
              id={`course-section-${index}`}
              sx={{ mb: 3, pt: 2 }}
            >
              <Divider sx={{ my: 3 }} />
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  variant={completedSections.has(section.id) ? "contained" : "outlined"}
                  color="primary"
                  size="small"
                  startIcon={completedSections.has(section.id) ? 
                    <CheckCircle /> : <RadioButtonUnchecked />
                  }
                  onClick={() => toggleSectionComplete(section.id)}
                >
                  {completedSections.has(section.id) ? 
                    "Section complétée" : "Marquer comme complété"
                  }
                </Button>
              </Box>
            </Box>
          ))}
        </Paper>

        {/* Navigation bas de page */}
        <Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/student/courses')}
          >
            Retour aux cours
          </Button>
          
          {calculateProgress() === 100 && (
            <Chip 
              label="Cours terminé !" 
              color="success" 
              icon={<CheckCircle />}
            />
          )}
        </Box>
      </Container>

      {/* Styles pour l'impression */}
      <style jsx>{`
        @media print {
          .MuiAppBar-root,
          .MuiDrawer-root,
          button {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default StudentCourseView;