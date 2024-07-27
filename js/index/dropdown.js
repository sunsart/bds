// 특약 카테고리 선택시 >> 드롭다운메뉴 보이기
function clickMenuBtn(id) {
  document.querySelector("#apt_Dropdown").classList.remove("show");
  document.querySelector("#officetel_Dropdown").classList.remove("show");
  document.querySelector("#dasedae_Dropdown").classList.remove("show");
  document.querySelector("#dagagu_Dropdown").classList.remove("show");
  document.querySelector("#oneroom_Dropdown").classList.remove("show");
  document.querySelector("#shop_Dropdown").classList.remove("show");
  document.querySelector("#factory_Dropdown").classList.remove("show");
  document.querySelector("#land_Dropdown").classList.remove("show");
  document.querySelector("#etc_Dropdown").classList.remove("show");

  let temp = id + "_Dropdown";
  document.getElementById(temp).classList.toggle("show");
}


// 드롭다운메뉴 밖의 공간을 클릭시 드롭다운메뉴 닫기
window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.querySelectorAll(".dropdown_content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
