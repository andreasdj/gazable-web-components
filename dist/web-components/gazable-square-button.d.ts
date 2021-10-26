import { GazableButtonElement } from './gazable-button';
export declare class GazableSquareButtonElement extends GazableButtonElement {
    dwellAnimation: Animation | undefined;
    innerContent: HTMLElement;
    activationColorRgb: string;
    constructor();
    startActivationAnimation(): void;
    onActivate(): void;
    startDwell(): void;
    stopDwell(): void;
}
