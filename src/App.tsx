import * as React from 'react';
import './App.css';

import logo from './logo.svg';
import {IHand, ILeg, IPoint} from "./interfaces";

export interface IStickManState {
    leftHandCord: IHand;
    rightHandCord: IHand;
    leftLegCord: ILeg;
    rightLegCord: ILeg;
    basePoint: IPoint;
}

class App extends React.Component<{}, IStickManState> {

    private canvas: any;

    constructor(p: any) {
        super(p);

        let basePoint: IPoint = { x: 150, y: 150 };
        this.state = {
            leftHandCord: {
                mid: { x: -30, y: 0 },
                end: { x: -50, y: 0 }
            },
            rightHandCord: {
                mid: {x: 30, y: 0},
                end: {x: 40, y: 0}
            },
            leftLegCord: {
                mid: { x: -30, y: 100 },
                end: { x: -50, y: 140 }
            },
            rightLegCord: {
                mid: {x: 30, y: 100},
                end: {x: 40, y: 140}
            },
            basePoint

        };

        this.handsUp = this.handsUp.bind(this);
        this.draw = this.draw.bind(this);
        this.drawStillBody = this.drawStillBody.bind(this);
        this.keydown = this.keydown.bind(this);
    }

    public componentDidMount() {

        this.addListeners();
        window.requestAnimationFrame(this.draw);
    }

    private draw(time: any) {
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, 300, 300);
        this.drawStillBody(ctx);

        window.requestAnimationFrame(this.draw);
    }

    private addListeners() {
        document.addEventListener('keydown', this.keydown);
    }

    private drawStillBody(ctx: any) {
        ctx.beginPath();
        ctx.arc(this.state.basePoint.x, 80, 20, 0, 2*Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.state.basePoint.x, this.state.basePoint.y - 50);
        ctx.lineTo(this.state.basePoint.x, this.state.basePoint.y + 50);
        ctx.lineWidth = 5;
        ctx.closePath();
        ctx.stroke();

        let drawHandsFrom: IPoint = { x: this.state.basePoint.x, y: this.state.basePoint.y - 40 };
        let drawLegsFrom: IPoint = { x: this.state.basePoint.x, y: this.state.basePoint.y + 50 };
        this.drawHand(this.state.basePoint, drawHandsFrom, ctx, this.state.rightHandCord);
        this.drawHand(this.state.basePoint, drawHandsFrom, ctx, this.state.leftHandCord);
        this.drawHand(this.state.basePoint, drawLegsFrom, ctx, this.state.rightLegCord);
        this.drawHand(this.state.basePoint, drawLegsFrom, ctx, this.state.leftLegCord);
    }

    private drawHand(basePoint: IPoint, drawFrom: IPoint, ctx: any, handState: IHand) {
        ctx.beginPath();
        ctx.moveTo(drawFrom.x, drawFrom.y);
        ctx.lineTo(handState.mid.x + basePoint.x, handState.mid.y + basePoint.y);
        ctx.lineTo(handState.end.x + basePoint.x, handState.end.y + basePoint.y);
        ctx.stroke();
        ctx.closePath();
    }

    private keydown(e: any) {
        switch (e.key) {
            case "ArrowLeft":
                this.setState({
                   basePoint: { x: this.state.basePoint.x - 5, y: this.state.basePoint.y }
                });
                break;
            case "ArrowRight":
                this.setState({
                    basePoint: { x: this.state.basePoint.x + 5, y: this.state.basePoint.y }
                });
                break;
        }
    }

    private handsUp() {
        this.setState({
            leftHandCord: {
                ...this.state.leftHandCord,
                end: {x: 115, y: 85}
            },
            rightHandCord: {
                ...this.state.rightHandCord,
                end: {x: 185, y: 85}
            }
        });
    }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <canvas width={300} height={300} ref={c => this.canvas = c}/>
      </div>
    );
  }
}

export default App;
