var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var trex, trexCorrendo, trexColidiu;
var solo, soloinvisivel, imagemdosolo;

var nuvem, grupodenuvens, imagemdanuvem;
var obstaculo, grupodeobstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var pontuacao;

var imgFimDeJogo,imgReiniciar
var somSalto , somCheckPoint, somMorte;


function preload(){
  trexCorrendo = loadAnimation("trex1.png","trex3.png","trex4.png");
  trexColidiu = loadAnimation("trex_collided.png");
  
  imagemdosolo = loadImage("ground2.png");
  
  imagemdanuvem = loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
    
  imgReiniciar = loadImage("restart.png");
  imgFimDeJogo = loadImage("gameOver.png");
  
  somSalto = loadSound("jump.mp3");
  somMorte = loadSound("die.mp3");
  somCheckPoint = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trexCorrendo);
  trex.scale = 0.5;
  
  solo = createSprite(200,180,400,20);
  solo.addImage(imagemdosolo);
      
  fimDeJogo = createSprite(300,100);
  fimDeJogo.addImage(imgFimDeJogo);
  
  
  reiniciar = createSprite(300,140);
  reiniciar.addImage(imgReiniciar);
  reiniciar.scale = 0.4;
    
  soloinvisivel = createSprite(200,190,400,10);
  soloinvisivel.visible = false;
   
  //criar grupos de obstáculos e de nuvens
  grupodeobstaculos = createGroup();
  grupodenuvens = createGroup();
  
   
  trex.setCollider("circle",0,0,40);
  trex.debug = false;
  
  pontuacao = 0;
  
}

function draw() {
  
  background("white");
  //exibindo pontuação
  text("Pontuação: "+ pontuacao, 500,50);
  
  if(estadoJogo === JOGAR){
    
    fimDeJogo.visible = false;
    reiniciar.visible = false;
     
    //solo.velocityX = -4;
    solo.velocityX = -(4 + pontuacao/100)
    
    //marcando pontuação
    pontuacao = pontuacao + Math.round(frameCount/60);
    
    if(pontuacao > 0 && pontuacao % 100 === 0){
      somCheckPoint.play();
    }
    
    if (solo.x < 0){
      solo.x = solo.width/2;
    }
    
    //saltar quando a tecla de espaço é pressionada
    if(keyDown("space") && trex.y >= 100) {
       trex.velocityY = -12;
       somSalto.play();
    }
  
    //adicionar gravidade
    trex.velocityY = trex.velocityY + 0.8
   
    //Funções
    gerarNuvens();

    gerarObstaculos();
    
    if(grupodeobstaculos.isTouching(trex)){
      //trex.velocityY = -12;
      //somSalto.play();
      estadoJogo = ENCERRAR;
      somMorte.play();
      
    }
  }
     else if (estadoJogo === ENCERRAR) {
      fimDeJogo.visible = true;
      reiniciar.visible = true;
       
      solo.velocityX = 0;
       
      //define o tempo de vida dos objetos do jogo para que nunca sejam destruídos
      grupodeobstaculos.setLifetimeEach(-1);
      grupodenuvens.setLifetimeEach(-1);
     
      grupodeobstaculos.setVelocityXEach(0);
      grupodenuvens.setVelocityXEach(0); 
      
      //altera a animação do Trex
      //trex.changeAnimation("collided", trex_colidiu);
     
     }
  
  
  //evita que o Trex caia no solo
  trex.collide(soloinvisivel);

  drawSprites();
}

function gerarObstaculos(){
 if (frameCount % 60 === 0){
   obstaculo = createSprite(600,165,10,40);
   obstaculo.velocityX = -(4 + pontuacao / 100);
   obstaculo.scale = 0.5;
   obstaculo.lifetime = 300;   

    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
      default: break;
    }

    //adicionar cada obstáculo ao grupo
    grupodeobstaculos.add(obstaculo);
 }
}

function gerarNuvens() {
  //escreva o código aqui para gerar as nuvens 
  if (frameCount % 60 === 0) {
    nuvem = createSprite(600,100,40,10);
    nuvem.y = Math.round(random(10,60));
    nuvem.addImage(imagemdanuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    nuvem.lifetime = 200; 
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
        
    //adiciondo nuvem ao grupo
   grupodenuvens.add(nuvem);
  }
}