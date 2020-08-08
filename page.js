var superagent = require('superagent');
var cheerio = require('cheerio');
var fs = require('fs');
var path = require('path')

var start = 0;
var url = 'https://movie.douban.com/top250?start=';
var end = '&filter='

function getMovies(url, start, end) {
    superagent.get(url + start + end)
        .end(function (err, res) {
            if (err) {
                return console.error(err);
            }

            var top250 = [];
            let $ = cheerio.load(res.text);

            $('li>.item>.info').each((index, ele) => {
                var movie = {
                    picture: $(ele).prev().find('img').attr('src'),
                    title: $(ele).children('.hd').text().replace(/[\r\n]/g, "").replace(/\ +/g, ""),
                    details: $(ele).children('.bd').find('.star').prev().text().replace(/[\r\n]/g, "").replace(/\ +/g, ""),
                    score: $(ele).children('.bd').find('.star').find('.rating_num').text(),
                    nums: $(ele).children('.bd').find('.star').find('.rating_num').next().next().text().replace(/[\r\n]/g, "").replace(/\ +/g, ""),
                    quote: $(ele).children('.bd').find('.quote').text().replace(/[\r\n]/g, "").replace(/\ +/g, ""),

                }
            top250.push(movie);
        })

    fs.appendFile(path.resolve(__dirname, 'page.json'),
        JSON.stringify(top250)
        , () => {
            console.log("保存成功")
        })
    if (start < 225) {
        getMovies(url, (start + 25), end);
    }
    else {
        console.log("爬取成功！");
    }
});

}

//开始爬取页面数据
getMovies(url, start, end);
