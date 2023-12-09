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
        <div className="flex flex-row justify-start
        mt-8
        ">
          <Game/>
          {/* controls bar */}
          <div className="ml-2 flex flex-col
          w-[150px]
          ">

            <div className="
              flex flex-col
              h-3/5">
              <button className="
                rounded-md 
                bg-red-800/80 text-white
                font-medium
                px-3 h-full
                my-1
                ">Pause</button>
              
              <button className="
                rounded-md 
                bg-orange-500 text-white
                font-medium
                px-3 h-full
                my-1
                ">PickUp</button>
              
              <button className="
                rounded-md 
                bg-blue-500 text-white
                font-medium
                px-3 h-full
                my-1
                ">DropOff</button>
              
              <button className="
                rounded-md 
                bg-purple-700/80 text-white
                font-medium
                px-3 h-full
                my-1
                ">Reset</button>
            </div>

            <div className="
            grid grid-cols-2 gap-1
            h-2/5 w-full">
              <button className="
                rounded-md 
                bg-black/70 text-white
                font-medium
                h-full
                px-1
                ">Left</button>

              <button className="
                rounded-md 
                bg-black/70 text-white
                font-medium
                h-full
                px-1
                ">Right</button>
              
              <button className="
                rounded-md 
                bg-black/70 text-white
                font-medium
                h-full
                px-1
                ">Up</button>

              <button className="
                rounded-md 
                bg-black/70 text-white
                font-medium
                h-full
                px-1
                ">Down</button>
              </div>


          </div>
        </div>
      </div>
    
    </div>
  );
}

export default App;
