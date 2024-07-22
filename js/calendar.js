let calendar;
let isLogin;  // 로그인 여부

document.addEventListener('DOMContentLoaded', function() {
  // todo
  const addBtn = document.querySelector('#addBtn');
  addBtn.addEventListener('click', () => {
    if (!isLogin) {
      alert("로그인이 필요합니다");
    } else {
      createTodo();
    }
  })

  // db 저장된 schedule
  let jsonData;
  let arrayData;
  let headerToolbar; // 캘린더 헤더 옵션
  if (!document.querySelector("#scheduleData").value) { 
    // 로그인 되어 있지 않으면
    isLogin = false;
    arrayData = [];
    headerToolbar = {
      left: 'title',
      right: 'today prev next'
    }
  } else {  
    // 로그인 되어 있으면
    isLogin = true;
    jsonData = document.querySelector("#scheduleData").value;
    arrayData = JSON.parse(jsonData);
    headerToolbar = {
      left: 'title',
      center: 'addEventButton',
      right: 'today prev next'
    }
  }
  //console.log(arrayData);

  // 캘린더 생성 옵션
  const calendarOption = {
    height: '800px',  // calendar 높이 설정
    expandRows: true, // 화면에 맞게 높이 재설정
    initialView: 'dayGridMonth', // 초기 로드시 캘린더 화면 (기본설정: month)
    headerToolbar: headerToolbar,
    titleFormat : function(date) {
			return date.date.year + '년 ' + (parseInt(date.date.month) + 1) + '월';
		},
    // 날짜에서 "일" 제거
    dayCellContent: function(info) {
      let number = document.createElement("a");
      number.classList.add("fc-daygrid-day-number");
      number.innerHTML = info.dayNumberText.replace("일", "").replace("day", "");
      if (info.view.type === "dayGridMonth") {
        return {
          html: number.outerHTML
        };
      }
      return {
        domNodes: []
      }
    },
    customButtons: {
      addEventButton: { // 추가한 버튼 설정
        text : "일정 추가",   // 버튼 내용
        click : function() { // 버튼 클릭시 이벤트
          showModal();
        }
      }
    },
    navLinks : false,  // 날짜, 요일 클릭시 주단위, 일단위로 넘어가는 기능
		selectable : true, // 사용자가 일정 범위를 선택하여 이벤트를 추가
		droppable : false,  // 캘린더에 요소를 드롭하여 이벤트를 생성할 수 있도록 허용
		editable : false,   // 이벤트의 드래그 앤 드롭, 리사이징, 이동을 허용
    fixedWeekCount : false,
    dayMaxEventRows: true,  // Row 높이보다 많으면 +숫자 more 링크 표시
		nowIndicator: true, // 현재 시간 마크
    displayEventTime: false, // 시간 표시 x, 하루이상 일정등록시 end날짜 포함
    eventDisplay : 'block',
		locale: 'ko', // 한국어 설정
    events: arrayData    // 캘린더에 표시할 이벤트 데이터를 정의 
	};

  // 캘린더 생성
  const calendarEl = document.querySelector('#calendar');
  calendar = new FullCalendar.Calendar(calendarEl, calendarOption);
  calendar.render();

  // 캘린더 이벤트 등록
  calendar.on("eventAdd", info => console.log("Add:", info));
  calendar.on("eventRemove", info => console.log("Remove:", info));
  calendar.on("select", info => { showModal(); });
  calendar.on("eventClick", info => {
    let result = confirm("일정을 삭제할까요?");
    if (result) {
      $.ajax({
        url : "/schedule_delete",
        type : "POST",
        data : {id:info.event.id},
        success : function(data) {
          if(data == "일정삭제성공") {
            info.event.remove();
            alert("일정을 삭제했습니다")
          }
        }
      })
    }
  });
});


// 일정등록 모달 show
function showModal() {
  if (!isLogin) {
    alert("로그인이 필요합니다");
    return;
  }
  // 모달 show
  const modal = document.querySelector('.modal');
  modal.classList.add('on');
  // 입력창 초기화
  document.querySelector("#title").value = "";
  document.querySelector("#start_date").value = "";
  document.querySelector("#end_date").value = "";
}


// 일정등록 모달 off
function closeModal() { 
  const modal = document.querySelector('.modal');
  modal.classList.remove('on');
}


// 일정 등록
function addCalendar() { 
  let title = document.querySelector("#title").value;
  let start_date = document.querySelector("#start_date").value;
  let end_date = document.querySelector("#end_date").value;
  let color = document.querySelector("#select").value;
  if(title == null || title == "") {
    alert("일정내용을 입력하세요");
  } else if(start_date == "") {
    alert("시작날짜를 입력하세요");
  } else if(end_date == "") {
    alert("종료날짜를 입력하세요");
  } else if(new Date(end_date)- new Date(start_date) < 0) { // date 타입으로 변경 후 확인
    alert("종료날짜가 시작날짜보다 먼저입니다!");
  } else { 
    let obj = {
      "title" : title,
      "start" : start_date + " 00:00:00", // 2일 이상 일정추가시 캘린더에 하루 적게 표시되는 것을 수정하기 위해 시간 추가
      "end" : end_date + " 24:00:00",
      "backgroundColor" : color,  
    } 
    $.ajax({
      url : "/schedule_add",
      type : "POST",
      data : {title:obj.title, start:obj.start, end:obj.end, color:obj.backgroundColor},
      success : function(data) {
        if(data == "일정등록성공") {
          calendar.addEvent(obj);
          alert("일정을 등록했습니다")
        }
      }
    })
    closeModal();
  }
}


// todo 등록
function createTodo(event) {
  const count = document.querySelector('#todoList').childElementCount;
  if(count >= 15) {
    alert("할 일은 15개까지만 등록할 수 있습니다");
    return;
  }
  const todoInput = document.querySelector('#todoInput');
  if(todoInput.value == null || todoInput.value == "") {
    alert("할 일을 입력하세요");
  } else if (todoInput.value.length > 20) {
    alert("20글자 이하로 입력해주세요 (띄어쓰기 포함)");
  } else {
    $.ajax({
      url : "/todo_add",
      type : "POST",
      data : {title:todoInput.value},
      success : function(data) {
        if(data == "투두저장성공") {
          window.location.href = '/calendar';
          // 화면을 리로드하지 않고 ajax 사용하여 부분 갱신하는 방법 필요
        }
      }
    })
    todoInput.value = ''; // todo 등록후 input창 초기화
  }
}


// todo 삭제
function deleteTodo(e) {
	num = e.dataset.id; // todod id번호
  if(confirm("삭제할까요?")) {
		$.ajax({
      url : "/todo_delete",
      type : "POST",
      data : {id:num},
      success : function(data) {
        if(data == "투두삭제성공") {
          window.location.href = '/calendar';
          // 화면을 리로드하지 않고 ajax 사용하여 부분 갱신하는 방법 필요
        }
      }
    })
	}
}
