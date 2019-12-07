/**
 * @constructor
 */
Sedma.Preloader = function () {
    this.background = null;
    this.preloadBar = null;
    this.ready = false;
};

Sedma.Preloader.prototype = {

    preload: function () {
        this.preloadBar = this.add.sprite(0, 100, 'preloaderBar');
        this.load.setPreloadSprite(this.preloadBar);
        this.load.image('green-start-button', 'images/green-start-button.png');
        this.load.image('place', 'images/place.png');
        this.load.image('background1', 'images/table/casinotable1.png');
        this.load.image('cardHide', 'images/cards/hide.png');

        const types = ['h', 'd', 'l', 'p'];

        for (let val of types) {
            for (let i = 7; i < 15; i++) {
                this.load.image('card' + val + i, 'images/cards/' + val + i + '.png');
            }
        }
    },

    update: function () {
        if (!this.ready) {
            this.ready = true;
            this.state.start('MainMenu');
        }
    }
};