//webpack.config.js
const path = require('path')

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        main: './test/test2.ts', // main ts file
    },
    output: {
        path: path.resolve(__dirname, './Reddit'),
        filename: '[name]-bundle.js', // <--- Will be compiled to this single file
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
            },
        ],
    },
}
