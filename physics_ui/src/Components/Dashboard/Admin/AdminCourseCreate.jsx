// src/Components/Dashboard/Admin/AdminCourseCreate.jsx
import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  MenuItem,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import {
  Save,
  Preview,
  Publish,
  CloudUpload,
  Delete,
  CheckCircle,
  Warning,
  Image as ImageIcon,
  Code,
  FormatQuote
} from '@mui/icons-material';
import LaTeXRenderer from '../../LaTeXRenderer';
import { courseService } from '../../../services/courseService';
import { imageService } from '../../../services/imageService';
import { useAuth } from '../../../contexts/AuthContext';

// Modèles LaTeX prédéfinis
const LATEX_TEMPLATES = {
  PHYSICS: `\\documentclass[a4paper,12pt]{article}
\\usepackage{amsmath, amssymb}
\\title{Titre du Cours}
\\author{}
\\date{}
\\begin{document}
\\maketitle

\\section{Introduction}
Introduisez votre cours ici...

\\section{Concepts Fondamentaux}
\\subsection{Premier concept}
Expliquez le concept...

\\[
E = mc^2
\\]

\\section{Applications}
\\begin{itemize}
  \\item Application 1
  \\item Application 2
\\end{itemize}

\\section{Conclusion}
Résumé du cours...

\\end{document}`,
  
  MATH: `\\documentclass{article}
\\usepackage{amsmath, amsthm}
\\title{Cours de Mathématiques}
\\begin{document}
\\maketitle

\\section{Théorèmes}
\\begin{theorem}
Énoncé du théorème...
\\end{theorem}

\\begin{proof}
Démonstration...
\\end{proof}

\\section{Exercices}
\\begin{example}
Exemple d'application...
\\end{example}

\\end{document}`,
};

const AdminCourseCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  
  // États
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageValidation, setImageValidation] = useState(null);
  
  // Données du cours
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    latexContent: '',
    academicLevel: '',
    branch: '',
    chapterNumber: '',
    tags: '',
    orderIndex: 0,
  });

  // Options de sélection
  const academicLevels = [
    { value: 'TRONC_COMMUN', label: 'Tronc Commun' },
    { value: 'PREMIERE_BAC', label: 'Première Bac' },
    { value: 'DEUXIEME_BAC', label: 'Deuxième Bac' },
  ];

  const branches = [
    { value: 'SM_MATHS_PHYSIQUE', label: 'Sciences Mathématiques' },
    { value: 'PC_SCIENCES_EXPERIMENTALES', label: 'Sciences Physiques' },
    { value: 'SVT_BIOLOGIE_GEOLOGIE', label: 'Sciences de la Vie' },
  ];

  // Gestion des changements
  const handleChange = (field) => (event) => {
    setCourseData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError(null);
  };

  // Charger un modèle
  const loadTemplate = (template) => {
    setCourseData(prev => ({
      ...prev,
      latexContent: LATEX_TEMPLATES[template]
    }));
  };

  // Upload d'images
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const result = await imageService.uploadCourseImages(files);
      
      if (result.data.uploaded) {
        const newImages = Object.entries(result.data.uploaded).map(([original, filename]) => ({
          originalName: original,
          filename: filename,
          url: `/api/images/course/${filename}`,
          available: true
        }));
        
        setUploadedImages(prev => [...prev, ...newImages]);
        setSuccess(`${Object.keys(result.data.uploaded).length} image(s) uploadée(s) avec succès`);
      }
      
      if (result.data.failed && Object.keys(result.data.failed).length > 0) {
        setError(`Échec pour ${Object.keys(result.data.failed).length} image(s)`);
      }
    } catch (err) {
      setError('Erreur lors de l\'upload des images');
    } finally {
      setLoading(false);
    }
  };

  // Valider les images référencées
  const validateImages = useCallback(async () => {
    // Extraire les références d'images du LaTeX
    const imageRefs = courseData.latexContent.match(/\\includegraphics(?:\[[^\]]*\])?\{([^}]+)\}/g) || [];
    const filenames = imageRefs.map(ref => {
      const match = ref.match(/\{([^}]+)\}/);
      return match ? match[1] : null;
    }).filter(Boolean);

    if (filenames.length === 0) {
      setImageValidation({ allAvailable: true, missing: [] });
      return;
    }

    try {
      const result = await imageService.validateImages(filenames, 'course');
      setImageValidation({
        allAvailable: result.data.allImagesAvailable,
        missing: result.data.missingImages || []
      });
    } catch (err) {
      console.error('Erreur validation images:', err);
      setImageValidation({ allAvailable: false, missing: filenames });
    }
  }, [courseData.latexContent]);

  // Sauvegarder le cours
  const handleSave = async (publish = false) => {
    // Validation
    if (!courseData.title || !courseData.latexContent) {
      setError('Le titre et le contenu LaTeX sont requis');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Créer le cours
      const result = await courseService.createCourse(courseData);
      
      if (result.success) {
        setSuccess('Cours créé avec succès');
        
        // Publier si demandé
        if (publish && result.data.id) {
          await courseService.publishCourse(result.data.id);
          setSuccess('Cours créé et publié avec succès');
        }
        
        // Rediriger après 2 secondes
        setTimeout(() => {
          navigate('/admin/courses');
        }, 2000);
      } else {
        setError(result.message || 'Erreur lors de la création');
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  // Insérer une référence d'image dans le LaTeX
  const insertImageReference = (filename) => {
    const imageRef = `\\includegraphics[width=0.8\\textwidth]{${filename}}`;
    setCourseData(prev => ({
      ...prev,
      latexContent: prev.latexContent + '\n' + imageRef + '\n'
    }));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        {/* En-tête */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">
            Créer un nouveau cours
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin/courses')}
            >
              Annuler
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={() => handleSave(false)}
              disabled={loading}
            >
              Enregistrer
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<Publish />}
              onClick={() => handleSave(true)}
              disabled={loading}
            >
              Publier
            </Button>
          </Box>
        </Box>

        {/* Alertes */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* Onglets */}
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
          <Tab label="Informations" />
          <Tab label="Contenu LaTeX" />
          <Tab label="Images" />
          <Tab label="Prévisualisation" />
        </Tabs>

        {/* Tab 1: Informations */}
        {activeTab === 0 && (
          <Box>
            <TextField
              fullWidth
              label="Titre du cours"
              value={courseData.title}
              onChange={handleChange('title')}
              required
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={courseData.description}
              onChange={handleChange('description')}
              sx={{ mb: 2 }}
            />
            
            <Box display="flex" gap={2} mb={2}>
              <TextField
                select
                label="Niveau académique"
                value={courseData.academicLevel}
                onChange={handleChange('academicLevel')}
                sx={{ flex: 1 }}
              >
                {academicLevels.map(level => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </TextField>
              
              <TextField
                select
                label="Branche"
                value={courseData.branch}
                onChange={handleChange('branch')}
                sx={{ flex: 1 }}
              >
                {branches.map(branch => (
                  <MenuItem key={branch.value} value={branch.value}>
                    {branch.label}
                  </MenuItem>
                ))}
              </TextField>
              
              <TextField
                type="number"
                label="Numéro de chapitre"
                value={courseData.chapterNumber}
                onChange={handleChange('chapterNumber')}
                sx={{ width: 150 }}
              />
            </Box>
            
            <TextField
              fullWidth
              label="Tags (séparés par des virgules)"
              value={courseData.tags}
              onChange={handleChange('tags')}
              placeholder="ex: mécanique, newton, forces"
              sx={{ mb: 2 }}
            />
          </Box>
        )}

        {/* Tab 2: Contenu LaTeX */}
        {activeTab === 1 && (
          <Box>
            {/* Boutons de modèles */}
            <Box display="flex" gap={2} mb={2}>
              <Typography variant="body2">Modèles :</Typography>
              <Button
                size="small"
                startIcon={<Code />}
                onClick={() => loadTemplate('PHYSICS')}
              >
                Physique
              </Button>
              <Button
                size="small"
                startIcon={<Code />}
                onClick={() => loadTemplate('MATH')}
              >
                Mathématiques
              </Button>
            </Box>
            
            {/* Éditeur LaTeX */}
            <TextField
              fullWidth
              multiline
              rows={20}
              label="Contenu LaTeX"
              value={courseData.latexContent}
              onChange={handleChange('latexContent')}
              sx={{
                mb: 2,
                '& textarea': {
                  fontFamily: 'monospace',
                  fontSize: '14px',
                },
              }}
              helperText="Entrez votre contenu LaTeX. Les sections seront automatiquement détectées et découpées."
            />
            
            {/* Aide LaTeX */}
            <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Commandes LaTeX supportées :</strong>
              </Typography>
              <Typography variant="caption" component="div">
                • Sections: \section{}, \subsection{}, \subsubsection{}<br />
                • Math: \[ \], $ $, \begin{equation}, \begin{align}<br />
                • Environnements: \begin{theorem}, \begin{definition}, \begin{proof}, \begin{example}<br />
                • Listes: \begin{itemize}, \begin{enumerate}<br />
                • Images: \includegraphics{filename}<br />
                • Formatage: \textbf{}, \textit{}, \underline{}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Tab 3: Images */}
        {activeTab === 2 && (
          <Box>
            {/* Upload d'images */}
            <Box mb={3}>
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                Uploader des images
              </Button>
            </Box>

            {/* Liste des images uploadées */}
            {uploadedImages.length > 0 && (
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>
                  Images disponibles ({uploadedImages.length})
                </Typography>
                <List>
                  {uploadedImages.map((img, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <ImageIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={img.filename}
                        secondary={img.originalName}
                      />
                      <Button
                        size="small"
                        onClick={() => insertImageReference(img.filename)}
                      >
                        Insérer dans LaTeX
                      </Button>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setUploadedImages(prev => prev.filter((_, i) => i !== index));
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Validation des images */}
            <Button
              variant="outlined"
              onClick={validateImages}
              startIcon={<CheckCircle />}
            >
              Vérifier les images référencées
            </Button>
            
            {imageValidation && (
              <Box mt={2}>
                {imageValidation.allAvailable ? (
                  <Alert severity="success">
                    Toutes les images référencées sont disponibles
                  </Alert>
                ) : (
                  <Alert severity="warning">
                    Images manquantes : {imageValidation.missing.join(', ')}
                  </Alert>
                )}
              </Box>
            )}
          </Box>
        )}

        {/* Tab 4: Prévisualisation */}
        {activeTab === 3 && (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              Voici comment votre cours apparaîtra aux étudiants
            </Alert>
            
            <Paper variant="outlined" sx={{ p: 3 }}>
              {courseData.latexContent ? (
                <LaTeXRenderer 
                  content={courseData.latexContent}
                  images={uploadedImages}
                />
              ) : (
                <Typography color="text.secondary" align="center">
                  Aucun contenu à prévisualiser
                </Typography>
              )}
            </Paper>
          </Box>
        )}

        {/* Indicateur de chargement */}
        {loading && (
          <Box display="flex" justifyContent="center" mt={3}>
            <CircularProgress />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default AdminCourseCreate;