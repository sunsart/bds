// nodejs 와 mysql 접속
const mysql = require('mysql');
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "0322",
  database: "bds"
});
conn.connect();

// mysql 테스트
// conn.query("SELECT * FROM account", function(err, rows, fields) {
//   if(err) throw err;
//   console.log(rows);
// })

const express = require('express');
const app = express();

// post방식의 데이터 사용을 위한 body-parser 설정
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

// 동적인 결과를 정적인 파일에 담기 위한 뷰엔진 설정
app.set('view engine', 'ejs');

// 서버가 정적파일을 제공하도록 하기 위한 설정
app.use(express.static(__dirname + ''));

app.get('/', function(req, res) {
  res.render("index.ejs");
})

app.listen(8080, function() {
  console.log("포트 8080 으로 서버 대기중...");
})



