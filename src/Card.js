/**
 * @param {Object} game
 * @param {Number} x
 * @param {Number} y
 * @param {String} type
 * @param {String} size
 * @returns {Sedma.Card}
 * @constructor
 */
Sedma.Card = function (game, x, y, type, size) {
    Phaser.Sprite.call(this, game, x, y, type);

    this.inputEnabled = true;
    this.size = size;
    this.enabled = true;
    this.cardPlayer = false;

    return this;
};

Sedma.Card.prototype = Object.create(Phaser.Sprite.prototype);
Sedma.Card.prototype.constructor = Sedma.Card;

/**
 * @param {Object} player
 */
Sedma.Card.prototype.setPlayer = function (player) {
    this.cardPlayer = player;
};

/**
 * @returns {Object}
 */
Sedma.Card.prototype.getPlayer = function () {
    return this.cardPlayer;
};

/**
 * @returns {String}
 */
Sedma.Card.prototype.getCardSize = function () {
    return this.size;
};

/**
 * @returns {string}
 */
Sedma.Card.prototype.getCardNum = function () {
    return this.size.substring(1);
};

/**
 * @param {Object} player
 */
Sedma.Card.prototype.setCardToWinPlayer = function (player) {
    const playerX = player.postionx + 10;
    const playerY = player.postiony + 20;

    this.game.add.tween(this.scale).to({x: 0.1, y: 0.1}, 500, Phaser.Easing.Linear.None, true);
    this.game.add.tween(this).to({x: playerX, y: playerY}, 500, Phaser.Easing.Linear.None, true);

    const playerTeamId = player.getPlayerTeamId();
    const cardNum = this.getCardNum();

    if (cardNum === '14' || cardNum === '10') {
        if (!Sedma.teamScoreRare[playerTeamId]) {
            Sedma.teamScoreRare[playerTeamId] = 1;
        } else {
            Sedma.teamScoreRare[playerTeamId] += 1;
        }
    }

    if (!Sedma.teamScoreCommon[playerTeamId]) {
        Sedma.teamScoreCommon[playerTeamId] = 1;
    } else {
        Sedma.teamScoreCommon[playerTeamId] += 1;
    }

    Sedma.lastWinPlayerInTeam[playerTeamId] = player.getPlayerId();
};