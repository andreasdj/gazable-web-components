import { GazableButtonElement } from './gazable-button.js';
import htmlTemplate from './gazable-square-button-template.html.js';

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
                borderColor: `rgba(var(--button-activation-color-rgb, ${this.activationColorRgb}), 0.5)`,
                background: `rgba(var(--button-activation-color-rgb, ${this.activationColorRgb}), var(--button-activation-opacity, 0.3))`,
            },
            {
                borderColor: `rgba(var(--button-activation-color-rgb, ${this.activationColorRgb}), 0.5)`,
                background: `rgba(var(--button-activation-color-rgb, ${this.activationColorRgb}), 0.3)`,
                offset: 0.05,
            },
            {
                borderColor: `rgba(var(--button-activation-color-rgb, ${this.activationColorRgb}), 0.5)`,
                background: `rgba(var(--button-activation-color-rgb, ${this.activationColorRgb}), 1)`,
                offset: 0.4,
            },
            {
                borderColor: `rgba(var(--button-activation-color-rgb, ${this.activationColorRgb}), 0.5)`,
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

export { GazableSquareButtonElement };
