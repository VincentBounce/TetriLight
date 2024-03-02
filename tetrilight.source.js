/******************************************************************
****************   TetriLight - Vincent BOURDEAU   ****************
****************   2011 and 2020 and 2024 - v0.3   ****************
*******************************************************************
Pure HTML5 JS CANVAS, no picture, no framework, no API, fully resizable
Tested on 2020-05-01, fit Chrome, Brave, Edge, Opera, Safari, Firefox (slow)
Fit ECMAScript 6 (2015) + HTML5 Canvas + https://standardjs.com/rules.html + Airbnb style
All browsers support MP3 and WAV, excepted Edge/IE for WAV

**************** GITHUB ****************
remote: tetrilight-github instead origin
branches:
    main: same as canvas
    canvas: canvas dev [to finish]
    svg: SVG dev [try in progress]
    es5-fit-ie11: latest version compatible [JS ES5=ECMAScript 2009] to fit Internet Explorer 11
    async: test using async functions

**************** VOCABULARY ****************
to clear = to sweep, cleared = swept
a row = a line
a cell = a slot = a box
sprites = graphics = gfx
pivot = orientation

**************** TETRIS GAME RULES ****************
When a player clears 3 or more (RULES.pentominoesRowsCountMin) lines together, then he have 1 to 3 blocks per shape,
and others players have 5 blocks per shape, during 15 or 20 seconds (it's called Pentominoes/Trominoes mode).
When a player clears 2 or more (RULES.transferRowsCountMin) lines together, then he drops same quantity of bad grey lines to others players.
Game is lost when new shape can't be placed (!_fallingShape.canMoveToPlaced).
Game starts at level 0
Level starts 0, increments +1 every 10 rows cleared
Hard drops double travelled cells count
Cleared rows count formula is 40 for 1, 100 for 2, 300 for 3, 1200 for 4, 6600 for 5 at level 0, then *(level + 1)
Combos rows count formula is same * 50%
Bonus same as 2 rows when all is cleared (Perfect clear)

**************** GRAPHIC CHOICE ****************
SVG:
    each SVG element is visible in Elements Explorer
    gradient possible on fonts
    small blur because sizes in %
    calculate render on each move
    implicit built-in page resize zoom
Canvas:
    each canvas element is obscur in Elements Explorer
    blur because window.devicePixelRatio !==1, 1.75 for example in 4K screen
    move without calculation
    computing page resize zoom with JS explicit code
    window.devicePixelRatio: read only, ratio 1.75 on my 4K LCD === physical px / px independant device
    DIV
        _htmlElement: DIV
        _htmlElement: CANVAS
            _drawingContext2D: CanvasRenderingContext2D (choose smooth)
                globalAlpha, imageSmoothingEnabled, imageSmoothingQuality

WebGL: not massively adopted

**************** MINOR BUGS ****************
Small bug, if riseGreyBlocks and 1 or more row appears, need to wait next drop to clear this row
If top line only is cleared AND top line has blocks under, then the anim and sound of droping occurs again
$$$ test browser when start!
$$$ display fps
$$$ ListAutoIndex called 1x, useless?
$$$ pentomode blinking to solve
$$$ pause doesn't pause coming grid movements
!= became !==, 10min tested: stable, check if slower
== became ===, 10min tested: stable, check if slower
Prototypes became Class, check if slower
frame rate

**************** CHANGES FROM ECMAScript 5 (2009) ****************
window.requestAnimationFrame, window.cancelAnimationFrame: W3C 2015: Firefox 23 / IE 10 / Chrome / Safari 7
IE11 (standard with Windows 10) not working with:
    (`Level ${this._level}`)
    let myFunc = function(x){return x;} --> let myFunc = (x)=>{return x;} --> x=>x
    cloneSheeps = sheeps.slice(); --> cloneSheepsES6 = [...sheeps]
    func(arg=null)
    myArray.fill()
ECMAScript 2015: let, const, Transform: IE11 OK
ECMAScript 2017: async await

**************** CODE JS ****************
SVG: can change in realtime, retained mode (gradient evaluated on each change)
    for large surface, small number of objects
HTML5 Canvas: draw and forget, immediate mode (gradient done): CHOOSEN!
    for small surface, large number of objects
JS editor: Visual Studio Code with "Monokay" theme
Debugger: Chrome with CTRL+SHIFT+I
delete myObject.myAttribute: not exist anymore, [undefined], then garbage collector comes
myObject.myAttribute = null: value is [null], then garbage collector comes
let = cond ? if_true : if_false
let x = {}; x = null (typeof === "object") / x = undefined (typeof === "undefined")
typeof: item[undefined, boolean, number, string, object[array, set], function]
'' === "" === `` / item <> element
console.log(obj1, obj2, obj3...) to log objects into console (F12 key) on Chrome;
console.clear() to clear before
console.table() to have a clear table
let result = myClassInstance.publicMethod(); <> let myMethod = myClassInstance.publicMethod;
callee function (appelée), calling function (appelante)
(function () { ...instructions... })(); it's IIFE, means Immediately invoked function expression
only Object or Array variables can be assigned by references
myMethod.call(this, arg1, arg2...) === myMethod.apply(this, [arg1, arg2...])
>= operator
=> used to define a func 
    In regular functions the this keyword represented the object that called the function, which could be the window, the document, a button or whatever.
    With arrow functions the this keyword always represents the object that defined the arrow function.
React (78% market): HTML, CSS, JS faster dev / Angular (21% market): Java, C# cleaner code, match TypeScript

**************** CODE JS ARRAY ****************
queue(fifo) / gridAnimsStackPush(filo)
shift<<, unshift>> [array] <<push, >>pop
delete myArray[0]: just set slot to undefined
myArray.shift(): remove the 1st slot from the table, decrease the length
    WARNING shift all indexes, start is alway 0
    WARNING even an Empty slot
for (let p in MyArray) delete myArray[p]: set to undefined / not Empty slots
instrument = [...instrument, 'violin', 'guitar'] // same as push violin, push guitar
instrument = ['violin', 'guitar', ...instrument] // same as unshift violin, unshift guitar
objectName.propertyName === objectName["propertyName"]
myArray = new Array(6) adds an array of 6 Empty slots, from 0 to 5
WARNING:
    Empty: without value
    null: with value
    undefined: with value
myArray["propertyName"]=3.14 adds a property, NOT an array index, array lenght still unchanged
myArray[-1]=3.14 adds a property, NOT an array index, array length still unchanged
myArray[666]=3.14 adds an array index, array length goes to 667
for (let p in myArray) browse each index AND each properties, WARNING p is string
    browse also ones with null and undefined values
    WARNING excepted Empty slots (without value) in array (skipping indices that were never assigned a value)
myArray.forEach() browse each index, NOT properties
    browse also ones with null and undefined values
    WARNING excepted Empty slots (without value) in array (skipping indices that were never assigned a value)
myArray = New Array(6).fill(null).forEach() browse each index
    browse also ones with null and undefined values
delete myArray[4] makes the 5th slot Empty
myArray.forEach() return nothing WARNING, first argument is READ ONLY WARNING
myArray.fill([]) return array, WARNING new Array is evaluated 1 time only, so it refers to same for each slot filled!
    KO:    _matrix = [...[new Array(RULES.horizontalCellsCount+2).fill(null).forEach( (column, index, matrix)=>{
            column = []; // column is READ ONLY, use matrix[index] instead
            for (let j=GAME._matrixBottom;j <= GAME._matrixHeight;j++) column[j] = null; // height -1 to +(2x20)    })]]; // WARNING column is READ ONLY, use matrix[index][j] instead
    OK:    _matrix = new Array(RULES.horizontalCellsCount+2).fill(null); // need to fill whole table, to make forEach browsing all slots
        _matrix.forEach( (column, index, matrix)=>{ // left and right boxes as margins columns, program fail if removed
            matrix[index] = [];
            for (let j=GAME._matrixBottom;j <= GAME._matrixHeight;j++) matrix[index][j] = null; // height -1 to +(2x20) });
merge 2 objects with different properties: myNewObject = Object.assign(firstOject, secondObject, {myThirdObjectProperty: 555}); or myNewObject = {...firstOject, ...secondObject, myThirdObjectProperty: 555};

**************** NAMING CONVENTION ****************
// #DEBUG: to track bug
// $$$: to check or fix later
$function: used to track bug
GLOBAL_VARIABLE_OR_CONSTANT: global variable to handle a class, or global constant
MyClass: public class with first letter uppercase (Pascal Case)
_privateVariable: private variable accessible only by class
privateMethod_: private method accessible only by class
privateMethodBody_: private method body called only by 1 method
publicMethod: public method (Lower Camel Case)
publicVariable: public variable (Lower Camel Case)
destroyMyClass: class destructor function
let myVariable is local variable in the fonction
let x, y are positions on browser, in pixels (x -> right, y -> down)
let i, j are positions of blocks into grid (i -> right, j -> up)
let o is generic object
let p is variable to browse in object
let item is generic item, object or array or string boolean number
forEach( (myVar)=>{ return myVar++; } );

**************** ANIMATIONS SEQUENCES ****************
Events program, reacts to:
    timeouts after animations, after drop period on each slot
    keys pressed
    mouse clicks
Queuing new actions, new exclusive anims when:
(hardDrop > quake)0-1 > (clearRows > hardDrop > quake)0-* : riseGreyBlocks actions are stuck
(riseGreyBlocks)1-* > (hitShape > (clearRows > hardDrop > quake)0-* )0-1 > : fallingShape is stuck
messages and scores anims are not exclusive, each new one replace previous one
0-1 means iterating from 0 to 1 time. 0-* from 0 to x times
pauseOrResume stops every timers, music. It let FX finish. It block controls

**************** CLASS ****************
MainMenu [1 instance]
    MAIN_MENU._domNode: DomNode [1 instance]
    SPRITES: TetrisSpritesCreation [1 instance]
        SpriteObj: sprite objects
    GAME: TetrisGame [1 instance]
        _gameEventsQueue
        PentominoesBriefMode
        TetrisGrid [x instance]
            _playedPolyominoesType
            _playerKeysSet
            _animsStack
            _anims: all grid anims
            _gridEventsQueue
            _gridMessagesQueue
            lose()
            _lockedBlocks: [] of Blocks
            _lockedShapes: [] of Shapes: Blocks: Node
            _fallingShape: Shape
            _nextShape: Shape
            TetrisScore
                _score
                _level
*/
"use strict"; // use JavaScript in strict mode to make code better and prevent errors
// GLOBAL VARIABLES, each one handle one class instance only
let MAIN_MENU, GAME, AUDIO, SPRITES;            // SPRITES: TetrisSpritesCreation
// GLOBAL CONSTANTS
const RULES                     = { // tetris rules
    gameSpeedRatio              : 1, // default 1 normal speed, decrease speed < 1 < increase global game speed #DEBUG
    initialVolume               : 0.1, // default 0.6, 0 to 1, if #DEBUG
    transferRowsCountMin        : 2, // default 2, min height of rows to drop bad grey lines to others players, decrease for #DEBUG
    pentominoesRowsCountMin     : 3, // default 3, min height of rows to start pentominoes mode, decrease for #DEBUG
    horizontalCellsCount        : 10, // default 10, min 5 #DEBUG
    verticalCellsCount          : 21, // default 21             = (20 visible + 1 hidden) #DEBUG
    topLevel                    : 25, // default 25, max level (steps of drop acceleration)
    risingRowsHolesCountMaxRatio: 0.3, // default 0.3, <        = 0.5, max holes into each rising row, example: 0.5 = 50% means 5 holes for 10 columns
    fps                         : 60/1000 }; // default 60/1000 = 60frames per 1000ms, average requestAnimationFrame() browser frame rate
const DURATIONS                 = { // tetris durations, periods in ms
    pentominoesModeDuration     : 10000, // 5000 ms, 15s for 3 lines cleared, 20s for 4 lines cleared
    movingGridsDuration         : 350, // 0350 ms
    clearingRowsDuration        : 350, // 0350 ms or 500, increase for #DEBUG, incompressible by any key excepted pause
    rising1RowDuration          : 150, // 0150 ms or 250, increase for #DEBUG
    rotatingDuration            : 400, // 0400 ms
    gridQuakeDuration           : 150, // 0150 ms or 200, increase for #DEBUG, incompressible by any key excepted pause
    centralMessagesDuration     : 1500, // 1500 ms, central messages displaying duration, replaced, not queued
    displayingScoreDuration     : 1500, // 1500 ms
    hardDropDuration            : 200, // 0200 ms, increase for #DEBUG
    lostMessageDuration         : 3500, // 3500 ms, period to display score
    softDropPeriod              : 50, // 0050 ms, if this is max DropDuration
    initialDropPeriod           : 1100 }; // 0700 ms, >= _softDropPeriod, decrease during game, increase for #DEBUG, incompressible duration by any key excepted pause
const FONTS                   = { scoreFont: 'Ubuntu', messageFont: 'Rock Salt' }; // online fonts
//const FONTS                   = { scoreFont: 'Arial, Helvetica, sans-serif', messageFont: 'Impact, Charcoal, sans-serif' }; // web safe fonts = offline fonts
const SOUNDS                  = { 
    landFX                    : {ext: 'wav'},
    rotateFX                  : {ext: 'wav'},
    moveFX                    : {ext: 'wav', vol: 0.2},
    clearFX                   : {ext: 'wav'},
    quadrupleFX               : {ext: 'wav'},
    selectFX                  : {ext: 'wav'},
    musicMusic                : {ext: 'mp3', vol: 0.5} };
// values > 0 to avoid (value === 0 == false)
const GAME_STATES = { paused   : 1, running: 2, runningBeforeKeyPressed: 3};
const GRID_STATES = { ready    : 1, playing: 2, lost   : 3}; // connected but not started
const BLOCK_TYPES = { ghost    : 1, inShape: 2, orphan : 3};
const SEARCH_MODE = { down     : 1, up     : 2};
const DROP_TYPES  = { soft     : 1, hard   : 2}; // 1 and 2 are useful for score: hard drop is double points

