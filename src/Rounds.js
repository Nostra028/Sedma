/**
 * @param {Object} state
 * @constructor
 */
Sedma.Rounds = function (state) {
    this.state = state;
    this.game = state.game;
    this.cards = state.cards;

    this.notUsedCard = [];
};

Sedma.Rounds.prototype = {

    createDeck: function () {
        const column = this.game.world.width - 70;
        const line = this.game.world.centerY;
        const types = ['h', 'd', 'l', 'p'];

        for (let val of types) {
            for (let i = 7; i < 15; i++) {
                const cardSize = val + i;
                this.notUsedCard.push(cardSize);
                this.cards.spawn(column, line, val + i);
            }
        }
    },
};