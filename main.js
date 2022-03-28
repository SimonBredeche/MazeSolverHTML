
let canv = document.getElementById("canvas");
let ctx = canv.getContext('2d');
let WIDTH = 0;
let HEIGHT = 0;
let board = [];
let solvingboard = [];
let solvingboardDist = [];
let start = false;
let lastTime = 0;
let TILEX = 10;
let TILEY = 10;
let startX = 0;
let startY = 0;
let endX = 0;
let endY =  0;
let updateGrid = 0;
let orderSearch = [];
let currentIndex = 0;
let currentIndexPath = 0;
let path = [];
let algorithm = "DFS"
let SPEED = 1;
function generateBoard(){
    for(let i = 0; i < WIDTH; i++){
        board[i] = [];
        for(let j = 0; j < HEIGHT; j++){
            board[i][j] = 'black';
        }
    }
}

function changeSpeed(val){
    SPEED = val;
}

function pause(){
    start = !start;
}

function changeAlgo(value){
    algorithm = value;
}

function solve(){
    board = [];
    solvingboard = [];
    path = [];
    orderSearch = [];
    solvingboardDist = [];
    currentIndex = 0;
    currentIndexPath = 0;
    let content = document.getElementById("laby").value;
    let rows = content.split("\n");
    start = false;
    WIDTH = rows.length;
    HEIGHT = rows[0].length;
    for(let x = 0; x < rows.length; x++){
        board[x] = [];
        solvingboard[x] = [];
        solvingboardDist[x] = [];
        for(let y = 0; y < rows[x].length; y++){
            solvingboard[x][y] = rows[x][y];
            switch (rows[x][y]) {
                case '*':
                    board[x][y] = "black";
                    break;
                case ' ':
                    board[x][y] = "white";
                    break;
                case '1':
                    startX = x;
                    startY = y;
                    board[x][y] = "red";
                    break;
                case '2':
                    endX = x;
                    endY = y;
                    board[x][y] = "orange";
                    break;
                default:
                    break;
            }
        }
    }
    let startTime = new Date();
    switch(algorithm){
        case "DFS":
            recursiveSolve(startX,startY,path);
            break;
        case "A*":
            recursiveSolveAStar(startX,startY,path);
            break;
    }
    let endTime = new Date();
    let timeDiff = endTime - startTime; //in ms
    timeDiff /= 1000;
    let seconds = timeDiff;
    document.getElementById("timeSolve").innerHTML = `Real solving time : ${seconds} second`;
    start = true;
    
    
}

function gameLoop(timeElapsed) {
    let deltaTime = timeElapsed - lastTime;
    if(start){
        draw();
        for(let i = 0; i < SPEED;i++){
            update(deltaTime);
        }
    }
    lastTime = timeElapsed;
    window.requestAnimationFrame(gameLoop);
}

function update(deltaTime){
    updateGrid += deltaTime;
    if(updateGrid > 50){
        if(currentIndex < orderSearch.length){
            if(orderSearch[currentIndex].search){
                board[orderSearch[currentIndex].x][orderSearch[currentIndex].y] = 'yellow';
            }else{
                board[orderSearch[currentIndex].x][orderSearch[currentIndex].y] = 'blue'
            }
            currentIndex ++;
        }
        else if(currentIndexPath < path.length){
            board[path[currentIndexPath].x][path[currentIndexPath].y] = 'violet'
            currentIndexPath++;
        }
        updateGrid = 0;
    }
}

