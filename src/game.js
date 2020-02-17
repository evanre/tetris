export default class Game {
    static points = {
        1: 40,
        2: 100,
        3: 300,
        4: 1200,
    };

    score = 0;

    lines = 19;

    playField = this.createPlayField(); // 2d array 10*20 of zeros

    activePiece = Game.createPiece();

    nextPiece = Game.createPiece();

    get level() {
        return Math.floor(this.lines * 0.1);
    }

    getState() {
        const playField = this.createPlayField();
        const { y: pieceY, x: pieceX, blocks } = this.activePiece;

        for (let y = 0; y < this.playField.length; y += 1) {
            playField[y] = [];

            for (let x = 0; x < this.playField[y].length; x += 1) {
                playField[y][x] = this.playField[y][x];
            }
        }

        for (let y = 0; y < blocks.length; y += 1) {
            for (let x = 0; x < blocks[y].length; x += 1) {
                if (blocks[y][x]) {
                    playField[pieceY + y][pieceX + x] = blocks[y][x];
                }
            }
        }

        return { playField };
    }

    static createPlayField() {
        return Array.from(Array(20), () => new Array(10).fill(0));
    }

    static createPiece() {
        const index = Math.floor(Math.random() * 7);
        const piece = {};

        piece.blocks = {
            I: [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            J: [
                [0, 0, 0],
                [2, 2, 2],
                [0, 0, 2],
            ],
            L: [
                [0, 0, 0],
                [3, 3, 3],
                [3, 0, 0],
            ],
            O: [
                [0, 0, 0, 0],
                [0, 4, 4, 0],
                [0, 4, 4, 0],
                [0, 0, 0, 0],
            ],
            S: [
                [0, 0, 0],
                [0, 5, 5],
                [5, 5, 0],
            ],
            T: [
                [0, 0, 0],
                [6, 6, 6],
                [0, 6, 0],
            ],
            Z: [
                [0, 0, 0],
                [7, 7, 0],
                [0, 7, 7],
            ],
        }['IJLOSTZ'[index]];

        if (!piece.blocks) {
            throw new Error('Undefined piece!');
        }

        piece.x = Math.floor((10 - piece.blocks[0].length) / 2);
        piece.y = -1;

        return piece;
    }

    movePieceLeft() {
        this.activePiece.x -= 1;

        if (this.hasCollision()) {
            this.activePiece.x += 1;
        }
    }

    movePieceRight() {
        this.activePiece.x += 1;


        if (this.hasCollision()) {
            this.activePiece.x -= 1;
        }
    }

    movePieceDown() {
        this.activePiece.y += 1;


        if (this.hasCollision()) {
            this.activePiece.y -= 1;
            this.lockPiece();
            this.clearLines();
            this.updatePieces();
        }
    }

    rotatePiece() {
        this.rotateBlocks();

        if (this.hasCollision()) {
            this.rotateBlocks(false);
        }
    }

    rotateBlocks(clockwise = true) {
        const { blocks } = this.activePiece;
        const { length } = blocks;

        const temp = Array.from(Array(length), () => new Array(length).fill(0));

        for (let y = 0; y < length; y += 1) {
            for (let x = 0; x < length; x += 1) {
                if (clockwise) {
                    temp[x][y] = blocks[length - 1 - y][x];
                } else {
                    temp[x][y] = blocks[y][length - 1 - x];
                }
            }
        }

        this.activePiece.blocks = temp;
    }

    hasCollision() {
        const { y: pieceY, x: pieceX, blocks } = this.activePiece;

        for (let y = 0; y < blocks.length; y += 1) {
            for (let x = 0; x < blocks[y].length; x += 1) {
                if (
                    blocks[y][x]
                    && (this.playField[pieceY + y] === undefined
                    || this.playField[pieceY + y][pieceX + x] === undefined
                    || this.playField[pieceY + y][pieceX + x])
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    lockPiece() {
        const { y: pieceY, x: pieceX, blocks } = this.activePiece;

        for (let y = 0; y < blocks.length; y += 1) {
            for (let x = 0; x < blocks[y].length; x += 1) {
                if (blocks[y][x]) {
                    this.playField[pieceY + y][pieceX + x] = blocks[y][x];
                }
            }
        }
    }

    clearLines() {
        const rows = 20;
        const columns = 10;
        const lines = [];

        for (let y = rows - 1; y >= 0; y -= 1) {
            let numberOfBlocks = 0;

            for (let x = 0; x < columns; x += 1) {
                if (this.playField[y][x]) {
                    numberOfBlocks += 1;
                }
            }

            if (numberOfBlocks === 0) {
                break;
            } else if (numberOfBlocks === columns) {
                lines.unshift(y);
            }
        }

        lines.forEach((line) => {
            this.playField.splice(line, 1);
            this.playField.unshift(new Array(columns).fill(0));
        });

        this.updateScore(lines.length);
    }

    updateScore(clearedLines) {
        if (clearedLines > 0) {
            this.score += Game.points[clearedLines] * (this.level + 1);
            this.lines += clearedLines;
        }
    }

    updatePieces() {
        this.activePiece = this.nextPiece;
        this.nextPiece = Game.createPiece();
    }
}
