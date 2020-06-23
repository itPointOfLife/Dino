const DIE_AMOUNT = 20,
    LVLUP_AMOUNT = 9,
    MAX_HEARTS = 5,
    MAX_SPEED = 2.5;

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

// Help functions
const getRandInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const getRandomSound = (isDie) => {
    let curArr = dieArr;
    
    if(!isDie) curArr = lvlUpArr;

    return curArr[Math.floor(Math.random() * curArr.length)];
}

const isEmpty = obj => {
  for (let key in obj) return false;
  return true;
}

const isPlaying = currentAudio => {
    if(currentAudio)
        return currentAudio.currentTime > 0
            && !currentAudio.paused
            && !currentAudio.ended
            && currentAudio.readyState > 2
    else return false    
}

// Frames counter
let frames = 0;

// Index of current cactus for collission detection check
let indexCactus = NaN;

// First time tutorial settings
let isTutorial = JSON.parse(localStorage.getItem('isTutorial'));

if(isTutorial === null || isTutorial === undefined)
    isTutorial = true;


// Load sprite img
const sprite = new Image();
sprite.src = "img/sprite.png";

//  Sounds
let curDieSound, curLvlUpSound;

const loadSounds = (i, isDie)=>{
    const sound = new Audio();
    isDie?sound.src = `audio/DIE${i}.mp3`:sound.src = `audio/LVLUP${i}.mp3`;
    return sound;
}

const dieArr = [],
    lvlUpArr = [];

for (let i = 0; i < LVLUP_AMOUNT; i++) {
    lvlUpArr[i] = loadSounds(i+1, false)
    dieArr[i] = loadSounds(i+1, true)
}

for(let i = LVLUP_AMOUNT; i < DIE_AMOUNT; i++){
    dieArr[i] = loadSounds(i+1, true)
}



// Sound obj
const sounds = {
    on: {
        sX: 960,
        sY: 6,
        x: 40,
        y: 50,
        w: 30,
        h: 28,
    },

    off: {
        sX: 997,
        sY: 7,
        x: 40,
        y: 50,
        w: 32,
        h: 27,
    },

    isSoundOff: JSON.parse(localStorage.getItem('isSoundOff')) || false,

    draw(){
        let soundImg = this.on

        if(this.isSoundOff)
            soundImg = this.off

        ctx.drawImage(sprite, soundImg.sX, soundImg.sY, soundImg.w, soundImg.h, soundImg.x, soundImg.y, soundImg.w, soundImg.h);
    }
}

// Game state
const state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
}

// Foreground
const fg = {
    sX: 2,
    sY: 104,
    x: 0,
    y: canvas.clientHeight*0.8,
    w: 2400,
    h: 26,

    dx: 8,

    draw: function(){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y - this.h, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y - this.h, this.w, this.h);
    },

    update(){
        if(state.current === state.game)
            this.x = (this.x - this.dx*dino.speed)%(this.w);
    }
}

// Game control
// canvas.onmousedown = (e)=>{
//     let rect = canvas.getBoundingClientRect(),
//         clickX = e.clientX - rect.left,
//         clickY = e.clientY - rect.top;

//     const soundBtn = sounds.on;

//     if(clickX >= soundBtn.x && clickX <= soundBtn.x + soundBtn.w && clickY >= soundBtn.y && clickY <= soundBtn.y + soundBtn.h){   
//         sounds.isSoundOff = !sounds.isSoundOff

//         if(sounds.isSoundOff)
//             localStorage.setItem('isSoundOff', true)
//         else if(localStorage.getItem('isSoundOff'))
//             localStorage.removeItem('isSoundOff')

//         if(sounds.isSoundOff && state.current === state.over){
//             curDieSound.pause()
//             curDieSound.currentTime = 0;

//             const isLvlUpPlaying = isPlaying(curLvlUpSound)
//             if(isLvlUpPlaying){
//                 curLvlUpSound.pause()
//                 curLvlUpSound.currentTime = 0;
//             }
//         }
//         return;
//     }

//     switch(state.current){
//         case state.getReady:
//             state.current = state.game;
//             hearts.lifeAmount = 1;

//             if(isTutorial){
//                 isTutorial = false;
//                 localStorage.setItem('isTutorial', false);
//             }
//             break;
//         case state.game:
//             if(clickX >= 0 && clickX < canvas.clientWidth/2){
//                 isTouchLeftSide = true
//                 dino.isDownAnimation = true
//                 dino.fastGravity = true 

//                 dino.y = dino.animation.down[1].default;
//             } else if(dino.onFloor)
//                 dino.jump()
//             break;
//         case state.over:
//             const startBtn = gameOverPanel.restartBtn;

