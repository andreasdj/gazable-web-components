import { GazableButtonElement } from './gazable-button';
import htmlTemplate from './gazable-square-button-template.html';

const gazableSquareButtonTemplate = document.createElement('template');
gazableSquareButtonTemplate.innerHTML = htmlTemplate;

export class GazableSquareButtonElement extends GazableButtonElement {
   dwellAnimation: Animation | undefined = undefined;
   innerContent: HTMLElement;
   activationColorRgb = '146, 188, 255'; //#92bcff

   constructor() {
      super();

      this.attachShadow({ mode: 'open' }).append(gazableSquareButtonTemplate.content.cloneNode(true));
      this.innerContent = this.shadowRoot?.querySelector('.inner-content') as HTMLElement;
   }

   startActivationAnimation() {
      const activationAnimation = this.animate(
         [
            { border: '0px' },
            { border: '5px solid transparent', backgroundColor: 'transparent', offset: 0.5 },
            {
               border: '0px',
               backgroundColor: `rgba(var(--button-activation-color-rgb, ${this.activationColorRgb}), var(--button-activation-opacity, 0.3))`,
               offset: 0.75,
            },
            { backgroundColor: 'transparent' },
         ],
         {
            duration: this.activationAnimationTime,
         }
      );

      this.setAttribute('gaze-activated', '');
      activationAnimation.oncancel = () => this.removeAttribute('gaze-activated');
      activationAnimation.onfinish = () => this.removeAttribute('gaze-activated');

      this.innerContent.animate(
         [
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
         ],
         {
            duration: this.activationAnimationTime,
            easing: 'ease',
            fill: 'backwards',
         }
      );
   }

   override onActivate() {
      this.startActivationAnimation();
      super.onActivate();
   }

   override startDwell() {
      this.dwellAnimation = this.animate(
         [{ backgroundPosition: 'right bottom' }, { backgroundPosition: 'left bottom' }],
         {
            duration: this.dwellTime,
            iterations: 1,
            easing: 'linear',
            fill: 'none',
         }
      );

      // this.dwellAnimation.oncancel = (e)=> console.log('oncancel', e);
      this.dwellAnimation.onfinish = () => this.click();
   }

   override stopDwell() {
      this.dwellAnimation?.cancel();
      this.dwellAnimation = undefined;
   }
}
if (!customElements.get('gazable-square-button')) {
   customElements.define('gazable-square-button', GazableSquareButtonElement);
}

/*
  https://css-tricks.com/custom-state-pseudo-classes-in-chrome/

  ctor
    // 1. instantiate the element???s ???internals???
    this._internals = this.attachInternals();

    // (other code)
  }

  // 2. toggle a custom state
  set checked(flag) {
    if (flag) {
      this._internals.states.add("--checked");
    } else {
      this._internals.states.delete("--checked");
    }
  }
*/
