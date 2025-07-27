/*
 * constant
 */
var SCREEN_WIDTH   = 450;
var SCREEN_HEIGHT   = 800;
var SCREEN_CENTER_X = SCREEN_WIDTH/2;
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;

var RESULT = {
    main: { // MainScene用ラベル
        children: [{
            type: "Label",
            name: "Resultscore",
            fontSize: 32,
            fillStyle: "White",
            shadowBlur: 4,
            x: SCREEN_WIDTH /2,
            y: SCREEN_HEIGHT /2 - 100,
        },
        {
            type: "Label",
            name: "comment",
            fontSize: 23,
            fillStyle: "White",
            shadowBlur: 4,
            x: SCREEN_WIDTH /2,
            y: (SCREEN_HEIGHT /2 - 100) + 35,
        }],
    }
};

var ASSETS = {
    "title":  "./image/title.png",
    "player":  "./image/tobuhito.png",
    "playerSS":  "./playerSS.tmss",
    "hoziri":  "./image/hoziri.png",
    "hoziriSS":  "./hoziriSS.tmss",
    "back":  "./image/Back.png",
    "back2":  "./image/Back2.png",
    "back3":  "./image/Back3.png",
   // "bgm1":  "./sound/Ravel-Borelo.ogg",
//    "bgm1":  "./sound/bgm1.mp3",
    //"bgm2":  "./sound/tuki.ogg",
//    "bgm2":  "./sound/bgm2.mp3",
    "tori":  "./image/tori.png",
    "man":  "./image/man.png",
    "manSS":  "./manSS.tmss",
    "para":  "./image/para.png",
    "paraSS":  "./paraSS.tmss",
    "riman":  "./image/riman.png",
    "rimanSS":  "./rimanSS.tmss",
    "ika":  "./image/ika.png",
    "ikaSS":  "./ikaSS.tmss",
    "meteo":  "./image/meteo.png",
    "meteoSS":  "./meteoSS.tmss",

};



var DEFAULT_PARAM = {
    width: 465,
    height: 465
};


//背景生成用
var backcontrol;

//画面全体をスクロールするためのY方向の速度
var worldvy;

var player;

var point;

var BackGroup;

tm.main(function() {
    var app = tm.app.CanvasApp("#world");
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    app.fitWindow();

    app.background = "#000000";
    /*
    app.replaceScene( myLoadingScene({
        assets: ASSETS,
        nextScene: TitleScene,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT
    }));
*/
    var loading = tm.app.LoadingScene({
        assets: ASSETS,
        nextScene: TitleScene,
    });
    app.replaceScene(loading);


    //音楽
    //tm.sound.SoundManager.add("bound", "https://github.com/phi1618/tmlib.js/raw/0.1.0/resource/se/puu89.wav");

    app.run();
});

tm.define("TitleScene", {
    superClass : "tm.app.Scene",

    init : function() {
        this.superInit({
            title :  "鼻をほじると隣の人が浮く人",
            width :  SCREEN_WIDTH,
            height : SCREEN_HEIGHT
        });


        this.title = tm.app.Sprite("title", SCREEN_WIDTH, SCREEN_HEIGHT).addChildTo(this);
        this.title.position.set(SCREEN_WIDTH/2, SCREEN_HEIGHT/2);


        // 画面(シーンの描画箇所)をタッチした時の動作
        this.addEventListener("pointingend", function(e) {
            // シーンの遷移
            e.app.replaceScene(MainScene());
        });


    },
});