//             if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h){   
//                 state.current = state.game;
//                 cactuses.position = [];
//                 birds.position = {};
//                 score.value = 0;
//                 hearts.lifeAmount = 1;
//                 dino.isDownAnimation = false;
//                 dino.y = fg.y - dino.animation.stand[1].h;
//                 dino.speed = 1.5;
//                 indexCactus = NaN;
//                 cactuses.periodSpawn = 80;

//                 const isDiePlaying = isPlaying(curDieSound)
//                 if(isDiePlaying){
//                     curDieSound.pause()
//                     curDieSound.currentTime = 0;
//                 }

//                 const isLvlUpPlaying = isPlaying(curLvlUpSound)
//                 if(isLvlUpPlaying){
//                     curLvlUpSound.pause()
//                     curLvlUpSound.currentTime = 0;
//                 }
//             }
//             break;
//     }
// }

// canvas.onmouseup = (e)=>{
//     if(state.current !== state.game) return;

//     let rect = canvas.getBoundingClientRect(),
//         clickX = e.clientX - rect.left,
//         clickY = e.clientY - rect.top;

//     if(clickX >= 0 && clickX < canvas.clientWidth/2){  
//         dino.isDownAnimation = false
//         dino.fastGravity = false

//         if(dino.onFloor){
//             dino.y = fg.y - dino.animation.stand[1].h;
//         } 
//     }
// }


// CLICK FOR MOBILE 
let isTouchLeftSide = false;

const handleTouchStart = (e) => {
    let rect = canvas.getBoundingClientRect(),
        clickX = e.touches[0].clientX - rect.left,
        clickY = e.touches[0].clientY - rect.top;

    const soundBtn = sounds.on;

    if(clickX >= soundBtn.x && clickX <= soundBtn.x + soundBtn.w && clickY >= soundBtn.y && clickY <= soundBtn.y + soundBtn.h){   
        sounds.isSoundOff = !sounds.isSoundOff

        if(sounds.isSoundOff)
            localStorage.setItem('isSoundOff', true)
        else if(localStorage.getItem('isSoundOff'))
            localStorage.removeItem('isSoundOff')

        if(sounds.isSoundOff && state.current === state.over){
            curDieSound.pause()
            curDieSound.currentTime = 0;

            const isLvlUpPlaying = isPlaying(curLvlUpSound)
            if(isLvlUpPlaying){
                curLvlUpSound.pause()
                curLvlUpSound.currentTime = 0;
            }
        }
        return;
    }

    switch(state.current){
        case state.getReady:
            state.current = state.game;
            hearts.lifeAmount = 1;

            if(isTutorial){
                isTutorial = false;
                localStorage.setItem('isTutorial', false);
            }
            break;
        case state.game:
            if(clickX >= 0 && clickX < canvas.clientWidth/2){
                isTouchLeftSide = true
                dino.isDownAnimation = true
                dino.fastGravity = true 

                dino.y = dino.animation.down[1].default;
            } else if(dino.onFloor)
                dino.jump()
            break;
        case state.over:
            const startBtn = gameOverPanel.restartBtn;

            if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h){   
                state.current = state.game;
                cactuses.position = [];
                birds.position = {};
                score.value = 0;
                hearts.lifeAmount = 1;
                dino.isDownAnimation = false;
                dino.y = fg.y - dino.animation.stand[1].h;
                dino.speed = 1.5;
                indexCactus = NaN;
                cactuses.periodSpawn = 80;

                const isDiePlaying = isPlaying(curDieSound)
                if(isDiePlaying){
                    curDieSound.pause()
                    curDieSound.currentTime = 0;
                }

                const isLvlUpPlaying = isPlaying(curLvlUpSound)
                if(isLvlUpPlaying){
                    curLvlUpSound.pause()
                    curLvlUpSound.currentTime = 0;
                }
            }
            break;
    }
}

const handleTouchEnd = (e) => {
    if(isTouchLeftSide && state.current === state.game){   
        isTouchLeftSide = false
        dino.isDownAnimation = false
        dino.fastGravity = false

        if(dino.onFloor){
            dino.y = fg.y - dino.animation.stand[1].h;
        } 
    }
}

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchend', handleTouchEnd, false);


// SWIPE
// let xDown = null,
//     yDown = null,
//     isSwiped = false;                                                

// const handleTouchStart = (e) => {
//     console.log('start touch')
//     const firstTouch = e.touches[0];                                      
//     xDown = firstTouch.clientX;                                      
//     yDown = firstTouch.clientY;                                 
// };                                                

// const handleTouchMove = (e) => {
//     if ( ! xDown || ! yDown ) return;

//     const xUp = e.touches[0].clientX,                                
//         yUp = e.touches[0].clientY;

//     const xDiff = xDown - xUp,
//         yDiff = yDown - yUp;

//     if ( Math.abs( xDiff ) < Math.abs( yDiff ) && yDiff < 0 ) {
//         console.log('swiped down')
//         isSwiped = true

    //         if(state.current === state.game){
    //         dino.isDownAnimation = true
    //         dino.gravity = 1.5

    //         if(dino.onFloor){
    //             dino.y = fg.y - dino.animation.down[1].h;
    //         }
    //     }                                                             
    // }
