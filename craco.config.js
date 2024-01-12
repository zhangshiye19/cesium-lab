// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const path = require('path');
// import path from 'path';
const path = require('path')
const webpack = require('webpack');
// const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

// import webpack from 'webpack'

const CopyWebpackPlugin = require('copy-webpack-plugin');
const { Z_FILTERED } = require('zlib');

// The path to the CesiumJS source code
const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';

module.exports = {
    babel: {
        // plugins: ['react-refresh/babel'],
    },
    webpack: {
        alias: {
            "@": path.join(__dirname, "src")
        },
        configure: {
            resolve: {
                fallback: {
                    url: false,
                    zlib: false,
                    https: false,
                    http: false,
                    buffer: false,
                    util: false,
                    stream: false,
                    assert: false
                    // "url": require.resolve("url/"),
                    // "zlib": require.resolve("browserify-zlib"),
                    // "https": require.resolve("https-browserify"),
                    // "http": require.resolve('stream-http'),
                    // "buffer": require.resolve("buffer/"),
                    // "assert": require.resolve("assert/"),
                    // "util": require.resolve("util/"),
                    // "stream": require.resolve("stream-browserify"),
                    // 'react/jsx-runtime': require.resolve('react/jsx-runtime.js'),
                    // 'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime.js')
                }
            },
            ignoreWarnings: [
                function ignoreSourcemapsloaderWarnings(warning) {
                    return (
                        warning.module &&
                        warning.module.resource.includes('node_modules') &&
                        warning.details &&
                        warning.details.includes('source-map-loader')
                    )
                },
            ],
        },
        // configure:  (webpackConfig, { env, paths }) => { return webpackConfig; },
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
                    CESIUM_BASE_URL: JSON.stringify('/')
                })
            ],
        },
    },
}