import * as React from 'react';
import './App.css';

import logo from './logo.svg';
import {BodyState, IHand, ILeg, IPoint} from "./interfaces";

export interface IStickManState {
    bodyState: BodyState;
    basePoint: IPoint;
}

class App extends React.Component<{}, IStickManState> {

    private canvas: any;

    private static readonly HAND_LENGTH = 90;

    constructor(p: any) {
        super(p);

        let basePoint: IPoint = { x: 150, y: 150 };
        this.state = {
            bodyState: BodyState.Still,
            basePoint

        };

        this.draw = this.draw.bind(this);
        this.drawStillBody = this.drawStillBody.bind(this);
        this.keydown = this.keydown.bind(this);
    }

    public componentDidMount() {

        this.addListeners();
        window.requestAnimationFrame(this.draw);
    }

    private draw(time) {
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, 300, 300);
        switch (this.state.bodyState) {
            case BodyState.Still:
                this.drawStillBody(ctx);
                break;
        }

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
        let rightHandEnd: IPoint = {x: drawHandsFrom.x + 40, y: drawHandsFrom.y + 73};
        let leftHandEnd: IPoint = {x: drawHandsFrom.x - 40, y: drawHandsFrom.y + 73};
        let rightLegEnd: IPoint = {x: drawLegsFrom.x + 40, y: drawLegsFrom.y + 73};
        let leftLegEnd: IPoint = {x: drawLegsFrom.x - 40, y: drawLegsFrom.y + 73};
        this.drawHand(this.state.basePoint, drawHandsFrom, ctx, rightHandEnd);
        this.drawHand(this.state.basePoint, drawHandsFrom, ctx, leftHandEnd);
        this.drawHand(this.state.basePoint, drawLegsFrom, ctx, rightLegEnd);
        this.drawHand(this.state.basePoint, drawLegsFrom, ctx, leftLegEnd);
    }

    private drawHand(basePoint: IPoint, drawFrom: IPoint, ctx: any, endPoint: IPoint) {
        ctx.beginPath();
        ctx.moveTo(drawFrom.x, drawFrom.y);
        let handStartEndDist = this.calcDist(drawFrom, endPoint);
        if (handStartEndDist > App.HAND_LENGTH) {
            console.error("DRAW HAND: hand length too big");
            return;
        }
        let midPoint: IPoint = { x: (drawFrom.x + endPoint.x) / 2, y: (drawFrom.y + endPoint.y) / 2 };
        let m = (drawFrom.y - endPoint.y) / (drawFrom.x - endPoint.x);
        let mOposite = - (1/m);
        // console.log("draw from", drawFrom, "draw to", endPoint, "mid point", midPoint ,"M:", mOposite);
        let elbowPos: IPoint = this.findElbowPos(mOposite, midPoint, drawFrom, endPoint);
        // console.log(elbowPos);
        ctx.lineTo(elbowPos.x, elbowPos.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();
        ctx.closePath();
    }

    private findElbowPos(m, midPoint: IPoint, startPoint: IPoint, endPoint: IPoint): IPoint {
        if (midPoint.y > startPoint.y) {
            for (let y = midPoint.y; y > 0; y--) {
                let x = (y - midPoint.y + m * midPoint.x) / m;
                let startToElbow = this.calcDist(startPoint, {x, y});
                let elbowToEnd = this.calcDist({x, y}, endPoint);
                if (Math.abs(startToElbow + elbowToEnd - App.HAND_LENGTH) < 5)
                    return {x, y};
            }
        } else {
            for (let y = midPoint.y; y < 300; y++) {
                let x = (y - midPoint.y + m * midPoint.x) / m;
                let startToElbow = this.calcDist(startPoint, {x, y});
                let elbowToEnd = this.calcDist({x, y}, endPoint);
                if (Math.abs(startToElbow + elbowToEnd - App.HAND_LENGTH) < 5)
                    return {x, y};
            }
        }
        console.error("Elbow pos not found");
        return { x: -1, y: -1 };
    }

    private calcDist(start: IPoint, end: IPoint) {
        return Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));
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
