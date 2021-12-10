const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
var canvasDimensions = 40; //Gridmodifier in pixeln


var width = 10; //anzahl Koordinaten in x-richtung
var height = 10;    //anzahl Koordinaten in y-Richtung
var end = false;    //Spielabbruchsvariable
var input;  //Eingabe, bsp: w,a,s und d
var tickRate = 500; //Tickrate in ms

canvas.height = width * canvasDimensions;
canvas.width = height * canvasDimensions;


//setup
//zufällige Positionen für Snake und Food
let startX = random(width);
let startY = random(height);
const player = new Snake(startX, startY);   //Instanz der Snake.
while(player.checkPosition(startX, startY)) {
    startX = random(width);
    startY = random(height);
}
const food = new Food(startX, startY);  //Instanz des Foods
drawGame();


//aktuellste Eingabe wird gespeichert, damit sie spaeter in setInterval verwendet werden kann
document.addEventListener('keypress', function(event) {
    input = event.key;
});

//"Clock", welche pro Tick run() aufruft, solange die Snake sich nicht selbst gefressen hat (true/False in Variable end).
setInterval(function() {
    if(end) {
        clearInterval();    //Clock wird gestoppt
    } else if(input !== undefined) {
        run();
    }
}, tickRate);


//run() ist die Spieldurchführung pro Tick, quasi "eine Runde".
function run() {

    //Mit x und y wird im folgenden kalkuliert. Diese müssen zunaechst auf die Werte x,y der ersten Player-Instanz Player ("Schlangenkopf") gesetzt werden, damit von da ausgehend Positionsveraenderungen berechnet werden koennen.
    var x = player.x;
    var y = player.y;
    
    //Positionsveränderungen an x, y ausgehend des aktuellsten Input (aktuellster Input siehe EventHandler).
    var key = input;
    document.getElementById('output').innerHTML = key + " " + player.x + " " + player.y;
    if(key == "w" || key == "W") {
        y--;
    } else if(key == "s" || key == "S") {
        y++;
    } else if(key == "a" || key == "A") {
        x--;
    } else if(key == "d" || key == "D") {
        x++;
    }

    //Position korrigiert, falls ausserhalb des Spielfeldes (Sprung auf andere Seite des Spielfeldes)
    if(x < 0 || x >= width || y < 0 || y >= height) {
        if(x < 0) {
            x = width - 1;
        }
        if(x >= width) {
            x = 0;
        }
        if(y < 0) {
            y = height - 1;
        }
        if(y >= height) {
            y = 0;
        }
    }

    //Spielregeln ausführen
    if(!player.checkPosition(x,y))  {   //wenn die neue Position nicht zu player gehört
        if(food.checkPosition(x,y)) {   //Wenn player auf neuer Position frisst: player verlängern und auf neue Position bewegen.
            player.addNext(player.x, player.y);
            player.recursiveMove(x, y);

            //Neue Position für Food berechnen
            let a = random(width);  
            let b = random(height);
            while(player.checkPosition(a, b)) {
                a = random(width);
                b = random(width);
            }
            food.relocate(a, b)

        } else {    //Wenn neue Position leer: player auf Position bewegen
            player.recursiveMove(x, y);
        }
    } else {    //Wenn neue Position = Instanz des Players: Player frisst sich selbst und das Spiel wird beendet.
        end = true;
        document.getElementById('output').innerHTML = "Ende! Druecke F5 fuer eine neue Runde. Score: " + player.getLength();   // Es wird ein Score ausgegeben basierend auf Länge des Players.
    }
    drawGame();
}

//Darstellung des Spielst auf HTML-Element Canvas
function drawGame() {
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    for(let y = 0; y < width; y++) {
        for(let x = 0; x < width; x++) {
            if(player.x == x && player.y == y) {    //Wenn erste Instanz von Player ("Schlangenkopf") an Position x,y
                context.fillStyle = 'lightgreen';
                context.fillRect( (x * canvasDimensions), (y * canvasDimensions), canvasDimensions, canvasDimensions);
            } else if(player.checkPosition(x, y)) { //Wenn weitere Instanzen von Player an Position x,y an Position x,y
                context.fillStyle = 'green';
                context.fillRect( (x * canvasDimensions), (y * canvasDimensions), canvasDimensions, canvasDimensions);
            } else if(food.checkPosition(x,y)) {    //Wenn Instanz von Food an Position x,y
                context.fillStyle = 'blue';
                context.fillRect( (x * canvasDimensions), (y * canvasDimensions), canvasDimensions, canvasDimensions);
            }
        }
    }
}

function random(n) {
    return Math.floor(Math.random() * n);
}

//--- Definitionen der Objekte Snake für die Schlange und Food ---

//Beinhaltet Koordinaten x,y und es kann eine Instanz von sich selbst an sich anhängen (Variable next).
function Snake(x, y) {
    this.x = x;
    this.y = y;
    var next;
    this.move = function(a, b) {
        this.x = a;
        this.y = b;
    }
    this.addNext = function(a, b) { //Instanz Snake an letze Instanz von Snake anhaengen ueber Variable next.
        if(this.next === undefined) {
            this.next = new Snake(a, b);
        } else {
            this.next.addNext(a, b);
        }
    }
    this.checkPosition = function(a, b) {   //true oder false. Prueft, ob sich an angegebener Position a,b eine Instanz von Snake befindet
        var occupied = (this.x == a && this.y == b);
        if(occupied) {
            return true
        } else if((this.next !== undefined)){
            return this.next.checkPosition(a, b);
        } else {
            return false;
        }
    }
    this.recursiveMove = function(a, b) {   //Bewegt alle Instanzen der Snake. Die erste Instanz wird an die neue Position a,b bewegt, die anderen Instanzen werden auf die Position ihres "vorgaengers" bewegt.
        if(this.next !== undefined) {
            this.next.recursiveMove(this.x, this.y);
        }
        this.x = a;
        this.y = b;
    }
    this.getLength = function() {
        if(this.next === undefined) {
            return 1;
        } else {
            return this.next.getLength() + 1;
        }
    }
}

//Beinhaltet Koordinaten x,y
function Food(x, y) {   
    this.x = x;
    this.y = y;
    this.relocate = function(a, b) {
        this.x = a;
        this.y = b;
    }
    this.checkPosition = function(a,b) {
        if(this.x == a && this.y == b) {
            return true;
        } else {
            return false;
        }
    }
}