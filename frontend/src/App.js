import React from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ClassifierPage from './pages/ClassifierPage';
import ModelInsightsPage from './pages/ModelInsightsPage';
import PipelinePage from './pages/PipelinePage';
import './App.css';

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

// Wrapper component to apply animations to each page
const PageWrapper = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Exoplanet Classifier 🚀</h1>
        <nav>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Classifier</NavLink>
          <NavLink to="/insights" className={({ isActive }) => (isActive ? 'active' : '')}>Model Insights</NavLink>
          <NavLink to="/pipeline" className={({ isActive }) => (isActive ? 'active' : '')}>Data Pipeline</NavLink>
        </nav>
      </header>
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><ClassifierPage /></PageWrapper>} />
            <Route path="/insights" element={<PageWrapper><ModelInsightsPage /></PageWrapper>} />
            <Route path="/pipeline" element={<PageWrapper><PipelinePage /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;