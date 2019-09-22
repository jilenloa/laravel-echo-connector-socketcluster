import typescript from 'rollup-plugin-typescript';
import babel from 'rollup-plugin-babel';

export default {
    input: './src/echo-connector-socketcluster.ts',
    output: [
        { file: './dist/echo-connector-socketcluster.js', format: 'esm' },
        { file: './dist/echo-connector-socketcluster.common.js', format: 'cjs' },
        { file: './dist/echo-connector-socketcluster.iife.js', format: 'iife', name: 'EchoConnector' },
    ],
    plugins: [
        typescript(),
        babel({
            exclude: 'node_modules/**',
            presets: ['es2015-rollup', 'stage-2'],
            plugins: ['transform-object-assign'],
        }),
    ],
};
