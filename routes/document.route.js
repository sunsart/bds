// 파일첨부 업로드 다운로드 모듈
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

// 서식자료실 리스트 페이지
router.get('/document_list', function(req, res) {
  let currentPage = req.query.page; // 현재 보여지는 페이지
  if(!currentPage) currentPage = 1; // page 파라미터 값을 넘겨주지 않을 시, 1페이지로 설정
  let postPerPage = 10; // 한 페이지에 보여질 게시물 수
  let btnPerPage = 5;  // 한 페이지에 보여질 페이지 버튼의 개수 

  let totalPostCnt = 0; // 전체 게시물 수
  let sql = "SELECT COUNT(*) AS documentCount FROM document";
  conn.query(sql, function(err, rows) {
    if(err) throw err;
    totalPostCnt = rows[0].documentCount;
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
    
    let sql2 = "SELECT id, title, content, user_id, user_nickname, post_date, download, ( \
                SELECT count(*) \
                FROM document_comment AS dc \
                WHERE dc.document_id = d.id) AS commentCount \
                FROM document AS d \
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
          'download' : rows[i].download,
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

      res.render('document_list.ejs', {paging:paging, data:data, user:req.session.user})
    })
  })
})


// 서식자료실 게시물등록 페이지
router.get('/document_write', function(req, res) {
  res.render('document_write.ejs', {user:req.session.user});
})


// 서식자료실 게시물 내용보기 페이지
router.get('/document_detail/:id', async function(req, res) {
  // 서식자료실 조회수 -> 다운수
  let sql = " SELECT d.id, d.title, d.content, d.user_id, d.user_nickname, d.original_name, d.changed_name, \
              dc.idx, dc.comment, dc.commenter_id, dc.commenter_nickname, dc.post_date, dc.document_id, dc.response_to, dc.deleted \
              FROM document AS d LEFT OUTER JOIN document_comment AS dc \
              ON d.id = dc.document_id \
              WHERE d.id = ? ";
  let params = req.params.id;
  conn.query(sql, params, function(err, rows) {
    if(err) throw err;
    res.render('document_detail.ejs', {data:rows, user:req.session.user});
  })
})


// 서식자료실 게시물 삭제
router.post('/document_delete', function(req, res) {
  let id = req.body.id;
  let sql = "DELETE FROM document WHERE id = ?";
  conn.query(sql, id, function(err, result) {
    if(err)
      res.status(500).send();
    else  
      res.status(200).send("서식자료실 게시물 삭제 성공");
  })
})


// 서식자료실 댓글,답글 등록 insert
router.post('/document_response_post', function(req, res) {
  let comment = req.body.content; // 댓글 내용
  let document_id = req.body.document_id; // 댓글이 등록되는 게시물의 인덱스
  let response_to = req.body.response_to;  // 상위 댓글의 인덱스
  let commenter_id = req.session.user.id;
  let commenter_nickname = req.session.user.nickname;
  let post_date = postDate();
  let deleted = 0;
  let sql = "INSERT INTO document_comment (comment, commenter_id, commenter_nickname, post_date, document_id, response_to, deleted) VALUES (?, ?, ?, ?, ?, ?, ?)";
  let params = [comment, commenter_id, commenter_nickname, post_date, document_id, response_to, deleted];
  conn.query(sql, params, function(err, result) {
    if(err)
      res.status(500).send();
    else  
      res.status(200).send("서식자료실 답글 등록성공");
  })
})


// 서식자료실 답글 수정 edit
router.post('/document_response_edit', function(req, res) {
  let idx = req.body.idx; // 답글 idx
  let comment = req.body.content; // 댓글 내용
  let sql = "UPDATE document_comment SET comment=? WHERE idx=?";
  let params = [comment, idx]
  conn.query(sql, params, function(err, result) {
    if(err)
      res.status(500).send();
    else  
      res.status(200).send("서식자료실 답글 수정 성공");
  })
})


// 서식자료실 댓글 삭제 --> 댓글 삭제하지 않고 "삭제된 댓글입니다" 변경함
router.post('/document_comment_delete', function(req, res) {
  let idx = req.body.idx;
  let comment = "삭제된 댓글입니다";
  let deleted = 1;
  let sql = "UPDATE document_comment SET comment=?, deleted=? WHERE idx=?";
  let params = [comment, deleted, idx];
  conn.query(sql, params, function(err, result) {
    if(err)
      res.status(500).send();
    else  
      res.status(200).send("서식자료실 댓글답글 삭제 성공");
  })
})

