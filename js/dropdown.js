// 메뉴 카테고리 선택시 >> 드롭다운메뉴 보이기
function clickMenuBtn(id) {
  document.getElementById("apt_Dropdown").classList.remove("show");
  document.getElementById("officetel_Dropdown").classList.remove("show");
  document.getElementById("dasedae_Dropdown").classList.remove("show");
  document.getElementById("dagagu_Dropdown").classList.remove("show");
  document.getElementById("oneroom_Dropdown").classList.remove("show");
  document.getElementById("shop_Dropdown").classList.remove("show");
  document.getElementById("factory_Dropdown").classList.remove("show");
  document.getElementById("land_Dropdown").classList.remove("show");
  document.getElementById("etc_Dropdown").classList.remove("show");

  let temp = id + "_Dropdown";
  document.getElementById(temp).classList.toggle("show");
}

// 드롭다운메뉴 밖의 공간을 클릭시 드롭다운메뉴 닫기
window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown_content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
