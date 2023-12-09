import React, {useState, useEffect} from 'react';
import { usePhaserGame } from '../hooks/usePhaserGame';
import GameScene from './GameScene';
import { GridEngine, GridEngineHeadless } from "grid-engine";
import {subscribePhaserEvent, unsubscribePhaserEvent} from '../phaser/EventsCenter';
import { set } from 'mobx';

const Game = () => {
    const [gameSceneLoaded, setGameSceneLoaded] = useState(false);
    const [ai_paused, setAi_paused] = useState(true);
    const [useStarkContract, setUseStarkContract] = useState(false);
    const [useDojoWorld, setUseDojoWorld] = useState(false);

    const gameConfig = {
        type: Phaser.AUTO,
        parent: "taxi-game",
        backgroundColor: '#ffffff',
        render: {
            antialias: false,
        },
        scale:{
            width: 480,
            height: 480,
            //mode:  Phaser.Scale.FIT,
            //mode:  Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.Center.CENTER_BOTH,
            // width: '100%',
            // height: '100%'
        },
        physics:{
            default: 'arcade',
            arcade:{ gravity: { y: 0 } }
        },
        plugins: {
            scene: [
                {
                    key: "gridEngine",
                    plugin: GridEngine,
                    mapping: "gridEngine",
                },
            ],
        },
        scene: [GameScene]
    }
    const game = usePhaserGame(gameConfig);

    const gamescene = gameSceneLoaded ? game?.scene?.keys?.GameScene : null;

    //suscribe to game events
    useEffect(() => {
        subscribePhaserEvent("gameloaded", () => {
            console.log("game loaded");
            setGameSceneLoaded(true);
        });

        subscribePhaserEvent("pauseunpause_ai", (e) => {
            //console.log("pauseunpause_ai");
            //console.log(e?.detail);
            setAi_paused(e?.detail);
        });

        subscribePhaserEvent("useStarkContract", (e) => {
            setUseStarkContract(e?.detail);
        });

        subscribePhaserEvent("usedojoWorld", (e) => {
            setUseDojoWorld(e?.detail);
        });

        return ()=>{
            unsubscribePhaserEvent("gameloaded", ()=>{});
            unsubscribePhaserEvent("pauseunpause_ai", ()=>{});
            unsubscribePhaserEvent("useStarkContract", ()=>{});
            unsubscribePhaserEvent("usedojoWorld", ()=>{});
        }
    }, [])

    return (
        <div className="flex flex-row justify-start
        mt-8
        ">
        
            {/* THE GAME */}
            <div className="
            border-2 border-orange-600 rounded-lg
            overflow-hidden
            w-[480px] h-[480px]" id="taxi-game"></div>

            {/* controls bar */}
            <div className="ml-2 flex flex-col
            w-[150px]
            ">

                <div className="
                flex flex-col
                h-3/5">
                <button className={`rounded-md 
                    ${!ai_paused? "bg-orange-500":"bg-green-500"}
                    text-white
                    font-medium
                    px-3 h-full
                    my-1`}
                    
                onClick={()=>{
                    gameSceneLoaded? 
                    gamescene?.pauseUnpauseAI() 
                    : null;
                }}
                >{
                        ai_paused ? "Resume AI" : "Pause AI"
                    }</button>
                
                <button className="
                    rounded-md 
                    bg-yellow-500 text-white
                    font-medium
                    px-3 h-full
                    my-1
                    "
                onClick={()=>{
                        gameSceneLoaded? 
                        gamescene?.pickupPassenger() 
                        : null;
                    }}
                >PickUp</button>
                
                <button className="
                    rounded-md 
                    bg-blue-500 text-white
                    font-medium
                    px-3 h-full
                    my-1
                    "
                onClick={()=>{
                        gameSceneLoaded? 
                        gamescene?.dropOffPassenger() 
                        : null;
                    }}
                >DropOff</button>
                
                <button className="
                    rounded-md 
                    bg-purple-700/80 text-white
                    font-medium
                    px-3 h-full
                    my-1
                    "
                onClick={()=>{
                    gameSceneLoaded? 
                    gamescene?.resetGame() 
                    : null;
                }}
                >Reset</button>
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
                    "
                onClick={()=>{
                        gameSceneLoaded? 
                        gamescene?.moveTaxi("left")
                        : null;
                    }}
                >Left</button>

                <button className="
                    rounded-md 
                    bg-black/70 text-white
                    font-medium
                    h-full
                    px-1
                    "
                onClick={()=>{
                        gameSceneLoaded? 
                        gamescene?.moveTaxi("right")
                        : null;
                    }}
                >Right</button>
                
                <button className="
                    rounded-md 
                    bg-black/70 text-white
                    font-medium
                    h-full
                    px-1
                    "
                onClick={()=>{
                        gameSceneLoaded? 
                        gamescene?.moveTaxi("up")
                        : null;
                    }}
                >Up</button>

                <button className="
                    rounded-md 
                    bg-black/70 text-white
                    font-medium
                    h-full
                    px-1
                    "
                onClick={()=>{
                        gameSceneLoaded? 
                        gamescene?.moveTaxi("down")
                        : null;
                    }}
                >Down</button>
                </div>


                </div>
        
        </div>
    )
}

export default Game