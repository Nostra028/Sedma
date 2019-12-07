/**
 * @param {Object} game
 * @constructor
 */
Sedma.ScoreInfo = function (game) {
};

Sedma.ScoreInfo.prototype = {

    create: function () {
        if (!Sedma.teamScoreRare[1]) {
            Sedma.teamScoreRare[1] = 0;
        }

        if (!Sedma.teamScoreRare[2]) {
            Sedma.teamScoreRare[2] = 0;
        }

        if (!Sedma.teamScoreCommon[1]) {
            Sedma.teamScoreCommon[1] = 0;
        }

        if (!Sedma.teamScoreCommon[2]) {
            Sedma.teamScoreCommon[2] = 0;
        }

        const style = {font: "bold 20pt Arial", fill: "#fff", align: "left", boundsAlignH: 'left', boundsAlignV: 'top'};
        this.highScoreText1 = this.game.add.text(this.game.world.centerX - 100, this.game.world.centerY + 10, 'Your Team:' + Sedma.teamScoreRare[1], style);
        this.highScoreText1.anchor.setTo(0.5, 0.5);

        this.highScoreText2 = this.game.add.text(this.game.world.centerX - 100, this.game.world.centerY + 40, 'all cards:' + Sedma.teamScoreCommon[1], style);
        this.highScoreText2.anchor.setTo(0.5, 0.5);

        this.highScoreText3 = this.game.add.text(this.game.world.centerX + 100, this.game.world.centerY + 10, 'Rival team:' + Sedma.teamScoreRare[2], style);
        this.highScoreText3.anchor.setTo(0.5, 0.5);

        this.highScoreText4 = this.game.add.text(this.game.world.centerX + 100, this.game.world.centerY + 40, 'all cards:' + Sedma.teamScoreCommon[2], style);
        this.highScoreText4.anchor.setTo(0.5, 0.5);

        const button1 = this.game.add.button(this.game.world.centerX - 30, this.game.world.centerY - 100, 'green-start-button', this.startGame, this, 2, 1, 0);
        button1.scale.set(0.3);

        if (Sedma.teamScoreRare[1] === Sedma.teamScoreRare[2]) {

            if (Sedma.teamScoreRare[1] === 0 && Sedma.teamScoreRare[2] === 0) {
                Sedma.startPlayer++;

                if (Sedma.startPlayer === 5) Sedma.startPlayer = 1;
            }

        } else {
            let lostTeam = 1;
            let winTeam = 2;

            if (Sedma.teamScoreRare[1] > Sedma.teamScoreRare[2]) {
                winTeam = 1;
                lostTeam = 2;
            }

            Sedma.teamScore[winTeam]++;

            if (Sedma.teamScoreRare[lostTeam] === 0) Sedma.teamScore[winTeam]++;
            if (Sedma.teamScoreCommon[lostTeam] === 0) Sedma.teamScore[winTeam] += 3;

            Sedma.startPlayer = Sedma.lastWinPlayerInTeam[winTeam];
        }
    },

    updateScore: function () {
        Sedma.teamScoreRare[1] = 0;
        Sedma.teamScoreRare[2] = 0;
        Sedma.teamScoreCommon[1] = 0;
        Sedma.teamScoreCommon[2] = 0;
    },

    update: function () {
    },

    startGame: function () {
        this.updateScore();
        this.state.start('Game');
    },
};