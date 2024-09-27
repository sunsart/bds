// ==== 파일 업로드 === 
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
  limits: {fileSize: 2 * 1024 * 1024} // 첨부파일 용량 2 MB 제한
});

router.post("/document_post", upload.single("file"), (req, res)=> {
  try {
    if(!req.file)
      return res.status(400).json({ 에러 : '파일을 첨부하세요' });
  } catch (error) {
      return res.status(400).json({ 에러 : '파일의 크기는 2 mb를 초과할 수 없습니다' });
  }

  let title = req.body.title;
  let content = req.body.content;
  let user_id = req.session.user.id;
  let user_name = req.session.user.name;
  let upload_date = postDate();
  let original_name = Buffer.from(req.file.originalname, "latin1").toString("utf8");
  let changed_name = req.file.filename;

  let sql = " INSERT INTO document \
              (title, content, user_id, user_name, created_at, original_name, changed_name) \
              VALUES (?, ?, ?, ?, ?, ?, ?)";
  let params = [title, content, user_id, user_name, upload_date, original_name, changed_name];
  conn.query(sql, params, function(err, result) {
    if(err) throw err;
    res.redirect("/document_list");
  })
});


// === 파일 다운로드 ===
router.get('/uploads/:file_name', async(req, res) => {
  let upload_folder = '/uploads/';
  let fileName = Buffer.from(req.params.file_name, "latin1").toString("utf8");
  let filePath = upload_folder + fileName;

  let result = fileName.split("_");
  
  try {
    if(fs.existsSync(filePath)) { 
      res.download(filePath, result[0]);
      // 다운로드시 다운수 증가 기능 구현 못함. get방식에서 document.id 값을 못가져옴
    } else {
      res.send('해당 파일이 없습니다.');  
      return;
    }
  } catch (e) { 
    console.log(e);
    res.send('파일을 다운로드하는 중에 에러가 발생하였습니다.');
    return;
  }
});