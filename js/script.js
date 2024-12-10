const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorButtons = document.querySelectorAll('.color-btn');
const undoButton = document.getElementById('undoButton');

let isDrawing = false;
let currentColor = '#ED005B';
let paths = []; // 모든 경로 저장
let currentPath = []; // 현재 그리고 있는 경로

// 버튼 데이터 (id, 링크, 위치 비율)
const buttonData = [
    { id: 'a-button', link: '2-a.html', x: 0.24, y: 0.21, width: 0.1135, height: 0.1085 },
    { id: 'b-button', link: '3-b.html', x: 0.226, y: 0.34, width: 0.1135, height: 0.1085 },
    { id: 'c-button', link: '4-c.html', x: 0.24, y: 0.47, width: 0.1135, height: 0.1085 },
    { id: 'd-button', link: '5-d.html', x: 0.225, y: 0.59, width: 0.117, height: 0.1085 },
    { id: 'e-button', link: '6-e.html', x: 0.642, y: 0.377, width: 0.132, height: 0.106 },
    { id: 'f-button', link: '7-f.html', x: 0.637, y: 0.485, width: 0.117, height: 0.106 },
    { id: 'g-button', link: '8-g.html', x: 0.64, y: 0.603, width: 0.132, height: 0.108 },
    { id: 'h-button', link: '9-h.html', x: 0.6506, y: 0.723, width: 0.115, height: 0.11 },
];

// 캔버스 초기화
function resizeCanvas() {
    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = window.innerWidth * pixelRatio;
    canvas.height = window.innerHeight * pixelRatio;

    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    ctx.scale(pixelRatio, pixelRatio);

    drawBackgroundImage();
}

window.addEventListener('resize', resizeCanvas);

// 배경 이미지 설정
const backgroundImage = new Image();
backgroundImage.src = './images/homeimagever2.png';

function drawBackgroundImage() {
    const pixelRatio = window.devicePixelRatio || 1;

    const imgWidth = backgroundImage.width;
    const imgHeight = backgroundImage.height;

    const imgAspectRatio = imgWidth / imgHeight;
    const canvasAspectRatio = canvas.width / canvas.height;

    let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

    if (imgAspectRatio > canvasAspectRatio) {
        drawWidth = canvas.width / pixelRatio;
        drawHeight = drawWidth / imgAspectRatio;
        offsetY = (canvas.height / pixelRatio - drawHeight) / 2;
    } else {
        drawHeight = canvas.height / pixelRatio;
        drawWidth = drawHeight * imgAspectRatio;
        offsetX = (canvas.width / pixelRatio - drawWidth) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, offsetX, offsetY, drawWidth, drawHeight);

    restorePaths();

    // 버튼 초기화 호출
    initializeButtons(drawWidth, drawHeight, offsetX, offsetY);
}

// 버튼 초기화 함수
function initializeButtons(imgWidth, imgHeight, offsetX, offsetY) {
    buttonData.forEach(button => {
        const btn = document.getElementById(button.id) || document.createElement('div');
        btn.id = button.id;
        btn.classList.add('common-button'); // 공통 CSS 클래스
        btn.style.position = 'absolute';
        btn.style.width = `${imgWidth * button.width}px`;
        btn.style.height = `${imgHeight * button.height}px`;
        btn.style.left = `${offsetX + imgWidth * button.x}px`;
        btn.style.top = `${offsetY + imgHeight * button.y}px`;
        btn.onclick = () => (window.location.href = button.link);
        
        // 개별버튼 회전 //
        if (button.id === 'b-button') {
            btn.style.transform = 'rotate(-5deg)';
        }
        if (button.id === 'd-button') {
            btn.style.transform = 'rotate(+3deg)';
        }
        if (button.id === 'e-button') {
            btn.style.transform = 'rotate(-2deg)';
        }
        if (button.id === 'f-button') {
            btn.style.transform = 'rotate(4deg)';
        }
        if (button.id === 'g-button') {
            btn.style.transform = 'rotate(2deg)';
        }
        if (button.id === 'h-button') {
            btn.style.transform = 'rotate(4deg)';
        }

        btn.onclick = () => (window.location.href = button.link);
        // 버튼이 이미 추가되지 않았다면 body에 추가
        if (!document.body.contains(btn)) {
            document.body.appendChild(btn);
        }
    });
}

// 저장된 경로를 다시 그림
function restorePaths() {
    paths.forEach(path => {
        ctx.strokeStyle = path.color;
        ctx.beginPath();
        path.points.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        ctx.stroke();
    });
}

// 선 그리기 시작
function startDrawing(x, y) {
    isDrawing = true;
    currentPath = [{ x, y }];
}

function draw(x, y) {
    if (!isDrawing) return;
    currentPath.push({ x, y });

    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    const { x: startX, y: startY } = currentPath[currentPath.length - 2];
    ctx.moveTo(startX, startY);
    ctx.lineTo(x, y);
    ctx.stroke();
}

function stopDrawing() {
    if (!isDrawing) return;
    isDrawing = false;

    paths.push({
        color: currentColor,
        points: currentPath,
    });
    currentPath = [];
}

// 뒤로가기 버튼 (직전 행동만 삭제)
function undo() {
    if (paths.length === 0) return;
    paths.pop();

    drawBackgroundImage();
}

// 마우스 이벤트
canvas.addEventListener('mousedown', (e) => startDrawing(e.clientX, e.clientY));
canvas.addEventListener('mousemove', (e) => draw(e.clientX, e.clientY));
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);

// 터치 이벤트
canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    startDrawing(touch.clientX, touch.clientY);
});

canvas.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    draw(touch.clientX, touch.clientY);
});

canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchcancel', stopDrawing);

// 색상 변경
colorButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentColor = button.getAttribute('data-color');
    });
});

// 뒤로가기 버튼
undoButton.addEventListener('click', undo);

// 이미지 로드 후 초기화
backgroundImage.onload = () => {
    resizeCanvas();
};