//     /* reset values */
//     xDown = null;
//     yDown = null;                                             
// };

// const handleTouchEnd = (e)=>{
//     console.log('end touch ',e)

//     if(isSwiped && state.current === state.game){
//         console.log('end swipe')
//         isSwiped = false
//         dino.isDownAnimation = false
//         dino.gravity = 1

//         if(dino.onFloor){
//             dino.y = fg.y - dino.animation.stand[1].h;
//         }
//     }
// }

// document.addEventListener('touchstart', handleTouchStart, false);        
// document.addEventListener('touchmove', handleTouchMove, false);
// document.addEventListener('touchend', handleTouchEnd, false); 


// For desktop
// document.onkeydown = (e) => {

//     if(state.current === state.game){
//         switch(e.keyCode){
//             case 40:
//                 dino.isDownAnimation = true
//                 dino.gravity = 1.5

//                 if(dino.onFloor){
//                     dino.y = canvas.clientHeight*0.65 - dino.animation.down[1].h;
//                 }

//                 break;
//             case 38:
//                 if(dino.onFloor){
//                     dino.jump()
//                 }
//                 break;
//         }
//     }
// }

// document.onkeyup = (e) => {

//     if(state.current === state.game){
//         switch(e.keyCode){
//             case 40:
//                 dino.isDownAnimation = false
//                 dino.gravity = 1

//                 if(dino.onFloor){
//                     dino.y = canvas.clientHeight*0.65 - dino.animation.stand[1].h;
//                 }
//                 break;
//         }
//     }
// }

// Dino
const dino = {
    animation : {
        stand: [
            {sX: 1678, sY: 2, w: 88, h: 94, default: fg.y - 94},
            {sX: 1854, sY: 2, w: 88, h: 94, default: fg.y - 94},
            {sX: 1942, sY: 2, w: 88, h: 94, default: fg.y - 94},
            {sX: 2030, sY: 2, w: 88, h: 94, default: fg.y - 94},
            {xCenterHead: 88/1.35, yCenterHead: 94/4, xCenterBody: 88/2.9, yCenterBody: 94/1.55},
        ],

        down: [
            null,
            {sX: 2206, sY: 36, w: 118, h: 60, default: fg.y - 60},
            {sX: 2324, sY: 36, w: 118, h: 60, default: fg.y - 60},
            {sX: 1170, sY: 7, w: 118, h: 60, default: fg.y - 60},
            {xCenterHead: 118/1.3, yCenterHead: 60/2.5, xCenterBody: 118/3.3, yCenterBody: 60/2}
        ]
    },

    radiusHead:20,
    radiusBody:30,

    isDownAnimation:false,

    x: 50,
    y: fg.y - 94,

    frame: 1,
    period: 5,

    isFalling: false,
    isFallingDefault: 0,
    isFallingHeight: 90,

    // default: canvas.clientHeight*0.65 - 94,

    fastGravity: false,
    step: 0,
    jumpHeight: 30,
    jumpCount: 0,

    speed: 1.5,

    isJump: false,
    onFloor: true,

    draw(){
        let curDino = this.animation.stand[this.frame];

        if(this.isDownAnimation)
            curDino = this.animation.down[this.frame];

        // double stand
        // ctx.setLineDash([])
        // ctx.beginPath();
        // ctx.arc(this.x+curDino.w/1.35,this.y+curDino.h/4,20,0,Math.PI*2,true);
        // ctx.stroke()

        // ctx.beginPath();
        // ctx.arc(this.x+curDino.w/2.9,this.y+curDino.h/1.55,30,0,Math.PI*2,true);
        // ctx.stroke()

        // double down
        // ctx.setLineDash([])
        // ctx.beginPath();
        // ctx.arc(this.x+curDino.w/1.3,this.y+curDino.h/2.5,20,0,Math.PI*2,true);
        // ctx.stroke()

        // ctx.beginPath();
        // ctx.arc(this.x+curDino.w/3.3,this.y+curDino.h/2,30,0,Math.PI*2,true);
        // ctx.stroke()

        ctx.drawImage(sprite, curDino.sX, curDino.sY, curDino.w, curDino.h, this.x, this.y, curDino.w, curDino.h)

        // ctx.setLineDash([])
        // ctx.beginPath();
        // ctx.arc(this.x+this.animation.stand[4].xCenterHead,this.y+this.animation.stand[4].yCenterHead,this.radiusHead,0,Math.PI*2,true);
        // ctx.stroke()

        // ctx.beginPath();
        // ctx.arc(this.x+this.animation.stand[4].xCenterBody,this.y+this.animation.stand[4].yCenterBody,this.radiusBody,0,Math.PI*2,true);
        // ctx.stroke()

    },

    jump(){
        this.isJump = true
        this.onFloor = false
        this.y -= this.step
    },

    update(){
        // if game over - set die dino
        if(state.current === state.over) this.frame = 3

        if(state.current !== state.game) return;

        let curDino = this.animation.stand[this.frame];

        if(this.isDownAnimation)
            curDino = this.animation.down[this.frame];

        // First time dino falls
        if(this.isFalling){
            this.jumpCount++;
            this.step = 10*this.isFallingHeight*Math.sin(Math.PI*this.jumpCount/this.isFallingHeight);
            this.y = this.isFallingDefault + this.step

            if(this.isFallingDefault + this.step>curDino.default){
                this.isFalling = false
                this.jumpCount = 0
                this.step = 0
                this.y = curDino.default
            }
            return;
        }

        // Jump 
        if(!this.onFloor && this.step>=0){
            this.jumpCount++;
            this.step = 6*this.jumpHeight*Math.sin(Math.PI*this.jumpCount/this.jumpHeight);
            this.y = curDino.default - this.step

            if(this.isJump){
                if(this.jumpCount>=this.jumpHeight/2) this.isJump = false
            } else {
                if(this.fastGravity){
                    this.jumpCount++;
                    this.step = 6*this.jumpHeight*Math.sin(Math.PI*this.jumpCount/this.jumpHeight)
                }

                if(this.jumpCount>=this.jumpHeight){
                    this.y = curDino.default
                    this.onFloor = true
                    this.jumpCount = 0
                    this.step = 0
                    this.fastGravity = false
                }
            }
        }

        // Run animation
        if(frames%this.period === 0)
            this.frame += 1;

        if(this.frame === 3 || this.frame === 4)
            this.frame = 1;

        if(this.isDownAnimation)
            curDino = this.animation.down[this.frame];
    }
}

