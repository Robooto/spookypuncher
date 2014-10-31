BasicGame.Game = function(game) {

};

var blast = false;
var gameStop = false;

BasicGame.Game.prototype = {

    create: function() {

        this.win = 420;

        game.add.image(0, 0, 'trees');


        // The radius of the circle of light
        this.LIGHT_RADIUS = 90;

        if (!this.game.device.desktop) {
            this.LIGHT_RADIUS = 110;
        }

        // Create the shadow texture
        this.shadowTexture = this.game.add.bitmapData(this.game.width, this.game.height);

        // Create an object that will use the bitmap as a texture
        this.lightSprite = this.game.add.image(0, 0, this.shadowTexture);

        // Set the blend mode to MULTIPLY. This will darken the colors of
        // everything below this sprite.
        this.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;

        // Simulate a pointer click/tap input at the center of the stage
        // when the example begins running.
        game.input.activePointer.x = this.game.width / 2;
        game.input.activePointer.y = this.game.height / 2;

        // Create a white rectangle that we'll use to represent the flash
        this.flash = this.game.add.graphics(0, 0);
        this.flash.beginFill(0xffffff, 1);
        this.flash.drawRect(0, 0, this.game.width, this.game.height);
        this.flash.endFill();
        this.flash.alpha = 0;

        // set world a little larger so we can screen shake
        this.game.world.setBounds(-10, -10, this.game.width + 20, this.game.height + 20);

        // start the first lightning blast
        game.time.events.add(4000, this.toggleBlast, this);

        this.explosionGroup = game.add.group();


        this.hudGroup = game.add.group();
        var posX = (game.width / 2) - 200;
        var posY = game.height - 200;

        this.spookBar = game.add.image(posX, posY, "spookMeter");
        this.spookBarFill = game.add.image(posX, posY - 5, 'spookFill');

        this.spookBarFill.width = 0;

        this.hudGroup.add(this.spookBar);
        this.hudGroup.add(this.spookBarFill);

        // score for timer
        this.score = 0;

        // increase score as game progresses
        game.time.events.loop(Phaser.Timer.SECOND, function() {
            this.score = this.score + 10;
        }, this);

        // game timer
        this.gameTimer = this.game.time.now;

        this.nextMonster = game.time.now + 500; // spawn timer every 1/2 second

        // add in rain into the game
        var emitter = new Rain(this.game, game.world.centerX, -300, 1600);

        // add sounds
        this.hitSpookies = this.game.add.audio('hit');
        this.endGameSound = this.game.add.audio('scream');


    },

    update: function() {

        // Update the shadow texture each frame
        this.updateShadowTexture(blast);

        // Create new enemies faster and faster
        // At first, one every 1.5 second, and finally one evey 800ms
        if (this.nextMonster < game.time.now) {
            var start = 4000,
                end = 1700,
                scoreholder = 600;
            var delay = Math.max(start - (start - end) * this.score / scoreholder, end);

            this.createMonster();

            this.nextMonster = game.time.now + delay;
        }

    },

    updateShadowTexture: function(blast) {

        if (gameStop === true) {
            return false;
        }

        // This function updates the shadow texture (this.shadowTexture).
        // First, it fills the entire texture with a dark shadow color.
        // Then it draws a white circle centered on the pointer position.
        // Because the texture is drawn to the screen using the MULTIPLY
        // blend mode, the dark areas of the texture make all of the colors
        // underneath it darker, while the white area is unaffected.

        // Draw shadow

        if (blast === true) {
            this.shadowTexture.context.fillStyle = 'rgb(120, 120, 120)';
        } else {
            this.shadowTexture.context.fillStyle = 'rgb(0, 0, 0)';
        }
        this.shadowTexture.context.fillRect(0, 0, this.game.width, this.game.height);

        var posY = this.game.input.activePointer.y;
        if (!this.game.device.desktop) {
            posY = this.game.input.activePointer.y - (this.LIGHT_RADIUS / 2);
        }

        // Draw circle of light with a soft edge
        var gradient = this.shadowTexture.context.createRadialGradient(
            game.input.activePointer.x, posY, this.LIGHT_RADIUS * 0.75,
            game.input.activePointer.x, posY, this.LIGHT_RADIUS);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

        this.shadowTexture.context.beginPath();
        this.shadowTexture.context.fillStyle = gradient;
        this.shadowTexture.context.arc(this.game.input.activePointer.x, posY,
            this.LIGHT_RADIUS, 0, Math.PI * 2);
        this.shadowTexture.context.fill();

        // This just tells the engine it should update the texture cache
        this.shadowTexture.dirty = true;

    },

    toggleBlast: function() {
        if (blast === false) {
            blast = true;
            this.shockAndAwe();
            game.time.events.add(120, this.toggleBlast, this);
        } else {

            blast = false;
            this.timerBlast = {};
            var _time = game.rnd.integerInRange(5500, 18000);

            this.timerBlast = game.time.events.add(game.rnd.integerInRange(6000, 19000), this.toggleBlast, this);


        }
    },

    shockAndAwe: function() {
        // Create the flash
        this.flash.alpha = 1;
        game.add.tween(this.flash)
            .to({
                alpha: 0
            }, 180, Phaser.Easing.Cubic.In)
            .start();

        // Shake the camera by moving it up and down 5 times really fast
        game.camera.y = 0;
        game.add.tween(game.camera)
            .to({
                y: -10
            }, 80, Phaser.Easing.Sinusoidal.InOut, false, 0, 5, true)
            .start();
    },

    createMonster: function() {
        var monster = game.add.sprite((game.width / 2), (game.height / 2) + 40, game.rnd.pick(['spook1', 'spook2', 'spook3']));
        var scale = game.rnd.realInRange(0.5, 0.8);
        game.world.bringToTop(this.lightSprite);
        game.world.bringToTop(this.hudGroup);

        var BarFill = this.spookBarFill;

        monster.scale.x = scale;
        monster.scale.y = scale;
        monster.alpha = 0;
        monster.x = game.rnd.integerInRange(40, game.width - 80);
        monster.y = game.rnd.integerInRange(110, game.height - 120);
        monster.anchor.setTo(0.5, 0.5);
        monster.inputEnabled = true;
        monster.events.onInputDown.add(this.attackSpook, this);

        var smallTween = game.add.tween(monster).to({
            y: monster.y + game.rnd.integerInRange(10, 30)
        }, game.rnd.integerInRange(1180, 1500), Phaser.Easing.Circular.none, true, 0, 1200, true);

        var tween2 = game.add.tween(monster).to({
            alpha: 0.7
        }, 1000, Phaser.Easing.Quintic.Out, true, 0, false);

        //tween._target = item;
        var tween = game.add.tween(monster.scale).to({
            y: 2.4,
            x: 2.4
        }, 4000, Phaser.Easing.Cubic.Out, true, 0, false);
        monster.tweenObj = tween;
        monster.smallTween = smallTween;
        tween.pause();

        tween2.onComplete.add(function(e) {
            var tween3 = game.add.tween(monster).to({
                alpha: 1
            }, 5600, Phaser.Easing.Sinusoidal.Out, true, 0, false);

            tween.resume();


            tween.onComplete.add(function(e) {
                // setTimeout(function(args) {
                for (var i = 0; i < 30; i++) {
                    BarFill.width += 1;
                };

                if (BarFill.width >= this.win) {
                    BarFill = null;
                    this.quitGame();
                }

                tween.stop();
                //  }, Math.round(reg.animationSpeed / 4) - 10, [monster]);
            }, this);

        }, this);

    },

    attackSpook: function(spook) {
        spook.tweenObj.stop();
        spook.smallTween.stop();

        this.hitSpookies.play();

        var scale = spook.scale.x + 0.2;
        this.getExplosion(Math.round(spook.x), Math.round(spook.y), scale);
        spook.kill();
    },

    getExplosion: function(x, y, scale) {
        // Try to get a used explosion from the explosionGroup.
        // If an explosion isn't available, create a new one and add it to the group.
        // Setup new explosions so that they animate and kill themselves when the
        // animation is complete.
        // Get the first dead explosion from the explosionGroup
        var explosion = this.explosionGroup.getFirstDead();

        // If there aren't any available, create a new one
        if (explosion === null) {
            explosion = game.add.sprite(0, 0, 'explosion');
            explosion.anchor.setTo(0.5, 0.5);

            // Add an animation for the explosion that kills the sprite when the
            // animation is complete
            var animation = explosion.animations.add('boom', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34], 40, false);

            animation.killOnComplete = true;

            // Add the explosion sprite to the group
            this.explosionGroup.add(explosion);
        }

        // Revive the explosion (set it's alive property to true)
        // You can also define a onRevived event handler in your explosion objects
        // to do stuff when they are revived.
        explosion.revive();

        // Move the explosion to the given coordinates
        explosion.x = x;
        explosion.y = y;
        explosion.scale.x = scale;
        explosion.scale.y = scale;

        // Set rotation of the explosion at random for a little variety
        explosion.angle = game.rnd.integerInRange(0, 360);

        // Play the animation
        explosion.animations.play('boom');

        // Return the explosion itself in case we want to do anything else with it
        return explosion;
    },

    createBar: function() {

        this.hudGroup = game.add.group();
        var posX = (game.width / 2) - 200;
        var posY = game.height - 200;

        this.spookBar = game.add.image(posX, posY, "spookMeter");
        this.spookBarFill = game.add.image(posX, posY, 'spookFill');

        this.spookBarFill.width = 0;

        this.hudGroup.add(this.spookBar);
        this.hudGroup.add(this.spookBarFill);

    },

    quitGame: function(pointer) {

        this.win = 700;
        this.endGameSound.play();

        this.spookBarFill.width = 410;

        this.nextMonster = Number.MAX_VALUE;

        var scoreboard = new Scoreboard(this.game);

        // show the scoreboard function in 1000ms
        game.time.events.add(2000, scoreboard.show(this.gameTimer), this);

        game.time.events.removeAll();

        this.score = 0;

    }

};