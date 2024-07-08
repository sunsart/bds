//.env 환경변수 사용
const dotenv = require('dotenv').config();

// nodejs 와 mysql 접속
const mysql = require('mysql');
const conn = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DATABASE
});
conn.connect();

const express = require('express');
const app = express();

//----------세션 미들웨어 설정----------
// 사용자마다 고유한 req.session 객체가 생성됨
let session = require('express-session');
let mysqlstore = require('express-mysql-session')(session);
let option = {
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DATABASE
}
let sessionStore = new mysqlstore(option);

app.use(session({
  secret : process.env.SESSION_SECRET,
  resave : false,
  saveUninitialized : true,
  store : sessionStore,
  cookie : { maxAge: 3600000 }  //1시간
}))
//---------------------------------------

// post방식의 데이터 사용을 위한 body-parser 설정
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

// 동적인 결과를 정적인 파일에 담기 위한 뷰엔진 설정
app.set('view engine', 'ejs');

// 서버가 정적파일을 제공하도록 하기 위한 설정
app.use(express.static(__dirname + ''));

// clause-name 전역변수
let clauseType = "";

//=============================//
app.get('/', function(req, res) {
  clauseType = "apt_trade";
  if(req.session.user) {
    //로그인 되어 있으면
    let sql = " (SELECT cl.clause_id AS 'id', cl.title, cl.content FROM clauses AS cl WHERE cl.account_id=? AND cl.type=?) \
                UNION ALL \
                (SELECT BASICS.id, BASICS.title, BASICS.content \
                FROM (SELECT * FROM basics AS ba WHERE ba.type = ?) BASICS \
                LEFT OUTER JOIN (SELECT * FROM clauses AS cl WHERE cl.account_id = ? AND cl.type=?) CLAUSES \
                ON BASICS.id = CLAUSES.clause_id \
                WHERE CLAUSES.clause_id IS NULL) \
                ORDER BY id ASC ";
    let params = [req.session.user.id, clauseType, clauseType, req.session.user.id, clauseType];
    conn.query(sql, params, function(err, rows) {
      if(err) throw err;
      res.render('index.ejs', {data:rows, user:req.session.user, type:setClauseName(clauseType)});
    })
  } else {
    //로그인 되어 있지 않으면
    let sql = "SELECT * FROM basics WHERE type=? AND title!=''";
    conn.query(sql, clauseType, function(err, rows) {
      if(err) throw err;
      res.render('index.ejs', {data:rows, user:req.session.user, type:setClauseName(clauseType)});
    })
  }
});

//특약사항 페이지, 시멘틱 url, 네비게이션바에서 메뉴 선택시 테이블 내용 변경
app.get('/type/:id', function(req, res) {
  clauseType = req.params.id;
  if(req.session.user) {
    //로그인 되어 있으면
    let sql = " (SELECT cl.clause_id AS 'id', cl.title, cl.content FROM clauses AS cl WHERE cl.account_id=? AND cl.type=?) \
                UNION ALL \
                (SELECT BASICS.id, BASICS.title, BASICS.content \
                FROM (SELECT * FROM basics AS ba WHERE ba.type = ?) BASICS \
                LEFT OUTER JOIN (SELECT * FROM clauses AS cl WHERE cl.account_id = ? AND cl.type=?) CLAUSES \
                ON BASICS.id = CLAUSES.clause_id \
                WHERE CLAUSES.clause_id IS NULL) \
                ORDER BY id ASC ";
    let params = [req.session.user.id, clauseType, clauseType, req.session.user.id, clauseType];
    conn.query(sql, params, function(err, rows) {
      if(err) throw err;
      res.render('index.ejs', {data:rows, user:req.session.user, type:setClauseName(clauseType)});
    })
  } else {
    //로그인 되어 있지 않으면
    let sql = "SELECT * FROM basics WHERE type=? AND title!=''";
    conn.query(sql, clauseType, function(err, rows) {
      if(err) throw err;
      res.render('index.ejs', {data:rows, user:req.session.user, type:setClauseName(clauseType)});
    })
  }
}) 

app.get('/login', function(req, res) {
  res.render('login.ejs', {user:req.session.user});
})

app.get('/signup', function(req, res) {
  res.render('signup.ejs', {user:req.session.user});
})

//약관 라우터
app.get('/terms', function(req, res) {
  res.render('terms.ejs', {user:req.session.user});
})

// 라우터 분리
app.use('/', require('./routes/auth.js'));

function setClauseName(eng) {
  let kor;
  if (eng == "apt_trade") kor = "아파트 매매 특약사항"
  else if (eng == "apt_jeonse") kor = "아파트 전세 특약사항"
  else if (eng == "apt_monthly") kor = "아파트 월세 특약사항"
  else if (eng == "apt_monthly") kor = "아파트 월세 특약사항"

  else if (eng == "officetel_trade") kor = "오피스텔 매매 특약사항"
  else if (eng == "officetel_jeonse") kor = "오피스텔 전세 특약사항"
  else if (eng == "officetel_monthly") kor = "오피스텔 월세 특약사항"

  else if (eng == "dasedae_trade") kor = "다세대 매매 특약사항"
  else if (eng == "dasedae_jeonse") kor = "다세대 전세 특약사항"
  else if (eng == "dasedae_monthly") kor = "다세대 월세 특약사항"

  else if (eng == "dagagu_trade") kor = "다가구 매매 특약사항"
  else if (eng == "dagagu_jeonse") kor = "다가구 전세 특약사항"
  else if (eng == "dagagu_monthly") kor = "다가구 월세 특약사항"

  else if (eng == "oneroom_jeonse") kor = "원룸 전세 특약사항"
  else if (eng == "oneroom_monthly") kor = "원룸 월세 특약사항"

  else if (eng == "shop_trade") kor = "상가 매매 특약사항"
  else if (eng == "shop_monthly") kor = "상가 월세 특약사항"

  else if (eng == "factory_trade") kor = "공장 매매 특약사항"
  else if (eng == "factory_monthly") kor = "공장 월세 특약사항"

  else if (eng == "land_trade") kor = "토지 매매 특약사항"
  else if (eng == "land_monthly") kor = "토지 월세 특약사항"

  else if (eng == "etc") kor = "기타 특약사항"
  return kor;
}

//=============================//
app.listen(8080, function() {
  console.log("포트 8080 으로 서버 대기중...");
})



