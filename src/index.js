import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



function Square(cName) {

  return (
    <div className={cName}>
       {null}
    </div>
  );
}

function Board(props) {
  let board = [];
  const height = props.height;
  const width = props.width;
  const snakeBody = props.snakeBody;
  const apple = props.apple;
  const snakeHead = props.snakeHead;
  for (let i = 0; i < height; i++) {
    let row = [];
    for (let j = 0; j < width; j++) {

      if (apple[0] === j && apple[1] === i) {
        row.push(Square("apple"));
      }
      else if (snakeHead[0] === j && snakeHead[1] === i) {
        row.push(Square("snake-head"));
      }
      else {
        let isSnake = false;
        isSnake = includes([j, i], snakeBody);
        isSnake ? row.push(Square("snake")) : row.push(Square("square"));
      }



    }

    board.push(
      <div className="board-row">
        {row}
      </div>
    )
  }



  return (
    <div>
      {board}
    </div>
  );

}



function instantiateApple(width, height, snakeBody) {
  let apple;
  let inSnake;
  do {
    apple = [randomInteger(0, width - 1), randomInteger(0, height - 1)];
    inSnake = includes(apple, snakeBody);
  } while (inSnake)

  return apple;
}

function includes(value, arr) {
  for (let i = 0; i < arr.length; i++) {
    const elem = arr[i];
    if (value[0] === elem[0] && value[1] === elem[1]) {
      return true;
    }
  }
  return false;
}

function randomInteger(min, max) {
  // случайное число от min до max (включительно)
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      height: this.props.height,
      width: this.props.width,
      snakeSize: 3,
      snakeHead: [],
      snakeBody: [],
      sTime: this.props.startTime,
      movement: [1, 0],
      apple: [],
      goal: this.props.goal
    }
    this.stepTime = this.props.stepTime;
    this.maxTime = this.props.maxTime;

    this.idTimer = null;

    this.state.snakeHead = [Math.floor(this.state.width / 2)+1, Math.floor(this.state.height / 2)];
    const sHead = this.state.snakeHead;
    this.state.snakeBody.push([sHead[0]-2, sHead[1]]);
    this.state.snakeBody.push([sHead[0]-1, sHead[1]]);
    this.state.snakeBody.push([sHead[0], sHead[1]]);
    this.state.apple = instantiateApple(this.state.width, this.state.height, this.state.snakeBody);

    this.snakeMove = this.snakeMove.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }


  handleKeyPress(event) {

    const movement = this.state.movement;
    let newMovement;
    let key = event.key;
    switch (key) {
      case "Ы": 
      case "ы":
      case "S": 
      case "s": newMovement = [0, 1]; break;
      case "В": 
      case "в":
      case "D": 
      case "d": newMovement = [1, 0]; break;
      case "Ц": 
      case "ц":
      case "W": 
      case "w": newMovement = [0, -1]; break;
      case "Ф": 
      case "ф":
      case "A": 
      case "a": newMovement = [-1, 0]; break;
      default: newMovement = movement;
    }
    
    const snakeNeck = this.state.snakeBody[this.state.snakeBody.length - 2];
    const snakeHead = this.state.snakeHead;
    if ((snakeNeck[0] !== snakeHead[0] + newMovement[0]) || (snakeNeck[1] !== snakeHead[1] + newMovement[1]))
      this.setState({ movement: newMovement });

  }

  snakeMove() {
    let snakeHead = this.state.snakeHead;
    let snakeBody = this.state.snakeBody;
    let snakeSize = this.state.snakeSize;
    let apple = this.state.apple;


    snakeHead[0] = snakeHead[0] + this.state.movement[0];
    if (snakeHead[0] === this.state.width)
      snakeHead[0] = 0;
    if (snakeHead[0] === -1)
      snakeHead[0] = this.state.width - 1;
    snakeHead[1] = snakeHead[1] + this.state.movement[1];
    if (snakeHead[1] === this.state.height)
      snakeHead[1] = 0;
    if (snakeHead[1] === -1)
      snakeHead[1] = this.state.height - 1;

    if (includes(snakeHead, snakeBody)) {
      clearInterval(this.idTimer);
      alert("You lose. If you want restart game, just refresh website");
      return;
    }

    snakeBody.push([snakeHead[0], snakeHead[1]]);
    if (snakeBody.length > snakeSize) {
      const notBody = snakeBody.shift();
    }
    let sTime = this.state.sTime;
    let goal = this.state.goal;
    if (snakeHead[0] === apple[0] && snakeHead[1] === apple[1]) {
      snakeSize++;
      goal--;
      if (goal === 0) {
        clearInterval(this.idTimer);
        alert("You won. If you want restart game, just refresh website");
        return;
      }
      sTime = sTime - this.stepTime;
      if (sTime < this.maxTime) sTime = this.maxTime;
      apple = instantiateApple(this.state.width, this.state.height, snakeBody);
    }
    this.setState({ snakeBody: snakeBody, snakeHead: snakeHead, snakeSize: snakeSize, sTime: sTime, apple: apple, goal: goal });
    clearInterval(this.idTimer);
    this.idTimer = setInterval(this.snakeMove, this.state.sTime);
  }

  componentDidMount() {
    this.idTimer = setInterval(this.snakeMove, this.state.sTime);
    window.addEventListener("keydown", this.handleKeyPress);
  }



  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board
            height={this.state.height}
            width={this.state.width}
            snakeBody={this.state.snakeBody}
            snakeHead={this.state.snakeHead}
            apple={this.state.apple}
          />
        </div>
        <div className="game-info">
          <div>
            apples left: {this.state.goal}
          </div>
          <div>
            size: {this.state.snakeSize}
          </div>
        </div>
      </div>

    );
  }



}

ReactDOM.render(
  <Game height={7} width={7} startTime={1000} minTime={100} stepTime={50} goal={10} />,
  document.getElementById('root')
);