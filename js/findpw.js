// 비밀번호찾기 모달창 열기
function showFindpw() {
  // 모달 show
  const modal = document.querySelector('.modal_pw_container');
  modal.classList.add('on');

  // 입력창 초기화
  document.querySelector("#findpw_name").value = "";  
  document.querySelector("#findpw_email").value = "";      
}

// 비밀번호찾기 모달창 닫기
function closeFindpw() { 
  const modal = document.querySelector('.modal_pw_container');
  modal.classList.remove('on');
}

//비밀번호찾기 버튼 클릭시
function findpw() {
  let name = document.querySelector("#findpw_name").value;
  let email = document.querySelector("#findpw_email").value;
  const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;

  if (name == "" ) 
    alert("아이디를 입력해주세요");
  else if (email == "")
    alert("이메일 주소를 입력해주세요");
  else if (pattern.test(email) === false)
    alert("이메일 형식이 올바르지 않습니다");
  else {
    $.ajax({
      url : "/findpw",
      type : "POST",
      data : {name:name, email:email},
      success : function(data) {
        if(data == "비밀번호찾기실패") 
          alert("일치하는 정보를 찾을 수 없습니다");
        else {
          alert(data.address + " 메일주소로 6자리 숫자코드를 발송했습니다");

          // 이메일로 수신한 6자리 인증코드 입력시 비교하기 위해  
          localStorage.setItem('codeNum', data.codeNum);
          localStorage.setItem('memberNum', data.memberNum);

          // 비밀번호 찾기 모달창 닫기
          const modal_find = document.querySelector('.modal_pw_container');
          modal_find.classList.remove('on');

          // 비밀번호 수정 모달 열기
          const modal_edit = document.querySelector('.modal_editpw_container');
          modal_edit.classList.add('on');
        }
      }
    })
  }
}
