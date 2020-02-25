/**
 * @param {Object} game
 * @param {Number} playerId
 * @returns {Sedma.Player}
 * @constructor
 */
Sedma.Player = function (game, playerId) {
    this.slots = [];
    this.game = game;
    this.tint = '';
    this.defaultTint = '';

    if (playerId === 1 || playerId === 3) {
        this.postionx = (game.world.width / 2) - 50;
        this.team = 1;
    } else {
        this.team = 2;
        this.postiony = 80;
    }

    if (playerId === 4) {
        this.postionx = 20;
    }
    if (playerId === 1) {
        this.postiony = 0;
    }

    if (playerId === 2) {
        this.postionx = game.world.width - 150;
    }

    if (playerId === 3) {
        this.postiony = game.world.height - 270;
        this.actualplayer = 'yes';
    } else {
        this.actualplayer = 'no';
    }

    Phaser.Sprite.call(this, game, this.postionx, this.postiony, 'place');
    this.defaultTint = this.tint;
    this.scale.set(0.5);
    this.setDefaultTin();

    this.physics = game.physics.arcade;
    this.physics.enable(this);

    this.body.drag.set(100);
    this.body.maxVelocity.set(200);

    this.speed = 100;

    for (let slotSeq = 1; slotSeq < 5; slotSeq++) {
        this.slots[slotSeq] = new Sedma.PlayerSlot(game, slotSeq);
        this.slots[slotSeq].setPosition(this);
    }

    this.playerid = playerId;

    return this;
};

Sedma.Player.prototype = Object.create(Phaser.Sprite.prototype);
Sedma.Player.prototype.constructor = Sedma.Player;

Sedma.Player.prototype.update = function () {
    this.game.world.wrap(this, 16);
};

/**
 * @returns {Number}
 */
Sedma.Player.prototype.getPlayerTeamId = function () {
    return this.team;
};

/**
 * @returns {Number}
 */
Sedma.Player.prototype.getPlayerId = function () {
    return this.playerid;
};

/**
 * @returns {boolean}
 */
Sedma.Player.prototype.isActualPlayer = function () {
    return (this.actualplayer === "yes");
};

/**
 * @param {Number} slot
 * @param {String} type
 * @returns {Number}
 */
Sedma.Player.prototype.getSlotPosition = function (slot, type) {
    return this.slots[slot].getPosition(type);
};

/**
 * @param {Number} slot
 * @returns {Number}
 */
Sedma.Player.prototype.getSlotAngle = function (slot) {
    return this.slots[slot].getAngle(this);
};

Sedma.Player.prototype.getFreeSlotId = function () {

    for (let slotSeq in this.slots) {
        if (this.slots.hasOwnProperty(slotSeq)) {
            const value = this.slots[slotSeq].getCardSize();

            if (value === '') {
                return slotSeq;
            }
        }
    }

    return false;
};

/**
 * @param {Number} slotSeq
 * @param {Object} card
 * @param {String} cardSize
 */
Sedma.Player.prototype.setCardToHandPosition = function (slotSeq, card, cardSize) {
    this.slots[slotSeq].setCard(card);
    this.slots[slotSeq].setCardSize(cardSize);
};

Sedma.Player.prototype.setText = function () {
    const style1 = {
        font: "14px Arial",
        fill: "#cdba52",
        align: "center",
        boundsAlignH: "0",
        boundsAlignV: "0",
        wordWrapWidth: this.width
    };

    const text1 = this.game.add.text(this.postionx + 32, this.postiony + 20, "Blaster: Stopped", style1);
    text1.text = 'Player ' + this.playerid;

    const style2 = {
        font: "11px Arial",
        fill: "#cdba52",
        align: "center",
    };

    const text2 = this.game.add.text(this.postionx + 38, this.postiony + 40, "Blaster: Stopped", style2);
    text2.text = '(Team ' + this.team + ')';
};

/**
 * @param {Object} game
 * @returns {boolean|*}
 */
