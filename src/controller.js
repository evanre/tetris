export default class Controller {
    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.isPlaying = false;
        this.interval = null;

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));

        this.view.renderStartScreen();
    }

    update() {
        this.game.movePieceDown();
        this.updateView();
    }

    updateView() {
        const state = this.game.getState();

        if (state.isGameOver) {
            this.view.renderEndScreen(state);
        } else if (!this.isPlaying) {
            this.view.renderPauseScreen();
        } else {
            this.view.renderMainScreen(state);
        }
    }

    play() {
        this.isPlaying = true;
        this.startTimer();
        this.updateView();
    }

    pause() {
        this.isPlaying = false;
        this.stopTimer();
        this.updateView();
    }

    reset() {
        this.game.reset();
        this.play();
    }

    startTimer() {
        const speed = 1000 - this.game.getState().level * 100;

        if (!this.interval) {
            this.interval = setInterval(() => {
                this.update();
            }, speed > 0 ? speed : 100);
        }
    }

    stopTimer() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    handleKeyDown(event) {
        const state = this.game.getState();
        switch (event.keyCode) {
            case 13: // ENTER
                if (state.isGameOver) {
                    this.reset();
                } else if (this.isPlaying) {
                    this.pause();
                } else {
                    this.play();
                }
                break;
            case 37: // left arrow
                this.game.movePieceLeft();
                this.updateView();
                break;
            case 38: // up arrow
                this.game.rotatePiece();
                this.updateView();
                break;
            case 39: // right arrow
                this.game.movePieceRight();
                this.updateView();
                break;
            case 40: // down arrow
                this.stopTimer();
                this.game.movePieceDown();
                this.updateView();
                break;
        }
    }


    handleKeyUp(event) {
        switch (event.keyCode) {
            case 40: // down arrow
                this.startTimer();
                break;
        }
    }
}
