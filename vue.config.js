const path = require('path');

module.exports = {
    configureWebpack: config => {
        Object.assign(config, {
            resolve: {
                extensions: ['.js', '.vue', '.json'],
                alias: {
                    'vue$': 'vue/dist/vue.esm.js',
                    '@': path.resolve('src'),
                    'styles': path.resolve('src/assets/css')
                }
            }
        })
    },
    publicPath: process.env.NODE_ENV === 'production' ?
        '/vueshop/' :
        '/'
}