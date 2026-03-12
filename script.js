const seatArea = document.getElementById("seatArea");

let selectedSeats = [];
let isAnimating = false;

document.getElementById("generate").onclick = createSeats;
document.getElementById("randomize").onclick = randomizeSeats;
document.getElementById("reshuffle").onclick = randomizeSeats;
document.getElementById("saveImage").onclick = saveImage;

// 좌석 생성
function createSeats() {
    const rows = parseInt(document.getElementById("rows").value);
    const cols = parseInt(document.getElementById("cols").value);

    seatArea.innerHTML = "";
    seatArea.style.gridTemplateColumns = `repeat(${cols},70px)`;

    for (let i = 0; i < rows * cols; i++) {
        const seat = document.createElement("div");
        seat.classList.add("seat");
        seat.onclick = (e) => seatClick(e, seat);
        seatArea.appendChild(seat);
    }

    selectedSeats = [];
}

// 좌석 클릭
function seatClick(e, seat) {
    if (e.shiftKey) {
        seat.classList.toggle("special");
        seat.classList.remove("excluded");
        return;
    }

    if (seat.innerText != "") {
        seatSwap(seat);
        return;
    }

    seat.classList.toggle("excluded");
    seat.classList.remove("special");
}

// 좌석 자리 교체
function seatSwap(seat) {
    selectedSeats.push(seat);
    seat.classList.add("selected");

    if (selectedSeats.length === 2) {
        const a = selectedSeats[0].innerText;
        const b = selectedSeats[1].innerText;

        selectedSeats[0].innerText = b;
        selectedSeats[1].innerText = a;

        selectedSeats[0].classList.remove("selected");
        selectedSeats[1].classList.remove("selected");

        selectedSeats = [];
    }
}

// 랜덤 배치 버튼
function randomizeSeats() {
    if (isAnimating) return;

    const seats = document.querySelectorAll(".seat");
    if (seats.length === 0) {
        alert("먼저 좌석을 생성하세요!");
        return;
    }

    isAnimating = true;

    // 카운트다운과 셔플 동시에 실행
    startCountdown();
    animateShuffle();
}

// 카운트다운
function startCountdown() {
    const cd = document.getElementById("countdown");
    let count = 5;

    cd.style.display = "block";
    cd.innerText = count;

    const timer = setInterval(() => {
        count--;
        if (count <= 0) {
            clearInterval(timer);
            cd.style.display = "none";
        } else {
            cd.innerText = count;
        }
    }, 1000);
}

// 숫자 셔플 애니메이션
function animateShuffle() {
    const seats = document.querySelectorAll(".seat");
    let duration = 5000; // 5초 동안 돌아감
    let start = Date.now();

    const interval = setInterval(() => {
        seats.forEach(seat => {
            if (seat.classList.contains("excluded")) return;
            seat.innerText = Math.floor(Math.random() * 99) + 1;
        });

        if (Date.now() - start > duration) {
            clearInterval(interval);
            finalSeatAssignment();
            isAnimating = false;
        }
    }, 80);
}

// 최종 좌석 배정
function finalSeatAssignment() {
    const start = parseInt(document.getElementById("startNum").value);
    const end = parseInt(document.getElementById("endNum").value);

    let numbers = [];
    for (let i = start; i <= end; i++) numbers.push(i);

    const seats = document.querySelectorAll(".seat");

    // 제외 좌석 제외
    const usableSeats = [...seats].filter(s => !s.classList.contains("excluded"));

    if (numbers.length < usableSeats.length) {
        alert("출석번호가 좌석보다 부족합니다!");
    }

    shuffle(numbers);

    // 특정 좌석 숫자
    const specialNumbers = document.getElementById("specialNumbers").value
        .split(",")
        .map(n => parseInt(n.trim()))
        .filter(n => !isNaN(n));

    let specialSeats = [];

    seats.forEach(seat => {
        if (seat.classList.contains("special")) specialSeats.push(seat);
        seat.innerText = "";
    });

    shuffle(specialNumbers);

    specialSeats.forEach(seat => {
        if (specialNumbers.length > 0) {
            let num = specialNumbers.pop();
            seat.innerText = num;
            numbers = numbers.filter(n => n !== num);
        }
    });

    shuffle(numbers);

    seats.forEach(seat => {
        if (seat.classList.contains("excluded")) return;
        if (seat.innerText != "") return;
        if (numbers.length > 0) seat.innerText = numbers.pop();
    });
}

// 배열 섞기
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 이미지 저장
function saveImage() {
    html2canvas(document.body).then(canvas => {
        const link = document.createElement("a");
        link.download = "seat.png";
        link.href = canvas.toDataURL();
        link.click();
    });
}
