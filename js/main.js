var stage, counter = 0;
var text, pause;
function init () {
    var canvas = document.getElementById('canvas');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    stage = new createjs.Stage("canvas");
    stage.on("mouseleave", function (evt) {
            if(!isEndOfGame){
                createjs.Ticker.paused = true;
                pause = new createjs.Shape();
                pause.graphics.beginFill("#e2895f").drawRoundRect(stage.canvas.width / 3 - 40, 40, 80, stage.canvas.height - 80, 10)
                        .drawRoundRect(2 * stage.canvas.width / 3 - 40, 40,  80, stage.canvas.height - 80, 10);
                pause.alpha = 0.5;
                stage.addChild(pause);
            }
            })

    stage.on("mouseenter", function (evt) {
            if(!isEndOfGame){
                createjs.Ticker.paused = false;
                stage.removeChild(pause);
            }    
            })

    var background = new createjs.Shape();
    background.graphics.beginFill("#f4f3f2").drawRoundRect(0, 0, stage.canvas.width, stage.canvas.height, 10);
    stage.addChild(background);

    createCircle();

    createjs.Ticker.on("tick", tick);
    createjs.Ticker.setFPS(30);
    createjs.Ticker.paused = true;

    text = new createjs.Text(counter.toString(), "20px Arial", "#ff7700");
    text.x = 5;
    text.y = 5;
    stage.addChild(text);
}

function createCircle(){
    var tempCircle = new createjs.Shape();
    var randomNo = Math.round(Math.random() * 2);
    var color = ["#00ffb6", "#b600ff", "#ffb600"];
    tempCircle.graphics.beginFill(color[randomNo]).drawCircle(0, 0, 80);
    tempCircle.x = 80 + (Math.random() * (stage.canvas.width - 160));
    tempCircle.y = 80 + (Math.random() * (stage.canvas.height - 160));
    tempCircle.on("click", function(evt) {
            stage.removeChild(this);
            createjs.Tween.removeTweens(this);
            createCircle();
            counter++;
            });

    createjs.Tween.get(tempCircle)
            .to({scaleX: 0.2, scaleY: 0.2, alpha: 0.1})
            .to({scaleX: 1, scaleY: 1, alpha: 1}, (700 - 10 * counter < 0) ? 0 : (500 - 10 * counter), createjs.Ease.bounceOut)
            .wait((700 - 5 * counter < 0) ? 0 : (200 - 5 * counter))
            .to({scaleX: 0, scaleY: 0, alpha: 0}, (700 - 10 * counter < 0) ? 0 : (500 - 10 * counter), createjs.Ease.backIn)
            .wait(100)
            .call(youLost);
    stage.addChild(tempCircle);
}
var isEndOfGame = false;
function youLost(){
    isEndOfGame = true;
    alert("You lost the game! \nYour final score was " + counter +" clicked balls. Good job!");
    var button = new createjs.Shape();
    //button.graphics.beginFill("green").drawRoundRect(stage.canvas.width/2 - 50, stage.canvas.height / 2 - 50 , 100, 100, 10);
    button.graphics.beginFill("#e2895f").drawPolyStar(stage.canvas.width / 2, stage.canvas.height / 2, stage.canvas.height / 3, 3, 0, 0);
    button.on("click", function (evt){
            location.reload();
            })
    
    stage.addChild(button);
}

function tick (event) {
    text.text = "Score: " + counter.toString();
    stage.update();

}