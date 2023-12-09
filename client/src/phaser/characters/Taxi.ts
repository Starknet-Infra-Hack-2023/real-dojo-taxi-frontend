import Phaser from "phaser";

export default class Taxi extends Phaser.Physics.Arcade.Sprite {
    speed = 250
    constructor(scene: Phaser.Scene, x: number, y: number, 
        texture: string, frame: string | number){
            super(scene, x, y, texture, frame);
            this.anims.play('taxi-mid', true)
    }

    static preload(scene: Phaser.Scene){
        scene.load.atlas('taxi1', 'characters/taxi.png', 'characters/taxi.json');
    }
    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta)
    }
    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys){

        // if (!cursors)
		// {
		// 	return
		// }

		// const leftDown = cursors.left?.isDown
		// const rightDown = cursors.right?.isDown
		// const upDown = cursors.up?.isDown
		// const downDown = cursors.down?.isDown

        // if (leftDown)
		// {   
        //     this.anims.play('taxi-left', true)
		// 	this.setVelocity(-this.speed, 0)
		// }
		// else if (rightDown)
		// {
        //     this.anims.play('taxi-right', true)
		// 	this.setVelocity(this.speed, 0)
			
		// }
		// else if (upDown)
		// {   
        //     this.anims.play('taxi-up', true)
		// 	this.setVelocity(0, -this.speed)
		// }
		// else if (downDown)
		// {   
        //     this.anims.play('taxi-down', true)
		// 	this.setVelocity(0, this.speed)
		// }
		// else
		// {
		// 	this.anims.play('taxi-mid', true)
		// 	this.setVelocity(0, 0)
		// }
    }
}