// Cactuses
const cactuses = {
    position: [],

    choose: [
        {sX: 447,sY: 3, w: 32, h: 67, y: fg.y - 68, radius: 15, cY:fg.y-50},
        {sX: 481,sY: 3, w: 32, h: 67, y: fg.y - 68, radius: 15, cY:fg.y-50},
        {sX: 515,sY: 3, w: 32, h: 67, y: fg.y - 68, radius: 15, cY:fg.y-50},
        {sX: 549,sY: 3, w: 32, h: 67, y: fg.y - 68, radius: 15, cY:fg.y-50},
        {sX: 583,sY: 3, w: 32, h: 67, y: fg.y - 68, radius: 15, cY:fg.y-50},
        {sX: 617,sY: 3, w: 32, h: 67, y: fg.y - 68, radius: 15, cY:fg.y-50},

        {sX: 653,sY: 3, w: 48, h: 97, y: fg.y - 90, radius: 25, cY:fg.y-62},
        {sX: 703,sY: 3, w: 46, h: 97, y: fg.y - 90, radius: 22, cY:fg.y-64},
        {sX: 753,sY: 3, w: 48, h: 97, y: fg.y - 90, radius: 25, cY:fg.y-64},
        {sX: 803,sY: 3, w: 46, h: 97, y: fg.y - 90, radius: 22, cY:fg.y-64},
        {sX: 851,sY: 3, w: 101, h: 97, y: fg.y - 90, radius: 50, cY:fg.y-40},

    ],

    dx: 8,

    periodSpawn: 80,

    clearPosFlag: false,

    getRandomCactus(){
        return this.choose[Math.floor(Math.random() * this.choose.length)]
    },


    draw(){
        for(let i = 0; i< this.position.length; i++){
            let p = this.position[i];

            // ctx.setLineDash([])
            // ctx.beginPath();
            // ctx.arc(p.x+p.w/2,p.cY,p.radius,0,Math.PI*2,true);
            // ctx.stroke()

            ctx.drawImage(sprite, p.sX, p.sY, p.w, p.h, p.x, p.y, p.w, p.h);
        }
    },

    update(){
        if(state.current !== state.game) return;

        // Add cactus
        if(frames%this.periodSpawn === 0){
            const curCactus = this.getRandomCactus()

            const randDx = getRandInt(150, 600)
            const randDist = canvas.clientWidth + randDx

            this.position.push({
                sX: curCactus.sX,
                sY: curCactus.sY,
                x: randDist,
                y: curCactus.y,
                w: curCactus.w,
                h: curCactus.h,
                cY: curCactus.cY,
                radius: curCactus.radius,
            });
        }

        // Clear array of cactuses
        if(this.clearPosFlag){
            this.clearPosFlag = false

            this.position = this.position.filter(p=>{
                return p.x+p.w>0
            });
        }

        // Move each cactus > 0 and get index of closest cactus
        for(let i = this.position.length-1; i>=0; i--){
            const p = this.position[i];
            console.log('for', indexCactus, i, this.position.length)
            if(p.x + p.w > 0){
                console.log('index set')
                indexCactus = i;

                p.x -= this.dx*dino.speed;
            } else break;
        }
        
        if(indexCactus>=0){
            const p = this.position[indexCactus];

            // Collision detection of the closest cactus
            let dxBody, dyBody, dxHead, dyHead, distanceHead, distanceBody,  
                curDino = dino.animation.stand[4];


            if(dino.isDownAnimation){
                curDino = dino.animation.down[4];

                dxHead = dino.x + curDino.xCenterHead - (p.x+p.w/2);
                dyHead = dino.y + curDino.yCenterHead - p.cY;

                distanceHead = Math.sqrt(dxHead * dxHead + dyHead * dyHead)
            }

            dxBody = dino.x + curDino.xCenterBody - (p.x+p.w/2);
            dyBody = dino.y + curDino.yCenterBody - p.cY;

            distanceBody = Math.sqrt(dxBody * dxBody + dyBody * dyBody);

            if (distanceBody < dino.radiusBody + p.radius || dino.isDownAnimation && distanceHead < dino.radiusHead + p.radius ) {
                if (hearts.lifeAmount>1){

                    hearts.lifeAmount--;       

                    this.position.splice(indexCactus,1)

                    indexCactus = -1;
                } else {
                    state.current = state.over
                    hearts.lifeAmount = 0;

                    if(!sounds.isSoundOff){
                        const dieSound = getRandomSound(true)
                        curDieSound = dieSound
                        dieSound.play()
                    } 

                    if(score.value > score.best){
                        score.best = score.value;
                        localStorage.setItem('dinoBest', score.best)
                    }
                }
            }
        }
    }
}

