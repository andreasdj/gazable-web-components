import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import html from 'rollup-plugin-html';

const PACKAGE_ROOT_PATH = process.cwd();
const input = `${PACKAGE_ROOT_PATH}/src/main.ts`;

export default [
   {
      input,
      output: [
         {
            exports: 'named',
            dir: 'dist',
            format: 'esm',
            preserveModules: true,
         },
      ],
      plugins: [
         resolve(),
         html({ include: '**/*.html' }),
         typescript({
            tsconfig: `${PACKAGE_ROOT_PATH}/tsconfig.json`,
         }),
      ],
   },
   {
      input,
      output: [
         {
            file: 'dist/bundle.esm.js',
            format: 'esm',
         },
      ],
      plugins: [
         resolve(),
         html({ include: '**/*.html' }),
         typescript({
            tsconfig: `${PACKAGE_ROOT_PATH}/tsconfig.json`,
            declaration: false,
         }),
      ],
   },
];
