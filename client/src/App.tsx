import React from 'react';
import Original from "./pages/Original";
import Game from './phaser/Game';
import { Navbar } from './components/Navbar';

function App() {

  return (
    <div className="">
      <Navbar/>
      
      <div className="contain mx-auto
      w-full
      flex flex-row justify-center items-center
      pt-24
      ">
        <Game/>
      </div>
    
    </div>
  );
}

export default App;
