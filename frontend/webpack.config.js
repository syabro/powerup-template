const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './src/index',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'bundle.js'
    },
    // adding .ts and .tsx to resolve.extensions will help babel look for .ts and .tsx files to transpile
    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, './src/'),
        ],
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },

    module: {
        rules: [
            { test: /\.(ts|js)x?$/, exclude: /node_modules/, use: { loader: 'babel-loader' }, },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './assets/index.html' })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: false,
        port: 3000,
        open: false
    }
};
