/**
 * @constructor
 */
Sedma.MainMenu = function () {
    this.music = null;
    this.playButton = null;
};

Sedma.MainMenu.prototype = {

    create: function () {
        this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background1');

        const graphics = this.game.make.graphics(0, 0);
        graphics.beginFill(0x33cc00)
            .drawRoundedRect(0, 0, 200, 60, 13)
            .endFill();
        const texture = graphics.generateTexture();
        const button = this.game.add.button(this.game.width / 2, 175, texture, this.startGame, this);
        button.anchor.set(0.5, 0.5);

        const label = this.game.add.text(0, 0, 'Start', {
            'font': 'bold 30px Arial',
            'fill': '#000',
            align: "left", boundsAlignH: 'left', boundsAlignV: 'top'
        });
        label.anchor.set(0.5);
        button.addChild(label);
    },

    startGame: function () {
        this.state.start('Game');
    }
};