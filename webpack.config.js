var webpack = require('webpack');
var path = require('path');
module.exports = {
    entry: {
        app: './src/game.ts',
    },
    output: {
        filename: './deploy/js/game.js'
    },
    module: {
        loaders: [
            {
                exclude: ["node_modules"],
                loader: 'ts-loader'
            },
        ]
    }
}
