(function (exports) {
    'use strict';

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

    var htmlTemplate = "<style>\n   :host {\n      display: inline-block;\n      border: var(--button-border, 1px solid transparent);\n      position: relative;\n      border-radius: var(--button-border-radius, 3pt);\n      box-sizing: border-box;\n      width: var(--button-width, 13.5vw);\n      height: var(--button-height, 5.4vw);\n      background-color: var(--button-dwell-background-color, rgba(56, 56, 56, 0.5));\n      padding: var(--button-dwell-thickness, 0.405vw); /* $square-button-height * 0.075; */\n      -webkit-tap-highlight-color: transparent;\n      user-select: none;\n   }\n\n   :host([disabled]) {\n      cursor: default;\n      pointer-events: none;\n      opacity: var(--button-disabled-opacity, 0.5);\n   }\n\n   :host([gaze-focused]) {\n      border-radius: 0;\n      background: linear-gradient(\n         to left,\n         var(--button-dwell-background-color, rgba(56, 56, 56, 0.5)) 50%,\n         var(--button-dwell-color, #92bcff) 50%\n      );\n      background-size: 200% 200%;\n      background-repeat: repeat-y;\n      background-position: right bottom;\n   }\n\n   :host([gaze-activated]) {\n      border-radius: var(--button-border-radius, 3pt);\n   }\n\n   .inner-content {\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      color: var(--button-text-color, #fff);\n      font-size: var(--button-font-size, 1vw);\n      font-weight: var(--button-font-weight, bold);\n      width: 100%;\n      height: 100%;\n      border-radius: var(--button-border-radius, 3px);\n      box-sizing: border-box;\n      font-family: var(--button-font-family, sans-serif);\n      box-shadow: inset 0px 0px 1px var(--button-inner-border-width, 1px) var(--button-inner-border-color, #fff);\n      background-color: var(--button-inner-background-color, #222);\n      text-align: center;\n      transition: box-shadow 200ms ease-out, border-radius 200ms ease-out;\n   }\n\n   :host([disabled]) .inner-content {\n      border-color: transparent;\n      background-color: var(--button-disabled-inner-color, #383838);\n      color: var(--button-disabled-text-color, #989899);\n   }\n\n   :host([gaze-activated]) .inner-content {\n      color: var(--button-activated-text-color, #111);\n      border-color: transparent;\n      box-shadow: inset 0px 0px 1px var(--button-focused-inner-border-width, 3px)\n         rgba(var(--button-activation-color-rgb, 146, 188, 255), 0.5);\n   }\n\n   :host([gaze-focused]) .inner-content,\n   :host(:hover) .inner-content {\n      border-color: var(--button-focused-border-color, #92bcff);\n      box-shadow: inset 0px 0px 1px var(--button-focused-inner-border-width, 3px)\n         var(--button-focused-border-color, #92bcff);\n      border-radius: var(--button-focused-border-radius, 0);\n   }\n\n   .inner-content slot {\n      height: 100%;\n      width: 100%;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n   }\n</style>\n\n<div class=\"inner-content\">\n   <slot></slot>\n</div>\n";

    const gazableSquareButtonTemplate = document.createElement('template');
    gazableSquareButtonTemplate.innerHTML = htmlTemplate;
    class GazableSquareButtonElement extends GazableButtonElement {
        dwellAnimation = undefined;
        innerContent;
        activationColorRgb = '146, 188, 255';
        constructor() {
            super();
            this.attachShadow({ mode: 'open' }).append(gazableSquareButtonTemplate.content.cloneNode(true));
            this.innerContent = this.shadowRoot?.querySelector('.inner-content');
        }
        startActivationAnimation() {
            const activationAnimation = this.animate([
                { border: '0px' },
                { border: '5px solid transparent', backgroundColor: 'transparent', offset: 0.5 },
                {
                    border: '0px',
                    backgroundColor: `rgba(var(--button-activation-color-rgb, ${this.activationColorRgb}), var(--button-activation-opacity, 0.3))`,
                    offset: 0.75,
                },
                { backgroundColor: 'transparent' },
            ], {
                duration: this.activationAnimationTime,
            });
            this.setAttribute('gaze-activated', '');
            activationAnimation.oncancel = () => this.removeAttribute('gaze-activated');
            activationAnimation.onfinish = () => this.removeAttribute('gaze-activated');
            this.innerContent.animate([
                {
                    background: `rgba(var(--button-activation-color-rgb, ${this.activationColorRgb}), var(--button-activation-opacity, 0.3))`,
                },
                {
                    background: `rgba(var(--button-activation-color-rgb, ${this.activationColorRgb}), 0.3)`,
                    offset: 0.05,
                },
                {
                    background: `rgba(var(--button-activation-color-rgb, ${this.activationColorRgb}), 1)`,
                    offset: 0.4,
                },
                {
                    background: `rgba(var(--button-activation-color-rgb, ${this.activationColorRgb}), 1)`,
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

    exports.GazableButtonElement = GazableButtonElement;
    exports.GazableSquareButtonElement = GazableSquareButtonElement;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
