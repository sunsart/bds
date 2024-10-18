function checkSignup() {
  let name = document.querySelector("#name").value;
  let pw1 = document.querySelector("#pw1").value;
  let pw2 = document.querySelector("#pw2").value;
  let nickname = document.querySelector("#nickname").value;
  let email = document.querySelector("#email").value;
  let terms = document.querySelector("#terms");

  const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;

  if (name.length < 4 || name.length >= 20) 
    alert("아이디는 4글자 ~ 20글자 이내로 입력해주세요");
  else if (pw1.length < 6)
    alert("비밀번호는 6글자 이상 입력해주세요");
  else if (pw1 != pw2)
    alert("비밀번호가 서로 일치하지 않습니다");
  else if (nickname.length < 2 || nickname.length >= 10)
    alert("별명은 2글자 ~ 10글자 이내로 입력해주세요");
  else if (email == "")
    alert("이메일주소를 입력해주세요");
  else if (pattern.test(email) === false) 
    alert("이메일주소 형식이 올바르지 않습니다");
  else if (email.length >= 45)
    alert("이메일주소는 45자 이내로 입력해주세요");
  else if (terms.checked == false) 
    alert("약관에 동의해 주세요");
  else {
    $.ajax({
      url : "/signup",
      type : "POST",
      data : {name:name, pw:pw1, nickname:nickname, email:email},
      success : function(data) {
        if(data[0] == "가입실패") 
          alert("같은 이름의 아이디, 이메일주소, 별명이 존재합니다");
        else if(data[0] == "가입성공") {
          alert("정상적으로 회원가입 되었습니다.");
          window.location.href = '/login';
        }
      },
      error : function(xhr, textStatus, errorThrown) {
        console.log("회원가입 실패");
        console.log(xhr, textStatus, errorThrown);
      }
    })
  }
}