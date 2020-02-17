import Game from './src/game.js';
import View from './src/view.js';

document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');

    const game = new Game();
    const view = new View(root, 480, 640, 20, 10);

    window.game = game;
    window.view = view;
    document.addEventListener('keydown', (event) => {
        switch (event.keyCode) {
            case 37: // left arrow
                game.movePieceLeft();
                view.render(game.getState());
                break;
            case 38: // up arrow
                game.rotatePiece();
                view.render(game.getState());
                break;
            case 39: // right arrow
                game.movePieceRight();
                view.render(game.getState());
                break;
            case 40: // down arrow
                game.movePieceDown();
                view.render(game.getState());
                break;
        }
    });

    view.render(game.getState());
});
