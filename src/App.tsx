import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import * as React from 'react';
import Home from './components/Home';

// Generic lazy-loading factory for YamlBookWrapper
const lazyYamlBook = (yamlFileName: string): React.LazyExoticComponent<() => JSX.Element> =>
  lazy(() =>
    import('./components/YamlBookWrapper').then((m) => ({
      default: () => <m.default yamlFileName={yamlFileName} />,
    }))
  );

// Lazy load book components for better performance
const BonneAdventure = lazyYamlBook('bonne-adventure.yaml');
const DragonFighter = lazyYamlBook('dragon-fighter.yaml');
const SkywardBound = lazyYamlBook('skyward-bound.yaml');
const ZiggyTheBunny = lazyYamlBook('ziggy-the-bunny.yaml');
const SuperBowie = lazyYamlBook('super-bowie.yaml');
const SuperkittySavesBunnytown = lazyYamlBook('superkitty-saves-bunnytown.yaml');

/**
 * Main App component with routes to the home page and all books
 */
function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen bg-background-grad bg-[length:400%_400%] animate-gradient-slow">
            <div className="text-white text-2xl font-bold animate-pulse">Loading...</div>
          </div>
        }
      >
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
