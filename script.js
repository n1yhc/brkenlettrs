const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorButtons = document.querySelectorAll('.color-btn');
const undoButton = document.getElementById('undoButton');

let isDrawing = false;
let currentColor = '#ED005B';
let paths = []; // 모든 경로 저장
let currentPath = []; // 현재 그리고 있는 경로

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
backgroundImage.src = 'https://i.imgur.com/9xF3ofq.jpeg';

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

// 특정 영역 클릭 처리
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio || 1;

    // 클릭한 좌표 계산
    const clickX = (e.clientX - rect.left) * pixelRatio;
    const clickY = (e.clientY - rect.top) * pixelRatio;

    // 화면 중앙 기준으로 특정 영역(50x50px) 정의
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const regionSize = 50 * pixelRatio; // 영역 크기 (픽셀 비율 적용)

    if (
        clickX >= centerX - regionSize / 2 &&
        clickX <= centerX + regionSize / 2 &&
        clickY >= centerY - regionSize / 2 &&
        clickY <= centerY + regionSize / 2
    ) {
        // 클릭한 좌표가 영역 안에 있다면 URL 이동
        window.location.href = 'https://blog.naver.com/xchoix831';
    }
});

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