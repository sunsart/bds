//.env 환경변수 사용
const dotenv = require('dotenv').config();

// nodejs 와 mysql 접속
const mysql = require('mysql');
const conn = mysql.createConnection({
  host: "mariadb",
  port: 3306,
  user: "root",
  password: "0322",
  database: "bds-db"
});
conn.connect();

const express = require('express');
const app = express();

// ---------세션 미들웨어 설정---------
// 사용자마다 고유한 req.session 객체가 생성됨
let session = require('express-session');
let mysqlstore = require('express-mysql-session')(session);
let option = {
  host: "mariadb",
  port: 3306,
  user: "root",
  password: "0322",
  database: "bds-db"
}
let sessionStore = new mysqlstore(option);

app.use(session({
  secret : "secretkey012safa",
  resave : false,
  saveUninitialized : true,
  store : sessionStore,
  cookie : { maxAge: 3600000 }  // 1시간
}))
// ---------------------------------------

// post방식의 데이터 사용을 위한 body-parser 설정
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

// 동적인 결과를 정적인 파일에 담기 위한 뷰엔진 설정
app.set('view engine', 'ejs');

// 서버가 정적파일을 제공하도록 하기 위한 설정
app.use(express.static(__dirname + ''));

// 라우터 분리
app.use('/', require('./routes/index.route.js'));
app.use('/', require('./routes/auth.route.js'));
app.use('/', require('./routes/calendar.route.js'));

app.get('/login', function(req, res) {
  res.render('login.ejs', {user:req.session.user});
})

app.get('/signup', function(req, res) {
  res.render('signup.ejs', {user:req.session.user});
})

app.listen(8080, function() {
  console.log("포트 8080 으로 서버 대기중...");
})



