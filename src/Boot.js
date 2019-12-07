Sedma = {
    startPlayer: '',
    teamScore: [],
    lastPlayerInTeam: [],
    teamScoreRare: [],
    teamScoreCommon: [],
    lastWinPlayerInTeam: [],
    music: null,
    orientated: false
};

/**
 * @param {Object} game
 * @constructor
 */
Sedma.Boot = function (game) {
};

Sedma.Boot.prototype = {

    preload: function () {
        this.load.image('preloaderBar', 'images/preload.png');
    },

    create: function () {
        this.stage.disableVisibilityChange = true;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.setMinMax(260, 480, 640, 960);
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        if (!this.game.device.desktop) {
            this.scale.forceOrientation(false, true);
            this.scale.setResizeCallback(this.gameResized, this);
            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
        }

        this.state.start('Preloader');
    },

    /**
     * @param width
     * @param height
     */
    gameResized: function (width, height) {
    },

    enterIncorrectOrientation: function () {
        Sedma.orientated = false;
        document.getElementById('orientation').style.display = 'block';
    },

    leaveIncorrectOrientation: function () {
        Sedma.orientated = true;
        document.getElementById('orientation').style.display = 'none';
    },
};