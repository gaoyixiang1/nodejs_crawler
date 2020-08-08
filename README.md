
## nodejs爬虫简单实现
## [版本一](https://www.jianshu.com/p/d68db2a31e65) index.js--->index.json
#### 本次将会用到两个库：superagent 和cheerio
其中 superagent是用来请求目标库的数据，cheerio是用来获取数据的，这个库很好用，可以说是node版的jQuery
```
superagent.get(url).end((err,res)=>{
   if(err){
   return console.log(err)
   }
   else{
    movie = getMovies(res)
    }
})

```
此处要封装一个getMovies的函数


## [版本二](https://www.jianshu.com/p/96141205422a) page.js--->page.json 可以获取分页数据
## 分析
在爬取之前，着重观察点击分页符，地址栏的变化，在这个页面呢，可以发现每次点击一个，后面会有`start =num  &filter=`，这个num每次递增25
```
点击页码2：https://movie.douban.com/top250?start=25&filter=
点击页码3：https://movie.douban.com/top250?start=50&filter=
点击页码4：https://movie.douban.com/top250?start=75&filter=
```
接着在地址栏输入了`https://movie.douban.com/top250?start=0&filter=`
发现可以访问，并且显示内容与`https://movie.douban.com/top250`一致

## 思路
地址栏这么有规律，因此可以使用递归的方法，封装一个函数，可以在`superagent`的方法里面传入动态`url`，将获取到的数据 `push`进数组后，判断它是不是`https://movie.douban.com/top250?start=225&filter=`(因为这个是最后一页了)
如果是的话，就结束了，否则，继续调用函数
## 注意
数据采用追加`fs.appendFile()`的方式，因为写入的话数据会被覆盖的
本次采用的依旧是`superagent`+`cheerio`