tm.define("EndScene", {
    superClass : "tm.app.Scene",

    init : function() {
        this.superInit();

        this.Meigenmeke();

        this.ButtonWD = 140;
        this.ButtonHE = 40;
        this.MarginX  = (this.ButtonWD / 2) + 10;
        this.MarginY = 10;

        this.fromJSON(RESULT.main);
        this.Name = tm.app.Label("サイト").addChildTo(this);
        this.Name
            .setPosition(SCREEN_WIDTH - 100, SCREEN_HEIGHT -150)
            .setFillStyle("white")
            .setFontSize(25);
            var cachacom =  tm.ui.GlossyButton(this.ButtonWD , this.ButtonHE, "#32cd32", "かちゃコム").addChildTo(this);
            cachacom.setPosition(SCREEN_WIDTH - 100, SCREEN_HEIGHT -100);
            cachacom.onclick = function() {
                window.open("http://cachacacha.com");
            };


            var tweet =  tm.ui.GlossyButton(this.ButtonWD, this.ButtonHE, "blue", "tweet").addChildTo(this);
            tweet.setPosition(SCREEN_CENTER_X + this.MarginX, SCREEN_CENTER_Y + this.MarginY);
            url = "cachacacha.com/GAME/Hanahoziri/";
            txt = encodeURIComponent("SCORE: " + point + "cm" + this.ResultTxt + " " + url + "  #鼻をほじると隣の人が浮く人");


            tweet.onclick = function() {
                window.open("http://twitter.com/intent/tweet?text=" + txt);
            };

    },

    update: function(app) {
        this.Resultscore.text = point + "cm";
        this.comment.text = this.ResultTxt;

         var resume =  tm.ui.GlossyButton(this.ButtonWD, this.ButtonHE, "", "もう一回").addChildTo(this);
            resume.setPosition(SCREEN_CENTER_X - this.MarginX, SCREEN_CENTER_Y + this.MarginY);
            resume.onclick = function() {
              app.replaceScene(MainScene());
            };
    },

    onnextscene: function (e) {
 //       tm.asset.AssetManager.get("bgm2").stop();
        e.app.replaceScene(MainScene());
    },


    Meigenmeke:function (e){

        this.ResultTxt = "浮かせた";

    }

});


tm.define("MainScene", {
    superClass: "tm.app.Scene",

    init: function() {
        // 親の初期化
        this.superInit();

        //画面全体をスクロールするためのY方向の速度
        worldvy = 0;

        BackGroup = tm.app.CanvasElement().addChildTo(this); //ブロックグループ作成

         // Player
        player = Player().addChildTo(this);

        this.hoziri = Hoziri().addChildTo(this);

        this.mapA = Map("back").addChildTo(BackGroup);
        this.mapA.position.set(SCREEN_WIDTH/2, SCREEN_HEIGHT/2);

        this.mapB = Map("back2").addChildTo(BackGroup);
        this.mapB.position.set(SCREEN_WIDTH/2, -(SCREEN_HEIGHT/2));

        this.SentouMapY = this.mapB.y; //先頭のマップの高さ

        this.score = 0;
        this.scoreUI = tm.app.Label("SCORE").addChildTo(this);
        this.scoreUI
            .setPosition(80, 30)
            .setFillStyle("white")
            .setFontSize(40)
            .setShadowBlur(4)
            .setShadowColor("blue");


      //   tm.asset.AssetManager.get("bgm1").play();
      //   tm.asset.AssetManager.get("bgm1").loop = true;

        this.timer = 0;
        this.Level = 1;

       // test = hoziru_create().addChildTo(this);

        point = 0;

        this.stage= 1;

        this.interval = false;

    },

    update: function(app) {

        this.SentouMapY += worldvy;

        this.MapCheck();
        this.ScoreUpdate();

        this.LevelCheck();
        this.timer++;


        if(this.interval == false){
            this.enemy_create();
        }

    },


    MapCheck:function(){

        if(this.SentouMapY + 5 > SCREEN_HEIGHT - (SCREEN_HEIGHT /2)){
            this.MapCreate();
        }


    },

    MapCreate: function(){

        if(this.Level <= 5){
        var map = Map("back2").addChildTo(BackGroup);
        }
        else{
            if(this.stage == 1){
        //    tm.asset.AssetManager.get("bgm1").stop();
        //    tm.asset.AssetManager.get("bgm1").loop = true;

          //  tm.asset.AssetManager.get("bgm2").play();
        //    tm.asset.AssetManager.get("bgm2").loop = true;

            this.stage = 2;
            }

        var map = Map("back3").addChildTo(BackGroup);
        }
        map.position.set(SCREEN_WIDTH/2, -(SCREEN_HEIGHT/2));
        this.SentouMapY = map.y;

    },

    MapDestroy: function(){

    },

    ScoreUpdate:function(){

        point += Math.floor(worldvy);
        this.scoreUI.text = point + "cm";

    },


    LevelCheck:function(){

        if(point > 500 && this.Level < 2){
            this.Level = 2;
        }
        if(point > 2000 && this.Level < 3){
            this.Level = 3;
        }
        if(point > 3000 && this.Level < 4){
            this.Level = 4;
        }
        if(point > 4500 && this.Level < 5){
            this.Level = 5;
        }
        if(point > 6000 && this.Level < 6){
            this.Level = 6;
            this.interval = true;
        }
        if(point > 7000 && this.Level < 7){
            this.Level = 7;
            this.interval = false;
        }

        if(point > 9000 && this.Level < 8){
            this.Level = 8;
            this.interval = false;
        }

        if(point > 11000 && this.Level < 9){
            this.Level = 9;
            this.interval = false;
        }

    },

    enemy_create: function(){

        //トリの生成

        if(this.timer % 200 == 0 && this.Level >= 2){
            var tori = tori_create(2).addChildTo(this);
        }

        if(this.timer % 350 == 0 && this.Level >= 3){
            var man = man_create().addChildTo(this);
        }

        if(this.timer % 250 == 0 && this.Level >= 4){
            var man = para_create().addChildTo(this);
        }

        if(this.timer % 420 == 0 && this.Level >= 5){
            var man = riman_create().addChildTo(this);
        }

        if(this.timer % 600 == 0 && this.Level >= 7){
            var man = ika_create().addChildTo(this);
        }

        if(this.timer % 550 == 0 && this.Level >= 8){
            var man = meteo_create().addChildTo(this);
        }

        if(this.timer % 720 == 0 && this.Level >= 9){
            var man = hoziru_create().addChildTo(this);
        }


    },


});


