import Phaser from "phaser";

export default class Destination extends Phaser.Physics.Arcade.Sprite {
    speed = 250
    constructor(scene: Phaser.Scene, x: number, y: number, 
        texture: string, frame: string | number){
            super(scene, x, y, texture, frame);
            this.anims.play('destination', true)
    }

    static preload(scene: Phaser.Scene){
        scene.load.atlas('hotel1', 'characters/taxi.png', 'characters/taxi.json');
    }
    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta)
    }
}