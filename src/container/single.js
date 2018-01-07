import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../action/single';
import PerfectThrows from './perfectThrows';

class Single extends Component {
  constructor(props) {
    super(props);
    this.reset = this.reset.bind(this);
    this.throwCount = this.throwCount.bind(this);
    this.move = this.move.bind(this);
    this.startGame = this.startGame.bind(this);
    this.throwDice = this.throwDice.bind(this);
    this.makeCells = this.makeCells.bind(this);
    this.state = {isGameStarted: false, isGameCompleted: false, playerName: '', currentPos: 0, diceVal: 0};
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

  reset(){
    this.setState({isGameStarted: false, currentPos: 0});
    this.throwcount=0;
    this.props.dispatch(actions.resetSingle());
  }

  throwCount(){
    return (
      <span>Number of throws: {this.props.board.singlethrow}</span>
    )
  }

  move(next, current) {
    this.setState({currentPos: next});
    let snake =0;
    let ladder=0;
    if(next == 46) {
      snake = 1;
      current = 34;
      this.setState({currentPos: current});
      this.props.dispatch(actions.snakeladder(current, snake, ladder));
    } else if(next == 99) {
      snake = 1;
      current = 74;
      this.setState({currentPos: current});
      this.props.dispatch(actions.snakeladder(current, snake, ladder));
    }else if(next == 73) {
      snake = 1;
      current = 3;
      this.setState({currentPos: current});
      this.props.dispatch(actions.snakeladder(current, snake, ladder));
    }else if(next == 86) {
      snake = 1;
      current = 22;
      this.setState({currentPos: current});
      this.props.dispatch(actions.snakeladder(current, snake, ladder));
    } else if(next== 67) {
      ladder = 1;
      current = 95;
      this.setState({currentPos: current});
      this.props.dispatch(actions.snakeladder(current, snake, ladder));
    } else if(next== 14) {
      ladder = 1;
      current = 70;
      this.setState({currentPos: current});
      this.props.dispatch(actions.snakeladder(current, snake, ladder));
    } else if(next== 39) {
      ladder = 1;
      current = 63;
      this.setState({currentPos: current});
      this.props.dispatch(actions.snakeladder(current, snake, ladder));
    }else if(next == 61) {
      snake = 1;
      current = 20;
      this.setState({currentPos: current});
      this.props.dispatch(actions.snakeladder(current, snake, ladder));
    }
  }

  startGame() {
    const player = this.refs.player.value;
    if(player === '') {
      this.setState({isGameStarted: false});
    } else {
      this.setState({playerName: player, isGameStarted: true});
      this.props.dispatch(actions.player(player))
      const initial = this.props.board.initial;
      this.setState({currentPos: initial});
    }
  }

  throwDice() {
    this.throwcount += 1;
    let value = Math.floor(Math.random()*6 + 1);
    let currentval = this.props.board.initial;
    let nextVal = parseInt(currentval) + parseInt(value);
    this.setState({diceVal: value});
    if(nextVal == 100){
      this.setState({isGameCompleted: true});
    }
    this.props.dispatch(actions.throwDice(nextVal,currentval, this.throwcount));
      if(nextVal <= 100) {
        this.move(nextVal, currentval);
    }
    if(value == 6) {
      this.props.dispatch(actions.sixSingle());
    }
  }

  makeCells() {
    const {size} = this.props.board;
    let id = 101;
    let board = [];
    for(let i = 0; i < size ; i++) {
      for(let j = 0; j < size; j++) {
        id = id -1;
        board.push(<div key={id} id={id} ref={id} className="square"><div>{id}</div>{this.state.currentPos === id ? <p className="circle"></p> : ''}</div>);
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

  render() {
    const boardMarkup = this.makeCells();
    console.log(this.state.isGameStarted);
    console.log(this.props);
    return (
      <div className="container-fluid">
        {(this.state.currentPos > 0) && <PerfectThrows snakes={{'99': 74, '86': 22, '73': 3, '61': 20, '46': 34}} ladders={{'14': 70, '39':63, '67': 95}} maxRoll={50} currentPlayerIndex={0} getPlayerPosition={this.state.currentPos} reverse={false} />}
        <div className="col-sm-2">
          <div id="enterplayer" className="form-group">
            <label>Player Name:</label>
            <input ref="player" type="text" className="form-control" id="player" />
            {this.state.playerName === '' && <div> <p className="warning" id="warning" ref="warning">Enter Name</p> </div>}
          </div>
          <div id="playername" className="form-group">
            <label>{this.props.board.player}</label>
          </div>
          {(this.state.isGameStarted && !this.state.isGameCompleted) ? <div><button id="throw-single" className="btn btn-primary btn-sm db" onClick={()=>this.throwDice()}>
            Throw dice
          </button></div> : ''}
          {!this.state.isGameStarted ? <div><buttons id="start-single" className="btn btn-primary btn-sm db" onClick={()=>this.startGame()}>
            Start Game
          </buttons> </div> : ''}
          {this.state.isGameStarted ? <div><buttons id="reset-single" className="btn btn-primary btn-sm db" onClick={()=>this.reset()}>
            Reset Game
          </buttons></div> : ''}
          {this.state.isGameStarted ? <div id="throwcountSingle" className="well well-sm">
            <p>{this.throwCount()}</p>
            <p id="diceVal">{'Dice rolled: ' + this.state.diceVal}</p>
            <p>6 Rolled: {this.props.board.six}</p>
            <p>Snake Attacked: {this.props.board.snake}</p>
            <p>Ladder Climbed: {this.props.board.ladder}</p>
          </div> : ''}
        </div>
        <div id="board" className="board col-md-offset-3">
          {boardMarkup}
        </div>
      </div>
    )
  }
}
export default Single;
