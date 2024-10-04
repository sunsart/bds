// 라우터 객체
let router = require('express').Router();

// nodejs 와 mysql 접속
var mysql = require('mysql');
var conn = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DATABASE
});
conn.connect();

//-----------------------------------------//

// 매물찾아요 리스트 페이지
router.get('/find_list', function(req, res) {
  let currentPage = req.query.page; // 현재 보여지는 페이지
  if(!currentPage) currentPage = 1; // page 파라미터 값을 넘겨주지 않을 시, 1페이지로 설정
  let postPerPage = 10; // 한 페이지에 보여질 게시물 수
  let btnPerPage = 5;  // 한 페이지에 보여질 페이지 버튼의 개수 

  let totalPostCnt = 0; // 전체 게시물 수
  let sql = "SELECT COUNT(*) AS findCount FROM find";
  conn.query(sql, function(err, rows) {
    if(err) throw err;
    totalPostCnt = rows[0].findCount;
    console.log("전체 게시물 개수 = " + totalPostCnt);

    if(totalPostCnt <= 0)
      totalPostCnt = 1

    let totalPage = Math.ceil(totalPostCnt / postPerPage); // 전체 페이지 수 (ceil 소수점 올림)
    let totalSet = Math.ceil(totalPage / btnPerPage);     // 전체 세트 수 (5페이지가 한 세트)
    let currentSet = Math.ceil(currentPage / btnPerPage); // 현재 세트 번호 
    let startPage = ((currentSet-1) * btnPerPage) + 1;    // 시작 페이지 번호
    let endPage = (startPage + btnPerPage) - 1;           // 끝 페이지 번호
    let startPost = '';  // 시작 게시글 번호

    // sql 문에 들어갈 offset 설정
    if(currentPage <= 0)
      startPost = 0
    else 
      startPost = (currentPage - 1) * postPerPage // 시작 게시글 번호 설정

    // console.log("현재 페이지 = " + currentPage);
    // console.log("현재 세트 = " + currentSet);
    // console.log("현재 세트의 시작 페이지 = " + startPage);
    // console.log("현재 세트의 끝 페이지 = " + endPage);
    // console.log("현재 페이지의 시작 게시글 번호 = " + startPost);
    // console.log("============================");
    
    let sql2 = "SELECT id, title, content, user_id, user_nickname, post_date, hit, ( \
                SELECT count(*) \
                FROM find_comment AS fc \
                WHERE fc.find_id = f.id) AS commentCount \
                FROM find AS f \
                ORDER BY id DESC LIMIT ? OFFSET ? ";

    let params = [postPerPage, startPost];
    let data = []; 
    conn.query(sql2, params, function(err, rows) {
      if(err) throw err;
      for(let i=0; i<rows.length; i++) {
        let node = {
          'id' : rows[i].id,
          'title' : rows[i].title,
          'user_nickname' : rows[i].user_nickname,
          'post_date' : rows[i].post_date,
          'hit' : rows[i].hit,
          'commentCount' : rows[i].commentCount
        };
        data.push(node);
      }

      let paging = { // ejs로 전송하기위해 객체화
        'startPage' : startPage,
        'endPage' : endPage,
        'currentSet' : currentSet,
        'totalSet' : totalSet,
        'totalPage' : totalPage,
        'currentPage' : currentPage,
        'isSearchResult' : 'false',
      }

      res.render('find_list.ejs', {paging:paging, data:data, user:req.session.user})
    })
  })
})


// 매물찾아요 게시물등록 페이지
router.get('/find_write', function(req, res) {
  res.render('find_write.ejs', {user:req.session.user});
})


// 매물찾아요 게시물 등록
router.post('/find_post', function(req, res) {
  let title = req.body.title;
  let content = req.body.content;
  let user_id = req.session.user.id;
  let user_nickname = req.session.user.nickname;
  let post_date = postDate();

  let sql = "INSERT INTO find (title, content, user_id, user_nickname, post_date) VALUES (?, ?, ?, ?, ?)";
  let params = [title, content, user_id, user_nickname, post_date];
  conn.query(sql, params, function(err, result) {
    if(err)
      res.status(500).send();
    else  
      res.status(200).send("매물찾아요 게시물 등록성공");
  })
})