// Birds
const birds = {

    animation : [
        {sX: 260, sY: 14, w: 92, h: 68}, // down
        {sX: 352, sY: 2, w: 92, h: 60}, // up
    ],

    rounds: [],

    position:{},

    y: fg.y - 150,

    frame: 0,
    period: 20,

    dx:8,

    draw(){
        if(!isEmpty(this.position)){
            let curBird = this.animation[this.frame];

            ctx.drawImage(sprite, curBird.sX, curBird.sY, curBird.w, curBird.h, this.position.x, this.position.y, curBird.w, curBird.h)

            // wings down

            // ctx.setLineDash([])
            // ctx.beginPath();
            // ctx.arc(this.position.x+curBird.w/3.8,this.y+curBird.h/3.5,18,0,Math.PI*2,true);
            // ctx.stroke()

            // ctx.beginPath();
            // ctx.arc(this.position.x+curBird.w/1.5,this.y+curBird.h/1.5,23,0,Math.PI*2,true);
            // ctx.stroke()

            // wings up

            // ctx.setLineDash([])
            // ctx.beginPath();
            // ctx.arc(this.position.x+curBird.w/3.8,this.y+curBird.h/3,18,0,Math.PI*2,true);
            // ctx.stroke()

            // ctx.beginPath();
            // ctx.arc(this.position.x+curBird.w/1.5,this.y+curBird.h/1.5,23,0,Math.PI*2,true);
            // ctx.stroke()

            // alternate

            // ctx.setLineDash([])
            // ctx.beginPath();
            // ctx.arc(this.rounds[this.frame].xCenterHead,this.rounds[this.frame].yCenterHead,this.rounds[this.frame].radiusHead,0,Math.PI*2,true);
            // ctx.stroke()

            // ctx.beginPath();
            // ctx.arc(this.rounds[this.frame].xCenterBody,this.rounds[this.frame].yCenterBody,this.rounds[this.frame].radiusBody,0,Math.PI*2,true);
            // ctx.stroke()
        }
    },

    update(){
        if(state.current !== state.game) return;

        // Add bird
        if(frames%300 === 0 && score.value > 100){
            const randY = this.y + getRandInt(-50,80)

            const xLastCactus = cactuses.position[cactuses.position.length-1].x

            const randX = xLastCactus < canvas.clientWidth + 200 && xLastCactus > canvas.clientWidth - 200 ? canvas.clientWidth+500: canvas.clientWidth;
            
            this.position = {
                x: randX,
                y: randY
            }
        }

        if(!isEmpty(this.position)){
            let p = this.position;

            if(p.x + p.w < 0){
                this.position = {}
                return;
            }

            p.x -= this.dx*dino.speed*1.1;

            let curBird = this.animation[this.frame]

            // Hitboxes birds
            this.rounds = [
                {xCenterHead: p.x + curBird.w/3.8, yCenterHead: p.y+curBird.h/3.5, xCenterBody: p.x + curBird.w/1.5, yCenterBody: p.y + curBird.h/1.5, radiusHead:20, radiusBody:35},
                {xCenterHead: p.x + curBird.w/3.8, yCenterHead: p.y+curBird.h/3, xCenterBody: p.x+curBird.w/1.5, yCenterBody: p.y+curBird.h/1.5, radiusHead:18, radiusBody:23},
            ]
            

            // Collision detection
            let dxDinoHeadBirdHead, dyDinoHeadBirdHead, dxDinoHeadBirdBody, dyDinoHeadBirdBody,
                dxDinoBodyBirdHead, dyDinoBodyBirdHead, dxDinoBodyBirdBody, dyDinoBodyBirdBody,
                distanceDinoHeadBirdHead, distanceDinoHeadBirdBody, distanceDinoBodyBirdHead, distanceDinoBodyBirdBody,
                curDino = dino.animation.stand[4];

            if(dino.isDownAnimation)
                curDino = dino.animation.down[4];

            dxDinoHeadBirdHead = dino.x + curDino.xCenterHead - this.rounds[this.frame].xCenterHead
            dyDinoHeadBirdHead = dino.y + curDino.yCenterHead - this.rounds[this.frame].yCenterHead

            dxDinoHeadBirdBody = dino.x + curDino.xCenterHead - this.rounds[this.frame].xCenterBody
            dyDinoHeadBirdBody = dino.y + curDino.yCenterHead - this.rounds[this.frame].yCenterBody

            dxDinoBodyBirdHead = dino.x + curDino.xCenterBody - this.rounds[this.frame].xCenterHead
            dyDinoBodyBirdHead = dino.y + curDino.yCenterBody - this.rounds[this.frame].yCenterHead

            dxDinoBodyBirdBody = dino.x + curDino.xCenterBody - this.rounds[this.frame].xCenterBody
            dyDinoBodyBirdBody = dino.y + curDino.yCenterBody - this.rounds[this.frame].yCenterBody

            distanceDinoHeadBirdHead = Math.sqrt(dxDinoHeadBirdHead * dxDinoHeadBirdHead + dyDinoHeadBirdHead * dyDinoHeadBirdHead)
            distanceDinoHeadBirdBody = Math.sqrt(dxDinoHeadBirdBody * dxDinoHeadBirdBody + dyDinoHeadBirdBody * dyDinoHeadBirdBody)
            distanceDinoBodyBirdHead = Math.sqrt(dxDinoBodyBirdHead * dxDinoBodyBirdHead + dyDinoBodyBirdHead * dyDinoBodyBirdHead)
            distanceDinoBodyBirdBody = Math.sqrt(dxDinoBodyBirdBody * dxDinoBodyBirdBody + dyDinoBodyBirdBody * dyDinoBodyBirdBody)

            if (distanceDinoHeadBirdHead < dino.radiusHead + this.rounds[this.frame].radiusHead || 
                distanceDinoHeadBirdBody < dino.radiusHead + this.rounds[this.frame].radiusBody || 
                distanceDinoBodyBirdHead < dino.radiusBody + this.rounds[this.frame].radiusHead || 
                distanceDinoBodyBirdBody < dino.radiusBody + this.rounds[this.frame].radiusBody) {

                if (hearts.lifeAmount>1){
                    hearts.lifeAmount--;

                    this.position = {}
                } else {
                    state.current = state.over
                    hearts.lifeAmount = 0;

                    if(!sounds.isSoundOff){
                        const dieSound = getRandomSound(true)
                        curDieSound = dieSound
                        dieSound.play()
                    } 

                    if(score.value > score.best){
                        score.best = score.value;
                        localStorage.setItem('dinoBest', score.best)
                    }
                }
            }

            if(frames%this.period === 0)
                this.frame += 1;

            if(this.frame >= 2)
                this.frame = 0;
        }
    }
}

