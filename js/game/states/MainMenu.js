BasicGame.MainMenu = function(game) {

};

BasicGame.MainMenu.prototype = {

    create: function() {

        // Add the background
        game.add.image(0, 0, 'trees');


        // Name of the game
        var nameLabel = game.add.text(game.world.centerX, 400, 'Spooky Puncher', {
            font: '75px Butcherman',
            fill: '#FF5F1B'
        });
        nameLabel.anchor.setTo(0.5, 0.5);

        // How to start the game
        var startLabel = game.add.text(game.world.centerX, 700, 'Tap the screen to Start', {
            font: '26px Arial',
            fill: '#FF5F1B'
        });
        startLabel.anchor.setTo(0.5, 0.5);
        game.add.tween(startLabel).to({
            angle: -4
        }, 500).to({
            angle: 4
        }, 500).loop().start();

        // Add a mute button
        this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
        this.muteButton.scale.set(2);
        this.muteButton.input.useHandCursor = true;
        if (game.sound.mute) {
            this.muteButton.frame = 1;
        }

        // start the game on tap
        this.game.input.onDown.addOnce(this.start, this);

        // Create a white rectangle that we'll use to represent the flash
        this.flash = this.game.add.graphics(0, 0);
        this.flash.beginFill(0xffffff, 1);
        this.flash.drawRect(0, 0, this.game.width, this.game.height);
        this.flash.endFill();
        this.flash.alpha = 0;

        this.game.world.setBounds(-10, -10, this.game.width + 20, this.game.height + 20);

        game.time.events.add(2000, this.toggleBlast, this);

        // add in rain into the game
        var emitter = new Rain(this.game, game.world.centerX, -300, 1600);

        this.ambience = this.game.add.audio('ambience');
        this.ambience.play('', 0, 0.3, true);

        this.music = this.game.add.audio('music');
        this.music.play('', 0, 0.3, true);
    },

    toggleSound: function() {
        game.sound.mute = !game.sound.mute;
        this.muteButton.frame = game.sound.mute ? 1 : 0;
    },

    toggleBlast: function() {
        if (blast === false) {
            blast = true;
            this.shockAndAwe();
            game.time.events.add(120, this.toggleBlast, this);
        } else {

            blast = false;
            this.timerBlast = {};
            var _time = game.rnd.integerInRange(3500, 10000);

            this.timerBlast = game.time.events.add(game.rnd.integerInRange(4000, 10000), this.toggleBlast, this);


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

    start: function() {
        game.state.start('Game');
    }

};