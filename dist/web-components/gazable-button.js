class GazableButtonElement extends HTMLElement {
    _activateTimeout = undefined;
    _defaultDwellTime = 1000;
    _defaultActivationAnimationTime = 200;
    constructor() {
        super();
        this.gazeInteractable = true;
        const simulateGaze = new URLSearchParams(window.location.search).get('simulategaze') !== null;
        if (simulateGaze) {
            console.info('simulating gaze using mouse');
            this.addEventListener('mouseover', this.#onGazeOver, { capture: true, passive: true });
            this.addEventListener('mouseout', this.#onGazeOut, { capture: true, passive: true });
        }
        else {
            this.addEventListener('tdxFocus', this.#onGazeOver);
            this.addEventListener('tdxUnfocus', this.#onGazeOut);
        }
        this.addEventListener('click', this.#onClick, { capture: true, passive: true });
        this.style.setProperty('--dwell-time', `${this.dwellTime}ms`);
        this.style.setProperty('--activation-animation-time', `${this.activationAnimationTime}ms`);
    }
    #onGazeOver = () => {
        this.setAttribute('gaze-focused', '');
        this.startDwell();
    };
    #onGazeOut = () => {
        this.removeAttribute('gaze-focused');
        this.stopDwell();
    };
    #onClick = (e) => {
        if (e.target === this) {
            this.onActivate();
        }
    };
    onActivate() {
        this.#onGazeOut();
    }
    startDwell() {
        if (this._activateTimeout)
            clearTimeout(this._activateTimeout);
        this._activateTimeout = window.setTimeout(() => {
            this.click();
            this._activateTimeout = undefined;
        }, this.dwellTime);
    }
    stopDwell() {
        if (this._activateTimeout !== undefined) {
            window.clearTimeout(this._activateTimeout);
            this._activateTimeout = undefined;
        }
        this.blur();
    }
    hasGazeFocus() {
        return this.hasAttribute('gaze-focused');
    }
    get gazeInteractable() {
        return this.hasAttribute('data-tdx-interactor');
    }
    set gazeInteractable(val) {
        if (val) {
            this.setAttribute('data-tdx-interactor', '');
        }
        else {
            this.removeAttribute('data-tdx-interactor');
        }
    }
    get dwellTime() {
        const dwellTime = Number.parseInt(this.getAttribute('dwell-time'));
        if (!isNaN(dwellTime)) {
            if (dwellTime < 0)
                console.error(`'dwell-time' must be larger than zero`);
            return dwellTime;
        }
        return window.eyeTracking?.systemDwellTime || this._defaultDwellTime;
    }
    set dwellTime(value) {
        if (!Number.isInteger(value)) {
            console.error(`Invalid dwell time value ${value}`);
            return;
        }
        this.setAttribute('dwell-time', value.toString());
    }
    get activationAnimationTime() {
        const activationAnimationTime = Number.parseInt(this.getAttribute('activation-animation-time'));
        if (!isNaN(activationAnimationTime)) {
            if (activationAnimationTime < 0)
                console.error(`'activation-animation-time' must be larger than zero`);
            return activationAnimationTime;
        }
        return window.eyeTracking?.activationAnimationTime || this._defaultActivationAnimationTime;
    }
    set activationAnimationTime(value) {
        if (!Number.isInteger(value)) {
            console.error(`Invalid activation animation time value ${value}`);
            return;
        }
        this.setAttribute('activation-animation-time', value.toString());
    }
}
if (!customElements.get('gazable-button')) {
    customElements.define('gazable-button', GazableButtonElement);
}

export { GazableButtonElement };