tm.define("Map", {
    superClass: "tm.app.Sprite",

    init: function (Back) {
        this.superInit(Back,SCREEN_WIDTH,SCREEN_HEIGHT);


        },

    update: function(){


        this.y += worldvy;

    }

});



tm.define("Player", {
    superClass: "tm.app.AnimationSprite",

    init: function () {
        this.superInit("playerSS");
        this.gotoAndPlay("tati");

        this.width = 100;
        this.height = 200;

        this.yuka = 600;

        this.x = SCREEN_CENTER_X - (this.width / 2) -10;
        this.y = this.yuka;

        this.origin.x = 0;
        this.origin.y = 0;

        this.v = tm.geom.Vector2(0, 0);
        this.vy = 0;

        this.jumpFlg = 2;  //プレイヤーの状態フラグ　0:走ってる 1:地上　2:空中

        this.power = 10;

        this.speed = 0;
        this.kasokudo = 0.05;


        //この座標を超えたら画面全体がスクロールする
        this.RemitY = 450;

        this.MaxSpeed = 4;

        this.Gameoverflg = 0;

    },

    update: function(app) {

        this.L = this.x + 40;
        this.R = this.x + 60;
        this.T = this.y + 40;
        this.B = this.y+ 130; //足の当たり判定に加速度を足す。めり込み防止



        if(this.Gameoverflg == 0){
            this.Move(app);
            this.PositionCheck();
        }
        else{
            this.Gameover(app);
        }

        if(this.y > SCREEN_HEIGHT + this.height){
    //        tm.asset.AssetManager.get("bgm1").stop();
    //        tm.asset.AssetManager.get("bgm2").stop();
            app.replaceScene(EndScene());

        }


    },

    Move: function(app){

       if (app.pointing.getPointingStart()) {

            this.gotoAndPlay("jump");

            this.speed = -this.kasokudo;
            this.vy -= 1;


        }
        if(app.pointing.getPointingEnd()){
            this.gotoAndPlay("tati");
            this.speed = this.kasokudo;
            this.vy += 1;

        }


        this.vy += this.speed;
        this.SpeedCheck();


        if(this.y < this.RemitY && this.vy < 0){
            worldvy = -this.vy;
            this.yuka += worldvy;
        }
        else{
            worldvy = 0;
            this.y += this.vy;
        }


    },

    //最高速度チェック
    SpeedCheck:function(){

        if(this.MaxSpeed < this.vy){
            this.vy = this.MaxSpeed;
        }

        if(-this.MaxSpeed > this.vy){
            this.vy = -this.MaxSpeed;
        }

    },

    PositionCheck:function(){

        if(this.y > this.yuka){
            this.y = this.yuka;
            this.vy = 0;
        }

    },

    clash:function(){
        this.Gameoverflg = 1;
    },

    Gameover:function(app){
        this.x -= 8;
        this.y += 8;
        this.rotation += 30;



    },


});


