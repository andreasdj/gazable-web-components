import { GazableButtonElement } from './gazable-button';

// There is not option currently to define a module relative css url, use import.meta.url to overcome this
// const cssUrl = import.meta.url.replace(/\.js$/, '.css');

const gazableSquareButtonTemplate = document.createElement('template');
gazableSquareButtonTemplate.innerHTML = `
  <link href="gazable-square-button.css" rel="stylesheet">
  <div class="inner-content"><slot></slot></div>`;

export class GazableSquareButtonElement extends GazableButtonElement {
   dwellAnimation: Animation | undefined = undefined;
   innerContent: HTMLElement;
   
   constructor() {
      super();

      this.attachShadow({ mode: 'open' }).append(gazableSquareButtonTemplate.content.cloneNode(true));
      this.innerContent = this.getElementsByClassName('inner-content')[0] as HTMLElement;
   }

   startActivationAnimation(){
    this.animate([
      {border:'0px'},
      {border:'5px solid transparent',backgroundColor:'transparent', offset: 0.5},
      {border:'0px',backgroundColor:'rgba(var(--button-activation-color, #59f), var(--button-activation-opacity, 0.3))', offset: 0.75},
      {backgroundColor: 'transparent'}
    ],
    {
      duration: this.activationAnimationTime
    });

    this.innerContent.animate(
      [
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
      ],
      {
         duration: this.activationAnimationTime,
         easing: 'ease',
         fill: 'backwards',
      }
   );
  }
  onActivate(){
    this.startActivationAnimation();
    super.onActivate();
  }

  startDwell() {
    this.dwellAnimation = this.animate(
      [
        { backgroundPosition: 'right bottom' },
        { backgroundPosition: 'left bottom' }
      ],
      {
        duration: this.dwellTime,
        iterations: 1,
        easing: 'linear',
        fill: 'none'
      }
    );

    // this.dwellAnimation.oncancel = (e)=> console.log('oncancel', e);
    this.dwellAnimation.onfinish = (e) => this.click();
  }

  stopDwell(){
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
    // 1. instantiate the element’s “internals”
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