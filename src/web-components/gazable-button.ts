export class GazableButtonElement extends HTMLElement {
   _activateTimeout: number | undefined = undefined;
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
      } else {
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

   #onClick = (e: MouseEvent) => {
      if (e.target === this) {
         this.onActivate();
      }
   };

   onActivate() {
      this.#onGazeOut();
   }

   startDwell() {
      if (this._activateTimeout) clearTimeout(this._activateTimeout);

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
      } else {
         this.removeAttribute('data-tdx-interactor');
      }
   }

   get dwellTime() {
      const dwellTime = Number(this.getAttribute('dwell-time') as string);
      if (!isNaN(dwellTime)) {
         if (dwellTime < 0) console.error(`'dwell-time' must be larger than zero`);
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
      const activationAnimationTime = Number(this.getAttribute('activation-animation-time') as string);
      if (!isNaN(activationAnimationTime)) {
         if (activationAnimationTime < 0) console.error(`'activation-animation-time' must be larger than zero`);
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
