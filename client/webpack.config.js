var path = require('path');

var config = {
    entry: './main.js',
    
    output: {
        path:__dirname,
        filename: 'index.js',
    },
    
    devServer: {
        inline: true,
        port: 8090
    },
    
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                    
                query: {
                    presets: ['es2015', 'react', 'stage-0'],
                    plugins: [
                        'react-html-attrs',
                        'transform-class-properties',
                        'transform-decorators-legacy']
                }
            }, {
                test: /\.css/,
                // loaders: 'style!css!'
                loaders: ['style', 'css', 'sass'],
                // include: path.join(__dirname, 'client')
            }
        ]
    }
}

module.exports = config;
