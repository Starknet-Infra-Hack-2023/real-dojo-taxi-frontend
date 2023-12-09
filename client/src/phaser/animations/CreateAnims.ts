import Phaser from 'phaser';

const createAnims = (anims: Phaser.Animations.AnimationManager) => {
    const frameRate = 12;
    anims.create({
        key: 'taxi-mid',
        frames: [{key: 'taxi1', frame: 'cab_front.png'}],
        repeat: -1,
        frameRate: frameRate,
        yoyo: true,
    });

    anims.create({
        key: 'taxi-down',
        frames: [{key: 'taxi1', frame: 'cab_front.png'}],
        repeat: -1,
        frameRate: frameRate,
        yoyo: true,
    });
    anims.create({
        key: 'taxi-up',
        frames: [{key: 'taxi1', frame: 'cab_rear.png'}],
        repeat: -1,
        frameRate: frameRate,
        yoyo: true,
    });
    anims.create({
        key: 'taxi-left',
        frames: [{key: 'taxi1', frame: 'cab_left.png'}],
        repeat: -1,
        frameRate: frameRate,
        yoyo: true,
    });
    anims.create({
        key: 'taxi-right',
        frames: [{key: 'taxi1', frame: 'cab_right.png'}],
        repeat: -1,
        frameRate: frameRate,
        yoyo: true,
    });

    anims.create({
        key: 'customer-mid',
        frames: [{key: 'customer1', frame: 'passenger.png'}],
        repeat: -1,
        frameRate: frameRate,
        yoyo: true,
    });

    anims.create({
        key: 'destination',
        frames: [{key: 'hotel1', frame: 'hotel.png'}],
        repeat: -1,
        frameRate: frameRate,
        yoyo: true,
    });
}

export {
    createAnims
}