import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import BonneAdventure from './books/bonne-adventure/BonneAdventure'
import DragonFighter from './books/dragon-fighter/DragonFighter'
import './App.css'

function Home() {
  return (
    <div className="Home">
      <h1>Bowie's Books!</h1>
      <div className="image-grid">
        <div className="grid-item">
          <Link to="/bonne-adventure">
            <img src="/books/bonne-adventure/0-cover.webp" />
          </Link>
        </div>
        <div className="grid-item">
          <Link to="/dragon-fighter">
            <img src="/books/dragon-fighter/0-cover.webp" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bonne-adventure/*" element={<BonneAdventure />} />
        <Route path="/dragon-fighter/*" element={<DragonFighter />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