//鼻ほじりくん
tm.define("Hoziri", {
    superClass: "tm.app.AnimationSprite",

    init: function () {
        this.superInit("hoziriSS");
        this.gotoAndPlay("tati");

        this.width = 100;
        this.height = 200;

        this.x = 75;
        this.y = 515;


        this.origin.x = 0;
        this.origin.y = 0;

    },

    update: function(app) {

        this.Move(app);

    },

    Move: function(app){
       if (app.pointing.getPointingStart()) {

            this.gotoAndPlay("hoziru");

        }
        if(app.pointing.getPointingEnd()){
            this.gotoAndPlay("tati");

        }


        this.y += worldvy;

    },

});

//トリ生成


tm.define("tori_create", {
    superClass: "tm.app.Sprite",

init: function(Level) {
        this.superInit("tori");

        this.x = SCREEN_WIDTH;
        this.y = rand(SCREEN_HEIGHT - 500);

        this.origin.x = 0;
        this.origin.y = 0;

        this.width = 70;
        this.height = 70;

        this.L = this.x + 20;
        this.R = this.x + 40;
        this.T = this.y;
        this.B = this.y + this.height; //足の当たり判定に加速度を足す。めり込み防止


        this.speed = 3;

        this.vy = 0;
        if(Level == 3){
            this.vy = 3;
            this.rotation = -40;
            this.y = rand(300);
        }

    },

    update: function(app) {
        this.x -= this.speed;
        this.y += worldvy + this.vy;

        this.L = this.x + 10;
        this.R = this.x + this.width - 10;
        this.T = this.y +10;
        this.B = this.y + this.height - 10; //足の当たり判定に加速度を足す。めり込み防止

        if(clash(this,player)){
            player.clash();
        }


        if(this.x < 0 - this.width){
            this.remove();
        }


    },

});


tm.define("man_create", {
    superClass: "tm.app.AnimationSprite",

init: function(Level) {
        this.superInit("manSS");
        this.gotoAndPlay("tati");



        this.origin.x = 0;
        this.origin.y = 0;

        this.width = 185;
        this.height = 90;

        this.x = -this.width;
        this.y = rand(SCREEN_HEIGHT - 600);




        this.speed = 2;

        this.vy = 0;


    },

    update: function(app) {
        this.x += this.speed;
        this.y += worldvy + this.vy;

        this.L = this.x + 10;
        this.R = this.x + this.width - 10;
        this.T = this.y +10;
        this.B = this.y + 50; //足の当たり判定に加速度を足す。めり込み防止

        if(clash(this,player)){
            player.clash();
        }

        if(this.x > SCREEN_WIDTH){
            this.remove();
        }


    },

});


tm.define("para_create", {
    superClass: "tm.app.AnimationSprite",

init: function(Level) {
        this.superInit("paraSS");
        this.gotoAndPlay("tati");

        this.origin.x = 0;
        this.origin.y = 0;

        this.width = 100;
        this.height = 100;

        this.x = SCREEN_WIDTH;
        this.y = rand(300);


        this.speed = 2;

        this.vy = -2;


    },

    update: function(app) {
        this.x -= this.speed;
        this.y += worldvy - this.vy;

        this.L = this.x + 35;
        this.R = this.x + 65;
        this.T = this.y;
        this.B = this.y + this.height; //足の当たり判定に加速度を足す。めり込み防止

        if(clash(this,player)){
            player.clash();
        }



        if(this.x < 0 - this.width){
            this.remove();
        }


    },

});


