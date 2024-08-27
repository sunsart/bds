// 라우터 객체
let router = require('express').Router();

// HTML을 가져올 때 사용할 라이브러리
const axios = require("axios");

// Axios의 결과로 받은 데이터에서 필요한 데이터를 추출하는데 사용하는 라이브러리
const cheerio = require("cheerio");

// 다음메인페이지 > 키워드 '부동산' 검색 > 뉴스 카테고리 > 1,2페이지 크롤링
function getHtml() {
  return axios.get("https://search.daum.net/search?w=news&nil_search=btn&DA=NTB&enc=utf8&cluster=y&cluster_page=1&q=%EB%B6%80%EB%8F%99%EC%82%B0");
}

function getHtml2() {
  return axios.get("https://search.daum.net/search?w=news&nil_search=btn&DA=NTB&enc=utf8&cluster=y&cluster_page=1&q=%EB%B6%80%EB%8F%99%EC%82%B0&p=2");
}

router.get('/news', function(req, res) {
  axios.all([getHtml(), getHtml2()])
  .then(axios.spread((res1, res2) =>  {
    const html = res1.data + res2.data;
    let ulList = [];
    const $ = cheerio.load(html);
    const $bodyList = $("ul.c-list-basic").children("li");

    $bodyList.each(function(i, elem) {
      ulList[i] = {
        title: $(this).find('strong.tit-g a').text(),
        url: $(this).find('strong.tit-g a').attr('href'),
        //summary: $(this).find('p.conts-desc a').text(),
        press : $(this).find('div.inner_header a strong.tit_item span.txt_info').text(),
        //date: $(this).find('span.gem-subinfo span').text(),
      };
    });

    res.render('news.ejs', {data:ulList, user:req.session.user})
  }));
})

// router 변수를 외부 노출
module.exports = router;