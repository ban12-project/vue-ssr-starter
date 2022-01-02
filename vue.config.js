const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = defineConfig({
  transpileDependencies: true,
  indexPath: 'index.template.html',
  chainWebpack: webpackConfig => {
    // 删除 HTML 相关的 webpack 插件
    webpackConfig.plugins.delete('html')

    // 用 cli 的模版会造成引入两次 script
    // 保留模版中的 vue-ssr-outlet
    // webpackConfig.when(process.env.NODE_ENV === 'production', webpackConfig => {
    //   webpackConfig.plugin('html').tap(args => {
    //     // https://github.com/jantimon/html-webpack-plugin#minification
    //     args[0].minify = {
    //       collapseWhitespace: true,
    //       keepClosingSlash: true,
    //       removeComments: true,
    //       removeRedundantAttributes: true,
    //       removeScriptTypeAttributes: true,
    //       removeStyleLinkTypeAttributes: true,
    //       useShortDoctype: true,
    //       ignoreCustomComments: [/vue-ssr-outlet/],
    //     }
    //     return args
    //   })
    // })

    // 我们需要禁用 cache loader，否则客户端构建版本会从服务端构建版本使用缓存过的组件
    webpackConfig.module.rule('vue').uses.delete('cache-loader')
    webpackConfig.module.rule('js').uses.delete('cache-loader')
    webpackConfig.module.rule('ts').uses.delete('cache-loader')
    webpackConfig.module.rule('tsx').uses.delete('cache-loader')

    if (!process.env.SSR) {
      // 将入口指向应用的客户端入口文件
      webpackConfig.entry('app').clear().add('./src/entry-client.js')

      // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
      // 以便可以在之后正确注入异步 chunk。
      // 这也为你的 应用程序/vendor 代码提供了更好的缓存。
      webpackConfig.plugin('manifest').use(
        new webpack.optimize.SplitChunksPlugin({
          name: 'manifest',
          minChunks: Infinity,
        }),
      )

      // 此插件在输出目录中
      // 生成 `vue-ssr-client-manifest.json`。
      webpackConfig.plugin('VueSSRClient').use(new VueSSRClientPlugin())

      return
    }

    // 将入口指向应用的服务端入口文件
    webpackConfig.entry('app').clear().add('./src/entry-server.js')

    // 这允许 webpack 以适合于 Node 的方式处理动态导入，
    // 同时也告诉 `vue-loader` 在编译 Vue 组件的时候抛出面向服务端的代码。
    webpackConfig.target('node')
    // 这会告诉服务端的包使用 Node 风格的导出
    webpackConfig.output.libraryTarget('commonjs2')

    webpackConfig
      .plugin('vue-loader')
      .tap(args => [...args, { optimizeSSR: false }])

    // webpackConfig
    //   .plugin('manifest')
    //   .use(new WebpackManifestPlugin({ fileName: 'ssr-manifest.json' }))

    // https://webpack.js.org/configuration/externals/#function
    // https://github.com/liady/webpack-node-externals
    // 将应用依赖变为外部扩展。
    // 这使得服务端构建更加快速并生成更小的包文件。

    // 不要将需要被 webpack 处理的依赖变为外部扩展
    // 也应该把修改 `global` 的依赖 (例如各种 polyfill) 整理成一个白名单
    webpackConfig.externals(nodeExternals({ allowlist: /\.(css|vue)$/ }))

    webpackConfig.optimization.splitChunks(false).minimize(false)

    webpackConfig.plugins.delete('preload')
    webpackConfig.plugins.delete('prefetch')
    webpackConfig.plugins.delete('progress')
    webpackConfig.plugins.delete('friendly-errors')

    webpackConfig.plugin('limit').use(
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    )

    // 这是将服务器的整个输出
    // 构建为单个 JSON 文件的插件。
    // 默认文件名为 `vue-ssr-server-bundle.json`
    webpackConfig.plugin('VueSSRServer').use(new VueSSRServerPlugin())
  },
})
