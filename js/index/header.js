document.addEventListener('DOMContentLoaded', function() {
	// 현재 페이지 경로 가져오기
  let url = window.location.pathname;

  if(url == "/") {
    document.querySelector("#nav_clause").classList.add("selected");
  }
  else if (url == "/qna_list") {
    document.querySelector("#nav_qna").classList.add("selected");
  }
  else if (url == "/find_list") {
    document.querySelector("#nav_find").classList.add("selected");
  }
  else if (url == "/bookmark") {
    document.querySelector("#nav_bookmark").classList.add("selected");
  }
  else if (url == "/news") {
    document.querySelector("#nav_news").classList.add("selected");
  }
  else if (url == "/calendar") {
    document.querySelector("#nav_calendar").classList.add("selected");
  }
});
