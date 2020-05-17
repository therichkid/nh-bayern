module.exports = {
  transpileDependencies: ["vuetify"],
  productionSourceMap: false,
  configureWebpack: {
    optimization: {
      splitChunks: {
        minSize: 150000,
        maxSize: 250000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all"
          }
        }
      }
    }
  }
};
