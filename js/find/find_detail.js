import {
	ClassicEditor,
	AccessibilityHelp,
	Alignment,
	AutoImage,
	AutoLink,
	Autosave,
	Bold,
	Essentials,
	FontBackgroundColor,
	FontColor,
	FontFamily,
	FontSize,
	Highlight,
	ImageBlock,
	ImageCaption,
	ImageInline,
	ImageInsert,
	ImageInsertViaUrl,
	ImageResize,
	ImageStyle,
	ImageTextAlternative,
	ImageToolbar,
	ImageUpload,
	Italic,
	Link,
	List,
	ListProperties,
	Paragraph,
	SelectAll,
	SimpleUploadAdapter,
	SpecialCharacters,
	SpecialCharactersArrows,
	SpecialCharactersCurrency,
	SpecialCharactersEssentials,
	SpecialCharactersLatin,
	SpecialCharactersMathematical,
	SpecialCharactersText,
	Strikethrough,
	Table,
	TableCaption,
	TableCellProperties,
	TableColumnResize,
	TableProperties,
	TableToolbar,
	TodoList,
	Underline,
	Undo
} from 'ckeditor5';

import translations from 'ckeditor5/translations/ko.js';

const editorConfig = {
	toolbar: {
		items: [
			'undo',
			'redo',
			'|',
			'fontSize',
			'fontFamily',
			'fontColor',
			'fontBackgroundColor',
			'|',
			'bold',
			'italic',
			'underline',
			'strikethrough',
			'|',
			'specialCharacters',
			'link',
			'insertImage',
			'insertTable',
			'highlight',
			'|',
			'alignment',
			'|',
			'bulletedList',
			'numberedList',
			'todoList'
		],
		shouldNotGroupWhenFull: false
	},
	plugins: [
		AccessibilityHelp,
		Alignment,
		AutoImage,
		AutoLink,
		Autosave,
		Bold,
		Essentials,
		FontBackgroundColor,
		FontColor,
		FontFamily,
		FontSize,
		Highlight,
		ImageBlock,
		ImageCaption,
		ImageInline,
		ImageInsert,
		ImageInsertViaUrl,
		ImageResize,
		ImageStyle,
		ImageTextAlternative,
		ImageToolbar,
		ImageUpload,
		Italic,
		Link,
		List,
		ListProperties,
		Paragraph,
		SelectAll,
		SimpleUploadAdapter,
		SpecialCharacters,
		SpecialCharactersArrows,
		SpecialCharactersCurrency,
		SpecialCharactersEssentials,
		SpecialCharactersLatin,
		SpecialCharactersMathematical,
		SpecialCharactersText,
		Strikethrough,
		Table,
		TableCaption,
		TableCellProperties,
		TableColumnResize,
		TableProperties,
		TableToolbar,
		TodoList,
		Underline,
		Undo
	],
	fontFamily: {
		supportAllValues: true
	},
	fontSize: {
		options: [10, 12, 14, 'default', 18, 20, 22],
		supportAllValues: true
	},
	image: {
		toolbar: [
			'toggleImageCaption',
			'imageTextAlternative',
			'|',
			'imageStyle:inline',
			'imageStyle:wrapText',
			'imageStyle:breakText',
			'|',
			'resizeImage'
		]
	},
	initialData: document.querySelector(".find_content").value,
	language: 'ko',
	link: {
		addTargetToExternalLinks: true,
		defaultProtocol: 'https://',
		decorators: {
			toggleDownloadable: {
				mode: 'manual',
				label: 'Downloadable',
				attributes: {
					download: 'file'
				}
			}
		}
	},
	list: {
		properties: {
			styles: true,
			startIndex: true,
			reversed: true
		}
	},
	placeholder: '내용을 입력하세요',
	table: {
		contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
	},
	translations: [translations],
	// simpleUpload 추가함
	simpleUpload: {
		// The URL that the images are uploaded to
		// uploadUrl: 'http://localhost:8080/upload',
		uploadUrl: '/upload',

		// Enable the XMLHttpRequest.withCredentials property.
		withCredentials: true,

		// Headers sent along with the XMLHttpRequest to the upload server.
		headers: {
				'X-CSRF-TOKEN': 'CSRF-Token',
				Authorization: 'Bearer <JSON Web Token>'
		}
	}
};

