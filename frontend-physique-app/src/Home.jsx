import React from "react";
import Header from "./Components/HomePage/Header";
import HeroSection from "./Components/HomePage/HeroSection";
import FeaturesSection from "./Components/HomePage/FeaturesSection";
import AboutOwnerSection from "./Components/HomePage/AboutOwnerSection";
import ProcessSection from "./Components/HomePage/ProcessSection";
import CTASection from "./Components/HomePage/CTASection";
import Footer from "./Components/HomePage/Footer";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <AboutOwnerSection />
      <ProcessSection />
      <CTASection />
      <Footer />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