Sedma.Player.prototype.selectCard = function (game) {
    const cardValues = [];

    for (let slotSeq in this.slots) {
        if (this.slots.hasOwnProperty(slotSeq)) {
            const card1 = this.slots[slotSeq].getCard();

            if (card1) {
                const num = card1.getCardNum();

                if (!card1.enabled && game.turnstep === 1) {
                    continue;
                }

                cardValues[slotSeq] = 0;

                if (game.turnstep === 1) {
                    if (num === '7') {
                        cardValues[slotSeq] -= 500;
                    } else if (num !== '14' && num !== '10') {
                        cardValues[slotSeq] += 500;
                    }

                    for (let key2 in this.slots) {
                        if (this.slots.hasOwnProperty(key2)) {
                            if (slotSeq !== key2) {
                                const card2 = this.slots[key2].getCard();

                                if (card2) {
                                    const num2 = card2.getCardNum();

                                    if (num === num2 && card2.enabled) {
                                        cardValues[slotSeq] += 1000;
                                    }
                                }
                            }
                        }
                    }
                } else if (game.turnstep === 2) {
                    const gameSlotNum = game.gameslots[1].getCardNum();

                    if (num === '0' || num === '') {

                        if (gameSlotNum === '14' || gameSlotNum === '10') {
                            cardValues[slotSeq] += 500;
                        } else {
                            cardValues[slotSeq] -= 500;
                        }

                    } else {
                        if (gameSlotNum === num) {

                            cardValues[slotSeq] += 2000;
                        } else {
                            if (num !== '14' && num !== '10') {
                                cardValues[slotSeq] += 1000;
                            }

                            for (let key2 in this.slots) {
                                if (slotSeq === key2) {
                                    cardValues[slotSeq] -= 500;
                                    break;
                                }
                            }
                        }
                    }

                } else if (game.turnstep === 3) {
                    const gameSlotNum1 = game.gameslots[1].getCardNum();
                    const gameSlotNum2 = game.gameslots[2].getCardNum();

                    if (gameSlotNum1 === gameSlotNum2 || gameSlotNum2 === '7') {
                        if (num === gameSlotNum1) {
                            cardValues[slotSeq] += 1000;
                            if (num === '7') {
                                cardValues[slotSeq] -= 500;
                            }
                        } else {
                            if (num === '7') {
                                cardValues[slotSeq] += 500;
                            }
                        }

                        if (num === '14' || num === '10') {
                            cardValues[slotSeq] -= 500;
                        }

                    } else {
                        if (num === '14' || num === '10') {
                            if (num === gameSlotNum1) {
                                cardValues[slotSeq] -= 500;
                            } else {
                                cardValues[slotSeq] += 1000;
                            }

                        }
                    }
                } else if (game.turnstep === 4) {
                    let mustWin = true;
                    const gameSlotNum1 = game.gameslots[1].getCardNum();
                    const gameSlotNum2 = game.gameslots[2].getCardNum();
                    const gameSlotNum3 = game.gameslots[3].getCardNum();

                    if (gameSlotNum1 === gameSlotNum2 || gameSlotNum2 === '7') {
                        mustWin = (gameSlotNum2 === gameSlotNum3 || gameSlotNum3 === '7');
                    }

                    if (mustWin) {
                        if (num === gameSlotNum1) {
                            cardValues[slotSeq] += 1000;
                            if (num === '7') {
                                cardValues[slotSeq] -= 500;
                            }
                        } else {
                            if (num === '7') {
                                cardValues[slotSeq] += 500;
                            }
                        }
                    } else {

                        if (num === gameSlotNum1) {
                            cardValues[slotSeq] -= 500;
                        } else {
                            cardValues[slotSeq] += 500;
                        }

                        if (num === '7') {
                            cardValues[slotSeq] -= 1000;
                        }
                    }

                    if (num === '14' || num === '10') {
                        if (mustWin) {
                            cardValues[slotSeq] -= 500;
                        } else {
                            cardValues[slotSeq] += 1500;
                        }
                    }
                }
            }
        }
    }

    for (let slotSeq in this.slots) {
        if (this.slots.hasOwnProperty(slotSeq)) {
            const card1 = this.slots[slotSeq].getCard();

            if (card1) {
                card1.enabled = true;
            }
        }
    }

    let maxKey = '';

    for (let key in cardValues) {
        if (cardValues.hasOwnProperty(key)) {
            if (maxKey === '') {
                maxKey = key;
            } else {
                if (cardValues[key] > cardValues[maxKey]) {
                    maxKey = key;
                }
            }
        }
    }

    let newCardValues = [];

    for (let key in cardValues) {
        if (cardValues.hasOwnProperty(key)) {
            if (cardValues[key] === cardValues[maxKey]) {
                newCardValues.push(key);
            }
        }
    }

    const anyMaxKey = this.game.rnd.pick(newCardValues);
    const maxCard = this.slots[anyMaxKey].getCard();

    if (this.isActualPlayer()) {

        for (let slotSeq in this.slots) {
            if (this.slots.hasOwnProperty(slotSeq)) {
                const value = this.slots[slotSeq].getCardSize();

                if (value !== '') {
                    const card = this.slots[slotSeq].getCard();
                    card.input.enableDrag(false, true);
                    card.events.destroy();
                    card.events.onDragStop.add(function (currentSprite) {
                        game.setCardToFreeGameSlot(currentSprite);
                    }, this);
                }
            }
        }

        return false;
    } else {
        return maxCard;
    }
};

/**
 * @param {Object} game
 * @returns {string}
 */
Sedma.Player.prototype.controlRotate = function (game) {
    let cardNum = '';
    let rotateGame = 'no';
    let canRotate = false;

    for (let slotSeq in this.slots) {
        if (this.slots.hasOwnProperty(slotSeq)) {
            const card = this.slots[slotSeq].getCard();

            if (card) {
                cardNum = card.getCardNum();

                if (game.firstCardNum === cardNum || cardNum === '7') {
                    canRotate = true;
                    card.enabled = true;

                    if (this.isActualPlayer()) {
                        card.input.enableDrag(false, true);
                        card.events.destroy();
                        card.events.onDragStop.add(function (currentSprite) {
                            game.rotateTurn(currentSprite);
                        }, this);
                    }
                } else {
                    card.enabled = false;
                }
            }
        }
    }

    if (canRotate) {
        if (this.isActualPlayer()) {
            game.info = 'stop turn';
            rotateGame = 'stop';
            game.addNoRotateButton();
        } else {
            if (game.turnwinplayer !== this.playerid) {
                rotateGame = 'yes';
            } else {
                if (game.rnd.integerInRange(0, 10) > 7) {
                    rotateGame = 'yes';
                }
            }
        }
    }

    if (rotateGame === 'no') {
        for (let slotSeq in this.slots) {
            if (this.slots.hasOwnProperty(slotSeq)) {
                const card = this.slots[slotSeq].getCard();

                if (card) {
                    card.enabled = true;
                }
            }
        }
    }

    return rotateGame;
};

Sedma.Player.prototype.setPlayerActiveInfo = function () {
    this.tint = this.actualplayer === 'yes' ? 0x00CC33 : 0xFF0000;
};

Sedma.Player.prototype.unsetPlayerActiveInfo = function () {
    this.setDefaultTint();
};

Sedma.Player.prototype.setDefaultTint = function () {
    this.tint = this.defaultTint;
};