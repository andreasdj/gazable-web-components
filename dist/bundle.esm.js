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
        this.setAttribute('gaze-focused', true.toString());
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
            this.setAttribute('data-tdx-interactor', true.toString());
        }
        else {
            this.removeAttribute('data-tdx-interactor');
        }
    }
    get dwellTime() {
        const dwellTime = Number(this.getAttribute('dwell-time'));
        if (!isNaN(dwellTime)) {
            if (dwellTime < 0)
                console.error(`'dwell-time' must be larger than zero`);
            return dwellTime;
        }
        return window.eyeTracking?.systemDwellTime || this._defaultDwellTime;
    }
    set dwellTime(val) {
        const dwellTime = Number(val);
        if (isNaN(dwellTime)) {
            console.error(`Invalid dwell time value ${val}`);
            return;
        }
        this.setAttribute('dwell-time', dwellTime.toString());
    }
    get activationAnimationTime() {
        const activationAnimationTime = Number(this.getAttribute('activation-animation-time'));
        if (!isNaN(activationAnimationTime)) {
            if (activationAnimationTime < 0)
                console.error(`'activation-animation-time' must be larger than zero`);
            return activationAnimationTime;
        }
        return window.eyeTracking?.activationAnimationTime || this._defaultActivationAnimationTime;
    }
    set activationAnimationTime(val) {
        const activationAnimationTime = Number(val);
        if (isNaN(activationAnimationTime)) {
            console.error(`Invalid activation animation time value ${val}`);
            return;
        }
        this.setAttribute('activation-animation-time', activationAnimationTime.toString());
    }
}
if (!customElements.get('gazable-button')) {
    customElements.define('gazable-button', GazableButtonElement);
}

var htmlTemplate = "<style>\n   :host {\n      display: inline-block;\n      /* border: 1px solid transparent; */\n      position: relative;\n      border-radius: var(--button-border-radius, 3px);\n      box-sizing: border-box;\n      width: var(--button-width, 13.5vw);\n      height: var(--button-height, 5.4vw);\n      background-color: var(--button-color, transparent);\n      padding: var(--button-dwell-thickness, 0.405vw); /* $square-button-height * 0.075; */\n      -webkit-tap-highlight-color: transparent;\n   }\n\n   :host([disabled]) {\n      cursor: default;\n      pointer-events: none;\n      opacity: var(--button-disabled-opacity, 0.5);\n   }\n\n   :host([gaze-focused]) {\n      /* border-radius: 0; */\n   }\n\n   :host([gaze-focused]) {\n      background: linear-gradient(to left, var(--button-color, #999) 50%, var(--button-dwell-color, #59f) 50%);\n      background-size: 200% 200%;\n      background-repeat: repeat-y;\n      background-position: right bottom;\n      /* animation: square-dwell-animation linear forwards var(--dwell-time, 300ms); */\n   }\n\n   :host([gaze-activated]) {\n      border-radius: var(--button-border-radius, 3px);\n      /* animation: backgroundActivationAnimation var(--activation-animation-time, 150)ms; */\n   }\n\n   /* @keyframes backgroundActivationAnimation {\n      0% {\n        border: 0px;\n      }\n\n      50% {\n        border: 5px solid transparent;\n        background-color: transparent;\n      }\n\n      75% {\n        border: 0px;\n        background-color: rgba(var(--button-activation-color, #59f), var(--button-activation-opacity, 0.3));\n      }\n\n      100% {\n        background-color: transparent;\n      }\n    } */\n\n   .inner-content {\n      color: var(--button-text-color, #fff);\n      position: relative;\n      font-size: var(--button-font-size, 1vw);\n      width: 100%;\n      height: 100%;\n      border-radius: var(--button-border-radius, 3px);\n      box-sizing: border-box;\n      /* border: var(--button-inner-border-width, 1px) solid var(--button-inner-border-color, #fff); */\n      background-color: var(--button-inner-color, #222);\n   }\n\n   :host([disabled]) .inner-content {\n      border-color: transparent;\n      background-color: var(--button-inner-disabled-color, #999);\n      color: var(--button-text-disabled-color, #ff0);\n   }\n\n   :host([gaze-activated]) .inner-content {\n      color: var(--button-activation-text-color, #222);\n      border-color: transparent;\n      animation: activationAnimation var(--activation-animation-time, 150) ms ease forwards;\n   }\n\n   :host([gaze-focused]) .inner-content {\n      border-color: var(--button-focus-border-color, #59f);\n      border-width: var(--button-inner-border-width, 1px);\n      border-radius: var(--button-focus-border-radius, 0);\n   }\n\n   .inner-content slot {\n      height: 100%;\n      width: 100%;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n   }\n\n   @keyframes square-dwell-animation {\n      from {\n         background-position: right bottom;\n      }\n      to {\n         background-position: left bottom;\n      }\n   }\n</style>\n\n<div class=\"inner-content\">\n   <slot></slot>\n</div>\n";

const gazableSquareButtonTemplate = document.createElement('template');
gazableSquareButtonTemplate.innerHTML = htmlTemplate;
class GazableSquareButtonElement extends GazableButtonElement {
    dwellAnimation = undefined;
    innerContent;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }).append(gazableSquareButtonTemplate.content.cloneNode(true));
        this.innerContent = this.getElementsByClassName('inner-content')[0];
    }
    startActivationAnimation() {
        this.animate([
            { border: '0px' },
            { border: '5px solid transparent', backgroundColor: 'transparent', offset: 0.5 },
            {
                border: '0px',
                backgroundColor: 'rgba(var(--button-activation-color, #59f), var(--button-activation-opacity, 0.3))',
                offset: 0.75,
            },
            { backgroundColor: 'transparent' },
        ], {
            duration: this.activationAnimationTime,
        });
        this.innerContent.animate([
            {
                borderColor: `rgba(var(--button-activation-color, #59f), 0.5)`,
                background: `rgba(var(--button-activation-color, #59f), var(--button-activation-opacity, 0.3))`,
            },
            {
                borderColor: `rgba(var(--button-activation-color, #59f), 0.5)`,
                background: `rgba(var(--button-activation-color, #59f), 0.3)`,
            },
            {
                borderColor: `rgba(var(--button-activation-color, #59f), 0.5)`,
                background: `rgba(var(--button-activation-color, #59f), 1)`,
            },
            {
                borderColor: `rgba(var(--button-activation-color, #59f), 0.5)`,
                background: `rgba(var(--button-activation-color, #59f), 1)`,
            },
        ], {
            duration: this.activationAnimationTime,
            easing: 'ease',
            fill: 'backwards',
        });
    }
    onActivate() {
        this.startActivationAnimation();
        super.onActivate();
    }
    startDwell() {
        this.dwellAnimation = this.animate([{ backgroundPosition: 'right bottom' }, { backgroundPosition: 'left bottom' }], {
            duration: this.dwellTime,
            iterations: 1,
            easing: 'linear',
            fill: 'none',
        });
        this.dwellAnimation.onfinish = () => this.click();
    }
    stopDwell() {
        this.dwellAnimation?.cancel();
        this.dwellAnimation = undefined;
    }
}
if (!customElements.get('gazable-square-button')) {
    customElements.define('gazable-square-button', GazableSquareButtonElement);
}

export { GazableButtonElement, GazableSquareButtonElement };
