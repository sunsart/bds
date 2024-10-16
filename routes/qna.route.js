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


// 질문답변 리스트
router.get('/qna_list', function(req, res) {
  let currentPage = req.query.page; // 현재 보여지는 페이지
  if(!currentPage) currentPage = 1; // page 파라미터 값을 넘겨주지 않을 시, 1페이지로 설정
  let postPerPage = 10; // 한 페이지에 보여질 게시물 수
  let btnPerPage = 5;  // 한 페이지에 보여질 페이지 버튼의 개수 

  let totalPostCnt = 0; // 전체 게시물 수
  let sql = "SELECT COUNT(*) AS qnaCount FROM qna";
  conn.query(sql, function(err, rows) {
    if(err) throw err;
    totalPostCnt = rows[0].qnaCount;

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
    
    let sql2 = "SELECT id, title, content, user_id, user_nickname, post_date, hit, ( \
                SELECT count(*) \
                FROM qna_comment AS qc \
                WHERE qc.qna_id = q.id) AS commentCount \
                FROM qna AS q \
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
        'searchText' : ""
      }

      res.render('qna_list.ejs', {paging:paging, data:data, user:req.session.user})
    })
  })
})

// 질문답변 검색결과 리스트
router.get('/qna_search', function(req, res) {
  // 검색된 전체 게시물 개수 가져옴
  let currentPage = req.query.page; // 현재 보여지는 페이지
  if(!currentPage) currentPage = 1; // page 파라미터 값을 넘겨주지 않을 시, 1페이지로 설정
  let postPerPage = 10; // 한 페이지에 보여질 게시물 수
  let btnPerPage = 5;  // 한 페이지에 보여질 페이지 버튼의 개수 

  let totalPostCnt = 0;
  let find_text = req.query.search;
  let query = "%" + find_text +"%";

  let sql = "SELECT * FROM qna WHERE title LIKE ? OR content LIKE ?";
  let params = [query, query]; 
  conn.query(sql, params, function(err, rows) {
    if(err) throw err;
    totalPostCnt = rows.length;
    // console.log( '==="' + find_text + '"' + ' 검색된 게시물 개수 = ' + totalPostCnt);

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

    let sql2 = "SELECT id, title, content, user_id, user_nickname, post_date, hit, ( \
                SELECT count(*) \
                FROM qna_comment AS qc \
                WHERE qc.qna_id = q.id) AS commentCount \
                FROM qna AS q \
                WHERE title LIKE ? OR content LIKE ? \
                ORDER BY id DESC LIMIT ? OFFSET ?";
    let params = [query, query, postPerPage, startPost];
    let data = []; 
    conn.query(sql2, params, function(err, rows2) {
      if(err) throw err;
      for(let i=0; i<rows2.length; i++) {
        let node = {
          'id' : rows2[i].id,
          'title' : rows2[i].title,
          'user_nickname' : rows2[i].user_nickname,
          'post_date' : rows2[i].post_date,
          'hit' : rows2[i].hit,
          'commentCount' : rows2[i].commentCount
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
        'searchText' : find_text
      }

      res.render('qna_search_list.ejs', {paging:paging, data:data, user:req.session.user});
    })
  })
})


// 질문답변 게시물등록 페이지
router.get('/qna_write', loggedin, function(req, res) {
  res.render('qna_write.ejs', {user:req.session.user});
})


// 질문답변 게시물 등록
router.post('/qna_post', loggedin, function(req, res) {
  let title = req.body.title;
  let content = req.body.content;
  let user_id = req.session.user.id;
  let user_nickname = req.session.user.nickname;
  let post_date = postDate();

  let sql = "INSERT INTO qna (title, content, user_id, user_nickname, post_date) VALUES (?, ?, ?, ?, ?)";
  let params = [title, content, user_id, user_nickname, post_date];
  conn.query(sql, params, function(err, result) {
    if(err)
      res.status(500).send();
    else  
      res.status(200).send("질문답변 게시물 등록성공");
  })
})


// 질문답변 게시물 내용보기 페이지
router.get('/qna_detail/:id', async function(req, res) {
  // 조회수 카운트, 쿠키에 저장되어있는 값이 있는지 확인 (없을시 undefined 반환)
  let keyVal = "q_" + req.params.id;
  if (req.cookies[keyVal] == undefined) {
    // key, value, 옵션을 설정해준다.
    res.cookie(keyVal, getUserIP(req), {
      // 유효시간 : 1분  **테스트용 1분 / 출시용 1시간 3600000  
      maxAge: 60000
    })
    // 쿠키에 저장값이 없으면 조회수 1 증가
    let sql = "UPDATE qna SET hit=qna.hit+1 WHERE id=?";
    let params = [req.params.id];
    conn.query(sql, params, function(err, result) {
      if(err) throw err;
    })
  }

  // 쿠키에 client ip 저장값이 있으면 조회수 증가하지 않고, 내용을 보여줌
  let sql = " SELECT q.id, q.title, q.content, q.user_id, q.user_nickname, q.post_date, \
              qc.idx, qc.comment, qc.commenter_id, qc.commenter_nickname, qc.created_at, qc.qna_id, qc.response_to, qc.deleted, qc.response_name \
              FROM qna AS q LEFT OUTER JOIN qna_comment AS qc \
              ON q.id = qc.qna_id \
              WHERE q.id = ? ";
  let params = req.params.id;
  conn.query(sql, params, function(err, rows) {
    if(err) throw err;
    res.render('qna_detail.ejs', {data:rows, user:req.session.user});
  })
})


// 질문답변 게시물 수정
router.post('/qna_edit', loggedin, function(req, res) {
  let id = req.body.id;
  let title = req.body.title;
  let content = req.body.content;
  let post_date = postDate();

  let sql = "UPDATE qna SET title=?, content=?, post_date=? WHERE id=?";
  let params = [title, content, post_date, id]
  conn.query(sql, params, function(err, result) {
    if(err)
      res.status(500).send();
    else  
      res.status(200).send("질문답변 게시물 수정 성공");
  })
})


// 질문답변 게시물 삭제
router.post('/qna_delete', loggedin, function(req, res) {
  let id = req.body.id;
  let sql = "DELETE FROM qna WHERE id = ?";
  conn.query(sql, id, function(err, result) {
    if(err)
      res.status(500).send();
    else  
      res.status(200).send("질문답변 게시물 삭제 성공");
  })
})


// 질문답변 댓글,답글 등록 insert
router.post('/qna_response_post', loggedin, function(req, res) {
  let comment = req.body.content; // 댓글 내용
  let qna_id = req.body.qna_id; // 댓글이 등록되는 게시물의 인덱스
  let response_to = req.body.response_to;  // 상위 댓글의 인덱스
  let response_name = req.body.response_name;
  let commenter_id = req.session.user.id;
  let commenter_nickname = req.session.user.nickname;
  let created_at = postDateTime();
  let deleted = 0;
  let sql = "INSERT INTO qna_comment (comment, commenter_id, commenter_nickname, created_at, qna_id, response_to, deleted, response_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  let params = [comment, commenter_id, commenter_nickname, created_at, qna_id, response_to, deleted, response_name];
  conn.query(sql, params, function(err, result) {
    if(err)
      res.status(500).send();
    else  
      res.status(200).send("질문답변 답글 등록성공");
  })
})


// 질문답변 답글 수정 edit
router.post('/qna_response_edit', loggedin, function(req, res) {
  let idx = req.body.idx; // 답글 idx
  let comment = req.body.content; // 댓글 내용
  let sql = "UPDATE qna_comment SET comment=? WHERE idx=?";
  let params = [comment, idx]
  conn.query(sql, params, function(err, result) {
    if(err)
      res.status(500).send();
    else  
      res.status(200).send("질문답변 답글 수정 성공");
  })
})

// 질문답변 댓글 삭제 --> 댓글 삭제하지 않고 "삭제된 댓글입니다" 변경함
router.post('/qna_comment_delete', loggedin, function(req, res) {
  let idx = req.body.idx; 
  let comment = "삭제된 댓글입니다";
  let deleted = 1;
  let sql = "UPDATE qna_comment SET comment=?, deleted=? WHERE idx=?";
  let params = [comment, deleted, idx];
  conn.query(sql, params, function(err, result) {
    if(err)
      res.status(500).send();
    else  
      res.status(200).send("질문답변 댓글 삭제 성공");
  })
})

// 질문답변 답글 삭제 --> 답글은 그대로 삭제함
router.post('/qna_response_delete', loggedin, function(req, res) {
  let idx = req.body.idx;
  let sql = "DELETE FROM qna_comment WHERE idx = ?";
  conn.query(sql, idx, function(err, result) {
    if(err)
      res.status(500).send();
    else  
      res.status(200).send("질문답변 댓글답글 삭제 성공");
  })
})

// 로그인 여부 확인
function loggedin(req, res, next) {
  let login = req.session.user;
  if(login) 
    next();
  else 
    res.status(500).send("<script>alert('로그인이 필요합니다'); window.location.href='/login'</script>");
}

// 현재 날짜 가져오기
function postDate() {
  const today = new Date();
  const year = today.toLocaleDateString('en-US', {year: 'numeric',});
  const month = today.toLocaleDateString('en-US', {month: '2-digit',});
  const day = today.toLocaleDateString('en-US', {day: '2-digit',});
  return `${year}.${month}.${day}`;
}
function postDateTime() {
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1; // zero base month 때문에 +1 
  let date = today.getDate();
  let hour = today.getHours();
  hour = hour >= 10 ? hour : "0" + hour; // hour 두자리로 출력
  let minute = today.getMinutes();
  minute = minute >= 10 ? minute : "0" + minute; // minute 두자리로 출력
  let ampm = hour >= 12 ? '오후' : '오전';
  return `${year}.${month}.${date} ${ampm} ${hour}:${minute}`;
}

// client ip를 가져오는 함수 (조회수 카운트)
function getUserIP(req) {
  const addr = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  return addr
}

// router 변수를 외부 노출
module.exports = router;