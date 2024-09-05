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
	ImageBlock,
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
	Undo
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
		ImageBlock,
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
		toolbar: ['imageTextAlternative']
	},
	initialData: document.querySelector(".input_content").value,
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
	translations: [translations]
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

document.querySelector('#edit_btn').addEventListener('click', () => {
	let title = document.querySelector(".input_title").value;
	let id = document.querySelector(".input_no").value;
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

document.querySelector('#delete_btn').addEventListener('click', () => {
	let id = document.querySelector(".input_no").value;
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
