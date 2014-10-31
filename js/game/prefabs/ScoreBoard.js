var Scoreboard = function(game) {
    Phaser.Group.call(this, game);
};

// creating a prefab that inherites phaser group methods
Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;

// show function accepts score
Scoreboard.prototype.show = function(time) {
    var bmd; // for canvas rect
    var background; // for canvas 
    var gameoverText;
    var scoreText;
    var highScoreText;
    var newHighScoreText;
    var startText;
    var score;

    score = game.math.floor(game.time.elapsedSecondsSince(time));


    // bitmap data extended canvas that allow drawing (width, height) of drawing canvas
    bmd = this.game.add.bitmapData(this.game.width, this.game.height); // make it the width and height of game
    bmd.ctx.fillStyle = '#000'; // set fill to black
    bmd.ctx.fillRect(0, 0, this.game.width, this.game.height); // filled rectangle

    background = this.game.add.sprite(0, 0, bmd); // background spite of the bitmapdata
    background.alpha = 0.5; // make it see through

    this.add(background);

    var isNewHighScore = false; // flag for high score

    // grab highscore from local storage if it is there
    var highScore = localStorage.getItem('spookyhighscore');

    // if highscore is more than high score score is highscore and write to local storage
    if (!highScore || score > highScore) {
        isNewHighScore = true;
        highScore = score;
        localStorage.setItem('spookyhighscore', highScore);
    }



    this.y = this.game.height; // for our tween to come from the top

    // adding in all of our text
    gameoverText = this.game.add.text(game.world.centerX, 300, 'Happy Halloween!', {
        font: '70px Butcherman',
        fill: '#FF5F1B',
        align: 'center'
    });
    gameoverText.anchor.setTo(0.5, 0.5);
    this.add(gameoverText);

    scoreText = this.game.add.text(game.world.centerX, 500, 'You survived for: ' + score + ' seconds', {
        font: '26px Arial',
        fill: '#FF5F1B',
        align: 'center'
    });
    scoreText.anchor.setTo(0.5, 0.5);
    this.add(scoreText);

    highScoreText = this.game.add.text(game.world.centerX, 600, 'Longest Survival: ' + highScore, {
        font: '26px Arial',
        fill: '#FF5F1B',
        align: 'center'
    });
    highScoreText.anchor.setTo(0.5, 0.5);
    this.add(highScoreText);


    startText = this.game.add.text(game.world.centerX, 700, 'Tap the screen to play again', {
        font: '26px Arial',
        fill: '#FF5F1B',
        align: 'center'
    });
    startText.anchor.setTo(0.5, 0.5);
    startText.alpha = 0;
    game.add.tween(startText).delay(500).to({
        alpha: 1
    }, 1000).start();
    game.add.tween(startText).to({
        angle: -2
    }, 500).to({
        angle: 2
    }, 500).loop().start();
    this.add(startText);

    // if our highscore is new add this text
    if (isNewHighScore) {
        newHighScoreText = this.game.add.text(game.world.centerX + 130, 400, 'New Longest Survival!', {
            font: '18px Arial',
            fill: '#40ccff'
        });
        newHighScoreText.angle = 45;
        this.add(newHighScoreText);
        var highScoreTween = this.game.add.tween(newHighScoreText.scale).to({
            x: 1.5,
            y: 1.5,
        }, 500).to({
            x: 1,
            y: 1
        }, 500).loop().start();
    }

    this.game.add.tween(this).to({
        y: 0
    }, 2000, Phaser.Easing.Bounce.Out, true);


    // on click start the game again
    this.game.input.onDown.addOnce(this.restart, this);


};

Scoreboard.prototype.restart = function() {
    this.game.state.start('Game', true, false);
};