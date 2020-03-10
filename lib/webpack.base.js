const glob = require('glob');
const path = require('path');

const autoprefixer = require('autoprefixer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 目录清理
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成html文件
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin'); // 命令行信息显示
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // css单独提取一个文件

const projectRoot = process.cwd(); // 进入当前目录

// 3. 多页面打包
const setMPA = () => {
    const entry = {};
    const htmlWebpackPlugins = [];
    const entryFiles = glob.sync(path.join(projectRoot, './src/*/index.js'));

    Object.keys(entryFiles)
        .map((index) => {
            const entryFile = entryFiles[index];

            const match = entryFile.match(/src\/(.*)\/index\.js/);
            const pageName = match && match[1];

            entry[pageName] = entryFile;
            return htmlWebpackPlugins.push(
                new HtmlWebpackPlugin({
                    template: path.join(projectRoot, `./src/${pageName}/index.html`),
                    filename: `${pageName}.html`,
                    chunks: ['commons', pageName],
                    inject: true,
                    minify: {
                        html5: true,
                        collapseWhitespace: true,
                        preserveLineBreaks: false,
                        minifyCSS: true,
                        minifyJS: true,
                        removeComments: false,
                    },
                }),
            );
        });
    return {
        entry,
        htmlWebpackPlugins,
    };
};
const { entry, htmlWebpackPlugins } = setMPA();


module.exports = {
    entry,
    output: {
        path: path.join(projectRoot, 'dist'),
        filename: '[name]_[chunkhash:8].js',
    },
    module: { // 1. 资源解析
        rules: [
            {
                test: /\.js$/,
                use: [
                    'babel-loader',
                ],
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'px2rem-loader',
                        options: {
                            remUni: 75,
                            remPrecision: 8,
                        },
                    },
                    'sass-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                autoprefixer({
                                    overrideBrowserslist: ['> 1%', 'last 2 versions'],
                                }),
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]_[hash:8].[ext]',
                        },
                    },
                ],
            },
            {
                test: /.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]_[hash:8].[ext]',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({ // 6. css单独提取一个文件出来
            filename: '[name]_[contenthash:8].css',
        }),
        new CleanWebpackPlugin(), // 2. 目录清理
        new FriendlyErrorsWebpackPlugin(), // 4. 命令行信息显示优化
        function errorPlugin() { // 5. 错误捕获和处理
            this.hooks.done.tap('done', (stats) => {
                if (
                    stats.compilation.errors
          && stats.compilation.errors.length && process.argv.indexOf('- -watch') === -1) {
          console.log('build error'); // eslint-disable-line
                    process.exit(1);
                }
            });
        },
    ].concat(htmlWebpackPlugins),
    stats: 'errors-only',
};
