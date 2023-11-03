var game = new Phaser.Game(1000, 800, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

var background;
var map;
var layer;
var facing = 'left';
var player;
var cursors;
///////////////////////////
var coins;
var chekpoint;
var texto ;
var puntaje=0;
var vidas=3;
///////////////////////////
var enemy;
var enemyUpDownDirection = 1; // 1 representa movimiento hacia abajo, -1 representa movimiento hacia arriba
var enemyLeftRightDirection = 1; // 1 representa movimiento hacia la derecha, -1 representa movimiento hacia la izquierda
////////////////////////////
var bullets;
var bullet;
var bulletTime = 0;
var fireDelay = 1000; 
var lastFireTime = 0;
////
var coinSound;
var bulletSound;
var enemyDeathSound;
var dolor;
var sonidoAmbiente;
function preload() {
    game.load.image('background', 'assets/fondo.png');
    game.load.tilemap('map', 'assets/proyectt.csv', null, Phaser.Tilemap.CSV);
    game.load.image('tiles', 'assets/map.png');
    game.load.image('bullet', 'assets/bola.png');
    game.load.image('coin', 'assets/coinn.png');
    game.load.image('wait', 'assets/coin.png');
    game.load.spritesheet('mummy', 'assets/sprites.png', 64, 64, 16);
    game.load.spritesheet('enemy', 'assets/enemigos.png');
    game.load.audio('coinSound', 'assets/coin.mp3');
    game.load.audio('bulletSound', 'assets/bullet.mp3');
    game.load.audio('enemyDeathSound', 'assets/enemydeath.mp3');
    game.load.audio('dolor', 'assets/dolor.mp3');
    game.load.audio('ambiente', 'assets/musica.mp3');
}
function create() {
    sonidoAmbiente = game.add.audio('ambiente');
    sonidoAmbiente.loop = true;
    sonidoAmbiente.play();
    sonidoAmbiente.volume = 0.5;
    background = game.add.sprite(0, 0, 'background')
    background.scale.setTo(game.world.width / background.width, game.world.height / background.height);
    background.fixedToCamera = true;
    background.scale.setTo(4.9, 7.52);
    map = game.add.tilemap('map', 72, 72);
    map.addTilesetImage('tiles');
    layer = map.createLayer(0);
    layer.resizeWorld();
    map.setCollisionBetween(0,9); 
    texto = game.add.text(200, 10, "puntaje: 0/8 vidas:3", { font: "40px Arial", fill: "#ffffff", align: "center" });
	texto.fixedToCamera = true;
	texto.cameraOffset.setTo(10,10);
    coinSound = game.add.audio('coinSound');
    bulletSound = game.add.audio('bulletSound');
    enemyDeathSound = game.add.audio('enemyDeathSound');
    dolor = game.add.audio('dolor');
    chekpoint = game.add.group();   
    chekpoint.enableBody = true;
    var point = chekpoint.create(525, 900, 'wait');
    var point = chekpoint.create(955, 960, 'wait');
    var point = chekpoint.create(1460, 960, 'wait');
    var point = chekpoint.create(2180, 525, 'wait');
    var point = chekpoint.create(2610, 1540, 'wait');
    var point = chekpoint.create(2610, 2400, 'wait');
    var point = chekpoint.create(1460, 1970, 'wait');
    var point = chekpoint.create(2900, 2830, 'wait');
    coins = game.add.group();
    coins.enableBody = true;
    for (var i = 0; i < 1; i++) {
        var coin = coins.create(525, 900, 'coin');
        var coin = coins.create(955, 960, 'coin');
        var coin = coins.create(1460, 960, 'coin');
        var coin = coins.create(2180, 525, 'coin');
        var coin = coins.create(2610, 1540, 'coin');
        var coin = coins.create(2610, 2400, 'coin');
        var coin = coins.create(1460, 1970, 'coin');
        var coin = coins.create(2900, 2830, 'coin');
 
     }
    enemy = game.add.group();
    enemy.enableBody = true;
    for (var i = 0; i < 1; i++) {
        var enem = enemy.create(100, 400, 'enemy');
        var enem = enemy.create(525, 900, 'enemy');
        var enem = enemy.create(955, 960, 'enemy');
        var enem = enemy.create(1460, 960, 'enemy');
        var enem = enemy.create(2180, 525, 'enemy');
        var enem = enemy.create(2610, 1540, 'enemy');
        var enem = enemy.create(2610, 2400, 'enemy');
        var enem = enemy.create(1460, 1970, 'enemy');
        var enem = enemy.create(2900, 2530, 'enemy');
        var enem = enemy.create(525, 1700, 'enemy');
        var enem = enemy.create(525, 2100, 'enemy');
        var enem = enemy.create(100, 2000, 'enemy');
        var enem = enemy.create(955, 300, 'enemy');
        var enem = enemy.create(1500, 100, 'enemy');
        var enem = enemy.create(2600, 100, 'enemy');
        var enem = enemy.create(2040, 1200, 'enemy');
        var enem = enemy.create(1540, 1500, 'enemy');
        var enem = enemy.create(2900,1600, 'enemy');
        var enem = enemy.create(2900,700, 'enemy');
        var enem = enemy.create(1000,2250, 'enemy');   
    }
    game.time.events.loop(3000, toggleEnemyUpDownDirection, this);
    game.time.events.loop(1000, toggleEnemyLeftRightDirection, this);
    player = game.add.sprite(75, 75, 'mummy');
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 500;
    player.animations.add('up', [12 , 13 , 14 , 15 ], 10, true);
    player.animations.add('down', [0 , 1 , 2 , 3 ], 10, true);
    player.animations.add('left', [4, 5, 6, 7], 10, true);
    player.animations.add('right', [8, 9, 10, 11 ], 10, true);
    player.animations.add('turn', [0], 20, true);
    player.body.setSize(32, 32, 16, 16);
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    for (var i = 0; i < 20; i++) {
        var b = bullets.create(0, 0, 'bullet');
        b.name = 'bullet' + i;
        b.exists = false;
        b.visible = false;
        b.checkWorldBounds = true;
        b.events.onOutOfBounds.add(resetBullet, this);
    }
    cursors = game.input.keyboard.createCursorKeys();
    game.camera.follow(player);
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    configurarJuego();
}
function update() {
    game.physics.arcade.overlap(player, coins, recogerMonedas, null, this);
    game.physics.arcade.overlap(bullet, enemy, collisionHandler, null, this);
    game.physics.arcade.collide(bullets, layer, bulletWallCollision, null, this);
    game.physics.arcade.overlap(player,enemy, reiniciar, null, this);
    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(enemy, layer);
    player.body.velocity.x = 0;
    player.body.velocity.y = -9;   

    if (cursors.up.isDown) {
        player.body.velocity.y = -200;
        if (facing != 'up') {
            player.animations.play('up');
            facing = 'up';
        }
    } else if (cursors.down.isDown) {
        player.body.velocity.y = 200;
        if (facing != 'down') {
            player.animations.play('down');
            facing = 'down';
        }
    } else if (cursors.left.isDown) {
        player.body.velocity.x = -200;
        if (facing != 'left') {
            player.animations.play('left');
            facing = 'left';
        }
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 200;
        if (facing != 'right') {
            player.animations.play('right');
            facing = 'right';
        }
    } else {
        if (facing != 'idle') {
            player.animations.stop();
            if (facing == 'left') {
                player.frame = 0;
            } else {
                player.frame = 0;
            }
            facing = 'idle';
        }
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        if (game.time.now > lastFireTime + fireDelay) {
            fireBullet();
            lastFireTime = game.time.now;
        }
    }
    enemy.forEach(function(enem) {
        enem.body.velocity.y = 100 * enemyUpDownDirection; 
        enem.body.velocity.x = 100 * enemyLeftRightDirection; 
    });  
    if (vidas <= 0) {
        configurarJuego();
    }
}
function fireBullet() {
    bullet = bullets.getFirstExists(false);
    if (bullet) {
        bullet.reset(player.x + 6, player.y + 15);
        
        if (facing == 'left') {
            bullet.body.velocity.x = -300;
        } else if (facing == 'right') {
            bullet.body.velocity.x = 300;
        } else if (facing == 'up') {
            bullet.body.velocity.y = -300;
        } else if (facing == 'down') {
            bullet.body.velocity.y = 300;
        }else if(facing== 'idle'){
            bullet.kill();
        }
        bulletSound.play();
    }
   
}
function recogerMonedas(player, coin) {
    coin.kill();
    puntaje++;
    texto.text="puntaje: "+puntaje.toString()+"/8 vidas: "+vidas.toString();
    coinSound.play();
}
function resetBullet(bullet) {
    bullet.kill();
}
function collisionHandler(player,enemy) {
   bullet.kill();
   enemy.kill();
   enemyDeathSound.play();
}
function bulletWallCollision(bullet, layer) {
    bullet.kill();
}
function createEnemigos() {   
    for (var i = 0; i < 1; i++) {
        var enem = enemy.create(100, 400, 'enemy');
        var enem = enemy.create(525, 900, 'enemy');
        var enem = enemy.create(955, 960, 'enemy');
        var enem = enemy.create(1460, 960, 'enemy');
        var enem = enemy.create(2180, 525, 'enemy');
        var enem = enemy.create(2610, 1540, 'enemy');
        var enem = enemy.create(2610, 2400, 'enemy');
        var enem = enemy.create(1460, 1970, 'enemy');
        var enem = enemy.create(2900, 2530, 'enemy');
        var enem = enemy.create(525, 1700, 'enemy');
        var enem = enemy.create(525, 2100, 'enemy');
        var enem = enemy.create(100, 2000, 'enemy');
        var enem = enemy.create(955, 300, 'enemy');
        var enem = enemy.create(1500, 100, 'enemy');
        var enem = enemy.create(2600, 100, 'enemy');
        var enem = enemy.create(2040, 1200, 'enemy');
        var enem = enemy.create(1540, 1500, 'enemy');
        var enem = enemy.create(2900,1600, 'enemy');
        var enem = enemy.create(2900,700, 'enemy');
        var enem = enemy.create(1000,2250, 'enemy');   
        
    }
}
function createMonedas() {
    for (var i = 0; i < 1; i++) {
        var coin = coins.create(525, 900, 'coin');
        var coin = coins.create(955, 960, 'coin');
        var coin = coins.create(1460, 960, 'coin');
        var coin = coins.create(2180, 525, 'coin');
        var coin = coins.create(2610, 1540, 'coin');
        var coin = coins.create(2610, 2400, 'coin');
        var coin = coins.create(1460, 1970, 'coin');
        var coin = coins.create(2900, 2830, 'coin');
 
     }
}
function reiniciar(player, enemy) {
    dolor.play();
    enemy.kill();
    vidas--;
    texto.text = "puntaje: " + puntaje.toString() + "/8 vidas: " + vidas.toString();
    if (vidas == 0) {
        player.kill();
    }
}
function configurarJuego() {
    player.reset(75, 75);
    puntaje = 0;
    vidas = 3;
    texto.text = "puntaje: " + puntaje.toString() + "/8 vidas: " + vidas.toString();
    enemy.forEach(function(enemigo) {
        enemigo.kill();
    });
    coins.forEach(function(coin) {
        coin.kill();
    });
    createEnemigos();
    createMonedas();
}
function toggleEnemyUpDownDirection() {
    enemyUpDownDirection *= -1; 
}
function toggleEnemyLeftRightDirection() {
    enemyLeftRightDirection *= -1;
}
function render() {
    
}