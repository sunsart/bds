document.addEventListener('DOMContentLoaded', function() {
  // 년월일 구하기
  let today = new Date();
  let year = today.getFullYear();
  let month = ('0' + (today.getMonth() + 1)).slice(-2);
  let day = ('0' + today.getDate()).slice(-2);
  let dateString = year + '-' + month  + '-' + day;
  // console.log(dateString); 결과 : 2021-05-30

  // 요일 구하기
  let dayOfWeek = getDayOfWeek(dateString);

  // 년월일 + (요일)
  dateString = dateString + " (" + dayOfWeek + ") ";

  // 부동산뉴스 테이블 위에 날짜요일 표시
  document.querySelector(".page_date").textContent = dateString;
})

function getDayOfWeek(yyyyMMdd){	
  let dayOfWeek = new Date(yyyyMMdd).getDay(); 
  //0:일, 1:월, 2:화, 3:수, 4:목, 5:금, 6:토
  if(dayOfWeek == 0)
    dayOfWeek = "일";
  else if(dayOfWeek == 1)
    dayOfWeek = "월";
  else if(dayOfWeek == 2)
    dayOfWeek = "화";
  else if(dayOfWeek == 3)
    dayOfWeek = "수";
  else if(dayOfWeek == 4)
    dayOfWeek = "목";
  else if(dayOfWeek == 5)
    dayOfWeek = "금";
  else if(dayOfWeek == 6)
    dayOfWeek = "토";

  return dayOfWeek;
}