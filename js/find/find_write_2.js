import {
	ClassicEditor,
	AccessibilityHelp,
	Alignment,
	AutoImage,
	AutoLink,
	Autosave,
	Bold,
	CloudServices,
	Essentials,
	FontBackgroundColor,
	FontColor,
	FontFamily,
	FontSize,
	Highlight,
	//Image,
	ImageBlock,
	ImageCaption,
	ImageInsert,
	ImageInsertViaUrl,
	ImageToolbar,
	ImageUpload,
	Italic,
	Link,
	Paragraph,
	SelectAll,
	SimpleUploadAdapter,
	SpecialCharacters,
	Table,
	TableCaption,
	TableCellProperties,
	TableColumnResize,
	TableProperties,
	TableToolbar,
	Underline,
	Undo,
} from 'ckeditor5';

import translations from 'ckeditor5/translations/ko.js';

const editorConfig = {
	toolbar: {
		items: [
			'undo',
			'redo',
			'|',
			'selectAll',
			'|',
			'fontSize',
			'fontFamily',
			'fontColor',
			'fontBackgroundColor',
			'|',
			'bold',
			'italic',
			'underline',
			'|',
			'specialCharacters',
			'link',
			'insertImage',
			'insertTable',
			'highlight',
			'|',
			'alignment',
			'|',
			'accessibilityHelp'
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
		CloudServices,
		Essentials,
		FontBackgroundColor,
		FontColor,
		FontFamily,
		FontSize,
		Highlight,
		//Image,
		ImageBlock,
		ImageCaption,
		ImageInsert,
		ImageInsertViaUrl,
		ImageToolbar,
		ImageUpload,
		Italic,
		Link,
		Paragraph,
		SelectAll,
		SimpleUploadAdapter,
		SpecialCharacters,
		Table,
		TableCaption,
		TableCellProperties,
		TableColumnResize,
		TableProperties,
		TableToolbar,
		Underline,
		Undo,
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
			'ImageCaption',
			'imageTextAlternative'],
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
})
.catch(error => {
	console.error(error);
});


//
document.querySelector('#post_btn').addEventListener('click', () => {
  let title = document.querySelector(".input_title").value;
  let content = editor.getData();
  if(title == "")
    alert("제목을 입력하세요");
  else if(content == "")
    alert("내용을 입력하세요");
  else {
    $.ajax({
      url : "/find_post",
      type : "POST",
      data : {title:title, content:content},
      success : function(data) {
        alert("등록 되었습니다")
        window.location.href = '/find_list';
      },
      error : function(xhr, textStatus, errorThrown) {
        console.log("매물찾아요 등록실패");
        console.log(xhr, textStatus, errorThrown);
      }
    })
  }
});
