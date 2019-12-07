/**
 * @param {Object} game
 * @param {Number} seq
 * @returns {Sedma.PlayerSlot}
 * @constructor
 */
Sedma.PlayerSlot = function (game, seq) {
    Phaser.Group.call(this, game);

    this.physics = game.physics.arcade;
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.ARCADE;

    this.setAll('anchor.x', 0.5);
    this.setAll('anchor.y', 0.5);

    this.seq = seq;
    this.cardSize = "";
    this.card = false;
    this.postionx = 0;
    this.postiony = 0;

    return this;
};

Sedma.PlayerSlot.prototype = Object.create(Phaser.Group.prototype);
Sedma.PlayerSlot.prototype.constructor = Sedma.PlayerSlot;

Sedma.PlayerSlot.prototype.update = function () {
    this.forEachExists(this.game.world.wrap, this.game.world);
};

/**
 * @param {String} size
 */
Sedma.PlayerSlot.prototype.setCardSize = function (size) {
    this.cardSize = size;
};

/**
 * @returns {string}
 */
Sedma.PlayerSlot.prototype.getCardSize = function () {
    return this.cardSize;
};

/**
 * @returns {string}
 */
Sedma.PlayerSlot.prototype.getCardNum = function () {
    return this.cardSize.substring(1);
};

/**
 * @param {Object} card
 */
Sedma.PlayerSlot.prototype.setCard = function (card) {
    this.card = card;

    if (!card) {
        this.setCardSize("");
    }
};

/**
 * @returns {Object}
 */
Sedma.PlayerSlot.prototype.getCard = function () {
    return this.card;
};

Sedma.PlayerSlot.prototype.disableDrag = function () {
    if (this.card) {
        this.card.input.draggable = false;
    }
};

/**
 * @param {Object} player
 * @returns {Number}
 */
Sedma.PlayerSlot.prototype.getAngle = function (player) {
    let angleValue = 0;

    if (!player.isActualPlayer()) {
        if (this.seq === 3) {
            angleValue = 2;
        } else if (this.seq === 2) {
            angleValue = 1.5;
        } else if (this.seq === 1) {
            angleValue = -20;
        } else if (this.seq === 4) {
            angleValue = 50;
        }
    }
    return angleValue;
};

/**
 * @param {Object} player
 */
Sedma.PlayerSlot.prototype.setPosition = function (player) {
    this.postiony = player.postiony + 150;
    this.postionx = player.postionx + 20;

    if (player.isActualPlayer()) {

        if (this.seq === 3) {
            this.postionx = this.game.world.centerX + 70;
        } else if (this.seq === 2) {
            this.postionx = this.game.world.centerX - 70;
        } else if (this.seq === 1) {
            this.postionx = this.game.world.centerX - 210;
        } else if (this.seq === 4) {
            this.postionx = this.game.world.centerX + 210;
        }
    } else {
        this.postionx += this.seq * 20;

        if (this.seq === 2) {
            this.postiony = this.postiony - 10;
        } else if (this.seq === 1) {
            this.postiony = this.postiony + 20;
        } else if (this.seq === 3) {
            this.postiony = this.postiony + 20;
        } else if (this.seq === 4) {
            this.postiony = this.postiony + 40;
        }
    }
};

/**
 * @param {String} type
 * @returns {Number}
 */
Sedma.PlayerSlot.prototype.getPosition = function (type) {
    if (type === 'x') {
        return this.postionx;
    } else {
        return this.postiony;
    }
};