let editor;
ClassicEditor.create(document.querySelector('#editor'), editorConfig).then(newEditor => {
  editor = newEditor;
	editor.enableReadOnlyMode('#editor');
}).catch(error => {
  console.error(error);
});


// 수정 버튼 클릭시
document.querySelector('#edit_btn').addEventListener('click', () => {
	// 게시물 제목 활성화, 포커스
	const title = document.querySelector(".find_title");
	title.disabled = false;
	title.focus();

	// 게시물 본문 활성화
	editor.disableReadOnlyMode('#editor');

	// 완료버튼 활성화, 수정버튼/삭제버튼 비활성화
	const complete_btn = document.querySelector("#complete_btn");
	complete_btn.style.display = 'inline';
	const edit_btn = document.querySelector("#edit_btn");
	edit_btn.style.display = 'none';
	const delete_btn = document.querySelector("#delete_btn");
	delete_btn.style.display = 'none';
});


// 완료버튼 클릭시
document.querySelector('#complete_btn').addEventListener('click', () => {
	let title = document.querySelector(".find_title").value;
	let id = document.querySelector(".find_no").value;
	let content = editor.getData();
	if(title == "")
		alert("제목을 입력하세요");
	else if(title.length >= 45) 
		alert("제목은 45자 이내로 입력해주세요");
	else if(content == "")
		alert("내용을 입력하세요");
	else {
		$.ajax({
			url : "/find_edit",
			type : "POST",
			data : {title:title, id:id, content:content},
			success : function(data) {
				alert("수정했습니다")
				window.location.reload();
			},
			error : function(xhr, textStatus, errorThrown) {
				console.log("매물찾아요 게시물 수정 실패");
				console.log(xhr, textStatus, errorThrown);
			}
		})
	}
});


// 게시물 삭제 버튼 클릭시
document.querySelector('#delete_btn').addEventListener('click', () => {
	let id = document.querySelector(".find_no").value;
	let result = confirm("게시글을 삭제할까요?");
	if(result) {
		$.ajax({
			url : "/find_delete",
			type : "POST",
			data : {id:id},
			success : function() {
				alert("게시글을 삭제했습니다!");
				window.location.href = '/find_list';
			},
			error : function(xhr, textStatus, errorThrown) {
				console.log("매물찾아요 게시물 삭제 실패");
				console.log(xhr, textStatus, errorThrown);
			}
		})
	}	
});

// 댓글 입력창 등록 버튼 클릭시
document.querySelector('.comment_btn').addEventListener('click', () => {
  let content = document.querySelector(".comment_box").value;	// 댓글 내용
	let find_id = document.querySelector(".find_no").value;	// 댓글이 등록되는 게시물의 인덱스
	let response_to = 0;	// 상위 댓글 인덱스 없음
  if(content == "")
    alert("댓글을 입력하세요");
	else if(content.length >= 500)
		alert("댓글은 500자 이내로 입력해주세요");
  else {
    $.ajax({
      url : "/find_response_post",
      type : "POST",
      data : {content:content, find_id:find_id, response_to:response_to},
      success : function(data) {
        alert("댓글이 등록 되었습니다")
				window.location.reload();
      },
      error : function(xhr, textStatus, errorThrown) {
        console.log("매물찾아요 댓글 등록실패");
        console.log(xhr, textStatus, errorThrown);
      }
    })
  }
});

// 답글 입력창 등록 버튼 클릭시 post or edit
document.querySelector('.response_btn').addEventListener('click', () => {
	let content = document.querySelector(".response_box").value;	// 답글 내용
	let find_id = document.querySelector(".find_no").value;	// 댓글이 등록되는 게시물의 인덱스
	let response_to = document.querySelector(".comment_id").value;	// 최상위 댓글 인덱스
	let is_edit = document.querySelector("#post_type_edit").value;	// insert or edit
	let comment_idx = document.querySelector("#edit_comment_idx").value;	// 수정할 답글 인덱스
  if(content == "")
    alert("답글을 입력하세요");
	else if(content.length >= 500)
		alert("답글은 500자 이내로 입력해주세요");
  else {
		if(is_edit == "true") {
			$.ajax({
				url : "/find_response_edit",
				type : "POST",
				data : {content:content, idx:comment_idx},
				success : function(data) {
					alert("답글을 수정했습니다")
					window.location.reload();
				},
				error : function(xhr, textStatus, errorThrown) {
					console.log("매물찾아요 답글 수정 실패");
					console.log(xhr, textStatus, errorThrown);
				}
			})
		} else {
			$.ajax({
				url : "/find_response_post",
				type : "POST",
				data : {content:content, find_id:find_id, response_to:response_to},
				success : function(data) {
					alert("답글이 등록 되었습니다")
					window.location.reload();
				},
				error : function(xhr, textStatus, errorThrown) {
					console.log("매물찾아요 답글 등록실패");
					console.log(xhr, textStatus, errorThrown);
				}
			})
		}
  }
});

