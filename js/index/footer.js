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
    // contact 메일 발송 버튼 반응이 느려서 
    // success 안의 alert을 앞으로 이동함
    alert("내용을 전달했습니다");
    document.querySelector("#contact_email").value = "";
    document.querySelector("#contact_subject").value = "";
    $.ajax({
      url : "/sendContactMail",
      type : "POST",
      data : {email:email, subject:subject},
      success : function() {
        console.log("contact 내용을 전달했습니다");
      },
      error : function(xhr, textStatus, errorThrown) {
        console.log("contact mail 발송 에러");
        console.log(xhr, textStatus, errorThrown);
      }
    })
  }
}
