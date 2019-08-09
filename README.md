### Node.js开发实战

部分内容代码和每章小结与练习的代码

==handlebars直接import会报错，需要在webpack中配置alias==
```
resolve: {
    alias: {
        handlebars: path.resolve(__dirname, '../../node_modules/handlebars/dist/handlebars.min.js')
    },
},
```
> Homebrew安装工具

1. 安装Homebrew: `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
2. 安装Java8: 
    - `brew tap adoptopenjdk/openjdk`
    - `brew cask install java8`
3. 安装ElasticSearch: `brew install ElasticSearch`
4. 安装JSON格式化jq: `brew install jq`

> ElasticSearch相关

1. 基于RESTful的NoSQL
2. `elasticsearch`启动, 默认`9200`端口

> curl相关

1. 下载解压文件
    - 下载: `curl -O http://www.gutenberg.org/cache/epub/feeds/rdf-files.tar.bz2`
    - 解压: `tar -xvjf rdf-files.tar.bz2`
2. 发送HTTP请求:
    - `curl -i`: 输出相应正文同时输出HTTP协议头信息
    - `curl -s`: 静默模式, 只输出响应正文
    - `curl -X [method]`: 设置请求方式 `GET/POST/PUT/DELETE...`
    
> chmod相关

1. chmod +x [file]: 赋予文件执行权限
