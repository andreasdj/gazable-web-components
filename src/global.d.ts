export {};

declare global {
   interface Window {
      eyeTracking: {
         activationAnimationTime: number;
         systemDwellTime: number;
      };
   }
}
