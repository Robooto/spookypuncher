BasicGame.Preloader = function(game) {

    this.ready = false;

};

BasicGame.Preloader.prototype = {

    preload: function() {

        // Add a loading label 
        var loadingLabel = this.add.text(this.game.world.centerX, game.world.centerY - 80, 'Loading...', {
            font: '50px Butcherman',
            fill: '#FF5F1B'
        });
        loadingLabel.anchor.setTo(0.5, 0.5);

        // Add a progress bar
        var progressBar = this.add.sprite(this.game.world.centerX, game.world.centerY, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        progressBar.scale.set(2);
        this.load.setPreloadSprite(progressBar);

        // Load all assets
        this.game.load.spritesheet('mute', 'assets/images/muteButton.png', 28, 22);

        this.game.load.image('trees', "assets/images/trees.png");

        this.game.load.image('spook1', "assets/images/spook1.png");
        this.game.load.image('spook2', "assets/images/spook2.png");
        this.game.load.image('spook3', "assets/images/spook3.png");

        this.game.load.spritesheet("explosion", "assets/images/cartoon_smoke_up_strip.png", 256, 256);

        this.game.load.image('spookMeter', "assets/images/spookmeter.png");
        this.game.load.image('spookFill', "assets/images/spookmeterfilled.png");

        this.game.load.spritesheet('rain', 'assets/images/rain.png', 15, 24);

        //sounds!
        this.game.load.audio('hit', ['assets/sounds/Hit.mp3', 'assets/sounds/Hit.ogg']);
        this.game.load.audio('music', ['assets/sounds/Snipers.mp3', 'assets/sounds/Snipers.ogg']);
        this.game.load.audio('scream', ['assets/sounds/girl-scream.mp3', 'assets/sounds/girl-scream.ogg']);
        this.game.load.audio('ambience', ['assets/sounds/ambience.mp3', 'assets/sounds/ambience.ogg']);



    },

    create: function() {

        //	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
        //this.preloadBar.cropEnabled = false;

    },

    update: function() {

        if (this.cache.isSoundDecoded('music') && this.ready == false) {
            this.ready = true;
            this.state.start('MainMenu');
        }

    }

};