
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
    Still,
    WalkRight,
    WalkLeft,
    KneeKick
}

export interface HandDrawDetails {
    from: IPoint;
    to: IPoint;
}

export interface LegDrawDetails {
    from: IPoint;
    to: IPoint;
}