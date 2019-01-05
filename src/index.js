import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={props.className + " square"} onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {
    renderSquare(i, position) {
        let className = '';

        if (this.props.winner &&
           (this.props.winner.winnerLine.find( element => element === i  ) ||
           this.props.winner.winnerLine.find( element => element === i  ) === 0 )
           ) {
            className = 'win';
        }
        return (
            <Square
                className={className}
                key={i}
                value={this.props.squares[i]}
                onClick={ () => this.props.onClick(i, position) }
            />
        );
    }

    createBoard(row, col) {
        const board = []
        let cellCounter = 0;

        for (let i = 0; i < row; i++) {
            const columns = [];
            for (let j = 0; j < col; j++) {
                columns.push(this.renderSquare(cellCounter++, {col:j+1, row:i+1}));
            }
            board.push(<div key={i} className="board-row">{columns}</div>)
        }

        return board;
    }

    render() {

        return (
            <div>
            {this.createBoard(this.props.sizeGrid.rows, this.props.sizeGrid.columns)}
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history : [{
                squares : Array(9).fill(null),
                lastPosition: null
            }],
            stepNumber: 0,
            xIsNext : true,
            isHistoryReversed: false,
            sizeGrid : {
                rows: 3,
                columns:3
            },
        }
    }

    handleClick(i, position) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if ( calculateWinner(squares) || squares[i] ) {
            return;
        }
        squares[i] =  this.state.xIsNext ? 'X' : '0';
        this.setState({
            history: history.concat([{
                squares: squares,
                lastPosition : position
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }

    reverse() {
        let historyReverse = this.state.history.reverse();
        this.setState({
            history : historyReverse,
            isHistoryReversed : !this.state.isHistoryReversed
        })

    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {

            const desc = step.lastPosition ?
            'Go to move #' + move + ' col: ' + step.lastPosition.col + ' row: ' + step.lastPosition.row:
            'Go to game start';

            let className = '';
            if( this.state.stepNumber === move )
            {
                className += 'active';
            }
            return (
                <li key={move}>
                <button className={className} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        const buttonReverse = <button onClick={ () => this.reverse() }>Inverse history</button>;

        let status = '';
        if (winner) {
            status = 'winner' + winner.winner;
            console.log(winner);
        } else if (history.length >= (this.state.sizeGrid.rows * this.state.sizeGrid.columns + 1) ) {
            status = 'No winner';
        }
         else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                <Board
                    sizeGrid={this.state.sizeGrid}
                    winner={winner}
                    squares={current.squares}
                    onClick={(i, position) => this.handleClick(i, position)}
                />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>{buttonReverse}</div>
                    <ol>{moves}</ol>

                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner:squares[a], winnerLine: lines[i] };
        }
    }
    return null;
}


// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