// Hearts
const hearts = {
    empty:{sX:1033},
    full:{sX:1067},

    sY:7,
    w:30,
    h:27,
    x: canvas.clientWidth/2+50,
    y: 50,
    dx: 10,

    lifeAmount: 0,

    draw(){
        for(let i=0; i<this.lifeAmount; i++){
            ctx.drawImage(sprite, this.full.sX, this.sY, this.w, this.h, this.x - (this.w + this.dx)*i, this.y, this.w, this.h)
        }

        for(let i=this.lifeAmount; i<MAX_HEARTS; i++){
            ctx.drawImage(sprite, this.empty.sX, this.sY, this.w, this.h, this.x - (this.w + this.dx)*i, this.y, this.w, this.h)
        }
    }
}

// Score
let scoreWidth;

const score = {
    best: parseInt(localStorage.getItem('dinoBest')) || 0,
    value: 0,
    nums:[
        {sX:1294,w:18,h:21},
        {sX:1316,w:16,h:21},
        {sX:1334,w:18,h:21},
        {sX:1354,w:18,h:21},
        {sX:1374,w:18,h:21},
        {sX:1394,w:18,h:21},
        {sX:1414,w:18,h:21},
        {sX:1434,w:18,h:21},
        {sX:1454,w:18,h:21},
        {sX:1474,w:18,h:21},
    ],

    HI: {sX:1494,w:38,h:21}, 
    sY: 2,
    x: canvas.clientWidth-100,
    y: 50,
    dx: 40,

    draw(){
        if(frames%30 === 0 && state.current === state.game){
            this.value++;

            // Clear cactuses < 0 each 30 points
            if(this.value%30 === 0)
                cactuses.clearPosFlag = true;

            // spawn cactuses x2 after 150 points
            if(this.value>150){
                cactuses.periodSpawn = 60

                if(this.value>300)
                    cactuses.periodSpawn = 40
            }

            // LvlUp each 50 points
            if(score.value % 50 === 0 && hearts.lifeAmount < MAX_HEARTS){

                hearts.lifeAmount++

                if(dino.speed<MAX_SPEED)
                    dino.speed+=0.25

                if(!sounds.isSoundOff){
                    const lvlUpSound = getRandomSound(false)
                    curLvlUpSound = lvlUpSound
                    lvlUpSound.play()
                }
            }

        }

        // Draw score       
        if(this.value === 0)
            ctx.drawImage(sprite, this.nums[0].sX, this.sY, this.nums[0].w, this.nums[0].h, this.x, this.y+50, this.nums[0].w, this.nums[0].h)
        else
            for(let i = this.value, j = 0; i>=1; i=parseInt(i/10), j++){
                const curDigit = i%10
                const curDigitObj = this.nums[curDigit]
                scoreWidth = this.x-(18*j)

                ctx.drawImage(sprite, curDigitObj.sX, this.sY, curDigitObj.w, curDigitObj.h, scoreWidth, this.y+50, curDigitObj.w, curDigitObj.h)
            }

        scoreWidth = 0;
        
        if(this.best === 0){
            scoreWidth = this.x
            ctx.drawImage(sprite, this.nums[0].sX, this.sY, this.nums[0].w, this.nums[0].h, this.x, this.y, this.nums[0].w, this.nums[0].h)
        }
        else
            for(let i = this.best, j = 0; i>=1; i=parseInt(i/10), j++){
                const curDigit = i%10
                const curDigitObj = this.nums[curDigit]
                scoreWidth = this.x-(18*j)

                ctx.drawImage(sprite, curDigitObj.sX, this.sY, curDigitObj.w, curDigitObj.h, scoreWidth, this.y, curDigitObj.w, curDigitObj.h)
            }

        ctx.drawImage(sprite, this.HI.sX, this.sY, this.HI.w, this.HI.h, scoreWidth - this.HI.w - 30, this.y, this.HI.w, this.HI.h)
    }
}

