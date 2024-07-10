// checkbox 선택 >> 선택된 특약사항 컬러 변경
$(document).ready(function() {
  $('.checkbox').click(function() {
		//선택된 checkbox의 같은 row의 lebel 가져오기 
		let tr = $(this).parent().parent();
 		let td = tr.children();
		let label = td.eq(1).children();

		if (this.checked == true)
			label[0].style.color = "blue";
		else 
			label[0].style.color = "darkgray";
	})
});

// 특약 체크박스 선택후 >> 작성하기 버튼 클릭시
$(document).ready(function() {
  $('.copy_button').click(function(e) {

		// 1. 테이블에서 선택한 특약내용을 textarea 에 보여주기
		let contentStr = "";
		for (let i=0; i<$('.checkbox').length; i++) {
			if ($('.checkbox')[i].checked == true){
				contentStr += $('.content')[i].innerText;
				contentStr += "\n";
			}
		}
		document.querySelector("#copy_content").innerHTML = contentStr;

		//2. Clipboard.js를 이용하여 선택한 특약내용을 clipboard에 카피하기
		var clipboard = new ClipboardJS(".copy_button");
		clipboard.on('success', function (e) {
			console.log(e);
		});
		clipboard.on('error', function (e) {
			console.log(e);
		});
	})
});

//로그인후 >> 테이블 위쪽 수정버튼 클릭
$(document).ready(function() {
  $('#edit_button').click(function(e) {
		if (this.innerText == "수정") {
			this.innerText = "완료";
			//선택버튼 활성화
			let btns = document.querySelectorAll(".select_btn");
			for(let btn of btns)
				btn.className = "select_btn show_btn";
			//체크박스 비활성화
			let checkboxes = document.querySelectorAll(".checkbox");
			for(let cb of checkboxes)
				cb.style.visibility = 'hidden';
			//선택버튼 활성화시 칼럼 사이즈 늘리기
			let td = document.querySelector("#col_size");
			td.style.width = '14%';
		} 
		else if (this.innerText == "완료") {
			this.innerText = "수정";
			//선택버튼 비활성화
			let btns = document.querySelectorAll(".select_btn");
			for(let btn of btns)
				btn.className = "select_btn";
			//체크박스 활성화
			let checkboxes = document.querySelectorAll(".checkbox");
			for(let cb of checkboxes)
				cb.style.visibility = 'visible';
			//선택버튼 비활성화시 칼럼 사이즈 복원
			let td = document.querySelector("#col_size");
			td.style.width = '11%';
		}
	})	
});

//로그인후 >> 테이블 수정버튼 >> 선택버튼 클릭 >> 모달뷰
function clickEdit(e) {
	//선택한 basics 특약 id넘버 가져오기
	num = e.dataset.id;

	//list.js 에서 사용됨 (type="hidden" 화면에서 보이지 않음)
	document.querySelector("#clause_no").value = num;

	//선택된행의 데이터를 모달입력창에 설정
	let title;
	let content;
	let checkboxes = document.querySelectorAll(".checkbox");
	for (let i=0; i<checkboxes.length; i++) {
		if (checkboxes[i].dataset.id == num) {
			title = document.querySelectorAll(".title")[i].innerText;
			content = document.querySelectorAll(".content")[i].innerText;
			break;
		} 
	}
	document.querySelector(".edit_title").value = title;
	document.querySelector(".edit_content").value = content;
	
	//모달 show
	document.querySelector(".edit_modal").style.display = "block";
}