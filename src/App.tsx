import * as React from 'react';
import './App.css';

import logo from './logo.svg';
import {BodyState, HandDrawDetails, IHand, ILeg, IPoint, LegDrawDetails} from "./interfaces";

export interface IStickManState {
    bodyState: BodyState;
    basePoint: IPoint;
    rightHand: HandDrawDetails;
    leftHand: HandDrawDetails;
    leftLeg: LegDrawDetails;
    rightLeg: LegDrawDetails;
    actionTimer: number;
}

class App extends React.Component<{}, IStickManState> {

    private canvas: any;
    private ehh: HTMLAudioElement;

    private static readonly HAND_LENGTH = 90;
    private static readonly LEG_LENGTH = 105;
    private static readonly STEP_PERIOD_LEG_UP = 30;
    private static readonly STEP_PERIOD_LEG_DOWN = 30;
    private static readonly KNEE_KICK_PERIOD = App.STEP_PERIOD_LEG_DOWN + App.STEP_PERIOD_LEG_UP;
    private static readonly KNEE_HEIGHT = 35;
    private static readonly STEP_LEG_DIST = 80;
    private static readonly STEP_PERIOD = 60;


    constructor(p: any) {
        super(p);

        this.ehh = new Audio("https://s1.vocaroo.com/media/download_temp/Vocaroo_s1ql5yxbDLjI.mp3");
        this.ehh.load();

        let basePoint: IPoint = {x: 150, y: 150};
        let handsFrom = {x: basePoint.x, y: basePoint.y - 40};
        let drawLegsFrom = {x: basePoint.x, y: basePoint.y + 50};
        this.state = {
            bodyState: BodyState.Still,
            basePoint,
            rightHand: {
                from: handsFrom,
                to: {x: handsFrom.x + 40, y: handsFrom.y + 73}
            },
            leftHand: {
                from: handsFrom,
                to: {x: handsFrom.x - 40, y: handsFrom.y + 73}
            },
            rightLeg: {
                from: drawLegsFrom,
                to: {x: drawLegsFrom.x + 40, y: drawLegsFrom.y + 94}
            },
            leftLeg: {
                from: drawLegsFrom,
                to: {x: drawLegsFrom.x - 40, y: drawLegsFrom.y + 94}
            },
            actionTimer: 0

        };


        this.draw = this.draw.bind(this);
        this.drawStillBody = this.drawStillBody.bind(this);
        this.drawWalkingBody = this.drawWalkingBody.bind(this);
        this.drawKneeKick = this.drawKneeKick.bind(this);
        this.keydown = this.keydown.bind(this);
        this.keyup = this.keyup.bind(this);
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
            case BodyState.WalkRight:
                this.drawWalkingBody(ctx);
                break;
            case BodyState.WalkLeft:
                this.drawWalkingBody(ctx);
                break;
            case BodyState.KneeKick:
                this.drawKneeKick(ctx);
                break;

        }

