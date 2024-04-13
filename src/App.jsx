import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import BonneAdventure from './books/bonne-adventure/BonneAdventure'
import './App.css'

function Home() {
  return (
    <div className="Home">
      <h1>Bowie's Books!</h1>
      <div className="grid">
        <div className="grid-item">
          <Link to="/bonne-adventure">
            <img src="/books/bonne-adventure/0-cover.webp" />
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
      </Routes>
    </BrowserRouter>
  )
}

export default App
