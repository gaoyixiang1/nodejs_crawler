const express = require('express');
const superagent = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const app = express();
let movies = [];
superagent.get('https://movie.douban.com/chart').end(function(err,res){
    if(err){
        console.log('fail')
    }else{
        movies = getMovies(res);
    }
})
let getMovies = (res)=>{
    let movies = [];
    let $ = cheerio.load(res.text);

    $('.item>td').each((index,ele)=>{
        let movie = {
            picture:$(ele).children().children().attr('src'),
            title:$(ele).next().children().children("a").text().replace(/[\r\n]/g,"").replace(/\ +/g,""),
            content:$(ele).next().children().children('.pl').text().replace(/[\r\n]/g,"").replace(/\ +/g,""),
            score:$(ele).next().children().children('.star').children('.rating_nums').text(),
            count:$(ele).next().children().children('.star').children('.pl').text()

        }
        if(movie.title!=''){
            movies.push(movie)
        }
    })
    return movies;
}
app.get('/',async (req,res,next)=>{
    fs.writeFile(path.resolve(__dirname, 'data.json'), 
         JSON.stringify(movies) 
         , () => {
             console.log("保存成功")
         })
         res.send(movies)
 })
app.listen(4000,function(){
    console.log('http://localhost:4000')
})