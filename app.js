let boxes=Array.from(document.getElementsByClassName("box"));
const restartBtn=document.getElementById("restartBtn");
const playText=document.getElementById("playText");

const ai="O";
const human="X";
let gameState=1;
let currentPlayer=human;
const spaces=[null, null, null, null, null, null, null, null, null];

const drawBoard = () => {
    boxes.forEach((box, index) => {
        let styleString="";
        if(index<3) {
            styleString+=`border-bottom: 3px solid var(--color);`;
        }
        if(index%3===0) {
            styleString+="border-right: 3px solid var(--color);";
        }
        if(index%3===2) {
            styleString+="border-left: 3px solid var(--color);";
        }
        if(index>5) {
            styleString+="border-top: 3px solid var(--color);";
        }
        box.style=styleString;
        box.addEventListener("click", boxClicked);
    });
};

const boxClicked=(e) => {
    if(gameState==0) return;
    const id=e.target.id;
    if(!spaces[id]) {
        spaces[id]=currentPlayer;
        e.target.innerText=currentPlayer;
        if(playerHasWon()) {
            document.body.style.backgroundColor="#d7ffce";
            playText.innerText="Congrats! You Won";
            gameState=0;
            return;
        }
        if(isTie()) {
            document.body.style.backgroundColor="#fef9c8";
            playText.innerText="Oops! It's Tie";
            gameState=0;
            return;
        }
        currentPlayer=ai;
        bestMove();
    }
};

function minimax (depth, isMaximizing, i) {
    let result=playerHasWon();
    if(result==true) {
        return ((isMaximizing)?(-1):(1))/depth;
    }
    else {
        let cnt=0;
        spaces.forEach((space, index) => {
            if(spaces[index]==null) cnt++;
        });
        if(cnt==0) return 0;
    }
    let score=0;
    let bestScore1=-Infinity;
    let bestScore2=Infinity;
    spaces.forEach((space, index) => {
        if(spaces[index]==null) {
            spaces[index]=(isMaximizing)?ai:human;
            bl=((isMaximizing)?false:true);
            score=minimax(depth+1, bl, i);
            spaces[index]=null;
            bestScore1=Math.max(bestScore1, score);
            bestScore2=Math.min(bestScore2, score);
        }
    });
    return (isMaximizing)?bestScore1:bestScore2;
};

const bestMove = () => {
    if(gameState==0) return;
    let bestScore=-Infinity;
    let move=1;
    spaces.forEach((space, index) => {
        if(spaces[index]==null) {
            spaces[index]=currentPlayer;
            let score=minimax(1, false, index);
            spaces[index]=null;
            if(score>bestScore) {
                bestScore=score;
                move=index;
            }
        }
    });
    spaces[move]=currentPlayer;
    document.getElementsByClassName("box")[move].innerText=currentPlayer;
    if(playerHasWon()) {
        document.body.style.backgroundColor="#fed8d8";
        playText.innerText="Oops! You Lost";
        gameState=0;
        return;
    }
    if(isTie()) {
        document.body.style.backgroundColor="#fef9c8";
        playText.innerText="Oops! It's Tie";
        gameState=0;
        return;
    }
    currentPlayer=human;
};

const playerHasWon = () => {
    if ((spaces[0]!=null && spaces[0]==spaces[1] && spaces[1]==spaces[2]) ||
        (spaces[3]!=null && spaces[3]==spaces[4] && spaces[4]==spaces[5]) ||
        (spaces[6]!=null && spaces[6]==spaces[7] && spaces[7]==spaces[8])) {
            return true;
    }
    if ((spaces[0]!=null && spaces[0]==spaces[3] && spaces[3]==spaces[6]) ||
        (spaces[1]!=null && spaces[1]==spaces[4] && spaces[4]==spaces[7]) ||
        (spaces[2]!=null && spaces[2]==spaces[5] && spaces[5]==spaces[8])) {
            return true;
    }
    if ((spaces[0]!=null && spaces[0]==spaces[4] && spaces[4]==spaces[8]) ||
        (spaces[2]!=null && spaces[2]==spaces[4] && spaces[4]==spaces[6])) {
            return true;
    }
    return false;
};

const isTie = () => {
    let cnt=0;
    spaces.forEach((space, index) => {
        if(spaces[index]==null) cnt++;
    });
    if(cnt==0) return true;
    return false;
}

restartBtn.addEventListener("click", () => {
    spaces.forEach((space, index) => {
        spaces[index]=null;
    });
    boxes.forEach((box) => {
        box.innerText="";
    });
    document.body.style.backgroundColor="#ffffff";
    playText.innerText="Let's Play!";
    currentPlayer=human;
    gameState=1;
});

drawBoard();
