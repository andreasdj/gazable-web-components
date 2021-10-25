import { GazableButtonElement } from './gazable-button.js';
import htmlTemplate from './gazable-square-button-template.html.js';

const gazableSquareButtonTemplate = document.createElement('template');
gazableSquareButtonTemplate.innerHTML = htmlTemplate;
class GazableSquareButtonElement extends GazableButtonElement {
    dwellAnimation = undefined;
    innerContent;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }).append(gazableSquareButtonTemplate.content.cloneNode(true));
        this.innerContent = this.shadowRoot?.querySelector('.inner-content');
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
                offset: 0.05,
            },
            {
                borderColor: `rgba(var(--button-activation-color, #59f), 0.5)`,
                background: `rgba(var(--button-activation-color, #59f), 1)`,
                offset: 0.4,
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

export { GazableSquareButtonElement };
