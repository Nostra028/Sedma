/**
 * @param {Object} game
 * @param {Number} seq
 * @returns {Sedma.GameSlot}
 * @constructor
 */
Sedma.GameSlot = function (game, seq) {
    this.game = game;
    this.seq = seq;

    this.postionx = this.game.world.centerX - 50;
    this.postiony = this.game.world.centerY + 30;

    if (this.seq === 1) {
        this.postionx = this.postionx - 110;
    } else if (this.seq === 3) {
        this.postionx = this.postionx + 110;
    }

    if (this.seq === 1 || this.seq === 3) {
        this.postiony = this.postiony - 100;
    } else if (this.seq === 2) {
        this.postiony = this.postiony - 200;
    }

    Phaser.Sprite.call(this, game, this.postionx, this.postiony, 'place');
    this.scale.set(0.5);
    this.cardSize = '';
    this.card = false;
    this.slotPlayer = false;
    this.cardsInCentralDeck = [];

    return this;
};

Sedma.GameSlot.prototype = Object.create(Phaser.Sprite.prototype);
Sedma.GameSlot.prototype.constructor = Sedma.GameSlot;

Sedma.GameSlot.prototype.clearCardsInCentralDeck = function () {

    if (this.cardsInCentralDeck && this.cardsInCentralDeck.length > 0) {
        this.cardsInCentralDeck.forEach(function (card) {
            card.destroy();
        });
    }

    this.cardsInCentralDeck = [];
};

/**
 * @param {String} size
 */
Sedma.GameSlot.prototype.setCardSize = function (size) {
    this.cardSize = size;
};

/**
 * @returns {String}
 */
Sedma.GameSlot.prototype.getCardSize = function () {
    return this.cardSize;
};

/**
 * @returns {String}
 */
Sedma.GameSlot.prototype.getCardNum = function () {
    return this.cardSize.substring(1);
};

/**
 * @param {Object} card
 */
Sedma.GameSlot.prototype.moveSetCard = function (card) {
    this.setCardSize(card.size);

    const type = 'card' + card.size;
    card.loadTexture(type, 0);

    this.game.add.tween(card).to({
        x: this.postionx + 60,
        y: this.postiony + 80
    }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
    this.game.add.tween(card).to({angle: 0}, 500, Phaser.Easing.Linear.None, true);
    this.card = card;
};

/**
 * @param {Object} card
 */
Sedma.GameSlot.prototype.setCard = function (card) {
    this.card = card;

    if (!card) {
        this.setCardSize("");
    }
};

/**
 * @returns {Object}
 */
Sedma.GameSlot.prototype.getCard = function () {
    return this.card;
};

Sedma.GameSlot.prototype.setPosition = function () {
};

Sedma.GameSlot.prototype.clearSlot = function () {
    this.setCard(false);
    this.setPlayer(false);
};

/**
 * @param {String} type
 * @returns {Number}
 */
Sedma.GameSlot.prototype.getPosition = function (type) {
    if (type === 'x') {
        return this.postionx;
    } else {
        return this.postiony;
    }
};

/**
 * @param {Object} player
 */
Sedma.GameSlot.prototype.setPlayer = function (player) {
    this.slotPlayer = player;
};

/**
 * @returns {Object}
 */
Sedma.GameSlot.prototype.getPlayer = function () {
    return this.slotPlayer;
};

/**
 * @returns {Number}
 */
Sedma.GameSlot.prototype.getNumCardsInCentralDeck = function () {
    return this.cardsInCentralDeck.length;
};

/**
 * @param {Object} player
 */
Sedma.GameSlot.prototype.setCardToWinPlayer = function (player) {
    this.card.setCardToWinPlayer(player);

    if (this.cardsInCentralDeck.length > 0) {
        this.cardsInCentralDeck.forEach(function (card, index, object) {
            card.setCardToWinPlayer(player);
            object.splice(index, 1);
        });
    }

    this.clearSlot();
};

Sedma.GameSlot.prototype.setCardToCentralDeck = function () {
    const px = this.game.world.centerX;
    const py = this.game.world.centerY;

    this.game.add.tween(this.card.scale).to({x: 0.1, y: 0.1}, 500, Phaser.Easing.Linear.None, true);
    this.game.add.tween(this.card).to({x: px, y: py}, 500, Phaser.Easing.Linear.None, true);

    this.cardsInCentralDeck.push(this.card);

    this.clearSlot();
};

/**
 * @param {Object} actualPlayer
 */
Sedma.GameSlot.prototype.actualizePosition = function (actualPlayer) {
    let type = '';

    if (actualPlayer === 4) {
        if (this.seq === 1) {
            type = 'a';
        } else if (this.seq === 2) {
            type = 'b';
        } else if (this.seq === 3) {
            type = 'c';
        } else if (this.seq === 4) {
            type = 'd';
        }
    }

    if (actualPlayer === 1) {
        if (this.seq === 1) {
            type = 'b';
        } else if (this.seq === 2) {
            type = 'c';
        } else if (this.seq === 3) {
            type = 'd';
        } else if (this.seq === 4) {
            type = 'a';
        }
    }

    if (actualPlayer === 2) {
        if (this.seq === 1) {
            type = 'c';
        } else if (this.seq === 2) {
            type = 'd';
        } else if (this.seq === 3) {
            type = 'a';
        } else if (this.seq === 4) {
            type = 'b';
        }
    }

    if (actualPlayer === 3) {
        if (this.seq === 1) {
            type = 'd';
        } else if (this.seq === 2) {
            type = 'a';
        } else if (this.seq === 3) {
            type = 'b';
        } else if (this.seq === 4) {
            type = 'c';
        }
    }

    this.postionx = this.game.world.centerX - 50;
    this.postiony = this.game.world.centerY + 30;

    if (type === 'a') {
        this.postionx = this.postionx - 110;
    } else if (type === 'c') {
        this.postionx = this.postionx + 110;
    }

    if (type === 'a' || type === 'c') {
        this.postiony = this.postiony - 100;
    } else if (type === 'b') {
        this.postiony = this.postiony - 200;
    }

    this.x = this.postionx;
    this.y = this.postiony;
};