// 페이지 로드 후 작업
// 수정, 삭제버튼이 다수 존재하기 때문에
document.addEventListener('DOMContentLoaded', function() {
	// 1.답글쓰기 버튼 클릭시 --> 답글창 on
	const btns = document.querySelectorAll(".response_open_btn");
	btns.forEach(btn => { 
    btn.addEventListener('click', () => {
			// 답글 입력창 on
			const response = document.querySelector(".container_response");
			response.classList.add("on");

			// 수정할 내용을 초기화
			document.querySelector(".response_box").value = "";

			//=== 등록버튼 클릭시 mysql insert
			const post_type = document.querySelector("#post_type_edit");
			post_type.value = "false";

			// 답글 입력창의 위치를 수정할 댓글 아래로 이동함
			const eidt_comment = btn.parentElement;
			eidt_comment.after(response);
		})
	});

	// 2.취소버튼 클릭시 답글 --> 답글창 off
	const cancel = document.querySelector(".cancel_btn");
	cancel.addEventListener('click', () => {
		// 수정할 답글을 보이게 함
		cancel.parentElement.parentElement.previousElementSibling.classList.remove("off");
		// 답글 입력창 off
		cancel.parentElement.parentElement.classList.remove("on");
	})

	// 3.댓글&답글 수정 버튼 클릭시 --> 답글창 on
	const edit_btns = document.querySelectorAll(".response_edit_btn");
	edit_btns.forEach(btn => { 
    btn.addEventListener('click', () => {
			// 답글 입력창 on
			const response = document.querySelector(".container_response");
			response.classList.add("on");
			
			// 수정할 내용 가져오기
			const content = btn.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
			document.querySelector(".response_box").value = content;

			//=== 등록버튼 클릭시 mysql edit
			const post_type = document.querySelector("#post_type_edit");
			post_type.value = "true";

			//=== 수정할 답글의 idx 가져오기
			const comment_idx = btn.previousElementSibling
													.previousElementSibling
													.previousElementSibling
													.previousElementSibling
													.previousElementSibling.value;
			document.querySelector("#edit_comment_idx").value = comment_idx;

			// 답글 입력창의 위치를 수정할 댓글 아래로 이동함
			const eidt_comment = btn.parentElement;
			eidt_comment.after(response);

			// 수정할 댓글을 보이지 않게함
			eidt_comment.classList.add("off");
		})
	});

	// 4. 댓글&답글 삭제 index
	const delete_btns = document.querySelectorAll(".response_delete_btn");
	delete_btns.forEach(btn => { 
		// 삭제할 답글의 idx 가져오기
		const idx = btn.previousElementSibling
										.previousElementSibling
										.previousElementSibling
										.previousElementSibling
										.previousElementSibling
										.previousElementSibling.value;
		btn.nextElementSibling.value = idx;
		// console.log("idx =" + idx); 현재 삭제버튼들의 각자 삭제용 comment index
	});	
});

// 댓글&답글 삭제버튼 클릭시
const delete_btns = document.querySelectorAll(".response_delete_btn");
for(let i=0; i<delete_btns.length; i++) {
	delete_btns[i].addEventListener('click', function() {
		let result = confirm("댓글을 삭제할까요?");
		let idx = delete_btns[i].nextElementSibling.value;
		// console.log("clicked idx = " + idx);
		if(result) {
			$.ajax({
				url : "/find_comment_delete",
				type : "POST",
				data : {idx:idx},
				success : function() {
					alert("댓글을 삭제했습니다!");
					window.location.reload();
				},
				error : function(xhr, textStatus, errorThrown) {
					console.log("질문답변 댓글답글 삭제 실패");
					console.log(xhr, textStatus, errorThrown);
				}
			})
		}
	});
}