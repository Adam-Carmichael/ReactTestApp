import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value = {this.props.squares[i]}
        onClick = {() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNum: 0,
      xTurn: true,
    };
  }
  
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNum + 1);
    const current = history[history.length - 1];
    const newSquares = current.squares.slice();

    if (calculateWinner(newSquares) || newSquares[i]) {
      return;
    }

    newSquares[i] = this.state.xTurn ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: newSquares,
      }]),
      stepNum: history.length,
      xTurn: !this.state.xTurn,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNum: step,
      xTurn: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNum];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        "Go to Move #" + move :
        "Restart from Zero";

      return (
        <ol key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </ol>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xTurn ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-status">{status}</div>
        <span className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </span>
        <span className="game-info">
          <ol className="game-moves">{moves}</ol>
        </span>
      </div>
    );
  }
}

// =======================================

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
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
