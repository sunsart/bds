// 특약수정 모달 확인버튼 클릭시
function confirmModal() { 
  let clauseNum = document.querySelector("#clause_no").value;
  let title = document.querySelector(".edit_title").value;
  let content = document.querySelector(".edit_content").value;

  let clauseNameKor = document.querySelector(".clause_name").innerText;
  let clauseNameEng = setClauseNameToEng(clauseNameKor);

  if(title.length > 20) {
    alert("특약 제목은 20글자 이하로 입력해주세요 (띄어쓰기 포함)");
  } else if(content.length > 200) {
    alert("특약 내용은 200글자 이하로 입력해주세요 (띄어쓰기 포함)");
  } else {
    $.ajax({
      url : "/edit",
      type : "POST",
      data : {clauseNum:clauseNum, title:title, content:content},
      success : function(data) {
        if(data == "특약수정성공") 
          alert("특약사항을 저장했습니다");
        else if(data == "특약저장성공") 
          alert("특약사항을 저장했습니다");
      },
      error : function(xhr, textStatus, errorThrown) {
        console.log("특약사항 변경실패, 서버에러");
        console.log(xhr, textStatus, errorThrown);
      }
    })
    // 모달 닫기
    closeModal();

    // 특약수정된 결과를 바로 볼수 있게
    window.location.href = "/type/" + clauseNameEng;
  }
}

// 특약수정 모달 취소버튼 클릭시
function closeModal() { 
  let modal = document.querySelector("#edit_modal");
  modal.style.display = "none";
}

//
function setClauseNameToEng(kor) {
  let eng;
  if (kor == "아파트 매매 특약사항") eng = "apt_trade";
  else if (kor == "아파트 전세 특약사항") eng = "apt_jeonse";
  else if (kor == "아파트 월세 특약사항") eng = "apt_monthly";

  else if (kor == "오피스텔 매매 특약사항") eng = "officetel_trade";
  else if (kor == "오피스텔 전세 특약사항") eng = "officetel_jeonse";
  else if (kor == "오피스텔 월세 특약사항") eng = "officetel_monthly";

  else if (kor == "다세대 매매 특약사항") eng = "dasedae_trade";
  else if (kor == "다세대 전세 특약사항") eng = "dasedae_jeonse";
  else if (kor == "다세대 월세 특약사항") eng = "dasedae_monthly";

  else if (kor == "다가구 매매 특약사항") eng = "dagagu_trade";
  else if (kor == "다가구 전세 특약사항") eng = "dagagu_jeonse";
  else if (kor == "다가구 월세 특약사항") eng = "dagagu_monthly";

  else if (kor == "원룸 전세 특약사항") eng = "oneroom_jeonse";
  else if (kor == "원룸 월세 특약사항") eng = "oneroom_monthly";

  else if (kor == "상가 매매 특약사항") eng = "shop_trade";
  else if (kor == "상가 월세 특약사항") eng = "shop_monthly";

  else if (kor == "공장 매매 특약사항") eng = "factory_trade";
  else if (kor == "공장 월세 특약사항") eng = "factory_monthly";

  else if (kor == "토지 매매 특약사항") eng = "land_trade";
  else if (kor == "토지 월세 특약사항") eng = "land_monthly";

  else if (kor == "기타 특약사항") eng = "etc";
  return eng;
}