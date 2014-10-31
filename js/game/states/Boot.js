BasicGame = {
    /* Your game can check BasicGame.orientated in internal loops to know if it should pause or not */
    orientated: false

};

BasicGame.Boot = function(game) {};

BasicGame.Boot.prototype = {

    preload: function() {

        this.load.image('progressBar', 'assets/images/progressBar.png');

    },

    create: function() {

        // Set a background color and the physic system
        // Set stage background color
        game.stage.backgroundColor = 0x121212;
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop) {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(480, 260, 640, 1136);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.setScreenSize(true);
            this.scale.refresh();
        } else {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(480, 260, 640, 1136);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.forceOrientation(false, true);
            this.scale.setResizeCallback(this.gameResized, this);
            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
            this.scale.setScreenSize(true);
            this.scale.refresh();
        }

        this.state.start('Preloader');

    },

    gameResized: function(width, height) {

        //  This could be handy if you need to do any extra processing if the game resizes.
        //  A resize could happen if for example swapping orientation on a device.

    },

    enterIncorrectOrientation: function() {

        BasicGame.orientated = false;

        document.getElementById('orientation').style.display = 'block';

    },

    leaveIncorrectOrientation: function() {

        BasicGame.orientated = true;

        document.getElementById('orientation').style.display = 'none';

    }

};