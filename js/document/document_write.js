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
	initialData: ' ',
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
	placeholder: '아래와 같은 게시물은 알림없이 삭제하니 주의바랍니다\n-게시판 성격과 맞지 않는 내용\n-광고/홍보성 내용\n-비방, 욕설, 정치글',
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
}).catch(error => {
	console.error(error);
});


// 서식자료실 업로드 파일 용량 제한
document.addEventListener('DOMContentLoaded', function() {
	var fileInput = document.querySelector(".attach_btn")
	fileInput.addEventListener('change', function() {
		var file = fileInput.files[0];
		if (file.size > 2 * 1024 * 1024) {
			alert('첨부 파일의 크기는 2mb를 초과할 수 없습니다');
			fileInput.value = '';
		}
	});
});


// 등록 버튼 클릭시
document.querySelector('#post_btn').addEventListener('click', () => {
  let title = document.querySelector(".input_title").value;
  let content = editor.getData();
	let attach = document.querySelector(".attach_btn");
  if(title == "")
    alert("제목을 입력하세요");
	else if(title.length >= 45) 
		alert("제목은 45자 이내로 입력해주세요");
  else if(content == "")
    alert("내용을 입력하세요");
	else if(attach.files.length == 0)
    alert("파일을 첨부하세요");
  else {
    let formData = new FormData();
    formData.append("attachment", attach.files[0]);
		formData.append("title", title);
		formData.append("content", content);

    $.ajax({
      url : "/document_post",
      type : "POST",
			enctype :"multipart/form-data",
      data: formData,
      contentType: false, // 필수 : x-www-form-urlencoded로 파싱되는 것을 방지
      processData: false,  // 필수: contentType을 false로 줬을 때 QueryString 자동 설정됨. 해제
      success : function(data) {
        alert("등록 되었습니다")
        window.location.href = '/document_list';
      },
      error : function(xhr, textStatus, errorThrown) {
				alert("로그인이 필요합니다");
				window.location.href = '/login';
        //console.log("서식자료실 게시물 등록실패");
        //console.log(xhr, textStatus, errorThrown);
      }
    })
  }
});