// 서식자료실 답글 삭제
router.post('/document_response_delete', function(req, res) {
  let idx = req.body.idx;
  let sql = "DELETE FROM document_comment WHERE idx = ?";
  conn.query(sql, idx, function(err, result) {
    if(err)
      res.status(500).send();
    else  
      res.status(200).send("서식자료실 댓글답글 삭제 성공");
  })
})


// ========== 서식자료실 게시물 등록 ==========
// 파일 업로드
const upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, done) {
      done(null, "upload_file/");
    },
    filename: function(req, file, done) {
      const ext = path.extname(file.originalname); // 확장자명 : hwp
      const baseName = path.basename(file.originalname, ext);  // 파일명 : 정산양식
      let changed_name = baseName + "_" + Date.now() + ext; // 정산양식_2324343.hwp  
      changed_name = Buffer.from(changed_name, "latin1").toString("utf8");      
      done(null, changed_name);
    }
  }),
  limits: {fileSize: 2 * 1024 * 1024} // 2 MB 제한
});

const uploadMiddleware = upload.fields([
  { name: "attachment" },
  { name: "title" },
  { name: "content" }
]);
const uploadMiddleware2 = upload.fields([
  { name: "attachment" },
  { name: "id" },
  { name: "title" },
  { name: "content" }
]);

router.post("/document_post", uploadMiddleware, (req, res)=> {
  let title = req.body.title;
  let content = req.body.content;
  let user_id = req.session.user.id;
  let user_nickname = req.session.user.nickname;
  let post_date = postDate();
  let original_name = Buffer.from(req.files['attachment'][0].originalname, "latin1").toString("utf8");
  let changed_name = req.files['attachment'][0].filename;

  let sql = "INSERT INTO document \
            (title, content, user_id, user_nickname, post_date, original_name, changed_name) \
            VALUES (?, ?, ?, ?, ?, ?, ?)";
  let params = [title, content, user_id, user_nickname, post_date, original_name, changed_name];
  conn.query(sql, params, function(err, result) {
    if(err) {
      res.status(500).send();
      console.log(err);
    }
    else  
      res.status(200).send("서식자료실 게시물등록 + 파일첨부 성공");
  })
})


// 서식자료실 첨부파일 다운로드
router.post('/document_download', function(req, res) {
  let id = req.body.id;

  // 다운로드수 카운트, 쿠키에 저장되어있는 값이 있는지 확인 (없을시 undefined 반환)
  let keyVal = "d_" + id;
  if(req.cookies[keyVal] == undefined) {
    res.cookie(keyVal, getUserIP(req), {
      maxAge: 60000 // 유효시간 : 1분  *테스트용 1분 / 출시용 1시간 3600000 
    })
    // 쿠키에 저장값이 없으면 다운로드 카운트 1 증가
    let sql = "UPDATE document SET download=document.download+1 WHERE id=?";
    let params = [id];
    conn.query(sql, params, function(err, result) {
      if(err)
        res.status(500).send();
      else  
        res.status(200).send("다운로드 카운트 증가");
    })
  } else {  // 쿠키에 저장값이 있으면 다운로드 카운트 변동없음
    res.status(200).send("다운로드 카운트 변동없음");
  }
})


// 서식자료실 게시물 수정 + 첨부파일 수정없음
router.post('/document_edit_without_attach', function(req, res) {
  let id = req.body.id;
  let title = req.body.title;
  let content = req.body.content;
  let post_date = postDate();

  let sql = "UPDATE document SET title=?, content=?, post_date=? WHERE id=?";
  let params = [title, content, post_date, id];
  conn.query(sql, params, function(err, result) {
    if(err)
      res.status(500).send();
    else  
      res.status(200).send("서식자료실 게시물 without 첨부파일 수정 성공");
  })
})
// 서식자료실 게시물 수정 + 첨부파일 수정함
router.post("/document_edit_with_attach", uploadMiddleware2, (req, res)=> {
  let id = req.body.id;
  let title = req.body.title;
  let content = req.body.content;
  let post_date = postDate();
  let original_name = Buffer.from(req.files['attachment'][0].originalname, "latin1").toString("utf8");
  let changed_name = req.files['attachment'][0].filename;

  let sql = "UPDATE document SET title=?, content=?, post_date=?, original_name=?, changed_name=? WHERE id=?";
  let params = [title, content, post_date, original_name, changed_name, id]
  conn.query(sql, params, function(err, result) {
    if(err)
      res.status(500).send();
    else  
      res.status(200).send("서식자료실 게시물 with 첨부파일 수정 성공");
  })
})
// ==========================================


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