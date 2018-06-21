
export interface IPoint {
    x: number;
    y: number;
}

export interface IHand {
    end: IPoint;
    mid: IPoint;
}

export interface ILeg {
    end: IPoint;
    mid: IPoint;
}

export enum BodyState {
    Still = 0
}