import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

const env = process.env.NODE_ENV;

const config = {
  input: 'src/index.js',
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};

if (env === 'es' || env === 'cjs') {
  config.output = { format: env, indent: false };
  config.external = ['robust-point-in-polygon'];
}

if (env === 'development' || env === 'production') {
  config.output = {
    format: 'umd',
    name: 'fernandezPolygonDecomposition',
    exports: 'named',
  };

  config.plugins.push(
    nodeResolve({
      mainFields: ['jsnext:main', 'module', 'main']
    }),
    commonjs()
  );
}

if (env === 'production') {
  config.plugins.push(
    terser()
  );
}

export default config;
