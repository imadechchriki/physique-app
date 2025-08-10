import React from "react";

const Courses = () => {
  // Données du curriculum exactement comme dans l'image Kartable
  const curriculumData = {
    introduction: {
      subtitle: "Thème introductif",
      title: "Introduction",
      sections: [
        {
          title: "Mesures et incertitudes",
          courseLabel: "COURS INTRODUCTIF"
        }
      ]
    },
    theme1: {
      subtitle: "Thème 1",
      title: "Constitutions et transformation de la matière",
      sections: [
        {
          title: "Les mélanges",
          courseLabel: "COURS 1"
        },
        {
          title: "Les solutions aqueuses",
          courseLabel: "COURS 2"
        },
        {
          title: "Les constituants de la matière",
          courseLabel: "COURS 3"
        },
        {
          title: "La stabilité chimique",
          courseLabel: "COURS 4"
        },
        {
          title: "La quantité de matière",
          courseLabel: "COURS 5"
        },
        {
          title: "Les transformations physiques",
          courseLabel: "COURS 6"
        },
        {
          title: "Les transformations chimiques",
          courseLabel: "COURS 7"
        },
        {
          title: "Les transformations nucléaires",
          courseLabel: "COURS 8"
        }
      ]
    }
  };

  const CourseCard = ({ section, isIntro = false }) => (
    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group overflow-hidden min-h-[200px]">
      {/* Fond coloré en haut - vert clair comme dans l'image */}
      <div className="h-24 w-full bg-gradient-to-br from-green-100 to-green-200"></div>
      
      {/* Contenu principal */}
      <div className="p-4 -mt-4 relative bg-white">
        <h3 className="text-base font-semibold text-gray-900 mb-6 leading-tight min-h-[3rem]">
          {section.title}
        </h3>
        
        {/* Badge du cours en bas */}
        <div className="absolute bottom-4 left-4">
          <span className="inline-block px-3 py-1 bg-gray-100 text-xs font-medium text-gray-600 rounded">
            {section.courseLabel}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Section Introduction */}
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">
            {curriculumData.introduction.subtitle}
          </p>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {curriculumData.introduction.title}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {curriculumData.introduction.sections.map((section, index) => (
            <CourseCard key={index} section={section} isIntro={true} />
          ))}
        </div>
      </div>

      {/* Section Thème 1 */}
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">
            {curriculumData.theme1.subtitle}
          </p>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {curriculumData.theme1.title}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {curriculumData.theme1.sections.map((section, index) => (
            <CourseCard key={index} section={section} isIntro={false} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;