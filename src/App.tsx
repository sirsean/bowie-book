import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import BonneAdventure from './books/bonne-adventure/BonneAdventure';
import DragonFighter from './books/dragon-fighter/DragonFighter';
import SkywardBound from './books/skyward-bound/SkywardBound';
import ZiggyTheBunny from './books/ziggy-the-bunny/ZiggyTheBunny';
import './styles/global.css';

/**
 * Main App component with routes to the home page and all books
 */
function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bonne-adventure/*" element={<BonneAdventure />} />
        <Route path="/dragon-fighter/*" element={<DragonFighter />} />
        <Route path="/skyward-bound/*" element={<SkywardBound />} />
        <Route path="/ziggy-the-bunny/*" element={<ZiggyTheBunny />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;