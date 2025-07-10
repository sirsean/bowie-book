import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Home from './components/Home';
import './styles/global.css';

// Lazy load book components for better performance
const BonneAdventure = lazy(() => import('./books/bonne-adventure/BonneAdventure'));
const DragonFighter = lazy(() => import('./books/dragon-fighter/DragonFighter'));
const SkywardBound = lazy(() => import('./books/skyward-bound/SkywardBound'));
const ZiggyTheBunny = lazy(() => import('./books/ziggy-the-bunny/ZiggyTheBunny'));
const SuperBowie = lazy(() => import('./books/super-bowie/SuperBowie'));
const SuperkittySavesBunnytown = lazy(
  () => import('./books/superkitty-saves-bunnytown/SuperkittySavesBunnytown')
);

/**
 * Main App component with routes to the home page and all books
 */
function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bonne-adventure/*" element={<BonneAdventure />} />
          <Route path="/dragon-fighter/*" element={<DragonFighter />} />
          <Route path="/skyward-bound/*" element={<SkywardBound />} />
          <Route path="/ziggy-the-bunny/*" element={<ZiggyTheBunny />} />
          <Route path="/super-bowie/*" element={<SuperBowie />} />
          <Route path="/superkitty-saves-bunnytown/*" element={<SuperkittySavesBunnytown />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
