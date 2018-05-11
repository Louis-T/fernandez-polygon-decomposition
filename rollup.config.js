import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const env = process.env.NODE_ENV;

const config = {
  input: 'src/index.js',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers'],
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
      jsnext: true
    }),
    commonjs(),
  );
}

if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  );
}

export default config;
