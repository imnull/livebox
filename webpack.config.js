const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')

// const ESBuildRule = {
//     test: /\.[jt]sx?$/,
//     use: [
//         {
//             loader: 'esbuild-loader',
//             options: {
//                 tsconfig: './tsconfig.json',
//                 // jsx: 'react-jsx'
//             }
//         }
//     ]
// }

// const BabelRule = {
//     test: /\.[jt]sx?$/,
//     use: [
//         {
//             loader: 'babel-loader',
//             options: {
//                 presets: [
//                     ['@babel/preset-react', {
//                         runtime: 'automatic'
//                     }],
//                     '@babel/preset-typescript'
//                 ],
//             },
//         }
//     ],
//     exclude: /\/electron|\/dist/,
// }

module.exports = (options) => {

    const { WEBPACK_SERVE = false, target = 'dist', client = '' } = options
    const mode = WEBPACK_SERVE ? 'development' : 'production'
    const port = 9811


    return {
        mode,
        entry: path.resolve('src/index'),
        output: {
            path: path.resolve(target),
            filename: 'index.js',
            // libraryTarget: 'commonjs2',
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.jsx', '.js'],
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '~': path.resolve(__dirname, 'src'),
            },
        },
        module: {
            rules: [
                {
                    test: /\.[jt]sx?$/,
                    use: [
                        {
                            loader: 'esbuild-loader',
                            options: {
                                // tsconfig: './tsconfig.json',
                                // jsx: 'react-jsx'
                            }
                        }
                    ]
                },
                {
                    test: /\.(css|s[ac]ss)$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.(svg|png|jpe?g|gif)$/i,
                    use: ['file-loader']
                },
            ]
        },
        plugins: [
            new CleanWebpackPlugin({
                verbose: true
            }),
            new HTMLWebpackPlugin({
                template: path.resolve(__dirname, 'src/template.html'),
                filename: 'index.html',
                inject: 'body',
                hash: true,
                title: 'WebRTC',
            })
        ],
        devServer: {
            port,
            hot: true,
            open: true,
            static: {
                directory: client === 'ebuy' ? path.resolve('public/snapp') : path.resolve('public')
            }
        },
    }
}