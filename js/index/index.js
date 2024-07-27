// 특약수정 모달 확인버튼 클릭시
function confirmModal() { 
  let clauseNum = document.querySelector("#clause_no").value;
  let title = document.querySelector(".edit_title").value;
  let content = document.querySelector(".edit_content").value;
 
  $.ajax({
    url : "/edit",
    type : "POST",
    data : {clauseNum:clauseNum, title:title, content:content},
    success : function(data) {
      if(data == "특약수정성공") 
        alert("특약사항을 저장했습니다");
      else if(data == "특약저장성공") 
        alert("특약사항을 저장했습니다");
    }
  })
  
  // 모달 닫기
  closeModal();

  // 특약수정된 결과를 바로 볼수 있게
  window.location.href = '/';
}

// 특약수정 모달 취소버튼 클릭시
function closeModal() { 
  let modal = document.querySelector("#edit_modal");
  modal.style.display = "none";
}