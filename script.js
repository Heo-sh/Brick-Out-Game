// canvas with pen
let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');


// Ball
// x, y는 원의 좌표
let x = canvas.width / 2; // 240
let y = canvas.height - 30; // 220

//원의 반지름 = 10
let ballRadius = 10;

// Ball을 움직이기 위한 변수
let dx = 2;
let dy = -2;

// Paddle
let paddleHeight = 5;
let paddleWidth = 80;
let paddleX = (canvas.width - paddleWidth) / 2;
let leftPressed = false;
let rightPressed = false;

// Brick
let brickRowCount = 3; // 3행
let brickColumnCount = 5; // 5열
let brickWidth = 75; // brick의 크기
let brickHeight = 20; // brick의 크기
let brickPadding = 10; // brick 사이의 공간
let brickOffsetLeft = 30;
let brickOffsetTop = 30;
let bricks = [];

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {x: 0, y: 0, status: 1}
    }
}

console.log(bricks);

// Score
let score = 0;

// life
let lives = 3;

// Draw Bricks!
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let brick = bricks[c][r];

            brick.x = c * (brickWidth + brickPadding) + brickOffsetLeft;
            brick.y = r * (brickHeight + brickPadding) + brickOffsetTop;

            // 살아있는 벽돌만 그린다.
            if (brick.status === 1){
                ctx.beginPath();
                ctx.rect(brick.x, brick.y, brickWidth, brickHeight);
                ctx.fillStyle = '#333';
                ctx.fill();
                ctx.closePath();

                // Ball이 bricks에 충돌했을 때
                if (
                    x > brick.x 
                    && x < brick.x + brickWidth 
                    && y > brick.y
                    && y < brick.y + brickHeight
                ) {
                    dy = -dy;
                    // 벽돌이 비활성화된다.
                    brick.status = 0;
                    score++;

                    // if you win
                    if (score === brickColumnCount * brickRowCount) {
                        alert('YOU WIN');
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// Paddle을 움직이기 위한 event
// keyboard를 누를 때
document.addEventListener('keydown', (e) => {
    console.log('keydown', e.key);

    if (e.key === 'ArrowRight') {
        rightPressed = true;
    }
    if (e.key === 'ArrowLeft') {
        leftPressed = true;
    }
})

// keyboard에서 손을 뗄 때
document.addEventListener('keyup', (e) => {
    console.log('keyup', e.key);

    if (e.key === 'ArrowRight') {
        rightPressed = false;
    }
    if (e.key === 'ArrowLeft') {
        leftPressed = false;
    }
})


// Ball을 움직이게 하는 함수
function draw() {

    // .clearRect(): 원하는 좌표의 내부를 지운다
    // 0, 0: 최상단, 맨왼쪽 canvas.width, canvas.height: 최하단, 맨오른쪽 => canvas 전체를 선택
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ball 그리기
    ctx.beginPath(); // 그리기 시작
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2); // arc: 원을 그릴 때 사용하는 ctx의 메서드
    ctx.fillStyle = '#333'; // fillStyle = Color
    ctx.fill(); // fill 메서드를 호출
    ctx.closePath(); // 그리기 끝

    // paddle 그리기
    ctx.beginPath();
    // rect(left, top, width, height): 직사각형을 그릴 때 사용되는 ctx의 메서드
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight); 
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.closePath();

    // Draw Bricks! 호출!
    drawBricks();

    // 점수 그리기
    ctx.font = '16px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText(`Score: ${score}`, 8, 20);

    // life 그리기 
    ctx.font = '16px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);

    // 방향키 조작
    if (leftPressed) {
        paddleX -= 6;

        if (paddleX < 0) {
            paddleX = 0;
        }
    }

    if (rightPressed) {
        paddleX += 6;

        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    }

    // +, - ballRadius를 해주는 이유는 자연스럽게 부딪히는 현상을 보여주기 위해서이다.
    // 상단에 부딪혔을 때
    if (y < 0 + ballRadius) {
        dy = -dy;
    }
    // 우측에 부딪혔을 때 (480 = canvas.width)
    if (x > 480 - ballRadius) {
        dx = -dx;
    }
    // 좌측에 부딪혔을 때
    if (x < 0 + ballRadius) {
        dx = -dx;
    }
    // 하단에 부딪혔을 때 (250 = canvas.height)
    if (y > 250 - ballRadius) {
        
        // ball이 paddle 안으로 들어올 때
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else { // ball이 paddle 밖으로 떨어질 때
            // life 1 감소
            lives--;

            // Game Over
            if (!lives) {
                alert('GAME OVER');
                // 새로고침
                return document.location.reload();
            }

            // ball 위치 초기화
            x = canvas.width / 2;
            y = canvas.height - 30;
            // ball의 진행방향 초기화
            dx = 2;
            dy = -dy;

            // paddle 위치 초기화
            paddleX = (canvas.width - paddleWidth) / 2; 
        }
    }

    // Ball의 좌표 이동
    x += dx;
    y += dy;
}

setInterval(draw, 10);