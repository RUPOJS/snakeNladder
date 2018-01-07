import React, { Component } from 'react';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import actions from '../action/multi';
import Results from './winner';
import PerfectThrows from './perfectThrows';

class Multi extends Component {
  constructor(props) {
    super(props);
    this.reset = this.reset.bind(this);
    this.throwDice = this.throwDice.bind(this);
    this.submitName = this.submitName.bind(this);
    this.snakeorladder = this.snakeorladder.bind(this);
    this.makeCells = this.makeCells.bind(this);
    this.state = {isGameStarted: false, isGameCompleted: false, playerName1: '', playerName2: '', currentPlayer: '', nextPlayer: '', currentPos1: 0, currentPos2: 0, diceVal1: 0, diceVal2: 0, winner: ''};
    this.throwcount = 0;
  }

  componentDidMount() {
    for(var i=1;i<=100;i++) {
      if((i <=10)) {
          document.getElementById(i).className+=' pull-right';
      } else if((i >20) && (i <31)) {
          document.getElementById(i).className+=' pull-right';
      }else if((i >40) && (i <51)) {
          document.getElementById(i).className+=' pull-right';
      }else if((i >60) && (i <71)) {
          document.getElementById(i).className+=' pull-right';
      }else if((i>80) && (i <91)) {
          document.getElementById(i).className+=' pull-right';
      }
      if(i%2 == 0) {
        document.getElementById(i).className+=' square-orange';
      } else {
        document.getElementById(i).className+=' square-red';
      }
    }
  }

  snakeorladder(nextPos, turn) {
    let snake = 0;
    let ladder= 0;
    if(nextPos == 46) {
      snake +=1;
      nextPos = 34;
    } else if(nextPos == 99) {
      snake +=1;
      nextPos = 74;
    } else if(nextPos == 61) {
      snake +=1;
      nextPos = 20;
    } else if(nextPos == 73) {
      snake +=1;
      nextPos = 3;
    } else if(nextPos == 86) {
      snake +=1;
      nextPos = 22;
    } else if(nextPos == 39) {
      ladder +=1;
      nextPos = 63;
    } else if(nextPos == 14) {
      ladder +=1;
      nextPos = 70;
    } else if(nextPos == 67) {
      ladder +=1;
      nextPos = 95;
    } else {
      nextPos = nextPos;
    }
    this.props.dispatch(actions.snakeladder(snake,ladder));
    return nextPos;
  }

  makeCells() {
    console.log(this.state.currentPos1, this.state.currentPos2);
    const {size} = this.props.board;
    let id = 101;
    let board = [];
    for(let i = 0; i < size ; i++) {
      for(let j = 0; j < size; j++) {
        id = id -1;
        board.push(<div key={id} id={id} ref={id} className="square"><div>{id}</div>{this.state.currentPos1 === id ? <label className='circle'></label> : ''}{this.state.currentPos2 === id ? <label className='circle2'></label> : ''}</div>);
      }
    }
    return (
      <div>
        {board}
        <div className="overlay">
           <div>
             <img id="snake1" width="100" src="./images/snake1.png"></img>
             <img id="snake2" width="300" src="./images/snake2.png"></img>
             <img id="snake3" width="300" src="./images/snake3.png"></img>
             <img id="snake4" src="./images/snake4.png"></img>
             <img id="snake5" width="100" src="./images/snake5.png"></img>
             <img id="ladder1" width="150" src="./images/ladder1.png"></img>
             <img id="ladder2" width="150" src="./images/ladder1.png"></img>
             <img id="ladder3" width="150" src="./images/ladder1.png"></img>
           </div>
        </div>
      </div>
    )
  }

  reset() {
    this.setState({isGameStarted: false, isGameCompleted: false, playerName1: '', playerName2: '', currentPlayer: '', nextPlayer: '', currentPos1: 0, currentPos2: 0, diceVal1: 0, diceVal2: 0, winner: ''});
    this.props.dispatch(actions.reset());
  }

  throwDice() {
    let count = 0;
    let six = 0;
    let turn = this.props.multi.turn;
    const position1 = this.props.multi.player1.position;
    const position2 = this.props.multi.player2.position;
    const value = Math.floor(Math.random()*6 + 1);
    if(turn === 1) {
      this.setState({nextPlayer: this.props.multi.player2.name, diceVal1: value});
      let nextPos = parseInt(position1) + parseInt(value);
      count = parseInt(this.props.multi.player1.count) + 1;
      six = this.props.multi.player1.six;
      nextPos = this.snakeorladder(nextPos, turn);
      if(nextPos < 100){
        this.setState({currentPos1: nextPos});
      } else if(nextPos == 100) {
        this.setState({isGameCompleted: true, currentPos1: 0, winner: this.props.multi.player1.name});
        turn = 1;
        nextPos = 1;
      } else {
        nextPos = parseInt(position1);
      }
      this.props.dispatch(actions.throwDice(turn, count, nextPos, value ));
    } else {
      this.setState({nextPlayer: this.props.multi.player1.name, diceVal2: value});
      let nextPos = parseInt(position2) + parseInt(value);
      count = parseInt(this.props.multi.player1.count) + 1;
      six = this.props.multi.player2.six;
      if(value === 6) {
        six = + 1;
      }
      nextPos = this.snakeorladder(nextPos, turn);
      if(nextPos < 100) {
        this.setState({currentPos2: nextPos});
      } else if(nextPos === 100) {
        this.setState({isGameCompleted: true, currentPos2: 0, winner: this.props.multi.player2.name});
        turn = 1;
        nextPos = 1;
      } else {
        nextPos = parseInt(position2)
      }
      this.props.dispatch(actions.throwDice(turn, count, nextPos, value ));
    }
  }

