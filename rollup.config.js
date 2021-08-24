import {terser} from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const plugins = [typescript({
  tsconfig: './tsconfig.json',
  exclude: ['test/**', 'example/**']
})];
if (isDev === false) {
  plugins.push(terser());
}

export default {
  input: './src/index.ts',
  output: [
    {
      sourcemap: isDev,
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
    },
    {
      sourcemap: isDev,
      file: pkg.module,
      format: 'esm',
    },
  ],
  plugins,
};
