import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { MemoryCard } from "./components/MemoryCard";

function App() {
  const position = [0, 0];

  return (
    <>
      <MemoryCard position={position} />
    </>
  );
}

export default App
