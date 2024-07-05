// 메뉴 카테고리 선택시 >> 드롭다운메뉴 보이기
function clickMenuBtn(id) {
  document.getElementById("apt-Dropdown").classList.remove("show");
  document.getElementById("officetel-Dropdown").classList.remove("show");
  document.getElementById("dasedae-Dropdown").classList.remove("show");
  document.getElementById("dagagu-Dropdown").classList.remove("show");
  document.getElementById("oneroom-Dropdown").classList.remove("show");
  document.getElementById("shop-Dropdown").classList.remove("show");
  document.getElementById("factory-Dropdown").classList.remove("show");
  document.getElementById("land-Dropdown").classList.remove("show");
  document.getElementById("etc-Dropdown").classList.remove("show");

  let temp = id + "-Dropdown";
  document.getElementById(temp).classList.toggle("show");
}

// 드롭다운메뉴 밖의 공간을 클릭시 드롭다운메뉴 닫기
window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
