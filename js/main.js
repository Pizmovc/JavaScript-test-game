var stage, counter = 0;
var background, text, pause, queue, boo;
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

    background = new createjs.Shape();
    background.graphics.beginFill("#f4f3f2").drawRoundRect(0, 0, stage.canvas.width, stage.canvas.height, 10);
    stage.addChild(background);

    createjs.Ticker.on("tick", tick);
    createjs.Ticker.setFPS(30);
    createjs.Ticker.paused = true;

    text = new createjs.Text(counter.toString(), "20px Arial", "#ff7700");
    text.x = 5;
    text.y = 5;
    stage.addChild(text);

    manifest = [
        {src: "../images/sprites_boo.png", id: "boo"},
        {src: "../images/boo_hiding.png", id: "boo_hiding"}
    ];

    queue = new createjs.LoadQueue(false);
    queue.on("complete", handleComplete);
    queue.loadManifest(manifest, true);

}
function handleComplete () {
    var spriteSheet = new createjs.SpriteSheet({
        framerate: 30,
        "images": [queue.getResult("boo_hiding")],
        "frames": {"width": 29, "height": 53, "regX": 15, "regY": 53, "count": 9, "spacing": 3},
        "animations": {
            "bob": [0, 7, "bob"],
            "scare": {
                "frames": [8, 8, 8],
                "next": "bob"
            }
        }
    });
    boo = new createjs.Sprite(spriteSheet, "bob");
    boo.y = stage.canvas.height;
    boo.x = 50;
    boo.on("click", function (evt) {
        boo.gotoAndPlay("scare");
    });
    stage.addChild(boo);
    createCircle();
    fadeBackground();
}

function createCircle(){
    var tempCircle = new createjs.Shape();
    var randomNo = Math.round(Math.random() * 2);
    var color = ["#00ffb6", "#b600ff", "#ffb600"];
    tempCircle.graphics.beginFill(color[randomNo]).drawCircle(0, 0, 1);
    tempCircle.x = 80 + (Math.random() * (stage.canvas.width - 160));
    tempCircle.y = 80 + (Math.random() * (stage.canvas.height - 160));
    tempCircle.on("click", function(evt) {
            stage.removeChild(this);
            createjs.Tween.removeTweens(this);
            createjs.Tween.removeTweens(background);
            createCircle();
            fadeBackground();
            counter++;
            });

    createjs.Tween.get(tempCircle)
            .to({scaleX: 0, scaleY: 0, alpha: 0})
            .to({scaleX: 80, scaleY: 80, alpha: 1}, (700 - 10 * counter < 0) ? 0 : (700 - 10 * counter), createjs.Ease.bounceOut)
            .wait((700 - 5 * counter < 0) ? 0 : (700 - 5 * counter))
            .to({scaleX: 0, scaleY: 0, alpha: 0}, (700 - 10 * counter < 0) ? 0 : (700 - 10 * counter), createjs.Ease.backIn)
            .wait(200)
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

function fadeBackground () {
    createjs.Tween.get(background)
            .to({alpha: 1})
            .to({alpha: 0.0}, 2 * (700 - 10 * counter) + (700 - 5 * counter))
            .wait(200);
}

function tick (event) {
    text.text = "Score: " + counter.toString();
    stage.update();

}