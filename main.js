
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
        for(let i = -1; i <= 1; i++){
            for(let j = -1; j <= 1; j++){
                if(!(i == 0 && j==0)){
                    let dist = Math.sqrt(Math.pow((endX*10)-(posX+i)*10,2) + Math.pow((endY*10)-(posY+j)*10,2)) 
                    if(inBound(posX+i,posY+j) && solvingboard[posX+i][posY+j] == ' '){
                        solvingboardDist[posX+i][posY+j] = dist;
                        orderSearch.push({x:posX+i,y:posY+j,search:true});
                    }
                    tmpArr.push({
                        value : dist,
                        dx: i,
                        dy: j
                    });
                }
            }
        }
        tmpArr = tmpArr.sort(function(a, b){return a.value - b.value})
        for(let i = 0; i < tmpArr.length;i++){
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