// INIT called by HTML browser
function init() {
    for (let p in DURATIONS) DURATIONS[p] /= RULES.gameSpeedRatio;    // change durations with coeff, float instead integer no pb, to slowdown game
    AUDIO = new Audio(SOUNDS);
    AUDIO.changeVolume(false);
    MAIN_MENU = new MainMenu(); // #DEBUG
    // if (GAME) GAME.destroyGame();
    GAME = new TetrisGame();
    GAME.addGrid();
    GAME.addGrid();
    GAME.addGrid();
}
// MainMenu Class, menu manager, make new one to open a TetrisGame
function MainMenu() { // queue or stack
    window.addEventListener('keydown', this.keyCapture_, false); // for all keys, producing value or not
    window.addEventListener('keyup', this.keyCapture_, false); // for all keys, producing value or not
    // window.oncontextmenu = function(event){ this.cancelEvent_(event); }; // right click
    // below creation for MAIN dom node
    SPRITES = new TetrisSpritesCreation(); // need dom node created to get sizes for scaling
    this._domNode = new DomNode({ // menus on top of the screen #DEBUG white
        body: true,
        topScreenSprite: { type: 'canvas',
            width: _ => SPRITES.pxGameWidth, height: _ => SPRITES.pxTopMenuZoneHeight, sprite:SPRITES._spriteBackground }, // to create an HTML top free space above the tetris game
        message1Div: {
            width: _ => SPRITES.pxTopMenuZoneHeight, height: _ => SPRITES.pxTopMenuZoneHeight, vertical_align:'middle' },
        playingAreaSprite: { type:'canvas',
            width: _ => SPRITES.pxGameWidth, height: _ => SPRITES.pxGameHeight,
            y: _ => SPRITES.pxTopMenuZoneHeight, sprite: SPRITES._spriteBackground }
        }, 'gameAreaDiv'); // one arg only for setDomNode
    SPRITES.zoom1Step(0); // we set all px sizes
    this._domNode._childs.playingAreaSprite.nodeDrawSprite(); // paint black background
    // this._domNode._childs.message1Div.createText('FONTS.messageFont', 'bold', 'black', '');
    // this._domNode._childs.message1Div.setTex('totototo');
    this._domNode._htmlElement.addEventListener('click',
        function(eventClick) {
            if ((eventClick.offsetX < SPRITES.pxButtonSize) && (eventClick.offsetY < SPRITES.pxButtonSize))
                    GAME.addGrid(); // top left square click capture to add another grid
        }, false);
    window.onresize = function() { GAME.organizeGrids({resize:true}) };
}
MainMenu.prototype = {
    _domNode: null,
    cancelEvent_(event) { //seems useless
        keyboardEvent.stopPropagation(); //method prevents propagation of the same event from being called
        event.preventDefault();
    },
    keyCapture_(keyboardEvent) {
        //MAIN_MENU.cancelEvent_(keyboardEvent);
        switch (keyboardEvent.code) { //key press: both keydown and keyup
            case 'KeyP':
                if (keyboardEvent.type=='keydown' && !keyboardEvent.repeat) //avoid P keydown repeated
                    GAME.pauseOrResume(); // to enter pause
                break; // always exit after this instruction
            default:
                if (GAME._gameState !== GAME_STATES.paused) // if game is not paused
                    GAME._gridsListArray.forEach( myGrid => myGrid.chooseControlAction(keyboardEvent) );
        }
    },
};
// Audio Class, sounds management
function Audio(sounds) { // constructor
    this._sounds = {};
    for (let p in sounds)
        this.addSound(p, sounds[p].ext, sounds[p].vol);
}
Audio.prototype = {
    _mainVolume: RULES.initialVolume,
    _muted: false,
    _sounds: null, // object containing all sounds
    addSound(name, ext, volume) { // when new is called, add all sounds in this._sounds let, 2nd arg volume is optional
        this._sounds[name] = {};
        this._sounds[name].sound = window.document.createElement('audio');
        window.document.body.appendChild(this._sounds[name].sound);
        if (name.indexOf('Music') !== -1) // check if contains Music in name, if so then play with loop
            this._sounds[name].sound.loop = 'loop';
        this._sounds[name].sound.setAttribute('src', 'audio/' + name + '.' + ext); // (ext ? ext : 'wav')
        this._sounds[name].volumeFactor = (volume ? volume : 1);
        this._sounds[name].paused = false;
    },
    audioPlay(name) {
        this._sounds[name].paused = false;
        this._sounds[name].sound.play();
    },
    audioStop(name) {
        this._sounds[name].paused = false;
        this._sounds[name].sound.pause(); // old: this._sounds[name].sound.currentTime = 0;
    },
    pauseOrResume(name) {
        this._sounds[name].paused = !this._sounds[name].paused;
        if (this._sounds[name].paused)
            this._sounds[name].sound.pause();
        else
            this.audioPlay(name);
    },
    changeVolume(up) { // -1 or +1, return false if not changed
        let volume = this._mainVolume + up*0.1;
        if ((volume < 0) || (volume > 1))
            return false; // can't change out of [0-1] range
        else {
            this._mainVolume = volume;
            this.refreshVolume(this._mainVolume);
            return true;
        }
    },
    muteOrUnmute() {
        this.muted = !this.muted;
        if (this.muted)
            this.refreshVolume(0);
        else
            this.refreshVolume(this._mainVolume);
    },
    refreshVolume(volume) {
        for (let sound in this._sounds)
            this._sounds[sound].sound.volume = volume * this._sounds[sound].volumeFactor;
    },
    /*getDuration(name) {
        return this._sounds[name].sound.duration;
    }*/
};
// TetrisSpritesCreation Class, earlier: TetrisGraphics, GameGraphics
function TetrisSpritesCreation() {
    for (let color in this._colors) this._colors[color].name = color; // adding a name field to SPRITES._colors
    // creation of SPRITES below
    this._spriteBackground = new SpriteObj({ // define backgroung color here: black > grey
        _nocache: true,
        drawSprite: (c, x, y, a, w, h) => { // context c, x, y, args a, canvas width w, canvas height h
            c.fillStyle=SpriteObj.linearGradient(c,0,0,0,h,0.5,'#000',1,'#AAA');
            c.fillRect(x,y,w,h) }
    });
    this._spriteGridFront = new SpriteObj({ // we draw 3 trapeze that we merge
        _nocache: true,
        widthSprite: _ => SPRITES.pxFullGridWidth,
        heightSprite: _ => SPRITES.pxFullGridHeight,
        drawSprite(c, x, y, a) { // context, x, y, args
            let col = SPRITES._colors[a.col];
            c.moveTo(x,y);c.lineTo(x+SPRITES.pxGridBorder,y); // left border
            c.lineTo(x+SPRITES.pxGridBorder,y+SPRITES.pxGridHeight);
            c.lineTo(x,y+SPRITES.pxFullGridHeight);
            c.fillStyle=SpriteObj.linearGradient(c,0,0,SPRITES.pxGridBorder,0,1,SpriteObj.rgbaTxt(col.dark),0,SpriteObj.rgbaTxt(col.light));
            c.fill();
            c.beginPath();c.moveTo(x+SPRITES.pxFullGridWidth,y); // right border
            c.lineTo(x+SPRITES.pxGridBorder+SPRITES.pxGridWidth,y);
            c.lineTo(x+SPRITES.pxGridBorder+SPRITES.pxGridWidth,y+SPRITES.pxGridHeight);
            c.lineTo(x+SPRITES.pxFullGridWidth,y+SPRITES.pxFullGridHeight);
            c.fillStyle=SpriteObj.linearGradient(c,SPRITES.pxGridWidth+SPRITES.pxGridBorder,0,SPRITES.pxGridBorder,0,0,SpriteObj.rgbaTxt(col.dark),1,SpriteObj.rgbaTxt(col.light));
            c.fill();
            c.beginPath();c.moveTo(0,SPRITES.pxFullGridHeight); // bottom border
            c.lineTo(SPRITES.pxGridBorder,SPRITES.pxGridHeight);
            c.lineTo(SPRITES.pxGridBorder+SPRITES.pxGridWidth,SPRITES.pxGridHeight);
            c.lineTo(SPRITES.pxFullGridWidth,SPRITES.pxFullGridHeight);
            c.fillStyle=SpriteObj.linearGradient(c,0,SPRITES.pxGridHeight,0,SPRITES.pxGridBorder,0,SpriteObj.rgbaTxt(col.dark),1,SpriteObj.rgbaTxt(col.light));
            c.fill();
            c.fillStyle=SpriteObj.linearGradient(c,0,0,0,SPRITES.pxCellSize*2,0, SpriteObj.rgbaTxt([0,0,0],1),1, SpriteObj.rgbaTxt([0,0,0],0)); // top grid shadow
            c.fillRect(0,0,SPRITES.pxFullGridWidth,SPRITES.pxFullGridHeight); // #DEBUG
        }
    });
    this._spriteGridBackground = new SpriteObj({ // we draw grid, grid shadow, back
        _nocache: true,
        widthSprite: _ => SPRITES.pxFullGridWidth,
        heightSprite: _ => SPRITES.pxFullGridHeight,
        xSprite: _ => SPRITES.pxGridBorder,
        ySprite: _ => SPRITES.pxGridBorder,
        drawSprite(c, x, y, a) { // context, x, y, args
            let col = SPRITES._colors[a.col];
            c.fillStyle='#111';c.fillRect(x,y,SPRITES.pxGridWidth,SPRITES.pxGridHeight);
            let colo = ['#000','#222'];
            for (let p=colo.length-1;p>=0;p--) {
                c.beginPath();
                let margin = -(p*SPRITES.pxGridLineWidth)+SPRITES.pxGridLineWidth/2;
                for (let i=1;i < RULES.verticalCellsCount;i++) {
                    c.moveTo(x, y+SPRITES.pxCellSize*i+margin);
                    c.lineTo(x+SPRITES.pxGridWidth, y+(SPRITES.pxCellSize)*i+margin);
                    c.lineWidth=SPRITES.pxGridLineWidth;c.strokeStyle=colo[p];c.stroke();
                }
                for (let i=1;i < RULES.horizontalCellsCount;i++) {
                    c.moveTo(x+SPRITES.pxCellSize*i+margin, y);
                    c.lineTo(x+SPRITES.pxCellSize*i+margin, y+SPRITES.pxGridHeight);
                    c.lineWidth=SPRITES.pxGridLineWidth;c.strokeStyle=colo[p];c.stroke();
                }
            }
            c.rect(x,y,SPRITES.pxGridWidth,SPRITES.pxGridHeight);
            c.fillStyle=SpriteObj.radialGradient(c,x+SPRITES.pxGridWidth/2,y+SPRITES.pxGridHeight,0,0,0,3*SPRITES.pxGridHeight/4,
                0, SpriteObj.rgbaTxt(col.medium, 0.3), 1, SpriteObj.rgbaTxt(col.medium, 0)); c.fill();
            c.fillStyle=SpriteObj.linearGradient(c,x,y,SPRITES.pxGridWidth,0,
                0, SpriteObj.rgbaTxt([0,0,0],0.5), 0.1, SpriteObj.rgbaTxt([0,0,0],0),
                0.9, SpriteObj.rgbaTxt([0,0,0],0), 1, SpriteObj.rgbaTxt([0,0,0],0.5)); c.fill(); }
    });
    this._spriteBlock = new SpriteObj({ // we draw block
        _nocache: false,
        widthSprite: _ => SPRITES.pxBlockSize,
        heightSprite: _ => SPRITES.pxBlockSize,
        xSprite: i => SPRITES.pxGridLineWidth + ( i-1 ) * SPRITES.pxCellSize,
        ySprite: j => SPRITES.pxGridLineWidth + ( RULES.verticalCellsCount-j ) * SPRITES.pxCellSize,
        drawSprite(c, x, y, a) { // context, x, y, args
            let half = Math.round(SPRITES.pxBlockSize/2);
            let margin = Math.round(SPRITES.pxBlockSize/7);
            let col = SPRITES._colors[a.col];
            c.fillStyle=SpriteObj.rgbaTxt(col.medium);
            c.fillRect(x,y,SPRITES.pxBlockSize,SPRITES.pxBlockSize);
            c.beginPath();c.moveTo(x,y);c.lineTo(x+half,y+half);c.lineTo(x+SPRITES.pxBlockSize,y);
            c.fillStyle=SpriteObj.rgbaTxt(col.light);c.fill();
            c.beginPath();c.moveTo(x,y+SPRITES.pxBlockSize);c.lineTo(x+half,y+half);
            c.lineTo(x+SPRITES.pxBlockSize,y+SPRITES.pxBlockSize);c.fillStyle=SpriteObj.rgbaTxt(col.dark);c.fill();c.beginPath();
            c.fillStyle=SpriteObj.linearGradient(c,x,y,SPRITES.pxBlockSize-2*margin,SPRITES.pxBlockSize-2*margin,0,SpriteObj.rgbaTxt(col.dark),1,SpriteObj.rgbaTxt(col.light));
            c.fillRect(x+margin,y+margin,SPRITES.pxBlockSize-2*margin,SPRITES.pxBlockSize-2*margin) }
    });
    this._spritePreviewBlock = new SpriteObj({
        _nocache: false,
        widthSprite: _ => SPRITES.pxPreviewBlockSize,
        heightSprite: _ => SPRITES.pxPreviewBlockSize,
        xSprite: x => (SPRITES._shapesSpan + x) * (SPRITES.pxPreviewBlockSize + SPRITES.pxPreviewLineWidth),
        ySprite: y => (SPRITES._shapesSpan - y) * (SPRITES.pxPreviewBlockSize + SPRITES.pxPreviewLineWidth),
        drawSprite(c, x, y, a) { // context, x, y, args (gradient if true, uniform if false)
            let col = SPRITES._colors[a.col]; // c.clearRect(x,y,SPRITES.pxPreviewBlockSize,SPRITES.pxPreviewBlockSize); // useful if we don't erase previous value
            c.fillStyle = (a.__onOff
                ? SpriteObj.linearGradient(c,x,y,SPRITES.pxPreviewBlockSize,SPRITES.pxPreviewBlockSize, 0, SpriteObj.rgbaTxt(col.dark), 1, SpriteObj.rgbaTxt(col.light))
                : SpriteObj.rgbaTxt(col.medium, SPRITES._previewOpacity)
            );
            c.fillRect(x,y,SPRITES.pxPreviewBlockSize,SPRITES.pxPreviewBlockSize) }
    });
}
TetrisSpritesCreation.prototype = {
    _zoomRatio              : 1, // default 1, float current zoom ratio
    _scaleFactor            : 33, // default 33, int scale unit < SPRITES.pxBlockSize && > = 1
    pxTopMenuZoneHeight     : 0, // default 0 or 20, Y top part screen of the game, to display information #DEBUG
    pxGameWidth             : null,
    pxGameHeight            : null,
        pxHalfGameHeight    : null,
    pxBlockSize             : 34,
        pxCellSize          : null,
    pxGridBorder            : null,
    pxGridLineWidth         : null,
    pxGridWidth             : null,
        pxFullGridWidth     : null,
            pxGridMargin    : null,
    pxGridHeight            : null,
        pxFullGridHeight    : null,
    pxCeilHeight            : null,
    pxFullGridAndCeil       : null,
    pxPreviewFullSize       : null, // 2*36===72
    pxPreviewBlockSize      : null,
    pxPreviewLineWidth      : null,
    pxButtonSize            : 50, // default 50
    pxXPreviewPosition      : null,
    pxYPreviewPosition      : null,
    pxXScorePosition        : null,
    pxYScorePosition        : null,
    pxXMessagePosition      : null,
    pxYMessagePosition      : null,
    _shapesSpan             : 2, // span(means envergure)===(5-1)/2
    _spriteBackground       : null,
    _spriteBlock            : null,
    _spriteGridFront        : null,
    _spriteGridBackground   : null,
    _spritePreviewBlock     : null,
    _spritePreviewBlockFrame: null,
    _ghostShapeOpacity      : 0.15, // default 0.15
    _previewOpacity         : 0.2, // default 0.2, opacity for preview grid
    _lostShapeOpacity       : 0.5, // default 0.5, to show a ghost of shape wich makes losing
    _colors                 : { // name filed is added by constructor
        pink      : {light: [248, 190, 232], medium: [224, 107, 169], dark: [189,  66, 111]},
        purple    : {light: [210, 172, 241], medium: [136, 100, 208], dark: [ 90,  64, 177]},
        red       : {light: [245, 140, 140], medium: [219,  78,  78], dark: [187,  48,  48]},
        green     : {light: [199, 233,  88], medium: [115, 176,  13], dark: [ 75, 127,   0]},
        yellow    : {light: [255, 250, 134], medium: [218, 190,  13], dark: [184, 147,   0]},
        orange    : {light: [250, 197, 115], medium: [240, 143,   0], dark: [212,  87,   0]},
        blue      : {light: [  0, 215, 246], medium: [ 13, 134, 222], dark: [  0,  87, 190]},
        grey_white: {light: [255, 255, 255], medium: [188, 197, 204], dark: [ 97, 109, 121]},
        grey_blue : {light: [192, 216, 231], medium: [127, 150, 188], dark: [ 73,  85, 118]},
        grey      : {light: [207, 207, 207], medium: [134, 134, 134], dark: [ 88,  88,  88]}
    },
    condition_() {
        //return ( ( // #DEBUG: to compact grids together
        // (SPRITES.pxGameWidth > SPRITES.pxFullGridWidth * GAME._playersCount + SPRITES.pxGridMargin * (GAME._playersCount+1) ) && (SPRITES.pxGameHeight > SPRITES.pxFullGridHeight + 5*SPRITES.pxGridMargin)
        return (  ( (this.pxGameWidth >= this.pxFullGridWidth * GAME._playersCount )
                && (this.pxGameHeight >= this.pxFullGridAndCeil ) )
                || (!(this._scaleFactor-1))  );
    },
    zoomToFit() { // used for scaling if needed
        if (this.condition_()) {
            while (this.condition_())
                this.zoom1Step(1);
            this.zoom1Step(-1);
        } else
            while (!this.condition_())
                this.zoom1Step(-1);
    },
    zoom1Step(step) { // computing for zoom with pixels into web browser
        this._scaleFactor += step;
        this.pxBlockSize += step;
        let oldGridWidth        = this.pxFullGridWidth;
        this.pxGameWidth        = window.innerWidth;
        this.pxGameHeight       = window.innerHeight - this.pxTopMenuZoneHeight;
        this.pxHalfGameHeight   = Math.round(this.pxGameHeight/2);
        this.pxGridLineWidth    = Math.max(Math.round(this.pxBlockSize/14), 1);
        this.pxGridWidth        = RULES.horizontalCellsCount*this.pxBlockSize + (RULES.horizontalCellsCount+1)*this.pxGridLineWidth;
        this.pxGridHeight       = RULES.verticalCellsCount*this.pxBlockSize + (RULES.verticalCellsCount+1)*this.pxGridLineWidth;
        this.pxCellSize         = this.pxBlockSize + this.pxGridLineWidth;
        this.pxGridBorder       = Math.ceil(this.pxCellSize/3); // bordure de grille en dégradé
        this.pxFullGridWidth    = this.pxGridWidth + 2*this.pxGridBorder; // largeur grille + bordure
        this.pxFullGridHeight   = this.pxGridHeight + this.pxGridBorder; // hauteur grille + bordure
        this.pxGridMargin       = Math.round(this.pxFullGridWidth/8);
        this.pxPreviewBlockSize = Math.round(this.pxBlockSize/2.6);
        this.pxPreviewLineWidth = this.pxGridLineWidth; // valeur arbitraire, aurait pu etre différente
        this.pxPreviewFullSize  = (this.pxPreviewBlockSize + this.pxPreviewLineWidth) * (2*this._shapesSpan+1) ;
        this.pxCeilHeight       = this.pxPreviewFullSize + this.pxPreviewBlockSize + this.pxPreviewLineWidth; // hauteur de la zone posée sur la grille old: + this.pxCellSize
        this.pxFullGridAndCeil  = this.pxFullGridHeight + this.pxCeilHeight;
        this.pxXPreviewPosition = Math.round(this.pxFullGridWidth/2-this.pxPreviewFullSize/2);
        this.pxYPreviewPosition = 0;
        this.pxXScorePosition   = this.pxXPreviewPosition + this.pxPreviewFullSize; // Math.round(3*this.pxFullGridWidth/4);
        this.pxYScorePosition   = 0;
        this.pxXMessagePosition = Math.round(this.pxFullGridWidth/2);
        this.pxYMessagePosition = Math.round(this.pxFullGridHeight/2);
        this._zoomRatio         = !oldGridWidth ? 1 : this.pxFullGridWidth / oldGridWidth;
    },
};
// TetrisGame Class
function TetrisGame() {
    this._matrixHeight            = RULES.verticalCellsCount * 2; // GAME blocks rise (massively sometimes) by unqueuing animated sequences: if lost, need to finish these sequences before noticing losing with new falling shape unable to place
    this._iPositionStart          = Math.ceil(RULES.horizontalCellsCount/2); // shape start position
    this._jPositionStart          = RULES.verticalCellsCount - 1;
    this._gridsListArray          = []; // players grids array
    this._pentominoesBriefMode    = new PentominoesBriefMode();
    this._gameShapesWithRotations = new Array(this._storedPolyominoes.length); // table of all shapes with rotations
    this._storedPolyominoes.forEach( (storedPolyo, s) => { // creating all shapes variations: browsing shapes
        let shapeBlocksCount = storedPolyo.blocks.length;
        let quarters = storedPolyo.quarters;
        this._gameShapesWithRotations[s] = new Array(quarters);
        for (let pivot=0; pivot < quarters; pivot++) { // creating all shapes rotations: browsing rotations
            this._gameShapesWithRotations[s][pivot] = new Array(shapeBlocksCount);
            if (pivot === 0)
                for (let b=0; b < shapeBlocksCount; b++) // browsing 4 blocks
                    this._gameShapesWithRotations[s][pivot][b] = [
                        storedPolyo.blocks[b][0],
                        storedPolyo.blocks[b][1]    ];
            else // (pivot !== 0)
                for (let b=0; b < shapeBlocksCount; b++) // browsing 4 blocks
                    this._gameShapesWithRotations[s][pivot][b] = [
                        -this._gameShapesWithRotations[s][pivot-1][b][1], // minus 1 here (default) for unclockwise
                        +this._gameShapesWithRotations[s][pivot-1][b][0] ] // minus 1 here for clockwise
        }
    } );
    this._freeColorsArray = Object.values(SPRITES._colors).filter( color => color !== SPRITES._colors['grey'] ); // to copy available colors, excepted grey
    this._anims.moveGridsAnim = new Animation({ // make tetris grid coming and leaving
        animateFunc(animOutput){
            this._gridsListArray.forEach( myGrid => myGrid._domNode.moveTemporaryRelatively(myGrid._vector[0]*animOutput, myGrid._vector[1]*animOutput) )
        },
        endAnimFunc(){
            this._gridsListArray.forEach( myGrid => {
                myGrid._domNode.moveRelatively( myGrid._vector[0], myGrid._vector[1]);
                myGrid._vector = [0, 0];
            } );
            this._gameEventsQueue.dequeue();
        },
        timingAnimFunc: x => -(x-2*Math.sqrt(x)), // arrow replace a return // canceled: -(x-2*Math.sqrt(x));
        animDuration: DURATIONS.movingGridsDuration,
        animOwner: this // otherwise, it's animation context by default
    });
    this._gameEventsQueue = new EventsQueue();    // animating applied on this._anims.moveGridsAnim
}
TetrisGame.prototype = {
    _gridsListArray         : null,
    _matrixHeight           : null,
    _matrixBottom           : -1, // 1 rising row by 1 and queued, to avoid unchained blocks levitating 
    _iPositionStart         : null,
    _jPositionStart         : null,
    _playersCount           : 0,
    _gameState              : GAME_STATES.runningBeforeKeyPressed, // others states: GAME_STATES.paused, GAME_STATES.running
    _shapeIdTick            : 0,
    _nextBlockIndex         : 0,
    _pentominoesBriefMode   : null,            
    _gameShapesWithRotations: null,
    _gameEventsQueue        : null,
    _anims                  : {}, // only 1 instance of game
    _freeColorsArray        : null, // available colors for players
    _gameKeysSets           : [ // up down left right, https://keycode.info/
        {symbols: ['I','J','K','L'], keys          : ['KeyI', 'KeyJ', 'KeyK', 'KeyL'], free                   : true},
        {symbols: ['\u2227','<','\u2228','>'], keys: ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'], free: true},
        {symbols: ['W','A','S','D'], keys          : ['KeyW', 'KeyA', 'KeyS', 'KeyD'], free                   : true} // WASD on QWERTY for left player, ZQSD on AZERTY
    ],
    _storedPolyominoes : [                                                                 // 5x5 shapes only, coordinates, angles count
        // 4 trominoes or domino or monomino
        {blocks: [[ 0, 0]],                              quarters: 1, color: 'grey_blue'},  //  - default quarters 1
        {blocks: [[ 0, 1],[0, 0]],                       quarters: 2, color: 'grey_white'}, //  -- default quarters 2
        {blocks: [[ 0, 1],[0, 0],[0,-1]],                quarters: 2, color: 'grey_blue'},  //  --- default quarters 2
        {blocks: [[ 0, 1],[0, 0],[1, 0]],                quarters: 4, color: 'grey_white'}, //  |_
        // 7 tetrominoes
        {blocks: [[ 0, 1],[0, 0],[0,-1],[0,-2]],         quarters: 2, color: 'green' },     //  I default quarters 2
        {blocks: [[-1, 0],[0, 0],[1, 0],[1,-1]],         quarters: 4, color: 'blue'  },     //  J
        {blocks: [[-1, 0],[0, 0],[1, 0],[1, 1]],         quarters: 4, color: 'orange'},     //  L
        {blocks: [[ 0, 0],[0, 1],[1, 0],[1, 1]],         quarters: 1, color: 'pink'  },     //  O default quarters 1
        {blocks: [[-1,-1],[0,-1],[0, 0],[1, 0]],         quarters: 2, color: 'purple'},     //  S default quarters 2
        {blocks: [[-1, 0],[0, 0],[0,-1],[1,-1]],         quarters: 2, color: 'red'   },     //  Z default quarters 2
        {blocks: [[-1, 0],[0, 0],[0, 1],[1, 0]],         quarters: 4, color: 'yellow'},     //  T
        // 14 pentominoes
        {blocks: [[ 0, 0],[0, 1],[1, 0],[1, 1],[ 0,-1]], quarters: 4, color: 'pink'  },     //  O¨
        {blocks: [[ 0, 0],[0, 1],[1, 0],[1, 1],[-1, 0]], quarters: 4, color: 'pink'  },     //  O_
        {blocks: [[-1,-1],[0,-1],[0, 0],[1, 0],[ 2, 0]], quarters: 4, color: 'purple'},     //  S¨
        {blocks: [[-1, 1],[0, 1],[0, 0],[1, 0],[ 2, 0]], quarters: 4, color: 'red'   },     //  ¨Z
        {blocks: [[ 0, 2],[0, 1],[0, 0],[0,-1],[ 0,-2]], quarters: 2, color: 'green' },     //  -----
        {blocks: [[-1, 0],[0, 1],[0, 0],[0,-1],[ 0,-2]], quarters: 4, color: 'green' },     //  T¨
        {blocks: [[ 1, 0],[0, 1],[0, 0],[0,-1],[ 0,-2]], quarters: 4, color: 'green' },     //  ¨T
        {blocks: [[-1, 0],[0, 0],[0, 1],[1, 0],[ 0,-1]], quarters: 4, color: 'yellow'},     //  -|- default quarters 1
        {blocks: [[-1, 1],[-1,0],[-1,-1],[0,-1],[1,-1]], quarters: 4, color: 'orange'},     //  L_
        {blocks: [[-1, 0],[0, 0],[0, 1],[1, 0],[-1,-1]], quarters: 4, color: 'orange'},     //  -L
        {blocks: [[-1, 0],[0, 0],[0, 1],[1, 0],[ 1,-1]], quarters: 4, color: 'blue'  },     //  J-
        {blocks: [[-1, 1],[-1,0],[ 0, 0],[1, 0],[1,-1]], quarters: 2, color: 'purple'},     //  J¨
        {blocks: [[-1,-1],[-1,0],[ 0, 0],[1, 0],[1, 1]], quarters: 2, color: 'red'   },     //  ¨L
        {blocks: [[-1, 1],[-1,0],[ 0, 0],[1, 0],[1, 1]], quarters: 4, color: 'blue'  }      //  L¨
    ],
    _playedPolyominoesType: {
        trominoes  : {index: 0, count : 4}, // range of 3 blocks shapes
        tetrominoes: {index: 4, count : 7}, // range of 4 blocks shapes
        pentominoes: {index: 11, count: 14} // range of 5 blocks shapes
    },
    destroyGame() {
        this._gridsListArray.forEach( myGrid => myGrid.destroyDomNode() );
        this._nextBlockIndex = 0;
        _domNode.destroyDomNode();
        // this._pentominoesBriefMode.destroyPentoMode();// old, remove all timers
    },
    pauseOrResume() { // pause or resume
        this._gameState = (this._gameState !== GAME_STATES.paused) ? GAME_STATES.paused : GAME_STATES.running;
        AUDIO.pauseOrResume('musicMusic'); // pause or resume playing music only, because FX sounds end quickly
        AUDIO.audioPlay('selectFX'); // always play sound FX for pause or resume
        this._pentominoesBriefMode.pauseOrResume(); // if pentominoes mode, pause it
        this._gridsListArray.forEach( myGrid => myGrid.pauseOrResume() ); // all players
    },
    addGrid() { // return true if added
        this._gameEventsQueue.execNowOrEnqueue(this, this.addGridBody_);
    },
    addGridBody_() { // return grid if added, null otherwise, grids qty limit is color qty
        if (this._freeColorsArray.length > 0) {
            this._playersCount ++;
            let p; for (p in this._gameKeysSets)
                if ( this._gameKeysSets[p].free)
                    break;
            this._gameKeysSets[p].free = false;
            let randomIndex = Math.floor(Math.random()*this._freeColorsArray.length);
            let randomColor = this._freeColorsArray[randomIndex];
            this._freeColorsArray.splice(randomIndex, 1); // we remove from possible choice
            let grid = new TetrisGrid( this._gameKeysSets[p], randomColor );
            this.organizeGrids({newGrid:grid});
            return grid;
        } else
            this._gameEventsQueue.dequeue();
            return null;
    },
    removeGrid(grid) { // require to be sure that grid exists and is removable
        this._gridsListArray.splice(this._gridsListArray.indexOf(grid), 1); // removing grid from array
        grid._playerKeysSet.free = true; // release if keys used
        this._freeColorsArray.push(grid._gridColor);
        this._playersCount--;
        grid.destroyGrid(); // stops timers etc..
        this.organizeGrids({oldGrid:true});
    },
    organizeGrids(instruction) { // horizontal organization only, zoomToFit makes the correct zoom
        SPRITES.zoomToFit();
        MAIN_MENU._domNode._childs.playingAreaSprite.redrawNode(); // redraw background
        let realIntervalX = (SPRITES.pxGameWidth-(SPRITES.pxFullGridWidth*this._playersCount)) / (this._playersCount+1);
        if (instruction.newGrid || instruction.oldGrid) {
            if (instruction.newGrid)
                if (this._playersCount%2) { // from left or right
                    this._gridsListArray.unshift(instruction.newGrid); // added to left
                    instruction.newGrid._domNode.moveCenterTo(-SPRITES.pxFullGridWidth, null);
                } else {
                    this._gridsListArray.push(instruction.newGrid); // added to right
                    instruction.newGrid._domNode.moveCenterTo(SPRITES.pxGameWidth+SPRITES.pxFullGridWidth, null);                
                }
            let count = 0;
            for (let p in this._gridsListArray) {
                let myGrid=this._gridsListArray[p];
                count++;
                myGrid._domNode.redrawNode(); // we change all sizes
                myGrid._domNode.moveCenterTo(null, SPRITES.pxTopMenuZoneHeight + SPRITES.pxHalfGameHeight);
                myGrid._vector = [
                    count*realIntervalX + (count-1)*SPRITES.pxFullGridWidth - myGrid._domNode.getX(),
                    0    ];
            }
            // old: this._gameEventsQueue.execNowOrEnqueue(this._anims.moveGridsAnim, this._anims.moveGridsAnim.startAnim); // #DEBUG above, $alert(instruction);
            this._anims.moveGridsAnim.startAnim();
            if (instruction.newGrid)
                instruction.newGrid.startGrid(); // enqueue?
        } else {
            let count = 0;
            for (let p in this._gridsListArray) {
                let myGrid=this._gridsListArray[p];
                count++;
                myGrid._domNode.redrawNode(); // we change all sizes
                myGrid._domNode.moveCenterTo(null, SPRITES.pxTopMenuZoneHeight + SPRITES.pxHalfGameHeight);
                myGrid._domNode.moveNodeTo(count*realIntervalX + (count-1)*SPRITES.pxFullGridWidth, null);
            }
        }
    },
    averageBlocksByPlayingGrid() {
        let playingGridsCount = 0;
        let allGridsBlocksCount = 0;
        for (let p in this._gridsListArray) {
            let myGrid=this._gridsListArray[p];
            if (myGrid._gridState === GRID_STATES.playing) {
                playingGridsCount++;
                allGridsBlocksCount += myGrid._lockedBlocks._blocksCount;
            }
        }
        return allGridsBlocksCount/playingGridsCount;
    },
    /*startGame() { #DEBUG
        this._gameState = GAME_STATES.running;
        AUDIO.audioStop('musicMusic');
        AUDIO.audioPlay('musicMusic'); // works only if a click or keystroke is received from a menu before the game starts
    },*/
    transferRows(from, count) { // from grid
        let toGridArray = [];
        this._gridsListArray.forEach( myGrid => {
            if ( (myGrid !== from) && (myGrid._gridState === GRID_STATES.playing) ) toGridArray.push(myGrid);
        } );
        if (toGridArray.length > 0)
            while ((count--) > 0) { // decrement AFTER evaluation, equivalent to 'while (count--)'
                let destGrid = toGridArray[ (Math.floor(Math.random()*toGridArray.length)+count) % toGridArray.length ];
                destGrid._gridEventsQueue.execNowOrEnqueue(
                    destGrid._lockedBlocks,
                    destGrid._lockedBlocks.put1NewRisingRow ); // we exec or enqueue
            };
    },
}
// PentominoesBriefMode Class, to manage pentominoes mode, a special mode with 5 blocks shapes, which happens after a trigger
class PentominoesBriefMode {
    constructor() {
        this._pentoModeTimer = new Timer({
            funcAtTimeOut: _ => this.finishPentoMode(),
            timerPeriod: 0,
            timerOwner: this
        });
        this._gridWichTriggeredPentoMode;
    }
    /*destroyPentoMode() { with(this) { // to replace by anim timer
        _pentoModeTimer.finishTimer();
    }*/
    pauseOrResume() {
        this._pentoModeTimer.pauseOrResume();
    }
    isRunning() {
        return (this._pentoModeTimer.isRunning());
    }
    finishPentoMode() {
        this._pentoModeTimer.finishTimer();
        GAME._gridsListArray.forEach( myGrid => {
            if (myGrid._gridState === GRID_STATES.playing) {
                myGrid._playedPolyominoesType = 'tetrominoes'
                myGrid._nextShapePreview.unMark(myGrid._nextShape); // to mark immediately next shape on preview
                myGrid._nextShape = new TetrisShape(myGrid); // previous falling shape is garbage collected
                myGrid._nextShapePreview.mark(myGrid._nextShape);
            }
        });
    }
    runPentoMode(gridWichTriggeredPentoMode, clearedLinesCount) {
        this._gridWichTriggeredPentoMode = gridWichTriggeredPentoMode;
        if (this.isRunning()) this.finishPentoMode();
        GAME._gridsListArray.forEach( myGrid => { // here, argument is used
            if (myGrid._gridState === GRID_STATES.playing) {
                myGrid._playedPolyominoesType = (myGrid !== this._gridWichTriggeredPentoMode) ? 'pentominoes' : 'trominoes';
                myGrid._nextShapePreview.unMark(myGrid._nextShape); // to mark immediately next shape on preview
                myGrid._nextShape = new TetrisShape(myGrid); // previous falling shape is garbage collected
                myGrid._nextShapePreview.mark(myGrid._nextShape);
            }
        }, this ); // this way to pass this._gridWichTriggeredPentoMode
        this._pentoModeTimer.setTimerPeriod(DURATIONS.pentominoesModeDuration*clearedLinesCount) // *3 for 3 lines cleared, *4 for 4 lines cleared
            .restartTimer();
        gridWichTriggeredPentoMode._anims.pentominoesModeAnim.setDuration(DURATIONS.pentominoesModeDuration*clearedLinesCount);
        gridWichTriggeredPentoMode._anims.pentominoesModeAnim.startAnim();
    }
}
// TetrisGrid Class
function TetrisGrid(playerKeysSet, gridColor){
    this._gridColor       = gridColor;
    this._playerKeysSet   = playerKeysSet;
    this._lockedBlocks    = new LockedBlocks(this);
    this._gridEventsQueue = new EventsQueue();
    this._animsStack      = [];
    this._lockedShapes    = [];
    this._rowsToClearSet  = new Set();
    this._matrix = new Array(RULES.horizontalCellsCount + 2); // 12 columns, left and right boxes as margins columns, program fail if removed
    for (let i=0;i < this._matrix.length;i++) {
        this._matrix[i] = [];
        for (let j=GAME._matrixBottom;j <= GAME._matrixHeight;j++) // height -1 to +(2x20)
            this._matrix[i][j] = null;
    }
    this._dropTimer = new Timer({ // here this._fallingShape is not defined yet
        //funcAtTimeOut() { console.log(this);this.fallingShapeTriesMove(0,-1); },
        funcAtTimeOut: grid => grid.fallingShapeTriesMove(0,-1),
        timerPeriod: this._normalDropPeriod,
        timerOwner: this
    });
    this._keyPressTimer = new Timer({
        funcAtTimeOut: grid => grid._keyDownPressedAtLeast200ms = true,
        timerPeriod: 30,
        timerOwner: this
    });
    //this._domNode = MAIN_MENU._domNode.
    this._domNode = new DomNode({ // creating tetris DOM zone and sub elements
        width: _ =>  SPRITES.pxFullGridWidth, height: _ =>  SPRITES.pxFullGridAndCeil,
        frameZoneDiv: {
            x: _ => SPRITES.pxGridBorder, y: _ => SPRITES.pxCeilHeight,
            width: _ => SPRITES.pxGridWidth, height: _ => SPRITES.pxGridHeight,
            overflow: 'hidden',
            gridZoneDiv: { // tetris background, if not canvas, it's div
                gridSprite: { type: 'canvas', sprite:SPRITES._spriteGridBackground },
                ghostBlocksDiv: {},
                realBlocksDiv: {} } },
        frontZoneSprite: { type: 'canvas',
            y: _ => SPRITES.pxCeilHeight, sprite: SPRITES._spriteGridFront, height: _ => SPRITES.pxFullGridHeight },
        controlZoneDiv: {
            width: _ => SPRITES.pxXPreviewPosition, height: _ => SPRITES.pxPreviewFullSize,
            y: _ => SPRITES.pxYPreviewPosition, vertical_align: 'middle' },
        nextShapePreviewSprite: { type: 'canvas',
            x: _ => SPRITES.pxXPreviewPosition, y: _ => SPRITES.pxYPreviewPosition,
            width: _ => SPRITES.pxPreviewFullSize, height: _ => SPRITES.pxPreviewFullSize,
            sprite: SPRITES._spritePreviewBlock },
        scoreZoneDiv: {
            x: _ => SPRITES.pxXScorePosition, y: _ => SPRITES.pxYScorePosition,
            width: _ => SPRITES.pxXPreviewPosition, height: _ => SPRITES.pxPreviewFullSize, vertical_align: 'middle' },
        messageZoneDiv: {
            y: _ => SPRITES.pxCeilHeight, width: _ => SPRITES.pxFullGridWidth, height: _ => SPRITES.pxFullGridHeight, vertical_align: 'middle' }
    }, `fullGridDiv${MAIN_MENU._domNode.getNewUId_()}`, MAIN_MENU._domNode);
    this._domNode._childs.frontZoneSprite.nodeDrawSprite({col:this._gridColor.name});
    this._realBlocksNode = this._domNode._childs.frameZoneDiv._childs.gridZoneDiv._childs.realBlocksDiv; // shortcut
    this._ghostBlocksNode = this._domNode._childs.frameZoneDiv._childs.gridZoneDiv._childs.ghostBlocksDiv; // shortcut
    this._domNode._childs.frameZoneDiv._childs.gridZoneDiv._childs.gridSprite.nodeDrawSprite({col:this._gridColor.name});
    this._domNode._childs.controlZoneDiv.createText(FONTS.scoreFont, 'bold', SpriteObj.rgbaTxt(this._gridColor.light), '0 0 0.4em '+SpriteObj.rgbaTxt(this._gridColor.light)); // _textCharCountWidthMin : 1 or 7
    this._domNode._childs.controlZoneDiv.setTextIntoSizedField({
        text: this._playerKeysSet.symbols[0]+'</BR>'+this._playerKeysSet.symbols[1]+' '+this._playerKeysSet.symbols[2]+' '+this._playerKeysSet.symbols[3],
        fieldCharCount: 8 }); // up down left right
    this._domNode._childs.scoreZoneDiv.createText(FONTS.scoreFont, 'normal', SpriteObj.rgbaTxt(this._gridColor.light), '0 0 0.4em '+SpriteObj.rgbaTxt(this._gridColor.light), 3);
    this._domNode._childs.messageZoneDiv.createText(FONTS.messageFont, 'bold', SpriteObj.rgbaTxt(this._gridColor.light), '0.05em 0.05em 0em '+SpriteObj.rgbaTxt(this._gridColor.dark));
    this._nextShapePreview = new NextShapePreview(this);
    this._anims = {}; // need to initialize before creating new score which contains anim
    this._score = new TetrisScore(this); // contains animation, 
    this._anims.quakeAnim = new Animation({
        animateFunc(animOutput) { // to use context of this Animation
            this._domNode._childs.frameZoneDiv._childs.gridZoneDiv.moveTemporaryRelatively(0, SPRITES.pxCellSize*2/4*animOutput);    // default 2/4 or 3/4, proportionaly to deep 20 this._domNode use context of this TetrisGrid
        },
        endAnimFunc() {
            this._domNode._childs.frameZoneDiv._childs.gridZoneDiv.moveTemporaryRestore();
            this.gridAnimsStackPop(); // to have exclusive quake anim
        },
        timingAnimFunc: x => Math.sin(x*Math.PI), // arrow replace a return // or return Math.sin(x*Math.PI*2)*(1-x);
        animDuration: DURATIONS.gridQuakeDuration,
        animOwner: this // otherwise, it's animation context by default
    });
    this._anims.pentominoesModeAnim = new Animation({
        animateFunc(animOutput) { // to use context of this Animation
            this._domNode._childs.frontZoneSprite.setDomNode({opacity: Math.abs(animOutput)});
        },
        endAnimFunc() {
            this._domNode._childs.frontZoneSprite.setDomNode({opacity: 1}); // 1 = totalement opaque, visble
        },
        timingAnimFunc: x => -Math.cos( (3**(x*3)) * Math.PI) / 2 + 0.5, // arrow replace a return // f(x)=-cos(3^(x*3)*pi)/2+0.5
        animDuration: 0, // need to set duration for this animation before running
        animOwner: this // otherwise, it's animation context by default
    });
    this._anims.clearRowsAnim = new Animation({ // loading animation to use later
        animateFunc(animOutput) { // called n times recursively, this: current object AND Animation
            this._rowsToClearSet.forEach( myRow => { // for each row to clear
                for (let i=1;i <= RULES.horizontalCellsCount;i++) // for each column
                    this._matrix[i][myRow]._domNode.setScale(animOutput) }); // with blocks' _domNodes, programs goes here for each block of each row to clear
        },
        endAnimFunc() { // NOT GRAPHIC PROCESS
            this._rowsToClearSet.forEach( myRow => this.clearFullRowAfterClearingAnim(myRow) ); // now erasing animated cleared rows data
            this._lockedBlocks.chainSearchOrphan(SEARCH_MODE.down);
            this.gridAnimsStackPop();
        },
        timingAnimFunc: x => 1 - x**2, // arrow replace a return
        animDuration: DURATIONS.movingGridsDuration,
        animOwner: this // otherwise, it's animation context by default
    });
    this._anims.shapeHardDropAnim = new Animation({ // animation for 1 shape, falling or after clearing
        animateFunc(animOutput) { // to animate blocks, we move the DomNode elementjkk
            this._lockedShapes.forEach( myShape => myShape._domNode.moveNodeTo(0, - myShape._jVector * animOutput * SPRITES.pxCellSize) )
        },
        endAnimFunc() { // fetch rows to remove, remove from moving div, draw, destroy node
            this._lockedShapes.forEach( myShape => myShape.putShapeInRealBlocksNode().drawShape()._domNode.destroyDomNode() )
            this._lockedShapes = [];
            this.gridAnimsStackPush(this._anims.quakeAnim, this._anims.quakeAnim.startAnim); // startAnim() function stacked
            this.gridAnimsStackPush(AUDIO, AUDIO.audioPlay, 'landFX'); // we stack AUDIO.audioPlay('landFX');
            this.gridAnimsStackPop();
            // old: this._anims.quakeAnim.startAnim();
            // old: this.gridAnimsStackPop();
        },
        timingAnimFunc: x => x**3, // arrow replace a return
        animDuration: DURATIONS.hardDropDuration,
        animOwner: this // otherwise, it's animation context by default
    });
    this._anims.rising1RowAnim = new Animation({
        animateFunc(animOutput) { // to animate block, we move the DomNode element
            this._lockedShapes.forEach( myShape => myShape._domNode.moveNodeTo(0, - myShape._jVector * animOutput * SPRITES.pxCellSize) )
        },
        endAnimFunc() { // fetch rows to remove, remove from moving div, draw, destroy node
            this._lockedShapes.forEach( myShape => myShape.putShapeInRealBlocksNode().drawShape()._domNode.destroyDomNode() )
            this._lockedShapes = []; // this._ghostBlocksNode.show(); // show ghost shape after rising, not necessary to hide            
            this.gridAnimsStackPop(); // unstack all countandclearrows and this._gridEventsQueue.dequeue() in stack
        },
        timingAnimFunc: x => x, // arrow replace a return // linear rising of rows, not (2*Math.sqrt(x)-x);
        animDuration: DURATIONS.rising1RowDuration,
        animOwner: this // otherwise, it's animation context by default
    });
    this._anims.shapeRotateAnim = new Animation({ // loading animation to use later
        startAnimFunc() { // to animate block, we temporary apply a transform rotation
            this._fallingShape._domNode.setTransformOrigin(SPRITES._spriteBlock.xSprite(this._fallingShape._iPosition+0.5)+"px "+SPRITES._spriteBlock.ySprite(this._fallingShape._jPosition-0.5)+"px");
        },
        animateFunc(animOutput) {
            if ( (this._fallingShape._pivotsCount === 2) && (this._fallingShape._pivot === 0) )
                this._fallingShape._domNode.setRotate(-90 + animOutput);
            else
                this._fallingShape._domNode.setRotate(90 - animOutput);
        },
        endAnimFunc() {
            this._fallingShape._domNode.delTransform(); // at end, we remove transform effect
        },
        timingAnimFunc: x => -90*(x-2*Math.sqrt(x)), // arrow replace a return
        animDuration: DURATIONS.rotatingDuration,
        animOwner: this // otherwise, it's animation context by default
    });
    this._anims.messageAnim = new Animation({
        startAnimFunc(textInfos) {
            this._domNode._childs.messageZoneDiv.setTextIntoSizedField.call(this._domNode._childs.messageZoneDiv, textInfos);
        },
        animateFunc(animOutput) {
            this._domNode._childs.messageZoneDiv.moveTemporaryRelatively(0, animOutput*3*SPRITES.pxCellSize);// SPRITES.pxYMessagePosition);
            this._domNode._childs.messageZoneDiv.setDomNode({opacity: 1-Math.abs(animOutput)});    // animOutput from -1 to +1
        },
        endAnimFunc() {
            this._domNode._childs.messageZoneDiv.moveTemporaryRestore();
            this._domNode._childs.messageZoneDiv.setDomNode({opacity: 0});
            this._gridMessagesQueue.dequeue();
        },
        timingAnimFunc: x => (2*(x-0.5))**3, // arrow replace a return // bad effect: return (x<0.3)?Math.sin(x*Math.PI*8)*(0.3-x):0
        animDuration: DURATIONS.centralMessagesDuration,
        animOwner: this // otherwise, it's animation context by default
    });
    this._gridMessagesQueue = new EventsQueue(); // used only when lost
};
TetrisGrid.prototype            = {
    _gridState                 : GRID_STATES.ready,
    _gridColor                 : null,
    _domNode                   : null,
    _realBlocksNode            : null,
    _ghostBlocksNode           : null,
    _fallingShape              : null, // falling shape or locked shapes prepared to fall after sweeping
    _lockedShapes              : null,            
    _nextShape                 : null, // next shape about to be place
    _nextShapePreview          : null, // preview on top of grid
    _score                     : null,
    _dropTimer                 : null,
    _normalDropPeriod          : DURATIONS.initialDropPeriod, // going to DURATIONS.softDropPeriod
    _isSoftDropping            : false, // false means normal dropping, true means soft dropping
    _keyPressedUpForNextShape  : true, // keyup
    _keyPressTimer             : null,
    _keyDownPressedAtLeast200ms: false,
    _playedPolyominoesType     : 'tetrominoes',// starts tetris with 4 blocks shape
    _playerKeysSet             : null,
    _lockedBlocks              : null, // placed blocks in grid, including falling shape?
    _matrix                    : null,
    _anims                     : null,
    _animsStack                : null, // to stack anims sequences of (hardDrop > quake)0-1 > (clearRows > hardDrop > quake)0-*: riseGreyBlocks actions are stuck
    _gridEventsQueue           : null, // queue for rising rows, etc..
    _gridMessagesQueue         : null, // used only when lost $$$
    _rowsToClearSet            : null, // set to prepare rows to clear to anim when animating clearing rows
    _vector                    : null,
    destroyGrid() {
        if (GAME._gameState !== GAME_STATES.paused)
            this.pauseOrResume(); // to stop all timers, all anims
        this._lockedBlocks.destroyLockedBlocks();
        this._domNode.destroyDomNode();
    },
    isGridAvailableToPlay() { // if grid is busy, doesn't care about message displaying
        return ( (this._gridState === GRID_STATES.playing) // if grid is losing/finishing, return busy
            && !this._anims.clearRowsAnim.isAnimating()
            && !this._anims.shapeHardDropAnim.isAnimating()
            && !this._anims.rising1RowAnim.isAnimating()
            && !this._anims.quakeAnim.isAnimating() ); // to have exclusive quake anim
    },
    gridAnimsStackPush(o, func, param) { // o object which contains func method, this by default
        this._animsStack.push([o, func, param]);
    },
    gridAnimsStackPop() {
        while (this.isGridAvailableToPlay() && (this._animsStack.length > 0)) { // unstack only when not busy, 2nd condition equivalent to while (this._animsStack.length)
            let last = this._animsStack.pop();
            last[1].call(last[0], last[2]);
        }
        if (this._animsStack.length === 0) // dequeue at end of anims stack, equivalent to (!this._animsStack.length), #DEBUG before
            this._gridEventsQueue.dequeue();
    },
    startGrid() {
        this._gridState = GRID_STATES.playing
        this._nextShape = new TetrisShape(this);
        this.newFallingShape();
        // putRowsAtStart, 0 when no shape
        let myRowsCount = Math.round( GAME.averageBlocksByPlayingGrid() // average blocks per grid
            / (RULES.horizontalCellsCount * (1-RULES.risingRowsHolesCountMaxRatio)) ); // divided by 10, or 10*(100%-30%) = 7
        while (myRowsCount-- > 0) // we put same quanity of rows
            this._gridEventsQueue.execNowOrEnqueue(this._lockedBlocks, this._lockedBlocks.put1NewRisingRow);
        // end putRowsAtStart
        if (GAME._gameState === GAME_STATES.paused)
            this.pauseOrResume();
    },
    newFallingShape() {
        this._fallingShape = this._nextShape;
        this._fallingShape.putShapeInGame();
        if (this._fallingShape.canMoveToPlaced(0, 0)) { // normal mode, can move at starting position, so it's not lost
            this._nextShapePreview.unMark(this._fallingShape); // change current shape preview by a new shape
            this._nextShape = new TetrisShape(this); // change current shape preview by a new shape
            this._nextShapePreview.mark(this._nextShape); // change current shape preview by a new shape
            this._fallingShape.moveAndPlaceShape(0, 0) // only place with call without previous removeShapeFromPlace()
                .drawShape()
                .findNewPositionAndDrawGhost();
            this._dropTimer.setTimerPeriod(this._normalDropPeriod).restartTimer();
        } else { // it's lost
            this._fallingShape.drawShape()
                .clearGhostBlocks()
                ._domNode.setDomNode({opacity: SPRITES._lostShapeOpacity});
            this.lose();
        }
    },
    rotationAsked() { // do rotation if possible, else nothing
        this.turnsTimerToNormalDrop_()
        if (this._fallingShape.canShapeRotate())
            this._fallingShape.unplaceAndRotateAndPlaceAndDrawShape();
    },
    horizontalMoveAsked(iRight) {
        this.turnsTimerToNormalDrop_()
        this.fallingShapeTriesMove(iRight, 0);
    },
    turnsTimerToNormalDrop_() {
        if (this._isSoftDropping) { // if soft dropping, stops soft drop fall to continue normal timer
            this._isSoftDropping = false;
            this._dropTimer.setTimerPeriod(this._normalDropPeriod).restartTimer(); // shape can move after fall or stopped
        }
    },
    beginSoftDropping() { // full falling, called by keydown, call falling()
        switch (true) {
            case ( !this._isSoftDropping && this._keyPressedUpForNextShape ): // case normal drop and reloaded by DOWN key pressed up
                this._keyPressedUpForNextShape = false; // keydown
                if (this._fallingShape.canMoveFromPlacedToPlaced(0, -1))      
                    this.continueSoftDropping(); // we run fall
                else // if shape is on floor and wants fall
                    this.unplaceAndMoveAndPlaceHardDroppingShapeThenCountAndClearRows();
                break;
            case (this._isSoftDropping): // case soft drop, then hard drop requested
                this._keyPressedUpForNextShape = false;
                this._isSoftDropping = false;
                this._dropTimer.setTimerPeriod(this._normalDropPeriod).finishTimer();
                this.unplaceAndMoveAndPlaceHardDroppingShapeThenCountAndClearRows();
                break;
            default: // case DOWN key keep pressed down since last shape, wait for DOWN key pressed up
        }
    },
    continueSoftDropping() { // full falling iterative, called by timer
        this._fallingShape.unplaceAndMoveAndPlaceAndDrawShape(0, -1);
        this._isSoftDropping = true;            
        this._dropTimer.setTimerPeriod(DURATIONS.softDropPeriod).restartTimer();
    },
    fallingShapeTriesMove(iRight, jUp) { // return true if moved (not used), called by left/right/timer
        if (this._fallingShape.canMoveFromPlacedToPlaced(iRight, jUp)) {
            if (iRight === 0) //no left nor right
                this._dropTimer.restartTimer(); // shape go down, new period
            this._fallingShape.unplaceAndMoveAndPlaceAndDrawShape(iRight, jUp);
        } else { // shape can't move...
            if (jUp < 0) // ...player or drop timer tries move down
                if (this._isSoftDropping) //if shapes hit floor, but still can move left or right
                    this.turnsTimerToNormalDrop_()
                else
                    this.unplaceAndMoveAndPlaceHardDroppingShapeThenCountAndClearRows();
        }
    },
    unplaceAndMoveAndPlaceHardDroppingShapeThenCountAndClearRows() { // can be called recursively, when falling shape or locked shapes in game hit floor
        this.gridAnimsStackPush(this, this.newFallingShape); // this.newFallingShape()
        this._lockedShapes = []; // release for garbage collector
        this._lockedShapes[this._fallingShape._shapeIndex] = this._fallingShape;
        this._anims.shapeRotateAnim.endAnim(); // because made by drop period
        this.unplaceAndMoveAndPlaceHardDroppingShape(this._lockedShapes);
        if (this._fallingShape._jVector === 0) { // if played single falling shape
            this._fallingShape.putShapeInRealBlocksNode()
                ._domNode.destroyDomNode();
            // AUDIO.audioPlay('landFX');
            this._gridEventsQueue.execNowOrEnqueue(this, this.countAndClearRows); // exec this.countAndClearRows immediately
        } else { // if locked shapes to drop, have to make animation before next counting
            this.gridAnimsStackPush(this, this.countAndClearRows); // firstly stack this.countAndClearRows() for later
            this._gridEventsQueue.execNowOrEnqueue(this._anims.shapeHardDropAnim, this._anims.shapeHardDropAnim.startAnim); // secondly exec hard drop startAnim() immediately
            // sound played before after hardDrop and before Quake
        }
    },
    unplaceAndMoveAndPlaceHardDroppingShape(myShapes) { // move locked shapes to drop (after clearing rows) into matrix
        myShapes.forEach( myShape => myShape.unplaceShape() ) // move to a tested place
        myShapes.forEach( myShape => myShape.moveAndPlaceShape(0, myShape._jVector, DROP_TYPES.hard) ) // move to placed on grid
    },
    countAndClearRows() { // locks block and computes rows to transfer and _scores
        // old: AUDIO.audioPlay('landFX');
        if (this._fallingShape !== null) // for recursive calls with fallingshape === null
            this._fallingShape.clearGhostBlocks();
        let rowsToClearCount = this._rowsToClearSet.size;
        if (rowsToClearCount > 0) { // if there's rows to clear
            this._score.combosCompute();
            this._score.computeScoreForSweptRowsAndDisplay(rowsToClearCount);
            if (rowsToClearCount >= RULES.transferRowsCountMin)    // if 2 rows cleared, tranfer rule
                GAME.transferRows(this, rowsToClearCount);
            if (rowsToClearCount >= RULES.pentominoesRowsCountMin) { // if 3 rows cleared, pentominoes rule: player have 3 blocks per shape, and others players have 5 blocks per shape
                GAME._pentominoesBriefMode.runPentoMode(this, rowsToClearCount);// duration of pentominoes is proportional to rowsToClearCount, 3 or 4, it auto stops by timer
                AUDIO.audioPlay('quadrupleFX');
            } else
                AUDIO.audioPlay('clearFX');
            this._dropTimer.finishTimer() // need to finish timer before voiding _fallingShape, otherwise 'canMoveFromPlacedToPlaced of null' error
            this._fallingShape = null; // to avoid combo reset scores
            this._anims.clearRowsAnim.startAnim();
        } else {
            this._score.animAndDisplaysScore(); // to refresh score
            if (this._fallingShape !== null)
                this._score.combosReset();
            this.gridAnimsStackPop();
        }
    },
    lose() { // lives during this._score duration
        this._gridState = GRID_STATES.lost; // avoid any other players interact with this grid
        this._dropTimer.finishTimer(); // otherwise, new shape is tried
        this._score.animAndDisplaysScore(); // update score if necessary
        this._anims.messageAnim.setDuration(DURATIONS.lostMessageDuration); // slow down message animation
        this._gridMessagesQueue.execNowOrEnqueue( // empty queues necessary?
            this._anims.messageAnim,
            this._anims.messageAnim.startAnim,
            [{text: 'You<BR/>lose', fieldCharCount: 4}]);
        this._gridMessagesQueue.execNowOrEnqueue(this, this.afterLost_);
        // AUDIO.audioStop('musicMusic');
        for (let p in this._lockedBlocks._lockedBlocksArray)
            this._lockedBlocks._lockedBlocksArray[p].setBlockColor(SPRITES._colors['grey']);
    },
    setAnimLostVector_() {
        this._vector = [0, -SPRITES.pxTopMenuZoneHeight -SPRITES.pxGameHeight ]; // prepare vector
        GAME._gameEventsQueue.dequeue();
    },
    afterLost_() {
        GAME._gameEventsQueue.execNowOrEnqueue(this, this.setAnimLostVector_);
        GAME._gameEventsQueue.execNowOrEnqueue(GAME._anims.moveGridsAnim, GAME._anims.moveGridsAnim.startAnim);    // prepare move up
        GAME._gameEventsQueue.execNowOrEnqueue(GAME, GAME.removeGrid, [this]); // prepare remove
    },
    clearFullRowAfterClearingAnim(jRow) { // we suppose that row is full
        for (let i=1;i <= RULES.horizontalCellsCount;i++)
            this._matrix[i][jRow].destroyBlock();
    },
    chooseControlAction(keyboardEvent) { //no controls during animations, this.isGridAvailableToPlay solves bug of not reloading on keyup after a drop
        if (GAME._gameState === GAME_STATES.runningBeforeKeyPressed) {
            AUDIO.audioPlay('musicMusic');
            GAME._gameState = GAME_STATES.running;
        }
        if ( (this.isGridAvailableToPlay()) && keyboardEvent.type === 'keydown') switch (keyboardEvent.code) {
            case this._playerKeysSet.keys[0]: // UP
                this.rotationAsked();
                break; // up
            case this._playerKeysSet.keys[1]: // LEFT
                this.horizontalMoveAsked(-1);
                break; // left
            case this._playerKeysSet.keys[2]: // DOWN
                //if ( !this._keyDownPressedAtLeast200ms ) this._keyPressTimer.restartTimer();
                if ( !keyboardEvent.repeat) this.beginSoftDropping(); //to avoid hard drop by keeping keydown, but only by 2 times keydown
                break; // down
            case this._playerKeysSet.keys[3]: // RIGHT
                this.horizontalMoveAsked(1);
                break; // right
            default:
        }
        else switch (keyboardEvent.code) { //(keyboardEvent.type === 'keyup'), allow reload on DOWN key pressed yup even during animation
            case (this._playerKeysSet.keys[2]): // DOWN
                this._keyPressedUpForNextShape = true; // necessary to make control possible, but impossible just after last drop
                //console.log(this._keyDownPressedAtLeast200ms);
                //if ( this._keyDownPressedAtLeast200ms )
                //    this.turnsTimerToNormalDrop_();
                //else {
                //    this._keyDownPressedAtLeast200ms = false;
                //    this._keyPressTimer.finishTimer()
                //}
                break;
            default: 
        }
    },
    pauseOrResume() { // pause or resume this grid
        for (let p in this._anims) // this._anims is object, not array, contains animations of this grid
            this._anims[p].pauseOrResume();
        this._dropTimer.pauseOrResume();
    }
};
// TetrisShape Class
class TetrisShape {
    constructor(grid, group=null) { // default falling shape means not group argument
        this._grid = grid;
        this._iPosition;
        this._jPosition;
        this._shapeType;
        this._pivotsCount;
        this._pivot;
        this._shapeColor;
        this._shapeBlocks;
        this._polyominoBlocks; // READ ONLY, reference that points to current shape in GAME shapes store
        this._ghostBlocks; // shadowed blocks
        this._domNode;
        this._jVector = 0, // vector upper (+) and under (-) shape
        this._shapeIndex = GAME._shapeIdTick++;
        if (group===null)
            this.newControlledShape_();
        else
            this.newShapeForExistingLockedBlocks_(group); // old: this[shapeOrChain](group);
    }
    newControlledShape_() { // pick a new shape falling ramdomly (for next part) to control fall
        this._iPosition                = GAME._iPositionStart;
        this._jPosition                = GAME._jPositionStart;
        this._shapeType                = GAME._playedPolyominoesType[this._grid._playedPolyominoesType].index // to reach right polyomino type
            + Math.floor(Math.random() * GAME._playedPolyominoesType[this._grid._playedPolyominoesType].count);
        this._pivotsCount              = GAME._gameShapesWithRotations[this._shapeType].length;
        this._pivot                    = Math.floor(Math.random() * this._pivotsCount);
        this._shapeColor               = SPRITES._colors[ GAME._storedPolyominoes[this._shapeType].color ];
        this._polyominoBlocks          = GAME._gameShapesWithRotations[this._shapeType][this._pivot]; // refers to current shape in stored in GAME, it's a shortcut
    }
    newShapeForExistingLockedBlocks_(group) { // shape prepared to fall after clearing rows, need to be called from down to upper
        //this._domNode                  = this._grid._realBlocksNode.newChild({});
        this._domNode = new DomNode({}, `greyShapeSprite${this._shapeIndex}`, this._grid._realBlocksNode)
        this._shapeBlocks = group.shape;
        this._jPosition = group.jMin;
        for (let b=0;b < this._shapeBlocks.length;b++)
            this._shapeBlocks[b]._shape = this; // link to shape
        this.putShapeNodeIn();
    }
    getjVectorUnderShape() { // return negative cells count from falling shape to floor where it can be placed
        let result = 0;
        while (this.canMoveFromPlacedToPlaced(0, --result)); // compute result decrement BEFORE calling function
        return (++result); // compute result increment BEFORE calling function
    }
    putShapeInGame() {
        this._shapeBlocks = new Array(this._polyominoBlocks.length);
        this._ghostBlocks = new Array(this._shapeBlocks.length); // without putPositions
        //this._domNode = this._grid._realBlocksNode.newChild({});
        this._domNode = new DomNode({}, `fallingShapeSprite${this._shapeIndex}`, this._grid._realBlocksNode)
        for (let b=0 ; b < this._shapeBlocks.length ; b++) {
            this._shapeBlocks[b] = new TetrisBlock(
                BLOCK_TYPES.inShape, this,
                this._iPosition + this._polyominoBlocks[b][0],
                this._jPosition + this._polyominoBlocks[b][1],
                this._shapeColor);
            this._ghostBlocks[b] = new TetrisBlock(
                BLOCK_TYPES.ghost, this._grid,
                this._iPosition + this._polyominoBlocks[b][0],
                this._jPosition + this._polyominoBlocks[b][1],
                this._shapeColor);
        }
        return this; // to use chained calls
    }
    putShapeInRealBlocksNode() {
        this._shapeBlocks.forEach( myBlock => myBlock.putBlockInRealBlocksNode() );
        return this; // to use chained calls
    }
    putShapeNodeIn() {
        this._shapeBlocks.forEach( myBlock => myBlock.putBlockNodeIn(this._domNode), this); // this === TetrisShape context necessary fot this._domNode
        return this; // to use chained calls
    }
    drawShape() { // show hidden shapes
        this._shapeBlocks.forEach( myBlock => myBlock.drawBlockInCell() );
        return this; // to use chained calls
    }
    findNewPositionAndDrawGhost() {
        if (this._ghostBlocks) {
            this._jVector = this.getjVectorUnderShape(); // if not not placed so deleted so ghost deleted
            this._shapeBlocks.forEach( (myBlock, b) => {
                this._ghostBlocks[b]._iPosition = this._shapeBlocks[b]._iPosition;
                this._ghostBlocks[b]._jPosition = this._shapeBlocks[b]._jPosition + this._jVector;
                this._ghostBlocks[b].drawBlockInCell();
            }, this) // this = Window context by default, puting this here makes this === TetrisShape
        }
        return this; // to use chained calls
    }
    clearGhostBlocks() {
        if (this._ghostBlocks) { // if ghost blocks (not in chain)
            this._ghostBlocks.forEach( myBlock => myBlock._domNode.destroyDomNode() );
            this._ghostBlocks = null;
        }
        return this; // to use chained calls
    }
    unplaceAndMoveAndPlaceAndDrawShape(iRight, jUp) { // iRight === 0 or jUp === 0, jUp negative to fall
        this._grid._anims.shapeRotateAnim.endAnim(); // comment/remove this line to continue animating rotation when drop #DEBUG
        this._iPosition += iRight;
        this._jPosition += jUp;
        this.unplaceShape();
        this.moveAndPlaceShape(iRight, jUp, DROP_TYPES.soft);
        this.drawShape();
        if (jUp === 0) this.findNewPositionAndDrawGhost(); // if we move left or right
        else this._jVector -= jUp; // if ghostshape covered, new block layer hides it
        AUDIO.audioPlay('moveFX');
        return this; // to use chained calls
    }
    moveAndPlaceShape(iRight, jUp, dropType=null) { // move to placed
        this._shapeBlocks.forEach( myBlock => {
            myBlock._iPosition += iRight; // updating position
            myBlock._jPosition += jUp; // updating position // after 'without this' change, this is Windows object here
            myBlock.placeBlock();
        });
        if ((dropType !== null) && (jUp < 0))
            this._grid._score.computeScoreDuringDrop(-jUp, dropType); // function receive cells count traveled, and dropType
        return this; // to use chained calls
    }
    canMoveFromPlacedToPlaced(iRight, jUp) { // can move into grid
        this.unplaceShape();
        let result = this.canMoveToPlaced(iRight, jUp);
        this.placeShape();
        return result;
    }
    canMoveToPlaced(iRight, jUp) {
        let result = true;
        for (let b=0;b < this._shapeBlocks.length;b++)
            if (!this._shapeBlocks[b].isFreeCell(this._shapeBlocks[b]._iPosition + iRight, this._shapeBlocks[b]._jPosition + jUp)) {
                result = false;
                break; // exit loop
            }
        return result;
    }
    canShapeRotate() { // 1 is clockwiseQuarters
        if (this._pivotsCount === 1) // if shape has only 1 orientation
            return false;
        else {
            let result = true;
            this.unplaceShape();
            for (let b=0;b < this._shapeBlocks.length;b++)
                if ( !this._shapeBlocks[b].isFreeCell(
                    this._iPosition + GAME._gameShapesWithRotations[this._shapeType][(this._pivot+1) % this._pivotsCount][b][0],
                    this._jPosition + GAME._gameShapesWithRotations[this._shapeType][(this._pivot+1) % this._pivotsCount][b][1]
                    ) ) { result = false; break; } // exit loop
            this.placeShape();
            return result;
        }
    }
    unplaceAndRotateAndPlaceAndDrawShape() { // do rotation if possible, else nothing
        this._grid._anims.shapeRotateAnim.endAnim();
        this._pivot = (this._pivot+1+this._pivotsCount) % this._pivotsCount; // 1 is clockwiseQuarters
        for (let b=0;b < this._shapeBlocks.length;b++) {
            this._shapeBlocks[b].unplaceBlock();
            this._shapeBlocks[b]._iPosition = this._iPosition + GAME._gameShapesWithRotations[this._shapeType][this._pivot][b][0];
            this._shapeBlocks[b]._jPosition = this._jPosition + GAME._gameShapesWithRotations[this._shapeType][this._pivot][b][1];
            this._shapeBlocks[b].placeBlock();
        }
        this.drawShape();
        this._grid._anims.shapeRotateAnim.startAnim();
        this.findNewPositionAndDrawGhost();
        AUDIO.audioPlay('rotateFX');
    }
    shapesHitIfMove(iRight, jUp) { // if all shapes AND moving verticaly ; test only and assign getjVectorUnderShape if necessary
        this.unplaceShape();
        let shapesHit = [];
        let blockHit; // block which was hit, === TetrisBlock or null in matrix
        for (let b=0;b < this._shapeBlocks.length;b++) {
            blockHit = this._grid._matrix[this._shapeBlocks[b]._iPosition + iRight][this._shapeBlocks[b]._jPosition + jUp];
            if ( ( blockHit !== null) && (blockHit._shape._jVector !== 1) ) { // check if jvector not +1
                    blockHit._shape._jVector = 1;
                    this._grid._lockedShapes[blockHit._shape._shapeIndex] = blockHit._shape;
                    shapesHit.push(blockHit._shape);
                }
        }
        this.placeShape();
        while (shapesHit.length > 0) // equivalent to while (shapesHit.length)
            shapesHit.pop().shapesHitIfMove(iRight, jUp);
        return this; // to use chained calls
    }
    placeShape() {
        this._shapeBlocks.forEach( myBlock => myBlock.placeBlock() );
    }
    unplaceShape() {
        this._shapeBlocks.forEach( myBlock => myBlock.unplaceBlock() );
    }
}
// NextShapePreview Class, it's next shape view, not ghost shape
class NextShapePreview {
    constructor(grid) {
        this._grid = grid;
        this._domNode = this._grid._domNode._childs.nextShapePreviewSprite;
        for (let i=-SPRITES._shapesSpan;i <= SPRITES._shapesSpan;i++)
            for (let j=-SPRITES._shapesSpan;j <= SPRITES._shapesSpan;j++)
                this._domNode.nodeDrawSprite({xSprite: i, ySprite: j, col: this._grid._gridColor.name, __onOff: false}); // off
    }
    mark(shape) {
        for (let b=0;b < shape._polyominoBlocks.length;b++)
            this._domNode.nodeDrawSprite({xSprite: shape._polyominoBlocks[b][0], ySprite: shape._polyominoBlocks[b][1], col: this._grid._gridColor.name, __onOff: true}); // on
    }
    unMark(shape) { // optimized to remove only current previewed shape, and not all preview
        for (let b=0;b < shape._polyominoBlocks.length;b++)
            this._domNode.nodeDrawSprite({xSprite: shape._polyominoBlocks[b][0], ySprite: shape._polyominoBlocks[b][1], col: this._grid._gridColor.name, __onOff: false }); // off
    }
}
// LockedBlocks Class, for locked blocks on the ground
function LockedBlocks(grid) {
    this._grid = grid;
    this._lockedBlocksArray = []; // empty or TetrisBlock inside
    this._lockedBlocksArrayByRow = []; // empty or TetrisBlock inside
    for (let row=GAME._matrixBottom; row <= GAME._matrixHeight; row++) {
        this._lockedBlocksArrayByRow[row] = {};
        this._lockedBlocksArrayByRow[row].rowBlocksCount = 0; // 0 boxes on floor (row=0) and 0 boxes on ceil (row=RULES.verticalCellsCount+1)
        this._lockedBlocksArrayByRow[row].blocks = [];
    }
}
LockedBlocks.prototype = {
    _grid                  : null,
    _lockedBlocksArray     : null,
    _lockedBlocksArrayByRow: null, // -20 +40 +up que les boxes visibles
    _blocksCount           : 0,
    _searchDirections      : [[1, 0], [0, -1], [-1, 0], [0, 1]],// right, bottom, left, up
    destroyLockedBlocks() { // removes placed blocks
        for (let b=0; b < this._lockedBlocksArray.length; b++)
            if (this._lockedBlocksArray[b]) // if block exist
                this._lockedBlocksArray[b].destroyBlock();
    },
    chainSearchOrphan(mode) {
        if (mode === SEARCH_MODE.up)
            this._grid._fallingShape.unplaceShape(); // falling shape temporary removed, in testing mode
        let toProcessMap = new Map();
        this._lockedBlocksArray.forEach( myBlock => toProcessMap.set(myBlock._blockIndex, myBlock) ); // filtering (this._lockedBlocksArray[p] !== undefined) seems useless, removed #DEBUG
        let groups = []; // below we make isolated groups
        for (let blockIndex of toProcessMap.keys()) {
            let block = toProcessMap.get(blockIndex); toProcessMap.delete(blockIndex); // block impossible to be null
            let group = {jMin: RULES.verticalCellsCount, shape: []};
            group.jMin = Math.min(group.jMin, block._jPosition);
            group.shape.push(block);
            for (let dir=0;dir < 4;dir++)
                this.chainSearch3Ways(block, group, toProcessMap, dir); // this.chainSearch3Ways is recursive
            if ((( mode === SEARCH_MODE.down) && (group.jMin >= 2 ))
                || mode === SEARCH_MODE.up )
                groups.push(group);
        }; // below, (groups.length === 0) occured 3 times between 2020 05 01 and 2020 04 30 with SEARCH_MODE.down === 1, no pb
        if (groups.length > 0) { // here we decide, we have at least 1 group equivalent. Normally, if (groups.length === 0) the mode === SEARCH_MODE.down, to avoid error of not calling pair placeOrUnplaceShape false then true
            this._grid._lockedShapes = [];
            groups.sort(function(a, b) {return a.jMin - b.jMin;}); // regular sort: lines full disapear
            let jEquals = []; let group, shape; // [if shape blocks color]            
            while (groups.length > 0) { // equivalent to while (groups.length)
                group = groups.shift(); // lower block
                shape = new TetrisShape(this._grid, group); // creating new dropable shape based on locked blocks ready to run drop animation
                this._grid._lockedShapes[shape._shapeIndex] = shape; // add
                if (mode === SEARCH_MODE.down) { // [if shape blocks color] to sort equals
                    if ( !jEquals.length || (group.jMin === jEquals[jEquals.length-1].jMin) )
                        jEquals.push({jMin: group.jMin, shape: shape});
                    else {
                        this.tryMoveShapesSamejEquals(jEquals);
                        jEquals = [{jMin: group.jMin, shape: shape}]; // [if shape blocks color]
                    }
                }
            }
            if (mode === SEARCH_MODE.down) {
                this.tryMoveShapesSamejEquals(jEquals);
                this._grid.gridAnimsStackPush(this._grid, this._grid.countAndClearRows); // countAndClearRows()
                this._grid._anims.shapeHardDropAnim.startAnim();
            } else { // mode === SEARCH_MODE.up, need to check if hitting shape, not best code
                this._grid._fallingShape.placeShape(); // falling shape is back
                for (let p in this._grid._lockedShapes)
                    if (this._grid._lockedShapes[p]._jPosition === 0) { // sub first row : j = 0
                        this._grid._lockedShapes[p]._jVector = 1;
                        this._grid._lockedShapes[p].shapesHitIfMove(0, 1);
                    }
                this._grid.unplaceAndMoveAndPlaceHardDroppingShape(this._grid._lockedShapes);
                switch (true) { // exclusives cases
                    case (this._lockedBlocksArrayByRow[GAME._jPositionStart + SPRITES._shapesSpan + 1].rowBlocksCount > 0): 
                        this._grid.gridAnimsStackPush(this._grid, this._grid.lose); // lose()
                        break;
                    case (this._grid._fallingShape._shapeIndex in this._grid._lockedShapes): // if falling shape hit rising rows
                        this._grid.gridAnimsStackPush(this._grid, this._grid.newFallingShape); // newFallingShape()
                        this._grid.gridAnimsStackPush(this._grid, this._grid.countAndClearRows); // countAndClearRows()
                        break;
                    default: // if rising rows rises without hitting shape
                        this._grid.gridAnimsStackPush(this._grid._fallingShape, this._grid._fallingShape.findNewPositionAndDrawGhost); // findNewPositionAndDrawGhost()
                        this._grid.gridAnimsStackPush(this._grid._dropTimer, this._grid._dropTimer.restartTimer); // restartTimer(), seems to work fine
                }
            }
        }
    },
    chainSearch3Ways(blockFrom, group, toProcessMap, dir) { // recursive function
        let block = this._grid._matrix
            [blockFrom._iPosition + this._searchDirections[dir][0]]
            [blockFrom._jPosition + this._searchDirections[dir][1]];
        if (block && toProcessMap.has(block._blockIndex) // if shape blocks contact?
        && (blockFrom._blockColor === block._blockColor) ) { // if same shape blocks color #DEBUG rule to check here
            toProcessMap.delete(block._blockIndex);
            group.jMin = Math.min(group.jMin, block._jPosition);
            group.shape.push(block);
            for (let delta=-1;delta <= 1; delta++)
                this.chainSearch3Ways(block, group, toProcessMap, (dir+4+delta)%4);
        }
    },
    tryMoveShapesSamejEquals(jEquals) { // if shape blocks color
        let changed = true;
        while (changed) {
            changed = false;
            for (let p in jEquals) {
                let j = jEquals[p].shape.getjVectorUnderShape();
                if (j !== 0) { // getjVectorUnderShape() negative or zero, equivalent if (j) or if (j < 0)
                    jEquals[p].shape._jVector = j;
                    jEquals[p].shape.unplaceShape();
                    jEquals[p].shape.moveAndPlaceShape(0, j, DROP_TYPES.hard);
                    changed = true;
                }
            }           
        }
    },
    put1NewRisingRow() { // will stack all countandclearrows callee
        this._grid._anims.shapeRotateAnim.endAnim();
        this._grid._dropTimer.finishTimer();
        let rowFilledCells; // prepareNewRisingRowAt_jPos0
        let risingRowsHolesCountMax = Math.round(RULES.risingRowsHolesCountMaxRatio * RULES.horizontalCellsCount);
        rowFilledCells = new Array(RULES.horizontalCellsCount).fill(true); // we fill all table with any value, 10 cells
        for (let c=0 ; c < risingRowsHolesCountMax ; c++) // we delete min 1 and max 30% of 10 columns, means 1 to 3 holes max randomly
            delete rowFilledCells[Math.floor(Math.random()*RULES.horizontalCellsCount)]; // random() returns number between 0 (inclusive) and 1 (exclusive)
        rowFilledCells.forEach( // we skip delete rowFilledCells
            (uselessArg, slotIndex) => new TetrisBlock(BLOCK_TYPES.orphan, this._grid, slotIndex+1, 0, SPRITES._colors['grey']) ); // iPosition=[1-10], jPosition=0 just under game
        // end of prepareNewRisingRowAt_jPos0
        this.chainSearchOrphan(SEARCH_MODE.up); // this._grid._ghostBlocksNode.hide(); hide ghost shape before rising, not necessary
        this._grid._anims.rising1RowAnim.startAnim();
    }
};
// TetrisBlock Class
class TetrisBlock {
    constructor(blockType, shapeOrGridOwnerOfThisBlock, i, j, blockColor) {
        this._blockType = blockType;
        this._iPosition = i;
        this._jPosition = j;
        this._grid;
        this._shape;
        this._domNode;
        this._blockColor;
        this._blockIndex = GAME._nextBlockIndex++; // both inShape, orphan, and ghost block are indexed with incrementing number
        this._domNode = new DomNode({type: 'canvas', width: _ => SPRITES.pxBlockSize, height: _ => SPRITES.pxBlockSize, sprite: SPRITES._spriteBlock}, `blockSprite${this._blockIndex}`); // creating node
        this.setBlockColor(blockColor);
        switch (this._blockType) {
            case BLOCK_TYPES.inShape: // falling ghape
                this._shape = shapeOrGridOwnerOfThisBlock;
                this._grid = this._shape._grid;
                this.putBlockNodeIn(this._shape._domNode);
                break;
            case BLOCK_TYPES.orphan: // rising row coming from level j === 0
                this._grid = shapeOrGridOwnerOfThisBlock; // use of shape as a grid, can be optimized
                this.putBlockInRealBlocksNode();
                this.placeBlock();
                this.drawBlockInCell();
                break;
            case BLOCK_TYPES.ghost: // ghost shape for display only, no block index
                this._grid = shapeOrGridOwnerOfThisBlock;
                this.putBlockNodeIn(this._grid._ghostBlocksNode);
                this._domNode.setDomNode({opacity: SPRITES._ghostShapeOpacity});
                break;
            default: console.log('#DEBUG', this) // bug if this case occurs #DEBUG
        }
    }
    destroyBlock() { // destructor, remove block anywhere
        this._domNode.destroyDomNode();
        this.unplaceBlock();
    }
    placeBlock() {
        this._grid._matrix[this._iPosition][this._jPosition] = this;
        let locked = this._grid._lockedBlocks; // previously putBlockInLockedBlocks(this)
        locked._lockedBlocksArray[this._blockIndex] = this; // here we fill this._lockedBlocksArray
        locked._blocksCount++; // we increment
        locked._lockedBlocksArrayByRow[this._jPosition].blocks[this._blockIndex] = this;
        locked._lockedBlocksArrayByRow[this._jPosition].rowBlocksCount++; // we increment
         if ( locked._lockedBlocksArrayByRow[this._jPosition].rowBlocksCount === RULES.horizontalCellsCount ) // if full row to clear
            this._grid._rowsToClearSet.add(this._jPosition); // preparing rows to clear, not negative values
    }
    unplaceBlock() {
        this._grid._matrix[this._iPosition][this._jPosition] = null;
        let locked = this._grid._lockedBlocks; // previously removeBlockFromLockedBlocks(this)
        delete locked._lockedBlocksArray[this._blockIndex]; // remove block from locked blocks
        delete locked._lockedBlocksArrayByRow[this._jPosition].blocks[this._blockIndex];
        locked._lockedBlocksArrayByRow[this._jPosition].rowBlocksCount--; // we decrement
        locked._blocksCount--; // we decrement
         if ( locked._lockedBlocksArrayByRow[this._jPosition].rowBlocksCount === RULES.horizontalCellsCount-1 ) // if we remove 1 from 10 blocks, it remains 9, so rowsToClear need to be updated
            this._grid._rowsToClearSet.delete(this._jPosition); // we remove position of this._jPosition in _rowsToClearArra
    }
    setBlockColor(blockColor)  {
        this._blockColor = blockColor;
        this._domNode.nodeDrawSprite({col: this._blockColor.name});
    }
    isFreeCell(i, j)  { // can move on placed grid, put this into grid
        if (j < 0) console.log('#DEBUG', j, this);
        return (   (j >= 1) // j === 0 is bottom wall, j < 0 never happens
                && (i >= 1) // i === 0 is left wall
                && (i <=RULES.horizontalCellsCount) // i === 11 is right wall
                && (this._grid._matrix[i][j] === null)   ); // matrix[i][j] === null means free
    }
    drawBlockInCell() { // here you can hide top block outside grid
        this._domNode.moveToGridCell({i: this._iPosition, j: this._jPosition});
    }
    putBlockInRealBlocksNode() {
        this._grid._realBlocksNode.putChild(this._domNode);
    }
    putBlockNodeIn(myParentNode) {
        myParentNode.putChild(this._domNode);
    }
};
// TetrisScore Class, based on riginal Nintendo scoring system
class TetrisScore {
    constructor(grid) {
        this._grid              = grid;
        this._combos            = -1;
        this._digitalScore      = 0; // public real score
        this._displayedScore    = 0;
        this._delta             = 0;
        this._deltaShowed;
        this._factors           = [null, 40, 100, 300, 1200, 6600]; // a single line clear is worth 400 points at level 0, clearing 4 lines at once (known as a Tetris) is worth 1200, max 5 lines with pento mode
        this._previousAnimDelta = 0;
        this._totalSweptRows    = 0;
        this._level             = 0;
        this._grid._anims.score = new Animation({ // anim here because it's easier to access to score properties
            startAnimFunc() {
                this._deltaShowed = this._delta;
                this._delta = 0;
            },
            animateFunc(animOutput) {
                this.writeScore_(Math.ceil(this._displayedScore + animOutput*this._deltaShowed));
            },
            endAnimFunc() {
                this.writeScore_(this._displayedScore += this._deltaShowed);
            },
            timingAnimFunc: x => -(x-2*Math.sqrt(x)), // arrow replace a return
            animDuration: DURATIONS.displayingScoreDuration,
            animOwner: this // otherwise, it's animation context by default
        });
        this.writeScore_(this._displayedScore);
    }
    animAndDisplaysScore() {
        if (this._delta !== 0) { // if delta changed !== 0
            this._grid._anims.score.endAnim(); // need to end before setting variables
            this._displayedScore = this._digitalScore;
            this._digitalScore += this._delta;
            this._grid._anims.score.startAnim();
        }
    }
    combosReset() {
        this._combos = -1;
    }
    combosCompute() {
        this._combos++;
        if (this._combos >= 1) {
            this._delta += this._factors[Math.min(this._combos, 5)] * (this._level+1) * 0.5; // 50% of lines cleared together
            this._grid._anims.messageAnim.startAnim({text: this._combos+((this._combos<2)?' combo':' x')});
            // $$$sound of coins
        }
    }
    computeScoreDuringDrop(cellsTraveledCount, dropType) {
        this._delta += dropType * cellsTraveledCount;
    }
    computeScoreForSweptRowsAndDisplay(sweptRowsCount) {
        this._delta += this._factors[sweptRowsCount] * (this._level+1);
        this.computePerfectClear_(sweptRowsCount);
        this.animAndDisplaysScore();
        this.computeLevel_(sweptRowsCount);
    }
    computePerfectClear_(sweptRowsCount) {
        if (this._grid._lockedBlocks._blocksCount === sweptRowsCount * RULES.horizontalCellsCount) { // means same cleared blocks qty than grid currently had
            this._grid._anims.messageAnim.startAnim({ text: 'Perfect<BR/>clear', fieldCharCount: 5 });
            this._delta += this._factors[2] * (this._level+1);
        }
    }
    computeLevel_(sweptRowsCount) {
        this._totalSweptRows += sweptRowsCount;
        let newLevel = Math.min(Math.floor(this._totalSweptRows/10), RULES.topLevel);
        if (this._level < newLevel) {
            this._level = newLevel;
            // changing _normalDropPeriod, approaching DURATIONS.softDropPeriod
            this._grid._normalDropPeriod = DURATIONS.softDropPeriod +
                (DURATIONS.initialDropPeriod - DURATIONS.softDropPeriod)
                * (1 - this._level/RULES.topLevel );
            this._grid._dropTimer.setTimerPeriod(this._grid._normalDropPeriod);
            this._grid._anims.messageAnim.startAnim({
                text: (this._level < RULES.topLevel) ? (`Level ${this._level}`) : (`<BR/>TOP<BR/> level ${this._level}`), // fit ES6
                fieldCharCount: 5 }); // last arg: higher for smaller text, not to queue, each new one replace previous one
        }
    }
    writeScore_(scoreText) {
        this._grid._domNode._childs.scoreZoneDiv.setTextIntoSizedField({text: scoreText}); // here all program write score, just comment for #DEBUG
    }
}
// VARIOUS BASIC FUNCTIONS
function isValued (item) { // requires declared and defined not to null
    return (isDeclaredAndDefined(item) && (item !== null));
}
function isDeclaredAndDefined (item) {
    return (typeof item !== 'undefined');
}
// Timer Class, starts, pause and end a timer of a function to run in 'timerPeriod' ms
class Timer {
    constructor(timerObject) { // args never used here, so removed
        this._funcAtTimeOut = timerObject.funcAtTimeOut;
        this._timerPeriod = timerObject.timerPeriod;
        this._timerOwner = timerObject.timerOwner;
        //this._funcAtTimeOut = timerObject.funcAtTimeOut.bind(this._timerOwner);
        this._paused = false; // if timer is paused
        this._running = false; // if timer is running or finished (can be paused)
        this._beginTime;
        this._pauseTime;
        this._funcAtTimeOut;
        this._timerPeriod;
        this._timeOut;
    }
    restartTimer() { // return true if killing previous
        this.finishTimer(); // if still running
        this._running = true;
        this._beginTime = (new Date).getTime();
        //this._timeOut = setTimeout(this._funcAtTimeOut, this._timerPeriod);
        //this._timeOut = setTimeout(this._funcAtTimeOut.bind(this._timerOwner), this._timerPeriod);
        this._timeOut = setTimeout( _ => this._funcAtTimeOut.call(null, this._timerOwner), this._timerPeriod); // setInterval is useless here, not used
    }
    isRunning() {
        return this._running; // useless for drop timer, not working!!!
    }
    pauseOrResume() { // works only if running, if not do nothing
        if (this._running) { // if paused, resume and return false
            if (this._paused) { // if not paused, pause and return true
                this._paused = false;
                this._timeOut = setTimeout( _ => this._funcAtTimeOut.call(null, this._timerOwner), this._timerPeriod-(this._pauseTime-this._beginTime));
            } else {
                clearTimeout(this._timeOut);
                this._paused = true;
                this._pauseTime = (new Date).getTime();
            }
            return this._paused;
        }
    }
    finishTimer() {
        if (this._running) {
            clearTimeout(this._timeOut);
            this._running = false;
        }
    }
    setTimerPeriod(timerPeriod) { // period will change on next call can be changed when running
        this._timerPeriod = timerPeriod;
        return this; // for chained calls
    }
}
// EventsQueue Class
class EventsQueue {
    constructor() {
        this._funcsQueue;
        this._oCond;
        this._busy = false,
            this._funcsQueue = [];
    }
    execNowOrEnqueue(o, func, argsArray) { // exec o.func(argsArray) or enqueue if busy
        if (this._busy)                // can't use arguments from the function, because in the call, func is just a pointer without ()
        this._funcsQueue.push([o, func, argsArray]);
        else {
            this._busy = true; // #DEBUG before
            func.apply(o, argsArray); // #DEBUG after, apply() works because argsArray is [], if 1 arg it's call() instead
        }
    }
    dequeue() {
        this._busy = false;
        while (!this._busy && this._funcsQueue.length) {    // dequeue only when not busy
            let first = this._funcsQueue.shift();
            this._busy = true;
            first[1].apply(first[0], first[2]);
        }
    }
}
//SvgObj Class, SVG object
//new(parent:): optional parent
//newChil(name:): optional unique attribute name
function SvgObj(svgDefinition) { //svgDefinition is attributes
    this._svgElement = document.createElementNS(SVG_NS, svgDefinition.type);
    this._childs = {};
    this._translateText = '';
    this._rotateText = '';
    if (svgDefinition.parent) //if parent is supplied OR is not null
        svgDefinition.parent.appendChild(this._svgElement);
    delete svgDefinition.parent; //to avoid it in this.set()
    this.set(svgDefinition);
}
SvgObj.prototype = {
    _count        : 0, //for unamed elements
    _svgElement   : null, //public, DOM SVG
    _childs       : null,
    _parent       : null, //pointer to parent
    _parentIndex  : null, //index of child in this._childs, integer or name
    _translateText: null,
    _scaleText    : null,
    _rotateText   : null,
    del() { //optional because garbbage collector
        for (let p in this._childs)
            this._childs[p].del(); //delete this._childs[p] made by child
        this._count = 0;
        if (this._parent) delete this._parent._childs[this._parentIndex]; //manage parent
        delete this._childs;
        this._svgElement.parentNode.removeChild(this._svgElement);
        delete this._svgElement;
    },
    get(svgDefinition) {
        return this._svgElement.getAttributeNS(null, svgDefinition);
    },
    set1(svgDefinition, value) {    
        this._svgElement.setAttributeNS(null, svgDefinition, value);
    },
    set(svgDefinition) {
        for (let p in svgDefinition)
            if (!svgDefinition[p].type) //if sheet attribute without type
                this._svgElement.setAttributeNS(null, p.replace(/_/, '-'), svgDefinition[p]); // equivalent new RegExp("_","g"),
            else {
                svgDefinition[p].parent = this._svgElement;
                this._childs[p] = new SvgObj(svgDefinition[p]);
                this._childs[p]._parent = this; //manage parent
                this._childs[p]._parentIndex = p; //manage parent, create an instance for chars
            }
    },
    getText() { //works only if type == "text"
        return this._svgElement.textContent;
    },
    setText(text, width, maxHeightMinCharCount) { //works only if type == "text"
        this._svgElement.textContent = text;
        if (width) {
            let charCount = Math.max((''+text).length, maxHeightMinCharCount);
            this.set1('font-size', game._fontRatio * width/charCount); 
        }
    },
    setTranslate(x, y) {
        this._translateText = `translate(${x},${y})`;
        this.set({transform: this._translateText});
    },
    setScale(sx, sy) { //sy optional
        if (!sy) sy = sx;
        this._scaleText = `scale(${sx},${sy})`;
        this.set({transform: this._scaleText});
    },
    setRotate(r, x, y) { //sy optional
        this._rotateText = `rotate(${r},${x},${y})`;
        this.set({transform: this._rotateText});
    },
    cancelTransform() {
        this._translateText = '';
        this._scaleText = '';
        this._rotateText = '';
        this.set({transform:''});
    },
    newChild(svgDefinition) { //returns pointer to child
        svgDefinition.parent = this._svgElement;
        //return this._childs[svgDefinition.name?svgDefinition.name:this._count++] = new SvgObj(svgDefinition);
        this._childs[this._count] = new SvgObj(svgDefinition);
        this._childs[this._count]._parent = this; //manage parent
        this._childs[this._count]._parentIndex = this._count; //manage parent
        return this._childs[this._count ++];
    },
    putChild(svg) {
        if (svg._parent) delete svg._parent._childs[svg._parentIndex]; //manage parent
        if (typeof (svg._parentIndex) == 'number')
            svg._parentIndex = this._count ++;
        this._childs[svg._parentIndex] = svg; //manage parent
        svg._parent = this; //manage parent
        this._svgElement.appendChild(svg._svgElement);
    },
    delChilds() {
        for (let p in this._childs)
            this._childs[p].del();
        this._count = 0;
    },
    hide() {
        this._svgElement.setAttributeNS(null, 'display', 'none');
    },
    show() {
        this._svgElement.setAttributeNS(null, 'display', 'inherit');
    },
    addChildCloneOf(svg) {
        let id = svg._parentIndex;
        if (typeof (svg._parentIndex) == 'number')
            id = this._count ++;
        let child = this._childs[id];
        child = new SvgObj({});
        child._parent = this;
        child._parentIndex = id;
        child._svgElement = svg._svgElement.cloneNode(false); //don't copy nodes here
        this._svgElement.appendChild(child._svgElement);
        for (let p in svg._childs)
            child.addChildCloneOf(svg._childs[p], true); //copying nodes here
        return child;
    }
};
// DomNode Class, manages HTML Elements, x:0 is implicit
function DomNode(definitionObject, nodeNameId, nodeParent=null) { // 2 last arguments for recursive calls and PutChild
    this._childs = {};
    this._domNodeType = isValued(definitionObject.type) ? 'canvas' : 'div'; // implicit div if type ommited
    // creating element into page window.document
    this._htmlElement = window.document.createElement(this._domNodeType); // create canvas or div
    this._htmlElement.style.position = 'absolute';
    // name id of element
    this._nameId = nodeNameId; // see if replace by this._htmlElement.id = this._nameId; in future
    this._htmlElement.id = `${nodeNameId}CVS`; // used only to show Elements in Chrome debbuging #DEBUG
    if (nodeParent !== null) { // have a parent?
        this._parent = nodeParent;
        this._parent._childs[this._nameId] = this; // to have double way connexion
        this._parent._htmlElement.appendChild(this._htmlElement);
    }
    // run this code only 1 time for body MAIN dom node, then exit
    if (isValued(definitionObject.body)) { // it's BODY
        window.document.body.appendChild(this._htmlElement)
        this._htmlElement.style.width = '100%'; // all window
        this._htmlElement.style.height = '100%'; // all window
        this.widthSprite = this._htmlElement.offsetWidth; //this.getHeight();
        this.heightSprite = this._htmlElement.offsetHeight; //this.getHeight();
    } else { // it's NOT BODY
        // checking width property for DIV
        if (isValued(definitionObject.width)) {
            this.getWidth = definitionObject.width; // it's an arrow function
            this.setWidth(this.getWidth());
        } else
            this.getWidth = _ => this._parent.getWidth(); // arrow replace a return
        // checking height property for DIV
        if (isValued(definitionObject.height)) {
            this.getHeight = definitionObject.height // it's an arrow function
            this.setHeight(this.getHeight());
        } else
            this.getHeight = _ => this._parent.getHeight(); // arrow replace a return
        // checking x position property
        if (isValued(definitionObject.x))
            this.getXInit = definitionObject.x; // it's an arrow function
        // checking y position property
        if (isValued(definitionObject.y))
            this.getYInit = definitionObject.y; // it's an arrow function
        this.setX(this.getXInit());
        this.setY(this.getYInit());
        delete definitionObject.x;
        delete definitionObject.y;
        delete definitionObject.width;
        delete definitionObject.height;
        // checking canvas widthSprite and heightSprite properties
        if (this._domNodeType === 'canvas') {
            if (definitionObject.sprite) {
                this._sprite = definitionObject.sprite;
                delete definitionObject.sprite;
            }
            this._drawingContext2D = this._htmlElement.getContext('2d');
            this._htmlElement.width = this.widthSprite;
            //this._htmlElement.style.width = this.widthSprite*ratio+'px';
            this._htmlElement.height = this.heightSprite;
            //this._htmlElement.style.height = this.heightSprite*ratio+'px';
            this._drawStack = {};
        }
    }
    this.setDomNode(definitionObject); // check all others properties and childs
}
DomNode.prototype = {
    _idCount              : 0, // for unamed elements
    _htmlElement          : null, // public, DOM DomNode or Div
    _childs               : null, // object containing childs
    _parent               : null, // pointer to parent
    _nameId               : null, // = ID, index of child in this._childs, integer or name
    _x                    : 0,
    _y                    : 0,
    _domNodeType          : null,
    _drawingContext2D     : null, // _drawingContext2D context
    _sprite               : null,
    widthSprite           : 0,
    heightSprite          : 0,
    _scaleZoom            : 1, // float
    _drawStack            : null,
    _moveToGridCellStack  : null,
    _text                 : null, // text node
    _textCharCountWidthMin: null, // letter number in div width
    _textCharCountWidth   : null,
    destroyDomNode() { // destroy all childs, optional because garbbage collector
        for (let p in this._childs)
            this._childs[p].destroyDomNode(); // delete this._childs[p] made by child
        if (this._parent)
            delete this._parent._childs[this._nameId]; // manage parent
        delete this._childs;
        this._htmlElement.parentNode.removeChild(this._htmlElement);
    },
    getNewUId_() {
        return ++DomNode.prototype._idCount;
    },
    setTransformOrigin(origin) {
        this._htmlElement.style['transformOrigin'] = origin;
    },
    setRotate(degres) {
        this._htmlElement.style['transform'] = `rotate(${degres}deg)`;
    },
    setScale(factor) {
        this._htmlElement.style['transform'] = `scale(${factor})`; // scale with ratio
    },
    delTransform() {
        this._htmlElement.style['transform'] = '';
    },
    nodeDrawSprite(attributes=null) { // MAIN FUNCTION to draw a graphic, following attributes
        let definitionObject = (attributes !== null) ? attributes : {}; // if attributes not supplied, we make new Object
        let copyAtt = {}; // recording process to redraw
        Object.assign(copyAtt, definitionObject); // to copy object, old: for (let p in definitionObject) copyAtt[p] = definitionObject[p];
        if (!definitionObject.sprite) definitionObject.sprite = this._sprite;
        if (!definitionObject.x) definitionObject.x = 0; // px, int
        if (!definitionObject.y) definitionObject.y = 0; // px, int
        if (isValued(definitionObject.xSprite))
            definitionObject.x += definitionObject.sprite.xSprite(definitionObject.xSprite);
        if (isValued(definitionObject.ySprite))
            definitionObject.y += definitionObject.sprite.ySprite(definitionObject.ySprite);
        delete definitionObject.xSprite; // xy found, deleting functions
        delete definitionObject.ySprite;
        this._drawStack[this.getSortedXYArgs_(definitionObject)] = copyAtt; // remember xy only for index for redrawing
        let sortedArgs = this.getSortedArgs_(definitionObject);
        if (!definitionObject.sprite.hasImageData(sortedArgs)) {
            this._drawingContext2D.beginPath();
            definitionObject.sprite.drawSprite(this._drawingContext2D, definitionObject.x, definitionObject.y, definitionObject, this.getWidth(), this.getHeight());
            this._drawingContext2D.closePath();
        }
        if (definitionObject.sprite.hasImageData(sortedArgs)) { // second test
            let imageData = definitionObject.sprite.getImageData(sortedArgs);
            this._drawingContext2D.putImageData(imageData, definitionObject.x, definitionObject.y); // scaling position
        } else if (definitionObject.sprite._nocache === false) {
            let imageData = this._drawingContext2D.getImageData(definitionObject.x, definitionObject.y, definitionObject.sprite.getWidth(), definitionObject.sprite.getHeight());
            definitionObject.sprite.putImageData(sortedArgs, imageData);
        }
    },
    getSortedArgs_(definitionObject) { // return sorted args as String
        let result = [];
        for (let p in definitionObject)
            if (p !== 'x' && p !== 'y' && p !== 'xSprite' && p !== 'ySprite' && p !== 'sprite')
                result.push(p + definitionObject[p]);
        return SPRITES._scaleFactor + result.sort().join(); // we can put separator char in args here
    },
    getSortedXYArgs_(definitionObject) { // return sorted coord args as String
        let result = [];
        for (let p in definitionObject)
            if (p === 'x' || p === 'y')
                result.push(p + definitionObject[p]);
        return SPRITES._scaleFactor + result.sort().join(); // we can put separator char in args here
    },
    redrawNode(recursiveCalling=false) {
        this.setWidth(this.getWidth());
        this.setHeight(this.getHeight());
        if (recursiveCalling) { // if (recursiveCalling === true)
            this.moveNodeTo(this.getXInit(), this.getYInit()); // init x y
            if (this._moveToGridCellStack !== null) // positionned with xSprite
                this.moveToGridCell(this._moveToGridCellStack); //before: this.moveToGridCell.apply(this, this._moveToGridCellStack); i// stacked [i, j] === this._moveToGridCellStack
        } // _moveToGridCellStack is never reset, used 1 time
        if (this._domNodeType === 'canvas')
            this.redrawCanvas_(this.widthSprite, this.heightSprite);
        else // (this._domNodeType === 'div')
            if (this._text)
                this.resizeText_();
            for (let p in this._childs)
                this._childs[p].redrawNode(true); //recursiveCalling === true
    },
    redrawCanvas_(newWidth, newHeight) { // redraw at new size, no moving
        this._htmlElement.width = newWidth ? newWidth : this.getWidth();
        this._htmlElement.height = newHeight ? newHeight : this.getHeight();
        let redrawStack = {};
        for (let p in this._drawStack) // copy stack
            redrawStack[p] = this._drawStack[p];
        this._drawStack = {};
        for (let p in redrawStack) // redrawing
            this.nodeDrawSprite(redrawStack[p]);
    },
    /*get(definitionObject) {
        return this._htmlElement.getAttribute(definitionObject);
    },*/
    setDomNode(definitionObject) { // to run all attributes
        for (let p in definitionObject) // browsing properties
            if (typeof definitionObject[p] === 'object') // if sub object
                this._childs[p] = new DomNode(definitionObject[p], p, this); // if definitionObject[p] is parent div, create DomNode which runs setDomeNode
            else // external calls of setDomNode concerns anly this condition
                this._htmlElement.style[p.replace(/_/,'-')] = definitionObject[p]; // if definitionObject[p] is an attribute, opacity for example
    },
    pxVal_(val) {
        return `${val}px`;
    },
    setX(x) {
        this._x = Math.round(x);
        this._htmlElement.style.left = this.pxVal_(this._x);
    },
    setY(y) {
        this._y = Math.round(y);
        this._htmlElement.style.top = this.pxVal_(this._y); // comemnt to disable any Y graphical move #DEBUG
    },
    /*getXCenter() {
        return this._x + Math.round(this.getWidth()/2);
    },*/
    setWidth(w) {
        this.widthSprite = w;
        this._htmlElement.style.width = this.pxVal_(this.widthSprite);
    },
    setHeight(h) {
        this.heightSprite = h;
        this._htmlElement.style.height = this.pxVal_(this.heightSprite);
    },
    getXInit() { // function by default, can be overwritten by return SPRITES value
        return 0;
    },
    getYInit() { // function by default, can be overwritten by return SPRITES value
        return 0;
    },
    getX() {
        return this._x;// this._htmlElement.offsetLeft;
    },
    getY() {
        return this._y;// this._htmlElement.offsetTop;
    },
    getWidth() { // function by default, can be overwritten by return SPRITES value
        return this._htmlElement.offsetWidth;
    },
    getHeight() {// function by default, can be overwritten by return SPRITES value
        return this._htmlElement.offsetHeight;
    },
    moveRelatively(left, down) { // move relatively
        if (left) this.setX(this._x + left);
        if (down) this.setY(this._y + down);
    },
    moveTemporaryRelatively(left, down) { // move temporary relatively, used for quake
        if (left) this._htmlElement.style.left = this.pxVal_(this._x + left);
        if (down) this._htmlElement.style.top = this.pxVal_(this._y + down);
    },
    moveTemporaryRestore() { // restore before move, used for quake
        this._htmlElement.style.left = this._x;
        this._htmlElement.style.top = this._y;
    },
    moveNodeTo(x, y) {
        if (x) this.setX(x);
        if (y) this.setY(y);
    },
    moveToGridCell(cellPosition) {  // cellPosition = {i, j}
        this._moveToGridCellStack = cellPosition; // to stack last position
        this.moveNodeTo(this._sprite.xSprite(cellPosition.i), this._sprite.ySprite(cellPosition.j));
    },
    moveCenterTo(x, y) {
        if (x) this.setX(Math.round(x-this.getWidth()/2));
        if (y) this.setY(Math.round(y-this.getHeight()/2));
    },
    putChild(canvas) {
        if (canvas._parent)
            delete canvas._parent._childs[canvas._nameId]; // manage parent
        if ( !canvas._nameId || (typeof canvas._nameId === 'number') )
            canvas._nameId = this.getNewUId_();// ++ _idCount
        this._childs[canvas._nameId] = canvas; // manage parent
        canvas._parent = this; // manage parent
        canvas.moveNodeTo(canvas._x, canvas._y);
        this._htmlElement.appendChild(canvas._htmlElement);
    },
    createText(font, fontWeight, color, textShadow, textCharCountWidthMin) {
        this._textCharCountWidthMin = textCharCountWidthMin?textCharCountWidthMin:1; 
        let table = window.document.createElement('table');
        let tr = window.document.createElement('tr');
        this._text = window.document.createElement('td');
        table.style.width = '100%';
        table.style.height = '100%';
        table.style.textAlign = 'center';
        table.style.fontFamily = font;
        table.style.fontWeight = fontWeight;
        table.style.textShadow = textShadow;
        table.style.color = color;
        tr.appendChild(this._text);
        table.appendChild(tr);
        this._htmlElement.appendChild(table);
    },
    setTextIntoSizedField(textInfos) {
        this._textCharCountWidth = isValued(textInfos.fieldCharCount)
            ? textInfos.fieldCharCount // value >= text.length, example, 3 chars represents 100% of width of this HTML Node
            : (''+textInfos.text).length; // to convert if text is a number
        this._text.innerHTML = textInfos.text;
        this.resizeText_(); // resize field
    },
    resizeText_() {
        // this._htmlElement.style.width = 'auto';
        // this._htmlElement.style.height = 'auto';
        // console.log(this._htmlElement.clientHeight + ' ' + this._htmlElement.clientWidth); // #DEBUG
        this._htmlElement.firstChild.style.fontSize = this.pxVal_(
            this.getWidth()/Math.max(this._textCharCountWidth, this._textCharCountWidthMin)
        );
    },
    /*hide() {
        this._htmlElement.style.visibility = 'hidden'; // or this.setDomNode({opacity: 0});
    },
    show() {
        this._htmlElement.style.visibility = 'inherit';
    }*/
};
// SpriteObj Class, vectorial built sprite, emulates vectorial SVG graphics, generic
// boolean reserved: _nocache
// functions reserved: widthSprite, heightSprite, xSprite, ySprite, drawSprite
// use nomage: __funcToDoThis (intern) // no '_' in String value of arguments
class SpriteObj {
    constructor(spriteDefinition) {
        this._imagesData = []; // to work with _imagesData
        this._nocache; // boolean
        this.widthSprite; // function ()
        this.heightSprite; // function ()
        this.xSprite; // function (x)
        this.ySprite; // function (y)
        this.drawSprite; // function (context, x, y, args)
        Object.assign(this, spriteDefinition); // we take all properties boolean and functions
    }
    getWidth() {
        return this.widthSprite();
    }
    getHeight() {
        return this.heightSprite();
    }
    getImageData(sortedArgs) { // return {imageData, xD, yD}, no check if exist
        return this._imagesData[sortedArgs];
    }
    putImageData(sortedArgs, imageData) { // no check if already exist
        this._imagesData[sortedArgs] = imageData;
    }
    hasImageData(sortedArgs) { // return boolean
        return !!this._imagesData[sortedArgs];
    }
    // Graphic function, convert a [RGB] array + alpha value to text
    static rgbaTxt(color, alpha=null) { // alpha usefull to define gradients black to transparent
        return `rgba(${color[0]},${color[1]},${color[2]},${((alpha===null)?1:alpha)})`;
    }
    // Graphic function, to make a linear gradient
    static linearGradient(ctx, startX, startY, vectorX, vectorY) {
        let grad = ctx.createLinearGradient(startX, startY, startX+vectorX, startY+vectorY);
        //console.table(arguments)
        for (let p=5;p < arguments.length;p+=2)
            grad.addColorStop(arguments[p], arguments[p+1]);
        return grad;
    }
    // Graphic function, to make a radial  gradient
    static radialGradient(ctx, startX, startY, startRadius, vectorX, vectorY, endRadius) {
        let grad = ctx.createRadialGradient(startX, startY, startRadius, startX+vectorX, startY+vectorY, endRadius);
        for (let p=7;p < arguments.length;p+=2) 
            grad.addColorStop(arguments[p], arguments[p+1]);
        return grad;
    }
}
// Animation Class, to prepare an animation
class Animation {
    constructor(animObject) {
        this.startAnimFunc_  = isValued(animObject.startAnimFunc) ? animObject.startAnimFunc : false; // optional function when begin animation, value = null or defined
        this.animateFunc_    = animObject.animateFunc; // function to set THE movement to execute
        this.endAnimFunc_    = animObject.endAnimFunc; // function to set the last position after animation
        this.timingAnimFunc_ = animObject.timingAnimFunc; // f(x) defined on [0;1] to [-infinite;+infinite] give animation acceleration with animOutput, not dependant of declaring object, WARNING this fofbidden in the body
        this._animDuration   = animObject.animDuration; // duration of animation
        this._animOwner      = animObject.animOwner; // object owner of animation
        this.animOutput; // public value of f(x), current animation position after timingAnimFunc_, any value possible
        this._paused;
        this._animating;
        this._elapsedFrames;
        this._plannedFrames;
        this._beginTime;
        this._pauseTime;
        this._windowNextFrameId;
        this.reset_();
    }
    reset_() {
        this._paused        = false;
        this._animating     = false;
        this._elapsedFrames = 0;
    }
    makeNextFrame_() {
        this.animateFunc_.call(this._animOwner, this.animOutput); // because score anim not declared in grid
        //this.animateFunc_.bind(this._animOwner); this.animateFunc_(this.animOutput); // draw frame on display, as defined in the instance of Animation, not working
        if ( (++this._elapsedFrames) < this._plannedFrames) {
            this.animOutput = this.timingAnimFunc_( this._elapsedFrames / this._plannedFrames ); // input [0;1] animOutput have any value
            this._windowNextFrameId = window.requestAnimationFrame( _ => this.makeNextFrame_() ); // new 2015 feature, fast on Firefox, 60fps (this.makeNextFrame_) alone doesn't work, object context is Window instead Animation
            //this._windowNextFrameId = window.requestAnimationFrame(this.makeNextFrame_); // new 2015 feature, fast on Firefox, 60fps (this.makeNextFrame_) doesn't work, object context is not passed
        } else
            this.endAnim();
    }
    isAnimating() {
        return this._animating;
    }
    startAnim() { // start animation, optional arguments are stocked in the 'arguments' array, return true if kill previous same anim
        this.endAnim();    // return true if killing previous
        this._animating = true;
        // if (this.startAnimFunc_) this.startAnimFunc_.apply(arguments); // launch optional startAnimFunc_ function, arguments is array
        if (this.startAnimFunc_) this.startAnimFunc_.apply(this._animOwner, arguments); // launch optional startAnimFunc_ function, arguments is array
        this._beginTime = performance.now();
        this._plannedFrames = RULES.fps * this._animDuration;
        this.animOutput = this.timingAnimFunc_( (++this._elapsedFrames) / this._plannedFrames ); // input [0;1] animOutput have any value
        this.makeNextFrame_();
    }
    pauseOrResume() { // bug rare when often pause/resume
        if (this._animating) { // if animating running
            if (this._paused) { // if paused, resume
                this._paused = false;
                this._beginTime += performance.now()-this._pauseTime;
                this.makeNextFrame_();
            } else { // if playing, pausing
                this._paused = true;
                this._pauseTime = performance.now();
                window.cancelAnimationFrame(this._windowNextFrameId);
            }
            return this._paused;
        }
    }
    setDuration(animDuration) { // can't set duration while animation running; return (if set correctly?) boolean
        if (this._animating) return false;
        else { this._animDuration = animDuration; return true; }
    }
    endAnim() { // return true if killing previous
        if (this._animating) {
            window.cancelAnimationFrame(this._windowNextFrameId);
            this.reset_(); // _animating needs to be set to false to consider grid not busy
            // this.endAnimFunc_();
            this.endAnimFunc_.apply(this._animOwner, arguments); // because score anim not declared in grid
        }
    }
}