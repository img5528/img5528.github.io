document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const doodler = document.createElement('div');
    const scoring = document.createElement('div');

    let doodlerLeftSpace = 50;
    let startPoint = 150;
    let doodlerBottomSpace = startPoint;
    let isGameOver = false;
    let platformCount = 5;
    let platforms = [];
    let upTimerId;
    let downTimerId;
    let isJumping = true;
    let isGoingLeft = false;
    let isGoingRight = false;
    let leftTimerId;
    let rightTimerId;
    let startTimerId;
    let score = 0;
    let highscore = 0;
    let isStarted = false;
    const txtng = 'Appuyer sur une touche pour jouer';

    const prepoIMG = 'assets/img/'

    function createDoodler() {
        grid.appendChild(doodler);
        doodlerLeftSpace = platforms[0].left;
        doodler.classList.add('doodler');
        doodler.style.left = `${doodlerLeftSpace}px`;
        doodler.style.bottom = `${doodlerBottomSpace}px`;
    };

    class Platform {
        constructor(newPlatformBottom) {
            this.bottom = newPlatformBottom;
            this.left = Math.random() * 315;
            this.visual = document.createElement('div');

            const visual = this.visual;
            visual.classList.add('platform');
            visual.style.left = `${this.left}px`;
            visual.style.bottom = `${this.bottom}px`;
            visual.style.backgroundImage = `url("${prepoIMG}plat${Math.floor(Math.random() * 3)}.png")`;
            grid.appendChild(visual);
        };
    };

    function createPlatforms() {
        for (let i = 0; i < platformCount; i++) {
            const platformGap = 600 / platformCount;
            let newPlatformBottom = 100 + i * platformGap;
            let newPlatform = new Platform(newPlatformBottom);
            platforms.push(newPlatform);
        };
    };

    function createScoring() {
        grid.appendChild(scoring);
        scoring.classList.add('scoring');
        scoring.innerHTML = score;
    };

    function movePlatforms() {
        if(doodlerBottomSpace > 200){
            platforms.forEach(platform => {
                platform.bottom -= 4;
                let visual = platform.visual;
                visual.style.bottom = `${platform.bottom}px`;

                if(platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual;
                    firstPlatform.classList.remove('platform');
                    platforms.shift();
                    score++;
                    scoring.innerHTML = score;
                    let newPlatform = new Platform(600);
                    platforms.push(newPlatform);
                };
            });
        };
    };

    function jump() {
        clearInterval(downTimerId);
        isJumping = true;
        upTimerId = setInterval(() => {
            doodlerBottomSpace += 20;
            doodler.style.bottom = `${doodlerBottomSpace}px`;
            if(doodlerBottomSpace > 350) {
                fall();
            };
        }, 30);
    };

    function fall() {
        clearInterval(upTimerId);
        isJumping = false;
        downTimerId = setInterval(()=> {
            doodlerBottomSpace -= 5;
            doodler.style.bottom = `${doodlerBottomSpace}px`;
            if(doodlerBottomSpace <= 0) {
                gameOver();
            };
            platforms.forEach(platform => {
                if(
                    ( doodlerBottomSpace >= platform.bottom ) && 
                    ( doodlerBottomSpace <= platform.bottom + 15) &&
                    ( doodlerLeftSpace + 60 >= platform.left) &&
                    ( doodlerLeftSpace <= platform.left + 85 ) &&
                    !isJumping
                ) {
                    console.log('landed');
                    startPoint = doodlerBottomSpace;
                    jump();
                };
            });
        }, 30);
    };

    function control(e) {
        if(e.key === 'ArrowLeft'){
            moveLeft();
        } else if(e.key === 'ArrowRight'){
            moveRight();
        } else if(e.key === 'ArrowUp'){
            moveStraight();
        }

        if(isGoingLeft){
            console.log('l');
        }
        if(isGoingRight){
            console.log('r');
        }
    };

    function moveLeft() {
        if(isGoingRight) {
            clearInterval(rightTimerId);
            isGoingRight = false;
        };
        isGoingLeft = true;
        leftTimerId = setInterval(() => {
            if(doodlerLeftSpace >= 0) {
                doodlerLeftSpace -= 5;
                if(isGoingLeft) {
                    doodler.style.backgroundImage = `url("${prepoIMG}rutahL.png")`;
                    doodler.style.left = `${doodlerLeftSpace}px`;
                }
            } else moveRight();
        }, 20);
    };

    function moveRight() {
        if(isGoingLeft) {
            clearInterval(leftTimerId);
            isGoingLeft = false;
        };
        isGoingRight = true;
        rightTimerId = setInterval(() => {
            if(doodlerLeftSpace <= 340) {
                doodlerLeftSpace += 5;
                if(isGoingRight) {
                    doodler.style.backgroundImage = `url("${prepoIMG}rutahR.png")`;
                    doodler.style.left = `${doodlerLeftSpace}px`;
            }
            } else moveLeft();
        }, 20);
    };

    function moveStraight() {
        isGoingLeft = false;
        isGoingRight = false;
        clearInterval(rightTimerId);
        clearInterval(leftTimerId);
        doodler.style.backgroundImage = `url("${prepoIMG}rutahS.png")`;
    };

    function start() {
        if (isGameOver === false) {
            createPlatforms();
            createDoodler();
            createScoring();
            startTimerId = setInterval(movePlatforms,30);
            jump();
            document.addEventListener('keyup', control);
        };
    };
    
    function gameOver(){
        isGameOver = true;
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild);
        };
        grid.innerHTML = 
        `Score : ${score} <br />
        Record : ${highscore} <br /> <br />
        ${txtng}`;
        setHighScore(score, highscore);
        reset();
        isStarted = false;
    };

    function reset(){
        clearInterval(upTimerId);
        clearInterval(downTimerId);
        clearInterval(startTimerId);
        startPoint = 150;
        moveStraight();
        platforms = [];
    };

    function setHighScore(s, hs) {
        if(s > hs) {
            highscore = s;
            grid.innerHTML = 
            `NOUVEAU <br /> RECORD <br />
            ${s} <br />
            ${txtng}`
        }
    };

    document.addEventListener('keydown', onKeyHandler);
    function onKeyHandler(e) {
        if(!isStarted) {
            while (grid.firstChild) {
                grid.removeChild(grid.firstChild);
            };
            isGameOver = false;
            score = 0;
            start();
            isStarted = true;
        };
    };

    gameOver();
});