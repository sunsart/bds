// .env 환경변수 사용
require('dotenv').config();

// 이미지 업로드
const multer = require('multer');
const cors = require('cors');
const path = require('path');

// nodejs 와 mysql 접속
const mysql = require('mysql');
const conn = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DATABASE
});
conn.connect();

const express = require('express');
const app = express();

// ---------세션 미들웨어 설정---------
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
  cookie : { maxAge: 3600000 }  // 1시간
}))
// ---------------------------------------

// 게시판 조회수 중복제거에 사용 
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// post방식의 데이터 사용을 위한 body-parser 설정
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

// 뷰엔진 설정, 동적인 결과를 정적인 파일에 담기 위해
app.set('view engine', 'ejs');

// 서버가 정적파일을 제공하도록 하기 위한 설정
app.use(express.static(__dirname + ''));

// 이미지 업로드 정적파일
app.use("/upload", express.static("upload"));
app.use(cors());

// 라우터 분리
app.use('/', require('./routes/index.route.js'));
app.use('/', require('./routes/auth.route.js'));
app.use('/', require('./routes/calendar.route.js'));
app.use('/', require('./routes/news.route.js'));
app.use('/', require('./routes/find.route.js'));
app.use('/', require('./routes/qna.route.js'));
app.use('/', require('./routes/document.route.js'));

app.get('/login', function(req, res) {
  res.render('login.ejs', {user:req.session.user});
})

app.get('/signup', function(req, res) {
  res.render('signup.ejs', {user:req.session.user});
})

app.get('/bookmark', function(req, res) {
  let sql = "SELECT * FROM bookmark";
    conn.query(sql, function(err, rows) {
      if(err)
        res.status(500).send();
      else  
        res.render('bookmark.ejs', {data:rows, user:req.session.user});
    })
})


let imageName = '';
const storage = multer.diskStorage({
  destination: path.resolve(__dirname, 'upload/'),
  filename: function(req, file, done){
    const ext = path.extname(file.originalname); // 확장자명 : hwp
    const baseName = path.basename(file.originalname, ext);  // 파일명 : 정산양식
    let changed_name = baseName + "_" + Date.now() + ext; // 정산양식_2324343.hwp  
    imageName = Buffer.from(changed_name, "latin1").toString("utf8");      
    done(null, imageName);
  },
});
const upload = multer({storage:storage, limits:{fileSize: 3 * 1024 * 1024}}).single('upload');

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.json({error:{message:"이미지의 크기는 3mb를 초과할 수 없습니다"}});
    res.json({
      url: `http://localhost:8080/upload/${imageName}`,
    });
  });
});

//==========

app.listen(8080, function() {
  console.log("포트 8080 으로 서버 대기중...");
})



