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
ClassicEditor
  .create(document.querySelector('#editor'), editorConfig)
  .then(newEditor => {
    editor = newEditor;
		if(document.querySelector("#edit_btn")) {
			editor.disableReadOnlyMode('#editor');
		} else {
			editor.enableReadOnlyMode('#editor');
		}
  })
  .catch(error => {
    console.error(error);
  });

// 수정 버튼 클릭시
document.querySelector('#edit_btn').addEventListener('click', () => {
	let title = document.querySelector(".find_title").value;
	let id = document.querySelector(".find_no").value;
	let content = editor.getData();
	if(title == "")
		alert("제목을 입력하세요");
	else if(content == "")
		alert("내용을 입력하세요");
	else {
		$.ajax({
			url : "/find_edit",
			type : "POST",
			data : {title:title, id:id, content:content},
			success : function(data) {
				alert("수정했습니다")
				window.location.href = '/find_list';
			},
			error : function(xhr, textStatus, errorThrown) {
				console.log("매물찾아요 수정 실패");
				console.log(xhr, textStatus, errorThrown);
			}
		})
	}
});

// 삭제 버튼 클릭시
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
				console.log("매물찾아요 삭제 실패");
				console.log(xhr, textStatus, errorThrown);
			}
		})
	}	
});

// 댓글입력창 등록 버튼 클릭시
document.querySelector('.comment_btn').addEventListener('click', () => {
  let content = document.querySelector(".comment_box").value;
	// 댓글이 등록되는 게시물의 인덱스
	let find_id = document.querySelector(".find_no").value;
	// 상위 댓글 인덱스
	// let response_to = ;

  if(content == "")
    alert("댓글을 입력하세요");
  else {
    $.ajax({
      url : "/find_comment_post",
      type : "POST",
      data : {content:content, find_id:find_id},
      success : function(data) {
        alert("등록 되었습니다")
				// 댓글 바로 볼수 있게 디테일페이지로 가야함
				// ajax 사용해서 리로드 하지 않게 해야함
        window.location.href = '/find_list';
      },
      error : function(xhr, textStatus, errorThrown) {
        console.log("매물찾아요 댓글 등록실패");
        console.log(xhr, textStatus, errorThrown);
      }
    })
  }
});

document.addEventListener('DOMContentLoaded', function() {
	const btns = document.querySelectorAll(".response_open_btn");
	btns.forEach(btn => { 
    btn.addEventListener('click', () => {
			// 대댓글 입력창 열기
			const response = document.querySelector(".container_response");
			response.classList.add("on");

			// 대댓글 입력창의 위치를 선택한 댓글 아래로 이동함
			const comment_list = btn.parentElement;
			comment_list.after(response);
		})
	});

	// 대댓글 입력창 닫기
	const cancel = document.querySelector(".cancel_btn");
	cancel.addEventListener('click', () => {
		const response = document.querySelector(".container_response");
		response.classList.remove("on");
	})
});