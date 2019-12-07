/**
 * @param {Object} game
 * @constructor
 */
Sedma.Game = function (game) {
    this.players = [];
    this.gameslots = [];
    this.firstCardNum = '';
    this.step = 0;
    this.actualplayer = game.rnd.pick([1, 2, 3, 4]);
    this.turnstep = 0;
    this.turnwinplayer = 0;
    this.info = '';
    this.cardsInfo = [];
    this.noRotateButton = false
};

Sedma.Game.prototype = {

    create: function () {
        this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background1');

        //create main cards slots
        for (let slotSeq = 1; slotSeq <= 4; slotSeq++) {
            this.gameslots[slotSeq] = new Sedma.GameSlot(this.game, slotSeq);
            this.add.existing(this.gameslots[slotSeq]);
        }

        //create players
        for (let playerSeq = 1; playerSeq <= 4; playerSeq++) {
            this.players[playerSeq] = new Sedma.Player(this.game, playerSeq);
            this.add.existing(this.players[playerSeq]);
            this.players[playerSeq].setText();
        }

        this.cards = new Sedma.Cards(this);
        this.add.existing(this.cards);

        this.rounds = new Sedma.Rounds(this);
        this.rounds.createDeck();

        if (Sedma.startPlayer === '') {
            Sedma.startPlayer = this.actualplayer;
        } else {
            this.actualplayer = Sedma.startPlayer;
        }

        this.cardsInfo['all'] = this.rounds.notUsedCard.length;
        this.cardsInfo['free'] = this.cardsInfo['all'];
        this.cardsInfo['win'] = 0;

        this.createScoreInfoPanel();

        this.startGame();
    },

    createScoreInfoPanel: function () {
        const style = {font: "bold 16pt Arial", fill: "#fff", align: "left", boundsAlignH: 'left', boundsAlignV: 'top'};

        if (!Sedma.teamScore[1]) Sedma.teamScore[1] = 0;
        this.game.add.text(20, 20, 'Your Team:' + Sedma.teamScore[1], style);

        if (!Sedma.teamScore[2]) Sedma.teamScore[2] = 0;
        this.game.add.text(20, 50, 'Rival Team:' + Sedma.teamScore[2], style);
    },

    startGame: function () {
        this.setTurn();
    },

    setTurn: function () {
        for (let slotSeq = 1; slotSeq < 5; slotSeq++) {
            this.gameslots[slotSeq].actualizePosition(this.actualplayer);
            this.gameslots[slotSeq].setCard(false);
        }

        this.firstCardNum = '';
        this.turnstep = 1;
        this.setCards();
    },

    setCards: function () {
        const self = this;
        let havePlayerFreeSlot = false;

        this.game.time.events.add(350, function () {
            self.info = 'set cards';
            self.step++;

            if (self.rounds.notUsedCard.length > 0) {
                const cardSize = self.game.rnd.pick(self.rounds.notUsedCard);
                const index = self.rounds.notUsedCard.indexOf(cardSize);

                self.cards.forEach(function (card) {
                    if (cardSize === card.size) {
                        havePlayerFreeSlot = self.players[self.actualplayer].getFreeSlotId();

                        if (havePlayerFreeSlot) {
                            self.rounds.notUsedCard.splice(index, 1);
                            const playerFreeSlot = havePlayerFreeSlot;

                            self.players[self.actualplayer].setCardToHandPosition(havePlayerFreeSlot, card, cardSize);
                            self.info = 'addCardToPayer';
                            self.cards.addCardToPayer(self.players[self.actualplayer], playerFreeSlot, card, self.game);
                        }
                    }
                });

                self.cardsInfo['free'] = self.rounds.notUsedCard.length;
            }

            if (havePlayerFreeSlot) {
                self.setCards();
                self.setNextPlayer();
            } else {
                self.playerGo();
            }
        });
    },

    endRound: function () {
        this.state.start('ScoreInfo');
    },

    /**
     * @param {Object} selectedCard
     */
    rotateTurn: function (selectedCard) {
        this.turnstep = 1;
        this.setCardsToCentralDeck();

        if (selectedCard) {
            this.noRotateButton.kill();
        } else {
            selectedCard = this.players[this.actualplayer].selectCard(this);
        }

        this.setCardToFreeGameSlot(selectedCard);
    },

    endTurn: function () {
        this.info = 'turn end';

        //who is winner
        const firstCardNum = this.gameslots[1].getCardNum();
        let winSlotPlayer = this.gameslots[1].getPlayer();

        for (let slotSeq = 2; slotSeq < 5; slotSeq++) {
            const cardNum = this.gameslots[slotSeq].getCardNum();

            if (cardNum === firstCardNum || cardNum === '7' || cardNum === this.firstCardNum) {
                winSlotPlayer = this.gameslots[slotSeq].getPlayer();
            }
        }

        this.turnwinplayer = winSlotPlayer.getPlayerId();

        const rotateGame = this.players[this.actualplayer].controlRotate(this);

        if (rotateGame === 'no') {
            this.nextTurn();
        } else if (rotateGame === 'yes') {
            this.rotateTurn(false);
        }
    },

    nextTurn: function () {
        const self = this;
        const winPlayer = self.players[self.turnwinplayer];

        this.unsetPlayersActiveInfo();

        //add card to winner player
        for (let slotSeq = 1; slotSeq < 5; slotSeq++) {
            self.info = 'setCardToWinPlayer ' + slotSeq;
            const numCardsInCentralDeck = self.gameslots[slotSeq].getNumCardsInCentralDeck();

            if (numCardsInCentralDeck > 0) {
                self.cardsInfo['win'] += numCardsInCentralDeck;

                self.gameslots[slotSeq].clearCardsInCentralDeck();
            }

            self.gameslots[slotSeq].setCardToWinPlayer(winPlayer);
            self.gameslots[slotSeq].clearSlot();
        }
        self.cardsInfo['win'] += 4;

        if (self.cardsInfo['win'] === self.cardsInfo['all']) {
            self.game.time.events.add(400, function () {
                self.endRound();
            });
        } else {
            self.game.time.events.add(900, function () {
                self.actualplayer = self.turnwinplayer;
                self.setTurn();
            });
        }
    },

    nextPlayerGo: function () {
        this.turnstep++;

        if (self.turnstep !== 5) {
            this.unsetPlayersActiveInfo();
        }

        this.actualplayer++;

        if (this.actualplayer > 4) this.actualplayer = 1;

        this.playerGo();
    },

    unsetPlayersActiveInfo: function () {
        this.players.forEach(function (player) {
            player.unsetPlayerActiveInfo();
        })
    },

    playerGo: function () {
        const self = this;

        self.info = 'next';

        if (!self.turnwinplayer) {
            self.turnwinplayer = self.actualplayer;
        }

        let wait = 700;

        self.unsetPlayersActiveInfo();
        self.players[self.actualplayer].setPlayerActiveInfo();

        if (!self.players[self.actualplayer].isActualPlayer() || self.turnstep === 5) {
            wait += 1000;
        }

        this.game.time.events.add(wait, function () {
            if (self.turnstep === 5) {
                self.info = 'end Turn';
                self.endTurn();
            } else {

                self.info = 'player go';

                const selectedCard = self.players[self.actualplayer].selectCard(self);

                if (selectedCard) {
                    self.setCardToFreeGameSlot(selectedCard);
                } else {
                    self.info = 'waiting for player';
                }
            }
        });
    },

    setCardsToCentralDeck: function () {
        for (let slotSeq = 1; slotSeq < 5; slotSeq++) {
            this.info = 'setCardsToCentralDeck ' + slotSeq;
            this.gameslots[slotSeq].setCardToCentralDeck();
        }
    },

    /**
     * @param {Object} maxCard
     */
    setCardToFreeGameSlot: function (maxCard) {
        const self = this;

        if (self.firstCardNum === '') self.firstCardNum = maxCard.getCardNum();

        for (let gameSlotSeq = 1; gameSlotSeq < 5; gameSlotSeq++) {
            const cardSize = this.gameslots[gameSlotSeq].getCardSize();

            if (cardSize === '') {
                const actualPlayerInstance = self.players[self.actualplayer];

                for (let slotSeq in actualPlayerInstance.slots) {
                    if (actualPlayerInstance.slots.hasOwnProperty(slotSeq)) {
                        const value = actualPlayerInstance.slots[slotSeq].getCardSize();

                        if (actualPlayerInstance.isActualPlayer()) {
                            actualPlayerInstance.slots[slotSeq].disableDrag();
                        }

                        if (value === maxCard.size) {
                            actualPlayerInstance.slots[slotSeq].setCard(false);
                        }
                    }
                }
                this.gameslots[gameSlotSeq].moveSetCard(maxCard);
                this.gameslots[gameSlotSeq].setPlayer(actualPlayerInstance);
                break;
            }
        }

        this.nextPlayerGo();
    },

    update: function () {
    },

    setNextPlayer: function () {
        this.actualplayer++;

        if (this.actualplayer > 4) {
            this.actualplayer = 1;
        }
    },

    render: function () {
        this.game.debug.text('STEP: ' + this.step || 'STEP: --', 240, 20, "#00ff00");
        this.game.debug.text('actual player: ' + this.actualplayer || 'STEP: --', 240, 40, "#00ff00");
        this.game.debug.text('turns tep: ' + this.turnstep || 'turn step: --', 240, 60, "#00ff00");
        this.game.debug.text('turn win player: ' + this.turnwinplayer || 'turn win player: --', 240, 80, "#00ff00");
        this.game.debug.text('info: ' + this.info || 'info: --', 240, 100, "#00ff00");
        this.game.debug.text('all cards: ' + this.cardsInfo['all'] || 'all cards: --', 240, 120, "#00ff00");
        this.game.debug.text('free cards: ' + this.cardsInfo['free'] || 'free cards: --', 240, 140, "#00ff00");
        this.game.debug.text('win cards: ' + this.cardsInfo['win'] || 'win cards: --', 240, 160, "#00ff00");
        this.game.debug.text('firstCardNum: ' + this.firstCardNum || 'firstCardNum: --', 240, 160, "#00ff00");
    },

    noRotate: function () {
        this.noRotateButton.kill();
        this.nextTurn();
    },

    addNoRotateButton: function () {
        const graphics = this.game.make.graphics(0, 0);
        graphics.beginFill(0x33cc00)
            .drawRoundedRect(0, 0, 80, 80, 13)
            .endFill();

        const texture = graphics.generateTexture();
        this.noRotateButton = this.game.add.button(this.game.width - 80, this.game.height - 300, texture, this.noRotate, this);
        this.noRotateButton.anchor.set(0.5, 0.5);
        const label = this.game.add.text(0, 0, 'End', {
            'font': 'bold 30px Arial',
            'fill': '#000',
            align: "left", boundsAlignH: 'left', boundsAlignV: 'top'
        });
        label.anchor.set(0.5);
        this.noRotateButton.addChild(label);
    },
};