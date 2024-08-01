function showFindid() {
  // 모달 show
  const modal = document.querySelector('.modal_id_container');
  modal.classList.add('on');
  // 입력창 초기화
  document.querySelector("#findid_email").value = "";
}

function closeFindid() { 
  // 모달 off
  const modal = document.querySelector('.modal_id_container');
  modal.classList.remove('on');
}


//아이디찾기 버튼 클릭 >> 휴효성검사 >> 결과표시
function findid() {
  let email = document.querySelector('#findid_email').value;
  const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
  if (email == "") 
    alert("이메일 주소를 입력해주세요")
  else if (pattern.test(email) === false) 
    alert("이메일 형식이 올바르지 않습니다")
  else {
    $.ajax({
      url : "/findid",
      type : "POST",
      data : {email:email},
      success : function(data) {
        if(data == "아이디찾기실패") 
          alert("입력하신 이메일 정보를 확인할 수 없습니다")
        else {
          let text = "찾으시는 아이디는 " + data + " 입니다";
          alert(text);
          closeFindid();
        }
      },
      error : function(xhr, textStatus, errorThrown) {
        console.log("findid 아이디찾기 실패, 서버에러");
        console.log(xhr, textStatus, errorThrown);
      }
    })
  }
}