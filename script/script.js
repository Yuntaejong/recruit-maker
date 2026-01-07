// ===== 1. 소제목 추가 기능 =====
document.getElementById("add-content-wrap").addEventListener("click", () => {
	const editor = document.querySelector(".editor");
	const buttonWrap = editor.querySelector(".button-wrap");

	// 현재 sub-title-wrap 개수 확인
	const subTitleWraps = editor.querySelectorAll(".sub-title-wrap");
	const newNumber = subTitleWraps.length + 1;

	// 에디터에 새 sub-title-wrap 추가
	const newSubTitleWrap = document.createElement("div");
	newSubTitleWrap.className = "sub-title-wrap title-wrap";
	newSubTitleWrap.setAttribute("data-number", newNumber);
	newSubTitleWrap.innerHTML = `
				<div>
						<div class="title-wrap">
								<span class="title">소제목</span>
								<input required type="text" class="text-input" data-value="sub-title">
						</div>
						<div class="title-wrap">
								<span class="title">내용</span>
								<div class="input-wrap">
										<textarea required data-value="sub-desc"></textarea>
								</div>
						</div>
				</div>
		`;

	// 버튼 앞에 삽입
	buttonWrap.parentNode.insertBefore(newSubTitleWrap, buttonWrap);

	// 결과물 section2에도 field-wrap 추가
	const section2 = document.querySelector(".section2");
	const newFieldWrap = document.createElement("div");
	newFieldWrap.className = "field-wrap";

	// 첫 번째 field-wrap인지 확인
	const existingFieldWraps = section2.querySelectorAll(".field-wrap");
	const isFirst = existingFieldWraps.length === 0;

	// 첫 번째면 d-flex 포함, 아니면 제외
	if (isFirst) {
		newFieldWrap.innerHTML = `
						<span class="badge"></span>
						<div class="d-flex">[<p class="team" data-value="field"></p>]</div>
						<div class="list-desc"></div>
				`;
	} else {
		newFieldWrap.innerHTML = `
						<span class="badge"></span>
						<div class="list-desc"></div>
				`;
	}

	section2.appendChild(newFieldWrap);
});

// ===== 1.1. 소제목 삭제 기능 =====
document.getElementById("remove-content-wrap").addEventListener("click", () => {
	const editor = document.querySelector(".editor");
	const subTitleWraps = editor.querySelectorAll(".sub-title-wrap");
	const alertMent = document.getElementById("alert-ment");

	// 소제목이 1개만 남아있는 경우
	if (subTitleWraps.length <= 1) {
		alertMent.innerText = "최소 1개의 소제목이 필요합니다";
		return;
	}

	// alert 메시지 초기화
	alertMent.innerText = "";

	// 가장 마지막 sub-title-wrap 삭제
	const lastSubTitleWrap = subTitleWraps[subTitleWraps.length - 1];
	lastSubTitleWrap.remove();

	// 결과물 section2의 마지막 field-wrap도 삭제
	const section2 = document.querySelector(".section2");
	const fieldWraps = section2.querySelectorAll(".field-wrap");

	if (fieldWraps.length > 0) {
		const lastFieldWrap = fieldWraps[fieldWraps.length - 1];
		lastFieldWrap.remove();
	}
});




// ===== 2. 만들기 버튼 기능 =====
document.getElementById("send_button").addEventListener("click", () => {
	// 2-1. 에디터 숨기기
	const displayNone = document.getElementById("content").style.display = "none";
	if (displayNone == true) {
		document.body.style.height = "auto";
		document.body.style.overflow = "auto";
	} else {
		document.body.style.height = "100vh";
		document.body.style.overflow = "none";
	}
		

	// 2-2. 제목과 거래처, 모집분야 값 가져오기
	const headlineValue = document.getElementById("headline").value.trim();
	const companyValue = document.getElementById("company").value.trim();
	const fieldInput = document.getElementById("field");
	const fieldValue = fieldInput ? fieldInput.value.trim() : "";

	// 2-3. 유효성 검사 (선택사항)
	if (!headlineValue || !companyValue) {
		alert("제목과 거래처를 모두 입력해주세요.");
		document.getElementById("content").style.display = "block";
		return;
	}

	// 2-4. 공고 결과물에 제목, 거래처 값 넣기
	// headline 영역
	const headlineDiv = document.querySelector(
		'.headline[data-value="headline"]'
	);
	if (headlineDiv) {
		headlineDiv.innerText = headlineValue;
	}

	// h2 안의 company span
	const companySpanInH2 = document.querySelector(
		'h2 span[data-value="company"]'
	);
	if (companySpanInH2) {
		companySpanInH2.innerText = companyValue;
	}

	// main-desc 안의 company span
	const companySpanInDesc = document.querySelector(
		'.main-desc span[data-value="company"]'
	);
	if (companySpanInDesc) {
		companySpanInDesc.innerText = companyValue;
	}

	// 2-5. 소제목 섹션들 처리
	const subTitleWraps = document.querySelectorAll("#content .sub-title-wrap");
	const fieldWraps = document.querySelectorAll(".section2 .field-wrap");

	subTitleWraps.forEach((wrap, index) => {
		// field-wrap이 없으면 건너뛰기
		if (index >= fieldWraps.length) return;

		// 현재 소제목 섹션의 input 값들 가져오기
		const subTitleInput = wrap.querySelector('[data-value="sub-title"]');
		const subDescTextarea = wrap.querySelector('[data-value="sub-desc"]');

		const subTitleValue = subTitleInput.value.trim();
		const subDescValue = subDescTextarea ? subDescTextarea.value.trim() : "";

		// 2-5-1. badge에 소제목 넣기
		const badge = fieldWraps[index].querySelector(".badge");
		if (badge && subTitleValue) {
			badge.innerText = subTitleValue;
		}

		// 2-5-2. 첫 번째 field-wrap인 경우 team에 field 값 넣기
		if (index === 0) {
			const teamP = fieldWraps[index].querySelector(
				'.team[data-value="field"]'
			);
			if (teamP && fieldValue) {
				teamP.innerText = fieldValue;
			}
		}

		// 2-5-3. list-desc에 textarea 내용 넣기
		const listDesc = fieldWraps[index].querySelector(".list-desc");
		if (listDesc && subDescValue) {
			// 줄바꿈을 기준으로 분리하여 각각을 p 태그로 생성
			const lines = subDescValue
				.split("\n")
				.filter((line) => line.trim() !== "");

			// 기존 내용 삭제
			listDesc.innerHTML = "";

			// 각 줄을 p 태그로 추가
			lines.forEach((line) => {
				const p = document.createElement("p");
				p.innerText = line.trim();
				listDesc.appendChild(p);
			});
		}
	});
});



// ===== 3. 수정하기 버튼 기능 =====
document.getElementById("back_button").addEventListener("click", () => {
	// 에디터 다시 보이기
	document.getElementById("content").style.display = "block";
});

// ===== 4. 이미지 저장 버튼 기능 (html2canvas 사용) =====
document.getElementById("save_button").addEventListener("click", () => {
	const wrapper = document.querySelector(".wrapper");

	html2canvas(wrapper, {
		scale: 2,
		useCORS: true,
		backgroundColor: "#ffffff",
	}).then((canvas) => {
		// canvas를 이미지로 변환하여 다운로드
		const link = document.createElement("a");
		link.download = "채용공고.png";
		link.href = canvas.toDataURL("image/png");
		link.click();
	});
});
