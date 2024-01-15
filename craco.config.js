const path = require('path')

const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const {whenDev} = require("@craco/craco");

// The path to the CesiumJS source code
const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';

module.exports = {
    babel: {
        // plugins: ['react-refresh/babel'],
    },
    devServer: {
        port: 3001
    },
    webpack: {
        alias: {
            "@": path.join(__dirname, "src")
        },
        configure: (webpackConfig, {env, paths}) => {

            // console.log(env)

            // webpackConfig.ignoreWarnings = [
            //     function ignoreSourcemapsloaderWarnings(warning) {
            //         return (
            //             warning.module &&
            //             warning.module.resource.includes('node_modules') &&
            //             warning.details &&
            //             warning.details.includes('source-map-loader')
            //         )
            //     },
            // ]

            //resolve
            webpackConfig.resolve.fallback = {
                url: false,
                zlib: false,
                https: false,
                http: false,
                buffer: false,
                util: false,
                stream: false,
                assert: false
            }

            webpackConfig.module.rules[1].oneOf = [
                ...[
                    {
                        test: /.svg$/,
                        // include: path.resolve('./src/static/svg'),
                        use: [
                            {
                                loader: '@svgr/webpack',
                                options: {
                                    icon: true
                                }
                            },
                        ],
                    },
                ],
                ...webpackConfig.module.rules[1].oneOf
            ]
            return webpackConfig;
        },
        plugins: {
            add: [
                // new ReactRefreshWebpackPlugin(),
                new CopyWebpackPlugin({
                    patterns: [
                        {from: path.join(cesiumSource, cesiumWorkers), to: 'Workers'},
                        {from: path.join(cesiumSource, 'Assets'), to: 'Assets'},
                        {from: path.join(cesiumSource, 'Widgets'), to: 'Widgets'}
                    ]
                }),
                new webpack.DefinePlugin({
                    // Define relative base path in cesium for loading assets
                    CESIUM_BASE_URL: JSON.stringify(whenDev(() => '/', '/clab'))
                })
            ],
        },
    },
}
