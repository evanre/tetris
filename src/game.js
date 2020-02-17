export default class Game {
    constructor() {
        this.reset();
    }

    static points = {
        1: 40,
        2: 100,
        3: 300,
        4: 1200,
    };

    get level() {
        return Math.floor(this.lines * 0.1);
    }

    reset() {
        this.score = 0;
        this.lines = 0;
        this.topOut = false;
        // 2d array 10*20 of zeros
        this.playField = Array.from(Array(20), () => new Array(10).fill(0));
        this.activePiece = Game.createPiece();
        this.nextPiece = Game.createPiece();
    }

    getState() {
        const { y: pieceY, x: pieceX, blocks } = this.activePiece;
        const playField = this.playField.map((arr) => arr.slice(0));

        for (let y = 0; y < blocks.length; y += 1) {
            for (let x = 0; x < blocks[y].length; x += 1) {
                if (blocks[y][x]) {
                    playField[pieceY + y][pieceX + x] = blocks[y][x];
                }
            }
        }

        return {
            score: this.score,
            level: this.level,
            lines: this.lines,
            nextPiece: this.nextPiece,
            playField,
        };
    }

    static createPiece() {
        const piece = {
            blocks: {
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
            }['IJLOSTZ'[Math.floor(Math.random() * 7)]], // get random item
        };

        piece.x = Math.floor((10 - piece.blocks[0].length) / 2);
        piece.y = -1;

        return piece;
    }

    moveLeft() {
        this.activePiece.x -= 1;

        if (this.hasCollision()) {
            this.activePiece.x += 1;
        }
    }

    moveRight() {
        this.activePiece.x += 1;


        if (this.hasCollision()) {
            this.activePiece.x -= 1;
        }
    }

    moveDown() {
        if (this.topOut) {
            return;
        }

        this.activePiece.y += 1;

        if (this.hasCollision()) {
            this.activePiece.y -= 1;
            this.lockPiece();
            this.clearLines();
            this.updatePieces();
        }

        if (this.hasCollision()) {
            this.topOut = true;
        }
    }

    moveRotate() {
        this.rotateBlocks();

        if (this.hasCollision()) {
            this.rotateBlocks(false);
        }
    }

    rotateBlocks(clockwise = true) {
        const { blocks, blocks: { length } } = this.activePiece;
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