// 매물찾아요 게시물 내용보기 페이지
router.get('/find_detail/:id', async function(req, res) {
  // 조회수 카운트, 쿠키에 저장되어있는 값이 있는지 확인 (없을시 undefined 반환)
  let keyVal = "f_" + req.params.id;
  if (req.cookies[keyVal] == undefined) {
    // key, value, 옵션을 설정해준다.
    res.cookie(keyVal, getUserIP(req), {
      // 유효시간 : 1분  **테스트용 1분 / 출시용 1시간 3600000  
      maxAge: 60000
    })
    // 쿠키에 저장값이 없으면 조회수 1 증가
    let sql = "UPDATE find SET hit=find.hit+1 WHERE id=?";
    let params = [req.params.id];
    conn.query(sql, params, function(err, result) {
      if(err) throw err;
    })
  }

  // 쿠키에 client ip 저장값이 있으면 조회수 증가하지 않고, 내용을 보여줌
  let sql = " SELECT f.id, f.title, f.content, f.user_id, f.user_nickname, \
              fc.idx, fc.comment, fc.commenter_id, fc.commenter_nickname, fc.post_date, fc.find_id, fc.response_to \
              FROM find AS f LEFT OUTER JOIN find_comment AS fc \
              ON f.id = fc.find_id \
              WHERE f.id = ? ";
  let params = req.params.id;
  conn.query(sql, params, function(err, rows) {
    if(err) throw err;
    res.render('find_detail.ejs', {data:rows, user:req.session.user});
  })
})


// 매물찾아요 게시물 수정
router.post('/find_edit', function(req, res) {
  let id = req.body.id;
  let title = req.body.title;
  let content = req.body.content;
  let post_date = postDate();

  let sql = "UPDATE find SET title=?, content=?, post_date=? WHERE id=?";
  let params = [title, content, post_date, id]
  conn.query(sql, params, function(err, result) {
    if(err)
      res.status(500).send();
    else  
      res.status(200).send("매물찾아요 게시물 수정 성공");
  })
})


// 매물찾아요 게시물 삭제
router.post('/find_delete', function(req, res) {
  let id = req.body.id;
  let sql = "DELETE FROM find WHERE id = ?";
  conn.query(sql, id, function(err, result) {
    if(err)
      res.status(500).send();
    else  
      res.status(200).send("매물찾아요 게시물 삭제 성공");
  })
})


// 매물찾아요 댓글,답글 등록 insert
router.post('/find_response_post', function(req, res) {
  let comment = req.body.content; // 댓글 내용
  let find_id = req.body.find_id; // 댓글이 등록되는 게시물의 인덱스
  let response_to = req.body.response_to;  // 상위 댓글의 인덱스
  let commenter_id = req.session.user.id;
  let commenter_nickname = req.session.user.nickname;
  let post_date = postDate();
  let sql = "INSERT INTO find_comment (comment, commenter_id, commenter_nickname, post_date, find_id, response_to) VALUES (?, ?, ?, ?, ?, ?)";
  let params = [comment, commenter_id, commenter_nickname, post_date, find_id, response_to];
  conn.query(sql, params, function(err, result) {
    if(err)
      res.status(500).send();
    else  
      res.status(200).send("매물찾아요 답글 등록성공");
  })
})


// 매물찾아요 답글 수정 edit
router.post('/find_response_edit', function(req, res) {
  let idx = req.body.idx; // 답글 idx
  let comment = req.body.content; // 댓글 내용
  let sql = "UPDATE find_comment SET comment=? WHERE idx=?";
  let params = [comment, idx]
  conn.query(sql, params, function(err, result) {
    if(err)
      res.status(500).send();
    else  
      res.status(200).send("매물찾아요 답글 수정 성공");
  })
})


// 질문답변 댓글&답글 삭제
router.post('/find_comment_delete', function(req, res) {
  let idx = req.body.idx;
  let sql = "DELETE FROM find_comment WHERE idx = ?";
  conn.query(sql, idx, function(err, result) {
    if(err)
      res.status(500).send();
    else  
      res.status(200).send("매물찾아요 댓글답글 삭제 성공");
  })
})


//현재 날짜 가져오기
function postDate() {
  const today = new Date();
  const year = today.toLocaleDateString('en-US', {year: 'numeric',});
  const month = today.toLocaleDateString('en-US', {month: '2-digit',});
  const day = today.toLocaleDateString('en-US', {day: '2-digit',});
  return `${year}-${month}-${day}`;
}

// client ip를 가져오는 함수 (조회수 카운트)
function getUserIP(req) {
  const addr = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  return addr
}


//router 변수를 외부 노출
module.exports = router;