        window.requestAnimationFrame(this.draw);
    }

    private addListeners() {
        document.addEventListener('keydown', this.keydown);
        document.addEventListener('keyup', this.keyup);
    }

    private keyup(e) {
        switch (e.key) {
            case "ArrowRight":
                this.setState({
                    bodyState: BodyState.Still,
                    actionTimer: 0
                });
                break;
            case "ArrowLeft":
                this.setState({
                    bodyState: BodyState.Still,
                    actionTimer: 0
                });
                break;
            case "a":
                this.setState({
                    bodyState: BodyState.Still,
                    actionTimer: 0
                });
                break;
        }
    }

    private drawWalkingBody(ctx: any) {
        // calc legs offset from still body state
        let baseOffSet = this.state.bodyState === BodyState.WalkRight ? 2 : -2;
        let upOffset = App.STEP_LEG_DIST * this.state.actionTimer / App.STEP_PERIOD;
        let newBasePoint = {x: this.state.basePoint.x + baseOffSet, y: this.state.basePoint.y};
        let handsFrom = {x: newBasePoint.x, y: newBasePoint.y - 40};
        let drawLegsFrom = {x: newBasePoint.x, y: newBasePoint.y + 50};
        this.setState({
            basePoint: newBasePoint,
            rightHand: {
                from: handsFrom,
                to: {x: handsFrom.x + 40, y: handsFrom.y + 73}
            },
            leftHand: {
                from: handsFrom,
                to: {x: handsFrom.x - 40, y: handsFrom.y + 73}
            },
            rightLeg: {
                from: drawLegsFrom,
                to: {x: drawLegsFrom.x + 40 - upOffset, y: drawLegsFrom.y + 94}
            },
            leftLeg: {
                from: drawLegsFrom,
                to: {x: drawLegsFrom.x - 40 + upOffset, y: drawLegsFrom.y + 94}
            },
            actionTimer: (this.state.actionTimer + 1) % App.STEP_PERIOD
        }, () => {
            this.drawConstants(ctx);
            this.drawHand(this.state.basePoint, this.state.rightHand.from, ctx, this.state.rightHand.to, App.HAND_LENGTH, true);
            this.drawHand(this.state.basePoint, this.state.leftHand.from, ctx, this.state.leftHand.to, App.HAND_LENGTH, true);
            this.drawHand(this.state.basePoint, this.state.rightLeg.from, ctx, this.state.rightLeg.to, App.LEG_LENGTH, false);
            this.drawHand(this.state.basePoint, this.state.leftLeg.from, ctx, this.state.leftLeg.to, App.LEG_LENGTH, false);
        });

    }

    private drawStillBody(ctx: any) {
        let handsFrom = {x: this.state.basePoint.x, y: this.state.basePoint.y - 40};
        let drawLegsFrom = {x: this.state.basePoint.x, y: this.state.basePoint.y + 50};
        this.setState({
            bodyState: BodyState.Still,
            rightHand: {
                from: handsFrom,
                to: {x: handsFrom.x + 40, y: handsFrom.y + 73}
            },
            leftHand: {
                from: handsFrom,
                to: {x: handsFrom.x - 40, y: handsFrom.y + 73}
            },
            rightLeg: {
                from: drawLegsFrom,
                to: {x: drawLegsFrom.x + 40, y: drawLegsFrom.y + 94}
            },
            leftLeg: {
                from: drawLegsFrom,
                to: {x: drawLegsFrom.x - 40, y: drawLegsFrom.y + 94}
            },
            actionTimer: 0
        }, () => {
            this.drawConstants(ctx);
            this.drawHand(this.state.basePoint, this.state.rightHand.from, ctx, this.state.rightHand.to, App.HAND_LENGTH, true);
            this.drawHand(this.state.basePoint, this.state.leftHand.from, ctx, this.state.leftHand.to, App.HAND_LENGTH, true);
            this.drawHand(this.state.basePoint, this.state.rightLeg.from, ctx, this.state.rightLeg.to, App.LEG_LENGTH, false);
            this.drawHand(this.state.basePoint, this.state.leftLeg.from, ctx, this.state.leftLeg.to, App.LEG_LENGTH, false);
        });

    }

    private drawKneeKick(ctx: any) {
        let handsFrom = {x: this.state.basePoint.x, y: this.state.basePoint.y - 40};
        let drawLegsFrom = {x: this.state.basePoint.x, y: this.state.basePoint.y + 50};

        let upOffset = App.KNEE_HEIGHT * this.state.actionTimer / App.STEP_PERIOD_LEG_UP;
        let downOffset = App.KNEE_HEIGHT - (App.KNEE_HEIGHT * (this.state.actionTimer - App.STEP_PERIOD_LEG_UP) / App.STEP_PERIOD_LEG_DOWN);
        let legUp = this.state.actionTimer <= App.STEP_PERIOD_LEG_UP ?
            upOffset : downOffset;
        this.setState({
            rightHand: {
                from: handsFrom,
                to: {x: handsFrom.x + 40, y: handsFrom.y + 73}
            },
            leftHand: {
                from: handsFrom,
                to: {x: handsFrom.x - 40, y: handsFrom.y + 73}
            },
            rightLeg: {
                from: drawLegsFrom,
                to: {x: drawLegsFrom.x + 40, y: drawLegsFrom.y + 94 - legUp}
            },
            leftLeg: {
                from: drawLegsFrom,
                to: {x: drawLegsFrom.x - 40, y: drawLegsFrom.y + 94}
            },
            actionTimer: (this.state.actionTimer + 1) % App.KNEE_KICK_PERIOD,
        }, () => {
            this.drawConstants(ctx);
            this.drawHand(this.state.basePoint, this.state.rightHand.from, ctx, this.state.rightHand.to, App.HAND_LENGTH, true);
            this.drawHand(this.state.basePoint, this.state.leftHand.from, ctx, this.state.leftHand.to, App.HAND_LENGTH, true);
            this.drawHand(this.state.basePoint, this.state.rightLeg.from, ctx, this.state.rightLeg.to, App.LEG_LENGTH, true);
            this.drawHand(this.state.basePoint, this.state.leftLeg.from, ctx, this.state.leftLeg.to, App.LEG_LENGTH, false);
            this.ehh.play();
        });

    }

    private drawConstants(ctx) {
        ctx.beginPath();
        ctx.arc(this.state.basePoint.x, 80, 20, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.state.basePoint.x, this.state.basePoint.y - 50);
        ctx.lineTo(this.state.basePoint.x, this.state.basePoint.y + 50);
        ctx.lineWidth = 5;
        ctx.closePath();
        ctx.stroke();
    }

    private drawHand(basePoint: IPoint, drawFrom: IPoint, ctx: any, endPoint: IPoint, maxLen, elbow: boolean) {
        ctx.beginPath();
        ctx.moveTo(drawFrom.x, drawFrom.y);
        let handStartEndDist = this.calcDist(drawFrom, endPoint);
        /*if (handStartEndDist > maxLen) {
            console.error("DRAW HAND: hand length too big");
            return;
        }*/
        if (elbow) {
            let midPoint: IPoint = {x: (drawFrom.x + endPoint.x) / 2, y: (drawFrom.y + endPoint.y) / 2};
            let m = (drawFrom.y - endPoint.y) / (drawFrom.x - endPoint.x);
            // (this.state.bodyState === BodyState.KneeKick) && console.log("shape of line between",drawFrom, endPoint, "is" ,m);
            let mOposite = -(1 / m);

            // console.log("draw from", drawFrom, "draw to", endPoint, "mid point", midPoint ,"M:", mOposite);
            let elbowPos: IPoint = this.findElbowPos(mOposite, midPoint, drawFrom, endPoint, maxLen);
            ctx.lineTo(elbowPos.x, elbowPos.y);
        }
        // console.log(elbowPos);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();
        ctx.closePath();
    }

    private findElbowPos(m, midPoint: IPoint, startPoint: IPoint, endPoint: IPoint, maxLen): IPoint {
        let found = false;
        let res = {x: -1, y: -1};
        if (midPoint.y > startPoint.y) {
            for (let y = midPoint.y; y > 0; y--) {
                let x = (y - midPoint.y + m * midPoint.x) / m;
                let startToElbow = this.calcDist(startPoint, {x, y});
                let elbowToEnd = this.calcDist({x, y}, endPoint);
                if (Math.abs(startToElbow + elbowToEnd - maxLen) < 1) {
                    found = true;
                    res = {x, y};
                    break;
                }
            }
            if (!found) {
                for (let x = midPoint.x; x < 300; x++) {
                    let y = m * (x - midPoint.x) + midPoint.y;
                    let startToElbow = this.calcDist(startPoint, {x, y});
                    let elbowToEnd = this.calcDist({x, y}, endPoint);
                    if (Math.abs(startToElbow + elbowToEnd - maxLen) < 1) {
                        found = true;
                        res = {x, y};
                        break;
                    }
                }
            }

        } else {
            for (let y = midPoint.y; y < 300; y++) {
                let x = (y - midPoint.y + m * midPoint.x) / m;
                let startToElbow = this.calcDist(startPoint, {x, y});
                let elbowToEnd = this.calcDist({x, y}, endPoint);
                if (Math.abs(startToElbow + elbowToEnd - maxLen) < 1) {
                    found = true;
                    res = {x, y};
                    break;
                }
            }
            if (!found) {
                for (let x = midPoint.x; x < 300; x++) {
                    let y = m * (x - midPoint.x) + midPoint.y;
                    let startToElbow = this.calcDist(startPoint, {x, y});
                    let elbowToEnd = this.calcDist({x, y}, endPoint);
                    if (Math.abs(startToElbow + elbowToEnd - maxLen) < 1) {
                        found = true;
                        res = {x, y};
                        break;
                    }
                }
            }
        }

        !found && console.error("Elbow pos not found");
        return res;
    }

    private calcDist(start: IPoint, end: IPoint) {
        return Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));
    }

    private keydown(e: any) {
        switch (e.key) {
            case "ArrowLeft":
                this.setState({
                    bodyState: BodyState.WalkLeft
                });
                break;
            case "ArrowRight":
                this.setState({
                    bodyState: BodyState.WalkRight,
                });
                break;
            case "a":
                this.setState({
                    bodyState: BodyState.KneeKick,
                    basePoint: {x: this.state.basePoint.x, y: this.state.basePoint.y}
                });
                break;
        }
    }


    public render() {
        return (
            <div className="App">
                {/*<audio ref="audio_tag" src="https://s1.vocaroo.com/media/download_temp/Vocaroo_s1ql5yxbDLjI.mp3"/>*/}
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <canvas width={300} height={300} ref={c => this.canvas = c}/>
            </div>
        );
    }
}

export default App;
