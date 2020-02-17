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

    move(dir) {
        if (this.isPlaying) {
            this.game[`move${dir}`]();
            this.updateView();
        }
    }

    updateView() {
        if (this.game.topOut) {
            this.view.renderEndScreen(this.game.score);
        } else if (!this.isPlaying) {
            this.view.renderPauseScreen();
        } else {
            this.view.renderMainScreen(this.game.getState());
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
        const speed = 1000 - this.game.level * 100;

        if (!this.interval) {
            this.interval = setInterval(() => {
                this.move('Down');
            }, speed > 0 ? speed : 100);
        }
    }

    stopTimer() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    handleKeyDown(e) {
        switch (e.key) {
        case 'Enter':
            if (this.game.topOut) {
                this.reset();
            } else if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
            break;
        case 'Left':
        case 'ArrowLeft':
            this.move('Left');
            break;
        case 'Up':
        case 'ArrowUp':
            this.move('Rotate');
            break;
        case 'Right':
        case 'ArrowRight':
            this.move('Right');
            break;
        case 'Down':
        case 'ArrowDown':
            this.stopTimer();
            this.move('Down');
            break;
        default:
        }
    }

    handleKeyUp(e) {
        switch (e.key) {
        case 'Down':
        case 'ArrowDown':
            this.startTimer();
            break;
        default:
        }
    }
}
