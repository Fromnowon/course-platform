module.exports = {
  // 它支持webPack-dev-server的所有选项
  devServer: {
    host: "localhost",
    port: 8080, // 端口号
    https: false, // https:{type:Boolean}
    open: false, //配置自动启动浏览器
    // proxy: 'http://localhost:9001' // 配置跨域处理,只有一个代理

    // 配置多个代理
    // proxy: {
    //   "/api": {
    //     target: "http://127.0.0.1:9001", //目标主机 
    //     changeOrigin: true //需要虚拟主机站点 
    //   },
    // }
    proxy: {
      //配置跨域
      '/api': {
        target: "http://127.0.0.1:9001/",
        changOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  }
}