function recursiveSolveAStar(posX,posY,path){
    if(solvingboard[posX][posY] == '2'){
        path.push({x:posX,y:posY})
        return true;
    }
    if(solvingboard[posX][posY] == ' ' || solvingboard[posX][posY] == '1'){
        solvingboard[posX][posY] = 'O';
        orderSearch.push({x:posX,y:posY,search:false});
        let tmpArr = [];

        let left = Math.sqrt(Math.pow(endX-posX-1,2) + Math.pow(endY-posY,2))
        let right = Math.sqrt(Math.pow(endX-posX+1,2) + Math.pow(endY-posY,2))
        let down = Math.sqrt(Math.pow(endX-posX,2)   + Math.pow(endY-posY-1,2))
        let up = Math.sqrt(Math.pow(endX-posX,2)   + Math.pow(endY-posY+1,2))

        let upleft = Math.sqrt(Math.pow(endX-posX-1,2) + Math.pow(endY-posY-1,2))
        let upright = Math.sqrt(Math.pow(endX-posX+1,2) + Math.pow(endY-posY-1,2))
        let downleft = Math.sqrt(Math.pow(endX-posX-1,2)   + Math.pow(endY-posY+1,2))
        let downRight = Math.sqrt(Math.pow(endX-posX+1,2)   + Math.pow(endY-posY+1,2))

        addSearchNode(posX,posY);
        tmpArr.push({
            value : left,
            dx: -1,
            dy: 0
        });
        tmpArr.push({
            value : right,
            dx: +1,
            dy: 0
        });
        tmpArr.push({
            value : down,
            dx: 0,
            dy: -1
        });
        tmpArr.push({
            value : up,
            dx: 0,
            dy: +1
        });
        tmpArr.push({
            value : upleft,
            dx: -1,
            dy: -1
        });
        tmpArr.push({
            value : upright,
            dx: +1,
            dy: -1
        });
        tmpArr.push({
            value : downleft,
            dx: -1,
            dy: +1
        });
        tmpArr.push({
            value : downRight,
            dx: +1,
            dy: +1
        });
        tmpArr = tmpArr.sort(function(a, b){return a.value - b.value})
        for(let i = tmpArr.length-1; i >= 0;i--){
            let data = tmpArr[i];
            if(recursiveSolveAStar(posX+data.dx,posY+data.dy,path)){
                path.push({x:posX,y:posY})
                return true;
            }
        }
    }
    return false;
}


function addSearchNode(posX,posY){
    if(inBound(posX+1,posY) && solvingboard[posX+1][posY] == ' '){
        orderSearch.push({x:posX+1,y:posY,search:true});
    }
    if(inBound(posX-1,posY) && solvingboard[posX-1][posY] == ' '){
        orderSearch.push({x:posX-1,y:posY,search:true});
    }
    if(inBound(posX,posY-1) && solvingboard[posX][posY-1] == ' '){
        orderSearch.push({x:posX,y:posY-1,search:true});
    }
    if(inBound(posX,posY+1) && solvingboard[posX][posY+1] == ' '){
        orderSearch.push({x:posX,y:posY+1,search:true});
    }
}

function recursiveSolve(posX,posY,path){
    if(solvingboard[posX][posY] == '2'){
        path.push({x:posX,y:posY})
        return true;
    }
    if(solvingboard[posX][posY] == ' ' || solvingboard[posX][posY] == '1'){
        solvingboard[posX][posY] = 'O';
        orderSearch.push({x:posX,y:posY,search:false});
        addSearchNode(posX,posY);
        if(recursiveSolve(posX+1,posY,path)){
            path.push({x:posX,y:posY})
            return true;
        }
        if(recursiveSolve(posX-1,posY,path)){
            path.push({x:posX,y:posY})
            return true;
        }
        if(recursiveSolve(posX,posY-1,path)){
            path.push({x:posX,y:posY})
            return true;
        }
        if(recursiveSolve(posX,posY+1,path)){
            path.push({x:posX,y:posY})
            return true;
        }
    }
    return false;
}

function inBound(posX,posY){
    if(posX >= 0 && posY >= 0 && posX < WIDTH && posY < HEIGHT){
        return true;
    }
    return false;
}


function drawBoard(){
    for(let x = 0; x < WIDTH; x++){
        for(let y = 0; y < HEIGHT; y++){
            if(board[x] != undefined){
                ctx.fillStyle = board[x][y];
                ctx.fillRect(y*TILEY,x*TILEX,TILEX,TILEY);  
            }
        }
    }
}

function draw(evt){
    ctx.clearRect(0,0,1920,1080);
    drawBoard();
}

window.requestAnimationFrame(gameLoop);
