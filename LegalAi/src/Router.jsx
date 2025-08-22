import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
import Home from './Pages/Home';
import AskAI from './Pages/AskAI';
import LegalDocs from './Pages/LegalDocs';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Services from './Pages/Services';

const Router = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          } 
        />
        <Route 
          path="/askai" 
          element={
            <PageTransition>
              <AskAI />
            </PageTransition>
          } 
        />
        <Route 
          path="/legaldocs" 
          element={
            <PageTransition>
              <LegalDocs />
            </PageTransition>
          } 
        />
        <Route 
          path="/about" 
          element={
            <PageTransition>
              <About />
            </PageTransition>
          } 
        />
        <Route 
          path="/contact" 
          element={
            <PageTransition>
              <Contact />
            </PageTransition>
          } 
        />
        <Route 
          path="/services" 
          element={
            <PageTransition>
              <Services />
            </PageTransition>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
};

export default Router;