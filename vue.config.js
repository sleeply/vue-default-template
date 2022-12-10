const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')

module.exports = {
    runtimeCompiler: true,
    pluginOptions: {
        i18n: {
            locale: 'uz',
            fallbackLocale: 'uz',
            localeDir: 'locales',
            enableLegacy: false,
            runtimeOnly: false,
            compositionOnly: false,
            fullInstall: true
        }
    },
    // configureWebpack: {
    //   plugins: [
    //     new webpack.optimize.LimitChunkCountPlugin({
    //       maxChunks: 1,
    //     }),
    //   ],
    // }
}

if (process.env.NODE_ENV === 'production') {
    module.exports.chainWebpack = config => {
        // config.plugin("optimize-css").tap(([options]) => {
        //     options.cssnanoOptions.preset[1].calc = false;
        //     return [options];
        // });

        if (!process.env.SSR) {
            config.devServer.disableHostCheck(true);
            config.entry('app').clear().add('./src/main.js');
            return;
        }

        config.entry('app').clear().add('./src/main-server.js')

        config.target('node')
        config.output.libraryTarget('commonjs2')

        config.plugin('manifest').use(new WebpackManifestPlugin({ fileName: 'ssr-manifest.json' }))

        config.externals(nodeExternals({ allowlist: /\.(css|vue)$/ }))

        config.optimization.splitChunks(false).minimize(false)

        config.plugins.delete('hmr')
        config.plugins.delete('preload')
        config.plugins.delete('prefetch')
        config.plugins.delete('progress')
        config.plugins.delete('friendly-errors')

        config.plugin('limit').use(
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 1
            })
        )

        // console.log(config.toConfig())
    }
}