  submitName(){
    const player1 = this.refs.player1.value;
    const player2 = this.refs.player2.value;
    if((player1 === '') || (player2 === '')){
      this.setState({isGameStarted: false});
    } else {
      this.setState({isGameStarted: true, nextPlayer: player1, currentPos1: 1, currentPos2: 1});
      this.props.dispatch(actions.multiplayer(player1, player2));
    }
  }
  render(){
    // const dragHandlers = {onStart: this.onStart, onStop: this.onStop};
    const boardMarkup = this.makeCells();
    return (
      <div className="container-fluid">
      {(this.state.currentPos1 > 0) && <PerfectThrows snakes={{'99': 74, '86': 22, '73': 3, '61': 20, '46': 34}} ladders={{'14': 70, '39':63, '67': 95}} maxRoll={50} currentPlayerIndex={0} getPlayerPosition={this.state.currentPos1} reverse={false} />}
      {(this.state.currentPos2 > 0) && <PerfectThrows snakes={{'99': 74, '86': 22, '73': 3, '61': 20, '46': 34}} ladders={{'14': 70, '39':63, '67': 95}} maxRoll={50} currentPlayerIndex={0} getPlayerPosition={this.state.currentPos2} reverse={false} />}
        {this.state.isGameCompleted && <Draggable zIndex={100}>
          <div id="winner" className="box">
          <h3>Winner: <span>{this.state.winner}</span></h3>
          <div className="result"><label>Player1: </label> {this.props.multi.player1.name}</div>
          <div className="result"><label>Total No. Throws: </label> {this.props.multi.player1.count}</div>
          <div className="result"><label>Snake Attacked: </label> {this.props.multi.player1.snake}</div>
          <div className="result"><label>Ladder Climbed: </label> {this.props.multi.player1.ladder}</div>
          <div className="result"><label>6 Rolled: </label> {this.props.multi.player1.six}</div>
          <hr />
          <div className="result"><label>Player2: </label> {this.props.multi.player2.name}</div>
          <div className="result"><label>Total No. Throws: </label> {this.props.multi.player2.count}</div>
          <div className="result"><label>Snake Attacked: </label> {this.props.multi.player2.snake}</div>
          <div className="result"><label>Ladder Climbed: </label> {this.props.multi.player2.ladder}</div>
          <div className="result"><label>6 Rolled: </label> {this.props.multi.player2.six}</div>
          </div>
        </Draggable>}
        <div className="col-md-12">
        {!this.state.isGameStarted && <div id="enterplayer" className="col-md-2">
          <div className="form-group">
            <label>Player 1:</label>
            <input ref="player1" type="text" className="form-control" />
          </div>
          <div className="form-group">
            <label>Player 2:</label>
            <input ref="player2" type="text" className="form-control" />
          </div>
          <div className="form-group">
            <button className="btn btn-primary" onClick={()=>this.submitName()}>Start Game</button>
          </div>
          <p className="warning">Enter Names</p>
        </div>}
        {this.state.isGameStarted && <div className="col-md-2 multi-box">
          <div id="next-turn" ref="next-turn" className="col-md-12">
            <h3>Next Turn: <span>{this.state.nextPlayer}</span></h3>
          </div>
          <div id="player1_Div" className="col-md-12 well">
            <p>{this.props.multi.player1.name}</p>
            <p>Number of throws: {this.props.multi.player1.count}</p>
            <p id="player-1-dice">{'Dice Rolled: ' + this.state.diceVal1}</p>
            <p>Player: Black</p>
          </div>
          <div id="player2_Div" className="col-md-12 well">
            <p>{this.props.multi.player2.name}</p>
            <p>Number of throws: {this.props.multi.player2.count}</p>
            <p id="player-2-dice">{'Dice Rolled: ' + this.state.diceVal2}</p>
            <p>Player: Blue</p>
          </div>
          {(this.state.isGameStarted && !this.state.isGameCompleted) && <div className="col-md-12">
            <button id="throw-dice" className="btn btn-primary" onClick={()=>this.throwDice()}>Throw Dice</button>
          </div>}
          <div className="col-md-12">
            <button id="reset-board" className="btn btn-primary" onClick={()=>this.reset()}>Reset Game</button>
          </div>
        </div>}

          <div className="col-md-8">
            <div id="board" className="board col-md-offset-3">
              {boardMarkup}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Multi;
