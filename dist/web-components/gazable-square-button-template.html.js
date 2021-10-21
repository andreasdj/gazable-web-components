var htmlTemplate = "<style>\n  :host {\n      display: inline-block;\n      /* border: 1px solid transparent; */\n      position: relative;\n      border-radius: var(--button-border-radius, 3px);\n      box-sizing: border-box;\n      width: var(--button-width, 13.5vw);\n      height: var(--button-height, 5.4vw);\n      background-color: var(--button-color, transparent);\n      padding: var(--button-dwell-thickness, 0.405vw); /* $square-button-height * 0.075; */\n      -webkit-tap-highlight-color: transparent;\n    }\n\n    :host([disabled]) {\n      cursor: default;\n      pointer-events: none;\n      opacity: var(--button-disabled-opacity, 0.5);\n    }\n\n    :host([gaze-focused]) {\n      /* border-radius: 0; */\n    }\n    \n    :host([gaze-focused]) {\n      background: linear-gradient(to left, var(--button-color, #999) 50%, var(--button-dwell-color, #59f) 50%);\n      background-size: 200% 200%;\n      background-repeat: repeat-y;\n      background-position: right bottom;\n      /* animation: square-dwell-animation linear forwards var(--dwell-time, 300ms); */\n    }\n\n    :host([gaze-activated]) {\n      border-radius: var(--button-border-radius, 3px);\n      /* animation: backgroundActivationAnimation var(--activation-animation-time, 150)ms; */\n    }\n\n    /* @keyframes backgroundActivationAnimation {\n      0% {\n        border: 0px;\n      }\n\n      50% {\n        border: 5px solid transparent;\n        background-color: transparent;\n      }\n\n      75% {\n        border: 0px;\n        background-color: rgba(var(--button-activation-color, #59f), var(--button-activation-opacity, 0.3));\n      }\n\n      100% {\n        background-color: transparent;\n      }\n    } */\n\n    .inner-content {\n      color: var(--button-text-color, #fff);\n      position: relative;\n      font-size: var(--button-font-size, 1vw);\n      width: 100%;\n      height: 100%;\n      border-radius: var(--button-border-radius, 3px);\n      box-sizing: border-box;\n      /* border: var(--button-inner-border-width, 1px) solid var(--button-inner-border-color, #fff); */\n      background-color: var(--button-inner-color, #222);\n    }\n\n    :host([disabled]) .inner-content {\n      border-color: transparent;\n      background-color: var(--button-inner-disabled-color, #999);\n      color: var(--button-text-disabled-color, #ff0);\n    }\n\n    :host([gaze-activated]) .inner-content {\n      color: var(--button-activation-text-color, #222);\n      border-color: transparent;\n      animation: activationAnimation var(--activation-animation-time, 150)ms ease forwards;\n    }\n\n    :host([gaze-focused]) .inner-content {\n      border-color: var(--button-focus-border-color, #59f);\n      border-width: var(--button-inner-border-width, 1px);\n      border-radius: var(--button-focus-border-radius, 0);\n    }\n\n    .inner-content slot {\n      height: 100%;\n      width: 100%;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    }\n\n    @keyframes square-dwell-animation {\n      from {\n        background-position: right bottom;\n      }\n      to {\n        background-position: left bottom;\n      }\n    }\n</style>\n\n<div class=\"inner-content\">\n  <slot></slot>\n</div>";

export { htmlTemplate as default };