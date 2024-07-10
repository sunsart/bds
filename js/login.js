function Login() {
  let name = document.querySelector("#name").value;
  let pw = document.querySelector("#pw").value;

  if (name == "") 
    alert("아이디를 입력해주세요")
  else if (pw == "") 
    alert("비밀번호를 입력해주세요")
  else {
    $.ajax({
      url : "/login",
      type : "POST",
      data : {name:name, pw:pw},
      success : function(data) {
        if(data == "로그인성공") {
          alert("로그인 되었습니다")
          window.location.href = '/';
        }
        else if(data == "로그인실패") {
          alert("아이디 또는 비밀번호를 잘못 입력했습니다");
        }
      }
    })
  }
}