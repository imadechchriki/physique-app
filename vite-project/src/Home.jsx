import React from "react";
import Header from "./Components/HomePage/Header";
import Section1 from "./Components/HomePage/Section1";
import Section2 from "./Components/HomePage/Section2";
import Section3 from "./Components/HomePage/Section3";
import About from "./Components/HomePage/About";	
import Contact from "./Components/HomePage/Contact";
import Footer from "./Components/HomePage/Footer";
import AnimationStyles from "./Components/HomePage/AnimationStyles";
function Home(){
    return(
        <>
        <AnimationStyles/>
        <Header/>
        <Section1/>
        <Section2/>
        <Section3/>
        <About/>
        <Contact/>
        <Footer/>
        
        </>
    )
}
export default Home;