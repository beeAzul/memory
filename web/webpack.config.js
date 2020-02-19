var path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Créé la balise `<style>` dans le dom et injecte notre CSS
                    'style-loader',
                    // traduit le CSS généré en JS (situé dans le fichier compilé ./assets/js/index.js
                    'css-loader',
                    // Compiles le Sass en CSS
                    'sass-loader',
                ]
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-object-rest-spread']
                    }
                }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: 'file-loader',
                options: {
                    outputPath: '../dist/images',
                }
           },
        ],
    },
};