// Settings
// const settings = {
//     sX: 1054,
//     sY: 40,
//     w: 35,
//     h: 35,
//     x: 40,
//     y: 40,

//     isOpen: false,

//     draw(){
//         ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)

//         if(this.isOpen){

//             ctx.fillStyle = 'rgb(0,0,0,.6)';
//             ctx.filter = 'blur(5px)';
//             ctx.fillRect(0,0,canvas.clientWidth,canvas.clientHeight);

            
//             ctx.filter = 'blur(0)';
//             ctx.fillStyle = 'none';

//             ctx.setLineDash([]);
//             ctx.fillStyle = '#FFF';
//             ctx.strokeStyle = '#000';
//             ctx.textAlign = 'center';
//             ctx.font = '40px Arial';
//             ctx.fillText('Some Text', canvas.clientWidth/2, 400);
//             ctx.strokeText('Some Text', canvas.clientWidth/2, 400);
//         }
//     }
// }

// Get Ready - tutorial image or sleeping dino
const getReady = {
    tap: {
        sX:960,
        sY:40,
        w:56,
        h:61,
    },

    dinos: {
        stand: {sX: 1766, sY: 2, x: 50, w: 88, h: 94},
        down: {sX: 2206, sY: 36, w: 118, h: 60},
        jump: {sX: 1854, sY: 2, w: 88, h: 94},

        y: fg.y,
    },

    arrows:{
        upX: 1024,
        downX: 1038,

        sY: 40,
        w: 12, 
        h: 35,
    },

    // swap:{sX:1099, sY:2, w:70, h:70, x:canvas.clientWidth/2, y:100},
    
    x:canvas.clientWidth/2,
    y:canvas.clientHeight/4,

    draw(){
        if(state.current !== state.getReady) return;
        const dinos = this.dinos;
        
        if(isTutorial){
            dino.isFalling = true;

            ctx.drawImage(sprite, this.tap.sX, this.tap.sY, this.tap.w, this.tap.h, this.x/2-this.tap.w/2, this.y, this.tap.w, this.tap.h);
            ctx.drawImage(sprite, this.tap.sX, this.tap.sY, this.tap.w, this.tap.h, this.x*1.5-this.tap.w/2, this.y, this.tap.w, this.tap.h);

            ctx.drawImage(sprite, dinos.down.sX, dinos.down.sY, dinos.down.w, dinos.down.h, this.x/2-dinos.down.w/2, dinos.y - dinos.down.h, dinos.down.w, dinos.down.h);
        
            ctx.setLineDash([]);
            ctx.fillStyle = '#FFF';
            ctx.strokeStyle = '#000';
            ctx.textAlign = 'center';
            ctx.font = '40px Arial';
            ctx.fillText('Duck', this.x/2, dinos.y*0.7);
            ctx.strokeText('Duck', this.x/2, dinos.y*0.7);

            ctx.drawImage(sprite, dinos.jump.sX, dinos.jump.sY, dinos.jump.w, dinos.jump.h, this.x*1.5-dinos.jump.w/2, dinos.y - dinos.jump.h, dinos.jump.w, dinos.jump.h);

            // ctx.setLineDash([0]);
            // ctx.beginPath();
            // ctx.moveTo(this.x*1.5-dinos.stand.w/2-20,fg.y-40);
            // ctx.lineTo(this.x*1.5-dinos.stand.w/2,fg.y-50);
            // ctx.stroke();


            ctx.setLineDash([]);
            ctx.fillStyle = '#FFF';
            ctx.strokeStyle = '#000';
            ctx.textAlign = 'center';
            ctx.font = '40px Arial';
            ctx.fillText('Jump', this.x*1.5, dinos.y*0.7);
            ctx.strokeText('Jump', this.x*1.5, dinos.y*0.7);
            
            ctx.setLineDash([20, 8]);/*dashes are 5px and spaces are 3px*/
            ctx.beginPath();
            ctx.moveTo(canvas.clientWidth/2, 0);
            // ctx.lineTo(canvas.clientWidth/2, this.swap.y);
            // ctx.moveTo(canvas.clientWidth/2, this.swap.y+this.swap.h);
            ctx.lineTo(canvas.clientWidth/2, canvas.clientHeight);
            ctx.stroke();

            ctx.drawImage(sprite, this.arrows.downX, this.arrows.sY, this.arrows.w, this.arrows.h, this.x/2-this.arrows.w/2+10, this.y*1.6, this.arrows.w, this.arrows.h);
            ctx.drawImage(sprite, this.arrows.upX, this.arrows.sY, this.arrows.w, this.arrows.h, this.x*1.5-this.arrows.w/2+10, this.y*1.6, this.arrows.w, this.arrows.h);
        
            // ctx.drawImage(sprite, this.swap.sX, this.swap.sY, this.swap.w, this.swap.h, this.x-this.swap.w/2, this.swap.y, this.swap.w, this.swap.h);

        } else{
            ctx.drawImage(sprite, dinos.stand.sX, dinos.stand.sY, dinos.stand.w, dinos.stand.h, dinos.stand.x, dinos.y - dinos.stand.h, dinos.stand.w, dinos.stand.h);
            ctx.drawImage(sprite, this.tap.sX, this.tap.sY, this.tap.w, this.tap.h, this.x-this.tap.w/2, this.y, this.tap.w, this.tap.h);
        }
    }
}

