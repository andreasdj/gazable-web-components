import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import html from 'rollup-plugin-html';

const PACKAGE_ROOT_PATH = process.cwd();

export default {
   input: `${PACKAGE_ROOT_PATH}/src/main.ts`,
   output: {
      exports: 'named',
      dir: 'dist',
      format: 'esm',
      preserveModules: true,
   },
   plugins: [
      resolve(),
      html({
         include: '**/*.html',
      }),
      typescript({
         tsconfig: `${PACKAGE_ROOT_PATH}/tsconfig.json`,
      }),
   ],
};