tm.define("riman_create", {
    superClass: "tm.app.AnimationSprite",

init: function(Level) {
        this.superInit("rimanSS");
        this.gotoAndPlay("tati");

        this.origin.x = 0;
        this.origin.y = 0;

        this.width = 100;
        this.height = 200;

        this.x = rand(SCREEN_WIDTH / 3);
        this.y = 0 - this.height;



        this.speed = 1;

        this.vy = -3;


    },

    update: function(app) {
        this.x += this.speed;
        this.y += worldvy - this.vy;

        this.L = this.x + 40;
        this.R = this.x + 60;
        this.T = this.y + 30;
        this.B = this.y + this.height - 50; //足の当たり判定に加速度を足す。めり込み防止

        if(clash(this,player)){
            player.clash();
        }



        if(this.y > SCREEN_HEIGHT + this.height){
            this.remove();
        }


    },

});



tm.define("ika_create", {
    superClass: "tm.app.AnimationSprite",

init: function(Level) {
        this.superInit("ikaSS");
        this.gotoAndPlay("tati");

        this.origin.x = 0;
        this.origin.y = 0;

        this.width = 60;
        this.height = 60;

        this.x = 0;
        this.y = 0 - this.height;




        this.speed = 2;

        this.vy = -3;


    },

    update: function(app) {
        this.x += this.speed;
        this.y += worldvy;

        this.L = this.x + 10;
        this.R = this.x + 50;
        this.T = this.y + 10;
        this.B = this.y + this.height - 10; //足の当たり判定に加速度を足す。めり込み防止

        if(clash(this,player)){
            player.clash();
        }


        if(this.x > SCREEN_WIDTH - this.width|| this.x < 0){
            this.speed *= -1;
        }

        if(this.y > SCREEN_HEIGHT + this.height){
            this.remove();
        }


    },

});

tm.define("meteo_create", {
    superClass: "tm.app.AnimationSprite",

init: function(Level) {
        this.superInit("meteoSS");
        this.gotoAndPlay("tati");

        this.origin.x = 0;
        this.origin.y = 0;

        this.width = 150;
        this.height = 150;

        this.x = 0 - this.width;
        this.y = rand(50);

        this.speed = 3;
        this.vy = -3;

    },

    update: function(app) {
        this.x += this.speed;
        this.y += worldvy - this.vy;

        this.L = this.x + 20;
        this.R = this.x + 180;
        this.T = this.y + 10;
        this.B = this.y + this.height - 10; //足の当たり判定に加速度を足す。めり込み防止

        if(clash(this,player)){
            player.clash();
        }



        if(this.y > SCREEN_HEIGHT + this.height){
            this.remove();
        }


    },

});


tm.define("hoziru_create", {
    superClass: "tm.app.AnimationSprite",

init: function(Level) {
        this.superInit("hoziriSS");
        this.gotoAndPlay("hoziru");

        this.origin.x = 0;
        this.origin.y = 0;

        this.width = 100;
        this.height = 200;

        this.x = 0 - this.width;
        this.y = SCREEN_HEIGHT - 100;

        this.speed = 1;
        this.vy = -2;

    },

    update: function(app) {
        this.x += this.speed;
        this.y +=  this.vy  + worldvy;

        this.L = this.x + 20;
        this.R = this.x + this.width;
        this.T = this.y + 10;
        this.B = this.y + this.height - 10; //足の当たり判定に加速度を足す。めり込み防止


        if(clash(this,player)){
            player.clash();
        }



        if(this.x > SCREEN_WIDTH + this.width){
            this.remove();
        }


    },

});



//衝突用関数ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
function clash(a,b){

    if((a.L <= b.R) && (a.R >= b.L)
    && (a.T  <= b.B) && (a.B >= b.T))
    {
            return true
    }

    return false;
}

function rand(n){
    return Math.floor(Math.random() * (n));
}
