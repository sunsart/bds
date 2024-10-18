function Login() {
  let name = document.querySelector("#login_name").value;
  let pw = document.querySelector("#login_pw").value;

  if (name.length < 4 || name.length >= 20) 
    alert("아이디는 4글자 ~ 20글자 이내로 입력해주세요");
  else if (pw.length < 6)
    alert("비밀번호는 6글자 이상 입력해주세요");
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
      },
      error : function(xhr, textStatus, errorThrown) {
        console.log("login 실패, 서버에러");
        console.log(xhr, textStatus, errorThrown);
      }
    })
  }
}