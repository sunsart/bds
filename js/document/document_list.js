// 검색 버튼 클릭시
function search() {
  let search = document.querySelector(".document_search_text").value;

  if(search == "")
    alert("검색어를 입력하세요");
  else 
    location.href = "/document_search/" + "?search=" + search;
}