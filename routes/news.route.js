// 라우터 객체
let router = require('express').Router();

// nodejs 와 mysql 접속
// var mysql = require('mysql');
// var conn = mysql.createConnection({
//   host: process.env.HOST,
//   user: process.env.USER,
//   password: process.env.PASS,
//   database: process.env.DATABASE
// });
// conn.connect();

// HTML을 가져올 때 사용할 라이브러리
const axios = require("axios");

// Axios의 결과로 받은 데이터에서 필요한 데이터를 추출하는데 사용하는 라이브러리
const cheerio = require("cheerio");

// 다음메인페이지 > 키워드 '부동산' 검색 > 뉴스 카테고리
// router.get('/news', function(req, res) {
//   getHtml()
//   .then(html => {
//     let ulList = [];
//     const $ = cheerio.load(html.data);
//     const $bodyList = $("div.card_comp ul").children("li");
//     //console.log("length = " + $bodyList.length);
//     //console.log("html = " + $bodyList.html());

//     $bodyList.each(function(i, elem) {
//       ulList[i] = {
//         title: $(this).find('strong.tit-g a').text(),
//         url: $(this).find('strong.tit-g a').attr('href'),
//         summary: $(this).find('p.conts-desc a').text(),
//         press: $(this).find('strong.tit_item span').text(),
//         date: $(this).find('span.gem-subinfo span').text(),
//       };
//     });

//     const data = ulList.filter(n => n.title);
//     res.render('news.ejs', {data:data, user:req.session.user})
//   }) 
// })


var client_id = 'UCPd6NScXC6etz7MVjV5';
var client_secret = 'L0vH_jnAQa';

router.get('/news', function (req, res) {
   // var api_url = 'https://openapi.naver.com/v1/search/blog?query=' + encodeURI(req.query.query); // JSON 결과
   var api_url = 'https://land.naver.com/news/headline.naver';
   var request = require('request');
   var options = {
       url: api_url,
       headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
    };
   request.get(options, function (error, response, body) {
     if (!error && response.statusCode == 200) {
       res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
       res.end(body);
     } else {
       res.status(response.statusCode).end();
       console.log('error = ' + response.statusCode);
     }
   });
 });


// const getHtml = async () => {
//   try {
//     return await axios.get("https://search.daum.net/search?w=news&nil_search=btn&DA=NTB&enc=utf8&cluster=y&cluster_page=1&q=%EB%B6%80%EB%8F%99%EC%82%B0");
//     //return await axios.get("https://land.naver.com/news/headline.naver");
//   } catch (error) {
//     console.error(error);
//   }
// };

// const getHtml2 = async () => {
//   try {
//     return await axios.get("https://search.daum.net/search?w=news&nil_search=btn&DA=NTB&enc=utf8&cluster=y&cluster_page=1&q=%EB%B6%80%EB%8F%99%EC%82%B0&p=2");
//   } catch (error) {
//     console.error(error);
//   }
// };

// router 변수를 외부 노출
module.exports = router;