export declare class GazableButtonElement extends HTMLElement {
    #private;
    _activateTimeout: number | undefined;
    _defaultDwellTime: number;
    _defaultActivationAnimationTime: number;
    constructor();
    onActivate(): void;
    startDwell(): void;
    stopDwell(): void;
    hasGazeFocus(): boolean;
    get gazeInteractable(): boolean;
    set gazeInteractable(val: boolean);
    get dwellTime(): number;
    set dwellTime(value: number);
    get activationAnimationTime(): number;
    set activationAnimationTime(value: number);
}
