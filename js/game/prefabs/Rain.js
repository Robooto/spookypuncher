var Rain = function(game, x, y, maxParticles) {

    Phaser.Particles.Arcade.Emitter.call(this, game, x, y, maxParticles);

    this.width = game.world.width + (game.world.width);
    this.makeParticles('rain');
    this.minParticleScale = 0.1;
    this.maxParticleScale = 0.5;
    this.setYSpeed(480, 680);
    this.setXSpeed(-5, 5);
    this.setAlpha(0.2, 1, 0);
    this.minRotation = 0;
    this.maxRotation = 0;
    //this.angle = 30; // uncomment to set an angle for the rain.
    this.start(false, 2000, 0, 0);

};

Rain.prototype = Object.create(Phaser.Particles.Arcade.Emitter.prototype);
Rain.prototype.constructor = Rain;