// Game over img & text
const gameOverPanel = {

    restartBtn: {
        sX: 2,
        sY: 2,
        x: canvas.clientWidth/2 - 36,
        y: canvas.clientHeight*0.45,
        w: 72,
        h: 64
    },

    gameOverText: {
        sX: 1294,
        sY: 29,
        x: canvas.clientWidth/2 - 190,
        y: canvas.clientHeight*0.35,
        w: 381,
        h: 21
    },

    draw(){
        if(state.current === state.over){
            const btn = this.restartBtn
            const text = this.gameOverText

            ctx.drawImage(sprite, btn.sX, btn.sY, btn.w, btn.h, btn.x, btn.y, btn.w, btn.h);
            ctx.drawImage(sprite, text.sX, text.sY, text.w, text.h, text.x, text.y, text.w, text.h);
        }
    }
}


//Draw
const draw = () => {
    const skyHeight = parseInt(fg.y) - 13;

    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0,0,canvas.clientWidth,skyHeight);
    ctx.fillStyle = '#ff9966';
    ctx.fillRect(0,skyHeight,canvas.clientWidth,canvas.clientHeight-skyHeight);
    fg.draw()

    if(state.current === state.getReady){
        getReady.draw()
    }
    else{
        dino.draw()
        cactuses.draw()
        birds.draw()
        gameOverPanel.draw()
        score.draw()
    }
    
    if(!isTutorial) hearts.draw()

    // settings.draw()
    sounds.draw()
}

// Update
const update = () => {
    fg.update()
    dino.update()
    cactuses.update()
    birds.update()
}

// Loop
const loop = () => {
    update();
    draw();
    frames++;
    requestAnimationFrame(loop);
}

loop();