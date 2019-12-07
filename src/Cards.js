/**
 * @param {Object} state
 * @returns {Sedma.Cards}
 * @constructor
 */
Sedma.Cards = function (state) {
    this.state = state;
    Phaser.Group.call(this, state.game);
    this.enableBody = true;

    return this;
};

Sedma.Cards.prototype = Object.create(Phaser.Group.prototype);
Sedma.Cards.prototype.constructor = Sedma.Cards;

Sedma.Cards.prototype.update = function () {
    this.forEachExists(this.game.world.wrap, this.game.world, 32);
};

/**
 * @param {Object} player
 * @param {Number} playerFreeHandPosition
 * @param {Object} card
 * @param {Object} game
 */
Sedma.Cards.prototype.addCardToPayer = function (player, playerFreeHandPosition, card, game) {
    const type = 'card' + card.size;

    if (player.isActualPlayer()) {
        card.loadTexture(type, 0);
    }

    card.setPlayer(player);

    game.add.tween(card).to({
        x: player.getSlotPosition(playerFreeHandPosition, "x"),
        y: player.getSlotPosition(playerFreeHandPosition, "y")
    }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);

    game.add.tween(card).to({angle: player.getSlotAngle(playerFreeHandPosition)}, 500, Phaser.Easing.Linear.None, true);
};

/**
 * @param {Number} x
 * @param {Number} y
 * @param {String} size
 */
Sedma.Cards.prototype.spawn = function (x, y, size) {
    const type = 'cardHide';
    const instance = new Sedma.Card(this.game, x, y, type, size);

    instance.scale.set(1.2);
    instance.anchor.set(0.5);
    instance.anchor.setTo(0.5, 0.5);

    this.add(instance);
};