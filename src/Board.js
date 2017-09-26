import React, {Component} from 'react';
import Game from './Game';

let width = 10,
    height = 10;

// Calls the children callback numTimes to produce a repeated component
function Repeat(props) {
    let items = [];
    for (let i = 0; i < props.numTimes; i++) {
        items.push(props.children(i));
    }
    return <div className={props.className}> {
        items
    } < /div>;
}

class MButton extends Component {
    render() {
        return (
            <div className="BoardCell">
                <button type='button' className = {
                    (this.props.visible === 1 ? "visible " : "") +
                    (this.props.visible === 2 ? "mark " : "") +
                    (this.props.visible === 3 ? "visible mine " : "") +
                    (this.props.visible === 4 ? "visible mine red " : "") + "Minesweeper-button"}
                    onClick = {this.props.onClick}
                    onContextMenu = {this.props.onRightClick}>
                {this.props.visible === 1 ? this.props.text : ''}
                </button>
            </div>
        )
    }
}

class MButtonRow extends Component {
    render() {
        return (
            <Repeat numTimes={width} className="BoardRow">
                {(index) => <MButton
                            key = {index}
                            visible = {this.props.visibility[index]}
                            text = {this.props.values[index] > 0 ? this.props.values[index] : '' }
                            onClick = {
                                () =>
                                this.props.onClick(index)
                            }
                            onRightClick = {
                                (e) => {
                                    e.preventDefault();
                                    this.props.onRightClick(index)
                                }
                            }
                            ></MButton>}
            </Repeat>
        )
    }
}

class Board extends Component {
    constructor(props) {
        super(props);

        this.state = Game.state(width, height);
        this.timer = setInterval(() => {this.onTick()}, 1000);
    }

    onClick(row, col) {
        this.setState(Game.click(row, col, this.state));
    }

    onRightClick(row, col) {
        this.setState(Game.rightClick(row, col, this.state));
    }

    onTick() {
        this.setState(Game.tick(this.state));
    }

    reset() {
        clearInterval(this.timer);
        this.setState(Game.state(width, height));
        this.timer = setInterval(() => {this.onTick()}, 1000);
    }

    render() {
        return (
            <div className="BoardFrame">
            <div className="BoardButtons">
                <span className="mines" >Mines left: {this.state.mines}</span>
                <button type='button' className={"status s" + this.state.status} onClick={() => {this.reset()} }/>
                <span className="time">Time: {this.state.time}</span>
            </div>
            <div className="Board">
                <Repeat numTimes={height} className="BoardTable">
                    {
                        (index) => <MButtonRow
                        key = {index}
                        visibility = {this.state.visibilityTable[index]}
                        values = {this.state.stateTable[index]}
                        onClick = {(col) => this.onClick(index, col)}
                        onRightClick = {(col) => this.onRightClick(index, col)}
                        />
                    }
                </Repeat>
            </div>
            </div>
        );
    }
}


export default Board;
