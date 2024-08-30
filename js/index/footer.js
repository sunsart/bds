// contact mail 보내기
function sendContactMail() {
  let email = document.querySelector("#contact_email").value;
  let subject = document.querySelector("#contact_subject").value;
  const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;

  if (email == "" ) 
    alert("답변 받을 이메일주소를 입력해주세요");
  else if (pattern.test(email) === false)
    alert("이메일 형식이 올바르지 않습니다");
  else if (subject == "")
    alert("문의내용, 건의내용을 입력해주세요");
  else {
    $.ajax({
      url : "/sendContactMail",
      type : "POST",
      data : {email:email, subject:subject},
      success : function() {
        alert("내용을 전달했습니다");
        document.querySelector("#contact_email").value = "";
        document.querySelector("#contact_subject").value = "";
      },
      error : function(xhr, textStatus, errorThrown) {
        alert("메일발송 에러가 발생했습니다");
        console.log("contact mail 발송 에러");
        console.log(xhr, textStatus, errorThrown);
      }
    })
  }
}
