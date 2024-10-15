
// 라우터 객체
let router = require('express').Router();

//nodejs 와 mysql 접속
var mysql = require('mysql');
var conn = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DATABASE,
  multipleStatements: true  // 다중쿼리 옵션
});
conn.connect();


// 저장된 schedule과 todo를 동시에 불러옴. 다중쿼리
router.get('/calendar', function(req, res) {
  if(req.session.user) {  //로그인 되어 있으면
    let sql_1 = "SELECT * FROM schedule WHERE user_id=?;";
    let sql_2 = "SELECT * FROM todo WHERE user_id=?;";
    let params = [req.session.user.id, req.session.user.id];

    conn.query(sql_1 + sql_2, params, function(err, rows) {
      if(err)
        res.status(500).send();
      else  
        res.render('calendar.ejs', {data_1:rows[0], data_2:rows[1], user:req.session.user});
    })
  } else {  //로그인 되어 있지 않으면
    res.render('calendar.ejs', {user:req.session.user});
  }
})


// schedule db에 저장
router.post('/schedule_add', loggedin, function(req, res) {
  let title = req.body.title;
  let start = req.body.start;
  let end = req.body.end;
  let color = req.body.color;
  let user_id = req.session.user.id;
  let sql = "INSERT INTO schedule (title, start, end, color, user_id) VALUES (?, ?, ?, ?, ? )";
  let params = [title, start, end, color, user_id];
  conn.query(sql, params, function(err, result) {
    if(err)
      res.status(500).send();
    else  
      res.status(200).send();
  })
})


// schedule 삭제
router.post('/schedule_delete', loggedin, function(req, res) {
  let schedule_id = req.body.id;
  let sql = "DELETE FROM schedule WHERE id = ?";
  conn.query(sql, schedule_id, function(err, result) {
    if(err)
      res.status(500).send();
    else  
      res.status(200).send();
  })
})


// todo db에 저장
router.post('/todo_add', loggedin, function(req, res) {
  let title = req.body.title;
  let user_id = req.session.user.id;
  let sql = "INSERT INTO todo (title, user_id) VALUES (?, ?)";
  let params = [title, user_id];
  conn.query(sql, params, function(err, result) {
    if(err) {
      res.status(500).send();
    }
    else {
      let bags = [];
      bags[0] = user_id;
      bags[1] = title;
      bags[2] = result.insertId;
      res.status(200).send(bags);
    }
  })
})


// todo 삭제
router.post('/todo_delete', loggedin, function(req, res) {
  let id = req.body.id;
  let sql = "DELETE FROM todo WHERE id = ?";
  let params = [id];
  conn.query(sql, params, function(err, result) {
    if(err)
      res.status(500).send();
    else  
      res.status(200).send();
  })
})

// todo 완료 변경
router.post('/todo_complete', loggedin, function(req, res) {
  let id = req.body.id;
  let complete = req.body.complete;
  let sql = "UPDATE todo SET completed=? WHERE id=?";
  let params = [complete, id];
  conn.query(sql, params, function(err, result) {
    if(err)
      res.status(500).send();
    else  
      res.status(200).send();
  })
});

// 로그인 여부 확인
function loggedin(req, res, next) {
  let login = req.session.user;
  if(login) 
    next();
  else 
    res.status(500).send("<script>alert('로그인이 필요합니다'); window.location.href='/login'</script>");
}

//router 변수를 외부 노출
module.exports = router;