/******************************************************************
****************   TetriLight - Vincent BOURDEAU   ****************
****************   2011 and 2020 - v0.1            ****************
*******************************************************************
Pure HTML5 JS CANVAS, no picture, no framework, no API, fully resizable
Tested on 2020 05 01, fit Chrome, Brave, Edge, Opera, Safari, Firefox (slow)
Fit ECMAScript 6 (2015) + HTML5 Canvas + https://standardjs.com/rules.html
All browsers support MP3 and WAV, excepted Edge/IE for WAV

**************** VOCABULARY ****************
to clear = to sweep, cleared = swept
a row = a line
a cell = a slot = a box
gfx = graphics
sprite = designed part of 
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
    blur because sizes in %
    calculate render on each move
    implicit built-in page resize zoom
Canvas:
    blur because window.devicePixelRatio !==1, 1.75 for example in 4K screen //$canvas
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
    var myFunc = function(x){return x;} --> var myFunc = (x)=>{return x;}
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
var = cond ? if_true : if_false
var x = {}; x = null (typeof === "object") / x = undefined (typeof === "undefined")
typeof: item[undefined, boolean, number, string, object[array, set], function]
'' === "" === `` / item <> element
console.log() to log object into console (F12 key) on Chrome;
console.clear() to clear before
console.table() to have a clear table
var result = myClassInstance.publicMethod(); <> var myMethod = myClassInstance.publicMethod;
callee function (appelée), calling function (appelante)
(function () { ...instructions... })(); it's IIFE, means Immediately invoked function expression
only Object or Array variables can be assigned by references
myMethod.call(this, arg1, arg2...) === myMethod.apply(this, [arg1, arg2...])
>= operator
=> used to define a func 
    In regular functions the this keyword represented the object that called the function, which could be the window, the document, a button or whatever.
    With arrow functions the this keyword always represents the object that defined the arrow function.

**************** CODE JS ARRAY ****************
queue(fifo) / gridAnimsStackPush(filo)
shift<<, unshift>> [array] <<push, >>pop
delete myArray[0]: just set slot to undefined
myArray.shift(): remove the slot from the table, even an Empty slot
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
    excepted WARNING Empty slots (without value) in array
myArray.forEach() browse each index (NOT properties)
    browse also ones with null and undefined values
    excepted WARNING Empty slots (without value) in array
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

**************** VISUAL STUDIO CODE ****************
To execute a command: CTRL + SHIFT + P
Monokai ST3 extension: gives function blue coloration instead green in 'Monokai' standard theme
Color Highlight extension: to colorize colors declarations into code
Alignment extension: ALT + = to align selection
GitHub: remove a remote: git remote rm old
GitHub: rename a local branch: git branch -m es5-fit-ie9 es5-fit-ie11
GitHub: rename a remote branch : git push tetrilight-github :es5-fit-ie9 es5-fit-ie11
GitHub: solve git fatal no configured push destination: git push --set-upstream tetrilight-github 2-players-menu
Settings Sync extension: to save VS Code configuration in GitHub

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
var x, y are positions on browser, in pixels (x -> right, y -> down)
var i, j are positions of blocks into grid (i -> right, j -> up)
var o is generic object
var p is variable to browse in object
var item is generic item, object or array or string boolean number
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
    DomNode [1 instance]
    SPRITES: TetrisSpritesCreation [1 instance]
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
            Score
                _score
                _level
Examples of list: toProcessList / _freeColors
Examples of listAutoIndex: _gridsListAuto
*/
//"use strict"; // use JavaScript in strict mode to make code better and prevent errors
// GLOBAL VARIABLES, each one handle one class instance only
let MAIN_MENU, GAME, AUDIO, SPRITES;            // SPRITES: TetrisSpritesCreation
// GLOBAL CONSTANTS
const RULES                     = { // tetris rules
    gameSpeedRatio              : 1.5, // default 1 normal speed, decrease speed < 1 < increase global game speed #DEBUG
    initialVolume               : 0.1, // default 0.6, 0 to 1, if #DEBUG
    transferRowsCountMin        : 1, // default 2, min height of rows to drop bad grey lines to others players, decrease for #DEBUG
    pentominoesRowsCountMin     : 1, // default 3, min height of rows to start pentominoes mode, decrease for #DEBUG
    horizontalCellsCount        : 5, // default 10, min 5 #DEBUG
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
    initialDropPeriod           : 1100 }; // 0700 ms, >         = _softDropPeriod, decrease during game, increase for #DEBUG, incompressible duration by any key excepted pause
const PIXELS                    = {
    pxTopMenuZoneHeight         : 20, // default 0 or 20, Y top part screen of the game, to displays others informations #DEBUG
    pxGameWidth                 : null,
    pxGameHeight                : null,
        pxHalfGameHeight        : null,
    pxBlockSize                 : 34,
        pxCellSize              : null,
    pxGridBorder                : null,
    pxGridLineWidth             : null,
    pxGridWidth                 : null,
        pxFullGridWidth         : null,
            pxGridMargin        : null,
    pxGridHeight                : null,
        pxFullGridHeight        : null,
    pxCeilHeight                : null,
    pxFullGridAndCeil           : null,
    pxPreviewFullSize           : null, // 2*36===72
    pxPreviewBlockSize          : null,
    pxPreviewLineWidth          : null,
    pxButtonSize                : 50, // default 50
}
const FONTS                   = { scoreFont: 'Ubuntu', messageFont: 'Rock Salt' }; // online fonts
//const FONTS                   = { scoreFont: 'Arial, Helvetica, sans-serif', messageFont: 'Impact, Charcoal, sans-serif' }; // web safe fonts = offline fonts
const SOUNDS                  = { 
    landFX                    :   {ext: 'wav'},
    rotateFX                  :   {ext: 'wav'},
    moveFX                    :   {ext: 'wav', vol: 0.2},
    clearFX                   :   {ext: 'wav'},
    quadrupleFX               :   {ext: 'wav'},
    selectFX                  :   {ext: 'wav'},
    musicMusic                :   {ext: 'mp3', vol: 0.5} };
// values > 0 to avoid (value === 0 == false)
const GAME_STATES = { paused   : 1, running: 2};
const GRID_STATES = { ready    : 1, playing: 2, lost   : 3}; // connected but not started
const BLOCK_TYPES = { ghost    : 1, inShape: 2, orphan : 3};
const SEARCH_MODE = { down     : 1, up     : 2};
const DROP_TYPES  = { soft     : 1, hard   : 2}; // 1 and 2 are useful for score: hard drop is double points

// INIT called by HTML browser
function init() {
    for (let p in DURATIONS) DURATIONS[p]/=RULES.gameSpeedRatio;    // change durations with coeff, float instead integer no pb, to slowdown game
    AUDIO = new Audio(SOUNDS);
    AUDIO.changeVolume(false);
    MAIN_MENU = new MainMenu();
    // if (GAME) GAME.destroyGame();
    GAME = new TetrisGame();
    GAME.addGrid();
    //GAME.addGrid(); // #DEBUG
}
// MENU MANAGER Class (make new to open web GAME)
function MainMenu() { // queue or stack
    window.addEventListener('keydown', this.keyCapture_, false); //for all keys, producing value or not
    window.addEventListener('keyup', this.keyCapture_, false); //for all keys, producing value or not
    window.oncontextmenu = function(event){ this.cancelEvent_(event); };
    // below creation for MAIN dom node
    this._domNode = new DomNode({body: true});
    SPRITES = new TetrisSpritesCreation(this._domNode); // need dom node created to get sizes for scaling
    this._domNode.setDomNode({ // menus on top of the screen
        top: {
            type:'canvas', width:'_pxGameWidth', height:'_pxTopMenuZoneHeight', sprite:SPRITES._spriteBackground },// to create an HTML top free space above the tetris game
        message1: {
            width:'_pxTopMenuZoneHeight', height:'_pxTopMenuZoneHeight', vertical_align:'middle' },
        background: {
            type:'canvas', y:'_pxTopMenuZoneHeight', width:'_pxGameWidth', height:'_pxGameHeight', sprite:SPRITES._spriteBackground }
        });
    this._domNode._childs.background.nodeDrawSprite(); // paint black background
    this._domNode._childs.message1.createText('FONTS.messageFont', 'bold', 'black', '');
    // this._domNode._childs.message1.setTex('totototo');
    this._domNode._htmlElement.addEventListener('click',
        function(eventClick) {
            if ((eventClick.offsetX < SPRITES._pxButtonSize) && (eventClick.offsetY < SPRITES._pxButtonSize))
                    GAME.addGrid(); // top left square click capture to add another grid
        }, false);
    window.onresize = function() { GAME.organizeGrids({resize:true}) }; // on IE : load at start ; or window.onresize = organizeGrids;
}
MainMenu.prototype = {
    _domNode    : null,
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
                if (GAME._gameState === GAME_STATES.running) // if game is not paused
                    GAME._gridsListAuto.runForEachListElement( (myGrid)=>{ myGrid.chooseControlAction(keyboardEvent); } );
        }
    },
};
// AUDIO Class, sounds management
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
            return false; // we can't change
        else {
            this._mainVolume = volume;
            this.refreshVolume(this._mainVolume);
            return true;
        }
    },
    muteUnmute() {
        muted = !muted;
        if (muted)
            this.refreshVolume(0);
        else
            this.refreshVolume(this._mainVolume);
    },
    refreshVolume(volume) {
        for (let sound in this._sounds)
            this._sounds[sound].sound.volume    = volume * this._sounds[sound].volumeFactor;
    },
    /*getDuration(name) {
        return this._sounds[name].sound.duration;
    }*/
};
// before TETRIS GRAPHICS Class
function TetrisSpritesCreation(rootNode) {
    this._rootNode = rootNode;
    for (let color in this._colors) this._colors[color].name = color; // adding a name field to SPRITES._colors
    this.zoom1Step(0);
    this.create_();
    // sprite without 'with this':
    this._spriteBackground = new VectorialSprite({ // define backgroung color here: black > grey
        _nocache: true,
        drawSprite_: (c, x, y, a, w, h)=>{ // context c, x, y, args a, canvas width w, canvas height h
            c.fillStyle=VectorialSprite.linearGradient(c,0,0,0,h,0.5,'#000',1,'#AAA');
            c.fillRect(x,y,w,h) }
    });
}
TetrisSpritesCreation.prototype = {
    _rootNode               : null,
    _zoomRatio              : 1, // default 1, float current zoom ratio
    _scaleFactor            : 33, // default 33, int scale unit < _pxBlockSize && > = 1
    _pxTopMenuZoneHeight    : 20, // default 0 or 20, Y top part screen of the game, to displays others informations #DEBUG
    _pxGameWidth            : null,
    _pxGameHeight           : null,
        _pxHalfGameHeight   : null,
    _pxBlockSize            : 34,
        _pxCellSize         : null,
    _pxGridBorder           : null,
    _pxGridLineWidth        : null,
    _pxGridWidth            : null,
        _pxFullGridWidth    : null,
            _pxGridMargin   : null,
    _pxGridHeight           : null,
        _pxFullGridHeight   : null,
    _XPreviewPosition       : null,
    _YPreviewPosition       : null,
    _XScorePosition         : null,
    _YScorePosition         : null,
    _XMessagePosition       : null,
    _YMessagePosition       : null,
    _pxCeilHeight           : null,
    _pxFullGridAndCeil      : null,
    _pxPreviewFullSize      : null, // 2*36===72
    _pxPreviewBlockSize     : null,
    _pxPreviewLineWidth     : null,
    _pxButtonSize           : 50, // default 50
    _spriteBackground       : null,
    _spriteBlock            : null,
    _spriteGridFront        : null,
    _spriteGridBackground   : null,
    _spritePreviewBlock     : null,
    _spritePreviewBlockFrame: null,
    _ghostShapeOpacity      : 0.15, // default 0.15
    _previewOpacity         : 0.2, // default 0.2, opacity for preview grid
    _lostShapeOpacity       : 0.5, // default 0.5, to show a ghost of shape wich makes losing
    _shapesSpan             : 2, // span                                            : envergure = (5-1)/2
    _colors                 : {
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
    condition_(gridCount) { // gridCount = GAME._playersCount
        //return ( ( // #DEBUG: to compact grids together
        // (_pxGameWidth > _pxFullGridWidth * gridCount + _pxGridMargin * (gridCount+1) ) && (_pxGameHeight > _pxFullGridHeight + 5*_pxGridMargin)
        return (  ( (this._pxGameWidth >= this._pxFullGridWidth * gridCount )
                && (this._pxGameHeight >= this._pxFullGridAndCeil ) )
                || (!(this._scaleFactor-1))  );
    },
    zoomToFit(gridCount) { // used for scaling if needed
        if (this.condition_(gridCount)) {
            while (this.condition_(gridCount))
                this.zoom1Step(1);
                this.zoom1Step(-1);
        } else
            while (!this.condition_(gridCount))
                this.zoom1Step(-1);
    },
    zoom1Step(step) { // computing for zoom with pixels into web browser
        this._scaleFactor += step;
        let oldGridWidth = this._pxFullGridWidth;
        this._pxBlockSize += step;
        this._pxGameWidth = this._rootNode.getWidth();
        this._pxGameHeight = this._rootNode.getHeight() - this._pxTopMenuZoneHeight;
        this._pxHalfGameHeight = Math.round(this._pxGameHeight/2);
        this._pxGridLineWidth = Math.max(Math.round(this._pxBlockSize/14), 1);
        this._pxGridWidth = RULES.horizontalCellsCount*this._pxBlockSize + (RULES.horizontalCellsCount+1)*this._pxGridLineWidth;
        this._pxGridHeight = RULES.verticalCellsCount*this._pxBlockSize + (RULES.verticalCellsCount+1)*this._pxGridLineWidth;
        this._pxCellSize = this._pxBlockSize + this._pxGridLineWidth;
        this._pxGridBorder = Math.ceil(this._pxCellSize/3); // bordure de grille en dégradé
        this._pxFullGridWidth = this._pxGridWidth + 2*this._pxGridBorder; // largeur grille + bordure
        this._pxFullGridHeight = this._pxGridHeight + this._pxGridBorder; // hauteur grille + bordure
        this._pxGridMargin = Math.round(this._pxFullGridWidth/8);
        this._pxPreviewBlockSize = Math.round(this._pxBlockSize/2.6);
        this._pxPreviewLineWidth = this._pxGridLineWidth; // valeur arbitraire, aurait pu etre différente
        this._pxPreviewFullSize = (this._pxPreviewBlockSize + this._pxPreviewLineWidth) * (2*this._shapesSpan+1) ;
        this._pxCeilHeight = this._pxPreviewFullSize + this._pxPreviewBlockSize + this._pxPreviewLineWidth; // hauteur de la zone posée sur la grille old: + _pxCellSize
        this._pxFullGridAndCeil = this._pxFullGridHeight + this._pxCeilHeight;
        this._XPreviewPosition = Math.round(this._pxFullGridWidth/2-this._pxPreviewFullSize/2);
        this._YPreviewPosition = 0;
        this._XScorePosition = this._XPreviewPosition + this._pxPreviewFullSize; // Math.round(3*_pxFullGridWidth/4);
        this._YScorePosition = 0;
        this._XMessagePosition = Math.round(this._pxFullGridWidth/2);
        this._YMessagePosition = Math.round(this._pxFullGridHeight/2);
        this._zoomRatio = !oldGridWidth ? 1 : this._pxFullGridWidth / oldGridWidth;
    },
    create_()  { with(this) { // creating all graphics
        _spriteGridFront = new VectorialSprite({ // on dessine 3 trapèzes qu'on assemble
            _nocache: true,
            _width: '_pxFullGridWidth',
            _height: '_pxFullGridHeight',
            drawSprite_(c, x, y, a) { // context, x, y, args
                let col = _colors[a.col];
                c.moveTo(x,y);c.lineTo(x+_pxGridBorder,y); // left border
                c.lineTo(x+_pxGridBorder,y+_pxGridHeight);
                c.lineTo(x,y+_pxFullGridHeight);
                c.fillStyle=VectorialSprite.linearGradient(c,0,0,_pxGridBorder,0,1,VectorialSprite.rgbaTxt(col.dark),0,VectorialSprite.rgbaTxt(col.light));
                c.fill();
                c.beginPath();c.moveTo(x+_pxFullGridWidth,y); // right border
                c.lineTo(x+_pxGridBorder+_pxGridWidth,y);
                c.lineTo(x+_pxGridBorder+_pxGridWidth,y+_pxGridHeight);
                c.lineTo(x+_pxFullGridWidth,y+_pxFullGridHeight);
                c.fillStyle=VectorialSprite.linearGradient(c,_pxGridWidth+_pxGridBorder,0,_pxGridBorder,0,0,VectorialSprite.rgbaTxt(col.dark),1,VectorialSprite.rgbaTxt(col.light));
                c.fill();
                c.beginPath();c.moveTo(0,_pxFullGridHeight); // bottom border
                c.lineTo(_pxGridBorder,_pxGridHeight);
                c.lineTo(_pxGridBorder+_pxGridWidth,_pxGridHeight);
                c.lineTo(_pxFullGridWidth,_pxFullGridHeight);
                c.fillStyle=VectorialSprite.linearGradient(c,0,_pxGridHeight,0,_pxGridBorder,0,VectorialSprite.rgbaTxt(col.dark),1,VectorialSprite.rgbaTxt(col.light));
                c.fill();
                c.fillStyle=VectorialSprite.linearGradient(c,0,0,0,_pxCellSize*2,0, VectorialSprite.rgbaTxt([0,0,0],1),1, VectorialSprite.rgbaTxt([0,0,0],0));    // top grid shadow
                c.fillRect(0,0,_pxFullGridWidth,_pxFullGridHeight); // #DEBUG
            }
        });
        _spriteGridBackground = new VectorialSprite({
            _nocache: true,
            _width:    '_pxFullGridWidth',
            _height: '_pxFullGridHeight',
            drawSprite_(c, x, y, a) { // context, x, y, args
                let col = _colors[a.col];
                c.fillStyle='#111';c.fillRect(x,y,_pxGridWidth,_pxGridHeight);
                let colo = ['#000','#222'];
                for (let p=colo.length-1;p>=0;p--) {
                    c.beginPath();
                    let margin = -(p*_pxGridLineWidth)+_pxGridLineWidth/2;
                    for (let i=1;i < RULES.verticalCellsCount;i++) {
                        c.moveTo(x, y+_pxCellSize*i+margin);
                        c.lineTo(x+_pxGridWidth, y+(_pxCellSize)*i+margin);
                        c.lineWidth=_pxGridLineWidth;c.strokeStyle=colo[p];c.stroke();
                    }
                    for (let i=1;i < RULES.horizontalCellsCount;i++) {
                        c.moveTo(x+_pxCellSize*i+margin, y);
                        c.lineTo(x+_pxCellSize*i+margin, y+_pxGridHeight);
                        c.lineWidth=_pxGridLineWidth;c.strokeStyle=colo[p];c.stroke();
                    }
                }
                c.rect(x,y,_pxGridWidth,_pxGridHeight);
                c.fillStyle=VectorialSprite.radialGradient(c,x+_pxGridWidth/2,y+_pxGridHeight,0,0,0,3*_pxGridHeight/4,
                    0, VectorialSprite.rgbaTxt(col.medium, 0.3),        1, VectorialSprite.rgbaTxt(col.medium, 0));    c.fill();
                c.fillStyle=VectorialSprite.linearGradient(c,x,y,_pxGridWidth,0,
                    0, VectorialSprite.rgbaTxt([0,0,0],0.5),    0.1, VectorialSprite.rgbaTxt([0,0,0],0),
                    0.9, VectorialSprite.rgbaTxt([0,0,0],0),    1, VectorialSprite.rgbaTxt([0,0,0],0.5));    c.fill();    },
            fx(x) {    return _pxGridBorder    },
            fy: 'fx'
        });
        _spritePreviewBlock = new VectorialSprite({ // args a: gradient if true, uniform if false
            _nocache: false,
            _width:    '_pxPreviewBlockSize',
            _height: '_pxPreviewBlockSize',
            drawSprite_(c, x, y, a) {    // context, x, y, args
                //console.log(this); VectorialSprite context here instead SPRITES, with (SPRITES) before definitionObject.sprite.drawSprite_ doesn't work
                let col = _colors[a.col]; // c.clearRect(x,y,_pxPreviewBlockSize,_pxPreviewBlockSize); // useful if we don't erase previous value
                c.fillStyle=(a.__onOff
                    ?VectorialSprite.linearGradient(c,x,y,_pxPreviewBlockSize,_pxPreviewBlockSize, 0, VectorialSprite.rgbaTxt(col.dark), 1, VectorialSprite.rgbaTxt(col.light))
                    :VectorialSprite.rgbaTxt(col.medium, _previewOpacity)
                );
                c.fillRect(x,y,_pxPreviewBlockSize,_pxPreviewBlockSize)    },
            fx(x)    {    return (_shapesSpan+x)*(_pxPreviewBlockSize+_pxPreviewLineWidth)    },
            fy(y)    {    return (_shapesSpan-y)*(_pxPreviewBlockSize+_pxPreviewLineWidth)    }
        });
        _spriteBlock = new VectorialSprite({
            _nocache: false,
            _width: '_pxBlockSize',
            _height: '_pxBlockSize',
            drawSprite_(c, x, y, a) {    // context, x, y, args
                let half = Math.round(_pxBlockSize/2);
                let margin = Math.round(_pxBlockSize/7);
                let col = _colors[a.col];
                c.fillStyle=VectorialSprite.rgbaTxt(col.medium);
                c.fillRect(x,y,_pxBlockSize,_pxBlockSize);
                c.beginPath();c.moveTo(x,y);c.lineTo(x+half,y+half);c.lineTo(x+_pxBlockSize,y);
                c.fillStyle=VectorialSprite.rgbaTxt(col.light);c.fill();
                c.beginPath();c.moveTo(x,y+_pxBlockSize);c.lineTo(x+half,y+half);
                c.lineTo(x+_pxBlockSize,y+_pxBlockSize);c.fillStyle=VectorialSprite.rgbaTxt(col.dark);c.fill();c.beginPath();
                c.fillStyle=VectorialSprite.linearGradient(c,x,y,_pxBlockSize-2*margin,_pxBlockSize-2*margin,0,VectorialSprite.rgbaTxt(col.dark),1,VectorialSprite.rgbaTxt(col.light));
                c.fillRect(x+margin,y+margin,_pxBlockSize-2*margin,_pxBlockSize-2*margin) },
            fx(i) { return _pxGridLineWidth + ( i-1 ) * _pxCellSize },
            fy(j) { return _pxGridLineWidth + ( RULES.verticalCellsCount-j ) * _pxCellSize }
        });
    }},
};
// TETRIS GAME Class
function TetrisGame() {
    this._matrixHeight                = RULES.verticalCellsCount * 2; // GAME blocks rise (massively sometimes) by unqueuing animated sequences: if lost, need to finish these sequences before noticing losing with new falling shape unable to place
    this._iPositionStart                = Math.ceil(RULES.horizontalCellsCount/2); // shape start position
    this._jPositionStart                = RULES.verticalCellsCount - 1;
    this._gridsListAuto                = new ListAutoIndex(); // players' grids' lists
    this._pentominoesBriefMode        = new PentominoesBriefMode();
    this._gameShapesWithRotations     = new Array(this._storedPolyominoes.length); // table of all shapes with rotations
    for (let s=0;s < this._storedPolyominoes.length;s++) { // creating all shapes variations: browsing shapes
        shapeBlocksCount        = this._storedPolyominoes[s].blocks.length;
        quarters                = this._storedPolyominoes[s].quarters;
        this._gameShapesWithRotations[s]    = new Array(quarters);
        for (let pivot=0;pivot < quarters;pivot++) { // creating all shapes rotations: browsing rotations
            this._gameShapesWithRotations[s][pivot] = new Array(shapeBlocksCount);
            if (pivot === 0)
                for (let b=0;b < shapeBlocksCount;b++) // browsing 4 blocks
                    this._gameShapesWithRotations[s][pivot][b] = [
                        this._storedPolyominoes[s].blocks[b][0],
                        this._storedPolyominoes[s].blocks[b][1]    ];
            else //(pivot !== 0)
                for (let b=0;b < shapeBlocksCount;b++) // browsing 4 blocks
                    this._gameShapesWithRotations[s][pivot][b] = [
                        - this._gameShapesWithRotations[s][pivot-1][b][1], // minus here (default) for unclockwise
                          this._gameShapesWithRotations[s][pivot-1][b][0] ] // minus here for clockwise
        }
    }
    this._freeColors = new List();
    for (let p in SPRITES._colors)
        if (p !== 'grey') // grey
            //this._freeColors.putInList(p, SPRITES._colors[p]); // to know available colors
            this._freeColors.putInList(p, p); // to know available colors
            //console.table(this._freeColors.listTable);
    this._anims.moveGridsAnim = new Animation({    // make tetris grid coming and leaving
        animateFunc(animOutput){
            this._gridsListAuto.resetNext();
            let grid;
            while (grid = this._gridsListAuto.next())
                grid._domNode.moveTemporaryRelatively(grid._vector[0]*animOutput, grid._vector[1]*animOutput)
        },
        endAnimFunc(){
            this._gridsListAuto.resetNext();
            let grid;
            while (grid = this._gridsListAuto.next()) {
                grid._domNode.moveRelatively(grid._vector[0], grid._vector[1]);
                grid._vector = [0, 0];
            }
            this._gameEventsQueue.dequeue();
        },
        timingAnimFunc(x) {
            return -(x-2*Math.sqrt(x));    // old: return -(x-2*Math.sqrt(x));
        },
        animDuration: DURATIONS.movingGridsDuration,
        optionalAnimOwner: this // otherwise, it's animation context by default
    });
    this._gameEventsQueue = new EventsQueue();    // animating applied on this._anims.moveGridsAnim
}
TetrisGame.prototype = {
    _gridsListAuto          : null,
    _matrixHeight           : null,
    _matrixBottom           : -1, // 1 rising row by 1 and queued, to avoid unchained blocks levitating 
    _iPositionStart         : null,
    _jPositionStart         : null,
    _playersCount           : 0,
    _gameState              : GAME_STATES.running, // others: GAME_STATES.paused, GAME_STATES.running
    _shapeIdTick            : 0,
    _newBlockId             : 0,
    _pentominoesBriefMode   : null,            
    _gameShapesWithRotations: null,
    _gameEventsQueue        : null,
    _anims                  : {}, // only 1 instance of game
    _freeColors             : null, // available colors for players
    _gameKeysSets           : [ // up down left right, https://keycode.info/
        {symbols: ['W','A','S','D'], keys          : ['KeyW', 'KeyA', 'KeyS', 'KeyD'], free                   : true}, // WASD on QWERTY for left player, ZQSD on AZERTY
        {symbols: ['I','J','K','L'], keys          : ['KeyI', 'KeyJ', 'KeyK', 'KeyL'], free                   : true},
        {symbols: ['\u2227','<','\u2228','>'], keys: ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'], free: true}
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
        this._gridsListAuto.runForEachListElement( (myGrid)=>{myGrid.destroyDomNode()} );
        this._newBlockId = 0;
        _domNode.destroyDomNode();
        // this._pentominoesBriefMode.destroyPentoMode();// old, remove all timers
    },
    pauseOrResume() { // pause or resume
        this._gameState = (this._gameState === GAME_STATES.running) ? GAME_STATES.paused : GAME_STATES.running;
        AUDIO.pauseOrResume('musicMusic'); // pause or resume playing music only, because FX sounds end quickly
        AUDIO.audioPlay('selectFX'); // always play sound FX for pause or resume
        this._pentominoesBriefMode.pauseOrResume(); // if pentominoes mode, pause it
        this._gridsListAuto.runForEachListElement( (myGrid)=>{myGrid.pauseOrResume()} );    // all players
    },
    addGrid() { // return true if added
        this._gameEventsQueue.execNowOrEnqueue(this, this.addGridBody_);
    },
    addGridBody_() { // return true if added
        if (this._freeColors.listSize > 0) {
            this._playersCount ++;
            let p; for (p in this._gameKeysSets)
                if ( this._gameKeysSets[p].free)
                    break;
            this._gameKeysSets[p].free = false;
            let grid = new TetrisGrid( this._gameKeysSets[p], this._freeColors.unListN( Math.floor(Math.random()*this._freeColors.listSize)) );
            // old: grid._gridId = (this._playersCount%2)?this._gridsListAuto.putFirst(grid):this._gridsListAuto.putLast(grid);    // from left or right
            this.organizeGrids({newGrid:grid});
            return grid;
        } else
            this._gameEventsQueue.dequeue();
            return null;
    },
    removeGrid(grid) {
        this._gridsListAuto.eraseItemFromListAuto(grid._gridId);
        grid._playerKeysSet.free = true; // release if keys used
        this._freeColors.putInList(grid._colorTxt, grid._colorTxt); // we reput color on free colors
        //this._freeColors.putInList(grid._gridColor.name, grid._gridColor); // we reput color on free colors
        this._playersCount--;
        grid.destroyGrid(); // stops timers etc..
        this.organizeGrids({oldGrid:true});
    },
    organizeGrids(instruction) { // horizontal organization only, zoomToFit makes the correct zoom
        SPRITES.zoomToFit(this._playersCount);
        MAIN_MENU._domNode._childs.background.redrawNode(); // redraw background
        let realIntervalX = (SPRITES._pxGameWidth-(SPRITES._pxFullGridWidth*this._playersCount)) / (this._playersCount+1);
        if (instruction.newGrid || instruction.oldGrid) {
            if (instruction.newGrid)
                if (this._playersCount%2) { // from left or right
                    instruction.newGrid._gridId = this._gridsListAuto.putFirst(instruction.newGrid);
                    instruction.newGrid._domNode.moveCenterTo(-SPRITES._pxFullGridWidth, null);
                } else {
                    instruction.newGrid._gridId = this._gridsListAuto.putLast(instruction.newGrid);
                    instruction.newGrid._domNode.moveCenterTo(SPRITES._pxGameWidth+SPRITES._pxFullGridWidth, null);                
                }
            this._gridsListAuto.resetNext();
            let grid;
            let count = 0;
            while (grid = this._gridsListAuto.next()) {
                count++;
                grid._domNode.redrawNode(); // we change all sizes
                grid._domNode.moveCenterTo(null, SPRITES._pxTopMenuZoneHeight + SPRITES._pxHalfGameHeight);
                grid._vector = [
                    count*realIntervalX + (count-1)*SPRITES._pxFullGridWidth - grid._domNode.getX(),
                    0    ];
            }
            // old: this._gameEventsQueue.execNowOrEnqueue(this._anims.moveGridsAnim, this._anims.moveGridsAnim.startAnim); // #DEBUG above, $alert(instruction);
            this._anims.moveGridsAnim.startAnim();
            if (instruction.newGrid)
                instruction.newGrid.startGrid(); // enqueue?
        } else {
            let grid;
            let count = 0;
            this._gridsListAuto.resetNext();
            while (grid = this._gridsListAuto.next()) {
                count++;
                grid._domNode.redrawNode(); // we change all sizes
                grid._domNode.moveCenterTo(null, SPRITES._pxTopMenuZoneHeight + SPRITES._pxHalfGameHeight);
                grid._domNode.moveNodeTo(count*realIntervalX + (count-1)*SPRITES._pxFullGridWidth, null);
            }
        }
    },
    averageBlocksByPlayingGrid() {
        let allGridsBlocksCount = 0;
        let playingGridsCount = 0;
        let grid;
        this._gridsListAuto.resetNext();
        while (grid = this._gridsListAuto.next())
            if (grid._gridState === GRID_STATES.playing) {
                playingGridsCount ++;
                allGridsBlocksCount += grid._lockedBlocks._blocksCount;
            }
        return allGridsBlocksCount/playingGridsCount;
    },
    startGame() {
        this._gameState = GAME_STATES.running;
        AUDIO.audioStop('musicMusic');
        // AUDIO.audioPlay('musicMusic');
    },
    transferRows(from, count) {    // from grid
        let toGrid = [];
        for (let p in this._gridsListAuto.listAutoTable)
            if ( (this._gridsListAuto.listAutoTable[p] !== from) && (this._gridsListAuto.listAutoTable[p]._gridState === GRID_STATES.playing) )
                toGrid.push(this._gridsListAuto.listAutoTable[p]);
        if (toGrid.length)
            while ((count--) > 0) { // decrement AFTER evaluation, equivalent to 'while (count--)'
                // toGrid[ (Math.floor(Math.random()*toGrid.length)+count) % toGrid.length ]._lockedBlocks.put1NewRisingRow(); // same call as earlier
                let destGrid = toGrid[ (Math.floor(Math.random()*toGrid.length)+count) % toGrid.length ];
                destGrid._gridEventsQueue.execNowOrEnqueue(
                    destGrid._lockedBlocks,
                    destGrid._lockedBlocks.put1NewRisingRow ); // we exec or enqueue
            }    
    },
};
// PENTOMINOES TIMER Class, to manage pentominoes mode, a special mode with 5 blocks shapes, which happens after a trigger
class PentominoesBriefMode {
    constructor() {
        this._pentoModeTimer = new Timer({
            funcAtTimeOut: ()=>{ this.finishPentoMode(); },
            timerPeriod: 0,
            timerOwner: this
        });
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
        GAME._gridsListAuto.runForEachListElement(
            (myGrid)=>{
                if (myGrid._gridState === GRID_STATES.playing) {
                    myGrid._playedPolyominoesType = 'tetrominoes'
                    myGrid._nextShapePreview.unMark(myGrid._nextShape); // to mark immediately next shape on preview
                    myGrid._nextShape = new TetrisShape(myGrid); // previous falling shape is garbage collected
                    myGrid._nextShapePreview.mark(myGrid._nextShape);
                }
            });
    }
    runPentoMode(gridWichTriggeredPentoMode, clearedLinesCount) {
        if (this.isRunning()) this.finishPentoMode();
        GAME._gridsListAuto.runForEachListElement(
            (myGrid)=>{ // here, argument is used
                if (myGrid._gridState === GRID_STATES.playing) {
                    myGrid._playedPolyominoesType = (myGrid !== gridWichTriggeredPentoMode) ? 'pentominoes' : 'trominoes';
                    myGrid._nextShapePreview.unMark(myGrid._nextShape); // to mark immediately next shape on preview
                    myGrid._nextShape = new TetrisShape(myGrid); // previous falling shape is garbage collected
                    myGrid._nextShapePreview.mark(myGrid._nextShape);
                }
            }, gridWichTriggeredPentoMode ); // this way to pass argument1 to pointed function
        this._pentoModeTimer.setPeriod(DURATIONS.pentominoesModeDuration*clearedLinesCount); // *3 for 3 lines cleared, *4 for 4 lines cleared
        this._pentoModeTimer.restartTimer();
        gridWichTriggeredPentoMode._anims.pentominoesModeAnim.setDuration(DURATIONS.pentominoesModeDuration*clearedLinesCount);
        gridWichTriggeredPentoMode._anims.pentominoesModeAnim.startAnim();
    }
}
// TETRIS GRID Class
function TetrisGrid(playerKeysSet, gridColor){
    this._colorTxt            = gridColor;
    this._gridColor           = SPRITES._colors[gridColor];
    //this._gridColor           = gridColor;
    this._playerKeysSet       = playerKeysSet; // [up down left right]
    this._lockedBlocks        = new LockedBlocks(this);
    this._gridEventsQueue     = new EventsQueue();
    this._animsStack          = [];
    this._lockedShapes        = [];
    // this._rowsToClearArray = []; // no row to clear at the begining
    this._rowsToClearList     = new List();
    this._matrix = new Array(RULES.horizontalCellsCount + 2); // 12 columns, left and right boxes as margins columns, program fail if removed
    for (let i=0;i < this._matrix.length;i++) {
        this._matrix[i] = [];
        for (let j=GAME._matrixBottom;j <= GAME._matrixHeight;j++) // height -1 to +(2x20)
            this._matrix[i][j] = null;
    }
    this._dropTimer = new Timer({ // here this._fallingShape is not defined yet
        //funcAtTimeOut() { console.log(this);this.fallingShapeTriesMove(0,-1); },
        funcAtTimeOut: (grid)=>{ grid.fallingShapeTriesMove(0,-1); },
        timerPeriod: this._normalDropPeriod,
        timerOwner: this
    });
    this._keyPressTimer = new Timer({
        funcAtTimeOut: (grid)=>{ grid._keyDownPressedAtLeast200ms = true; },
        timerPeriod: 30,
        timerOwner: this
    });
    this._domNode = MAIN_MENU._domNode.newChild({ // creating tetris DOM zone and sub elements
        width: '_pxFullGridWidth', height: '_pxFullGridAndCeil',
        frameZone: {
            x:'_pxGridBorder', y:'_pxCeilHeight',
            width:'_pxGridWidth', height:'_pxGridHeight',
            overflow:'hidden',
            back: { // tetris background, if not canvas, it's div
                background: { type:'canvas', sprite:SPRITES._spriteGridBackground },
                ghostBlocks:{},
                realBlocks: {} } },
        frontZone: {
            y:'_pxCeilHeight', type:'canvas', sprite:SPRITES._spriteGridFront, height: '_pxFullGridHeight' },
        controlZone: {
            y:'_YPreviewPosition', width:'_XPreviewPosition', height:'_pxPreviewFullSize', vertical_align:'middle' },
        nextShapePreview: {
            x:'_XPreviewPosition', y:'_YPreviewPosition',
            type:'canvas', width:'_pxPreviewFullSize', height:'_pxPreviewFullSize', sprite:SPRITES._spritePreviewBlock },
        scoreZone: {
            x:'_XScorePosition', y:'_YScorePosition',
            width:'_XPreviewPosition', height:'_pxPreviewFullSize', vertical_align:'middle' },
        messageZone: {
            y:'_pxCeilHeight', width:'_pxFullGridWidth', height:'_pxFullGridHeight', vertical_align:'middle' }
    });
    this._domNode._childs.frontZone.nodeDrawSprite({col:this._gridColor.name});
    this._realBlocksNode = this._domNode._childs.frameZone._childs.back._childs.realBlocks; // shortcut
    this._ghostBlocksNode = this._domNode._childs.frameZone._childs.back._childs.ghostBlocks; // shortcut
    this._domNode._childs.frameZone._childs.back._childs.background.nodeDrawSprite({col:this._gridColor.name});
    this._domNode._childs.controlZone.createText(FONTS.scoreFont, 'bold', VectorialSprite.rgbaTxt(this._gridColor.light), '0 0 0.4em '+VectorialSprite.rgbaTxt(this._gridColor.light)); // _textCharCountWidthMin : 1 or 7
    this._domNode._childs.controlZone.setTextIntoSizedField({
        text: this._playerKeysSet.symbols[0]+'</BR>'+this._playerKeysSet.symbols[1]+' '+this._playerKeysSet.symbols[2]+' '+this._playerKeysSet.symbols[3],
        fieldCharCount: 8 }); // up down left right
    this._domNode._childs.scoreZone.createText(FONTS.scoreFont, 'normal', VectorialSprite.rgbaTxt(this._gridColor.light), '0 0 0.4em '+VectorialSprite.rgbaTxt(this._gridColor.light), 3);
    this._domNode._childs.messageZone.createText(FONTS.messageFont, 'bold', VectorialSprite.rgbaTxt(this._gridColor.light), '0.05em 0.05em 0em '+VectorialSprite.rgbaTxt(this._gridColor.dark));
    this._nextShapePreview = new NextShapePreview(this);
    this._anims = {}; // need to initialize before creating new score which contains anim
    this._score = new Score(this); // contains animation, 
    this._anims.quakeAnim = new Animation({
        animateFunc(animOutput) { // to use context of this Animation
            this._domNode._childs.frameZone._childs.back.moveTemporaryRelatively(0, SPRITES._pxCellSize*2/4*animOutput);    // default 2/4 or 3/4, proportionaly to deep 20 this._domNode use context of this TetrisGrid
        },
        endAnimFunc() {
            this._domNode._childs.frameZone._childs.back.moveTemporaryRestore();
            this.gridAnimsStackPop(); // to have exclusive quake anim
        },
        timingAnimFunc(x) {
            return Math.sin(x*Math.PI); // or return Math.sin(x*Math.PI*2)*(1-x);
        },
        animDuration: DURATIONS.gridQuakeDuration,
        optionalAnimOwner: this // otherwise, it's animation context by default
    });
    this._anims.pentominoesModeAnim = new Animation({
        animateFunc(animOutput) { // to use context of this Animation
            this._domNode._childs.frontZone.setDomNode({opacity: Math.abs(animOutput)});
        },
        endAnimFunc() {
            this._domNode._childs.frontZone.setDomNode({opacity: 1}); // 1 = totalement opaque, visble
        },
        timingAnimFunc(x) {
            return -Math.cos(Math.pow(3,(x*3))*Math.PI)/2+0.5; // f(x)=-cos(3^(x*3)*pi)/2+0.5
        },
        animDuration: 0, // need to set duration for this animation before running
        optionalAnimOwner: this // otherwise, it's animation context by default
    });
    this._anims.clearRowsAnim = new Animation({ // loading animation to use later
        animateFunc(animOutput) { // called n times recursively, this: current object AND Animation
            // for (let r in this._rowsToClearArray) // for each row to clear
            //     for (let i=1;i <= RULES.horizontalCellsCount;i++) // for each column
            //         this._matrix[i][this._rowsToClearArray[r]]._domNode.setScale(animOutput); // with blocks' _domNodes, programs goes here for each block of each row to clear
            for (let r in this._rowsToClearList.listTable) // for each row to clear
                for (let i=1;i <= RULES.horizontalCellsCount;i++)
                    this._matrix[i][r]._domNode.setScale(animOutput); // with blocks' _domNodes, programs goes here for each block of each row to clear
        },
        endAnimFunc() { // NOT GRAPHIC PROCESS
            // this._rowsToClearArray.forEach(function(myRow) {
            //     this.clearFullRowAfterClearingAnim(myRow); }); // now erasing animated cleared rows datas // bad code:this._rowsToClearArray = [];
            for (let r in this._rowsToClearList.listTable)
                this.clearFullRowAfterClearingAnim(r); // so erasing previous
            this._lockedBlocks.chainSearchOrphan(SEARCH_MODE.down);
            this.gridAnimsStackPop();
        },
        timingAnimFunc(x) {
            return 1 - Math.pow(x, 2);
        },
        animDuration: DURATIONS.movingGridsDuration,
        optionalAnimOwner: this // otherwise, it's animation context by default
    });
    this._anims.shapeHardDropAnim = new Animation({ // animation for 1 shape, falling or after clearing
        animateFunc(animOutput) {
            for (let p in this._lockedShapes) // to animate block, we move the DomNode element
                this._lockedShapes[p]._domNode.moveNodeTo(0, - this._lockedShapes[p]._jVector * animOutput * SPRITES._pxCellSize);
        },
        endAnimFunc() {
            for (let p in this._lockedShapes) { // fetch rows to remove
                this._lockedShapes[p]
                    .putShapeInRealBlocksNode() // remove from moving div
                    .drawShape()
                    ._domNode.destroyDomNode();
            }
            this._lockedShapes = [];
            this.gridAnimsStackPush(this._anims.quakeAnim, this._anims.quakeAnim.startAnim); // startAnim() function stacked
            this.gridAnimsStackPush(AUDIO, AUDIO.audioPlay, 'landFX'); // we stack AUDIO.audioPlay('landFX');
            this.gridAnimsStackPop();
            // old: this._anims.quakeAnim.startAnim();
            // old: this.gridAnimsStackPop();
        },
        timingAnimFunc(x) {
            return Math.pow(x, 3);
        },
        animDuration: DURATIONS.hardDropDuration,
        optionalAnimOwner: this // otherwise, it's animation context by default
    });
    this._anims.rising1RowAnim = new Animation({
        animateFunc(animOutput) { // "this" display animation instancied object
            for (let p in this._lockedShapes) // to animate block, we move the DomNode element
                this._lockedShapes[p]._domNode.moveNodeTo(0, - this._lockedShapes[p]._jVector * animOutput * SPRITES._pxCellSize);
        },
        endAnimFunc() {
            for (let p in this._lockedShapes) {
                this._lockedShapes[p].putShapeInRealBlocksNode();
                this._lockedShapes[p].drawShape();
                this._lockedShapes[p]._domNode.destroyDomNode(); // _isLockedShape always true, so optimized
            }
            this._lockedShapes = [];
            this._ghostBlocksNode.show();
            this.gridAnimsStackPop(); // unstack all countandclearrows and this._gridEventsQueue.dequeue() in stack
        },
        timingAnimFunc(x) {
            return x; // linear rising of rows, not (2*Math.sqrt(x)-x);
        },
        animDuration: DURATIONS.rising1RowDuration,
        optionalAnimOwner: this // otherwise, it's animation context by default
    });
    this._anims.shapeRotateAnim = new Animation({ // loading animation to use later
        startAnimFunc() { // to animate block, we temporary apply a transform rotation
            this._fallingShape._domNode.setTransformOrigin(SPRITES._spriteBlock.fx(this._fallingShape._iPosition+0.5)+"px "+SPRITES._spriteBlock.fy(this._fallingShape._jPosition-0.5)+"px");
        },
        animateFunc(animOutput) {
            if ((this._fallingShape._pivotsCount==2) && (this._fallingShape._pivot==0))
                this._fallingShape._domNode.setRotate(-90 + animOutput);
            else
                this._fallingShape._domNode.setRotate(90 - animOutput);
        },
        endAnimFunc() {
            this._fallingShape._domNode.delTransform(); // at end, we remove transform effect
        },
        timingAnimFunc(x) {
            return -90*(x-2*Math.sqrt(x));
        },
        animDuration: DURATIONS.rotatingDuration,
        optionalAnimOwner: this // otherwise, it's animation context by default
    });
    this._anims.messageAnim = new Animation({
        startAnimFunc(textInfos) {
            this._domNode._childs.messageZone.setTextIntoSizedField.call(this._domNode._childs.messageZone, textInfos);
        },
        animateFunc(animOutput) {
            this._domNode._childs.messageZone.moveTemporaryRelatively(0, animOutput*3*SPRITES._pxCellSize);// _YMessagePosition);
            this._domNode._childs.messageZone.setDomNode({opacity: 1-Math.abs(animOutput)});    // animOutput from -1 to +1
        },
        endAnimFunc() {
            this._domNode._childs.messageZone.moveTemporaryRestore();
            this._domNode._childs.messageZone.setDomNode({opacity: 0});
            this._gridMessagesQueue.dequeue();
        },
        timingAnimFunc(x) {
            return Math.pow(2*(x-0.5), 3); // bad effect: return (x<0.3)?Math.sin(x*Math.PI*8)*(0.3-x):0;
        },
        animDuration: DURATIONS.centralMessagesDuration,
        optionalAnimOwner: this // otherwise, it's animation context by default
    });
    this._gridMessagesQueue = new EventsQueue(); // used only when lost
};
TetrisGrid.prototype            = {
    _gridId                    : null,
    _gridState                 : GRID_STATES.ready,
    _colorTxt                  : null,
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
    // _rowsToClearArray       : null, // arrays to prepare rows to clear to anim when animating clearing rows
    _rowsToClearList           : null, // arrays to prepare rows to clear to anim when animating clearing rows
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
            && !this._anims.quakeAnim.isAnimating() // to have exclusive quake anim
        );
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
            this._dropTimer.setPeriod(this._normalDropPeriod);
            this._dropTimer.restartTimer();
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
            this._dropTimer.setPeriod(this._normalDropPeriod);
            this._dropTimer.restartTimer(); // shape can move after fall or stopped
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
                this._dropTimer.setPeriod(this._normalDropPeriod);
                this._dropTimer.finishTimer();
                this.unplaceAndMoveAndPlaceHardDroppingShapeThenCountAndClearRows();
                break;
            default: // case DOWN key keep pressed down since last shape, wait for DOWN key pressed up
        }
        //return this;
    },
    continueSoftDropping() { // full falling iterative, called by timer
        this._fallingShape.unplaceAndMoveAndPlaceAndDrawShape(0, -1);
        this._isSoftDropping = true;            
        this._dropTimer.setPeriod(DURATIONS.softDropPeriod);
        this._dropTimer.restartTimer();
        //return this;
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
        //return this;
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
        myShapes.forEach( (myShape)=>{ myShape.unplaceShape(); }) // move to a tested place
        myShapes.forEach( (myShape)=>{ myShape.moveAndPlaceShape(0, myShape._jVector, DROP_TYPES.hard); }) // move to placed on grid
    },
    countAndClearRows() { // locks block and computes rows to transfer and _scores
        // old: AUDIO.audioPlay('landFX');
        if (this._fallingShape !== null) // for recursive calls with fallingshape === null
            this._fallingShape.clearGhostBlocks();
        // let rowsToClearCount = this._rowsToClearArray.length;
        let rowsToClearCount = this._rowsToClearList.listSize;
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
            this._score.displays(); // to refresh score
            if (this._fallingShape !== null)
                this._score.combosReset();
            this.gridAnimsStackPop();
        }
    },
    lose() { // lives during this._score duration
        this._score.displays();
        this._anims.messageAnim.setDuration(DURATIONS.lostMessageDuration); // empty queues necessary?
        this._gridMessagesQueue.execNowOrEnqueue(
            this._anims.messageAnim,
            this._anims.messageAnim.startAnim,
            [{text: 'You<BR/>lose', fieldCharCount: 4}]);
        this._gridMessagesQueue.execNowOrEnqueue(this, this.afterLost_);
        // AUDIO.audioStop('musicMusic');
        this._gridState = GRID_STATES.lost;
        for (let p in this._lockedBlocks._lockedBlocksArray)
            this._lockedBlocks._lockedBlocksArray[p].setBlockColor(SPRITES._colors['grey']);
    },
    setAnimLostVector_() {
        this._vector = [0, -SPRITES._pxTopMenuZoneHeight -SPRITES._pxGameHeight ]; // prepare vector
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
        //this._softDropTimer.pauseOrResume();
        this._dropTimer.pauseOrResume();
    }
};
// TETRIS SHAPE Class
class TetrisShape {
    constructor(grid, group=null) { // default falling shape means not group argument
        this._grid = grid;
        this._iPosition;
        this._jPosition;
        this._shapeType;
        this._pivotsCount;
        this._pivot;
        //this._colorTxt;
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
        //this._colorTxt                 = GAME._storedPolyominoes[this._shapeType].color;
        this._shapeColor               = SPRITES._colors[ GAME._storedPolyominoes[this._shapeType].color ];
        this._polyominoBlocks          = GAME._gameShapesWithRotations[this._shapeType][this._pivot]; // refers to current shape in stored in GAME, it's a shortcut
    }
    newShapeForExistingLockedBlocks_(group) { // shape prepared to fall after clearing rows, need to be called from down to upper
        this._domNode                  = this._grid._realBlocksNode.newChild({});
        this._shapeBlocks              = group.shape;
        this._jPosition                = group.jMin;
        for (let b=0;b < this._shapeBlocks.length;b++)
            this._shapeBlocks[b]._shape = this; // link to shape
        this.putShapeNodeIn();
    }
    getjVectorUnderShape() { // return negative slots count from falling shape to floor where it can be placed
        let result = 0;
        while (this.canMoveFromPlacedToPlaced(0, --result)); // compute result decrement BEFORE calling function
        return (++result); // compute result increment BEFORE calling function
    }
    putShapeInGame() {
        this._shapeBlocks = new Array(this._polyominoBlocks.length);
        this._ghostBlocks = new Array(this._shapeBlocks.length); // without putPositions
        this._domNode = this._grid._realBlocksNode.newChild({});
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
        this._shapeBlocks.forEach( (myBlock)=>{ myBlock.putBlockInRealBlocksNode(); });
        return this; // to use chained calls
    }
    putShapeNodeIn() {
        this._shapeBlocks.forEach( (myBlock)=>{ myBlock.putBlockNodeIn(this._domNode); }, this); // this === TetrisShape context necessary fot this._domNode
        return this; // to use chained calls
    }
    drawShape() { // show hidden shapes
        this._shapeBlocks.forEach( (myBlock)=>{ myBlock.drawBlockInCell(); });
        return this; // to use chained calls
    }
    findNewPositionAndDrawGhost() {
        if (this._ghostBlocks) {
            this._jVector = this.getjVectorUnderShape(); // if not not placed so deleted so ghost deleted
            this._shapeBlocks.forEach( (myBlock, b)=>{
                this._ghostBlocks[b]._iPosition = this._shapeBlocks[b]._iPosition;
                this._ghostBlocks[b]._jPosition = this._shapeBlocks[b]._jPosition + this._jVector;
                this._ghostBlocks[b].drawBlockInCell();
            }, this) // this = Window context by default, puting this here makes this === TetrisShape
        }
        return this; // to use chained calls
    }
    clearGhostBlocks() {
        if (this._ghostBlocks) { // if ghost blocks (not in chain)
            this._ghostBlocks.forEach( (myBlock)=>{ myBlock._domNode.destroyDomNode(); });
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
        this._shapeBlocks.forEach( (myBlock)=>{
            myBlock._iPosition += iRight; // updating position
            myBlock._jPosition += jUp; // updating position // after 'without this' change, this is Windows object here
            myBlock.placeBlock();
        });
        if ((dropType !== null) && (jUp < 0))
            this._grid._score.computeScoreDuringDrop(-jUp, dropType); // function receive slots count traveled, and dropType
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
            if (!this._shapeBlocks[b].isFreeSlot(this._shapeBlocks[b]._iPosition + iRight, this._shapeBlocks[b]._jPosition + jUp)) {
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
                if ( !this._shapeBlocks[b].isFreeSlot(
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
        let blockHit; // block who was hit, === TetrisBlock or null in _matrix
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
        this._shapeBlocks.forEach( (myBlock)=>{ myBlock.placeBlock(); });
    }
    unplaceShape() {
        this._shapeBlocks.forEach( (myBlock)=>{ myBlock.unplaceBlock(); });
    }
}
// TETRIS NEXT SHAPE PREVIEW Class
class NextShapePreview {
    constructor(grid) {
        this._grid = grid;
        this._domNode = this._grid._domNode._childs.nextShapePreview;
        for (let i=-SPRITES._shapesSpan;i <= SPRITES._shapesSpan;i++)
            for (let j=-SPRITES._shapesSpan;j <= SPRITES._shapesSpan;j++)
                this._domNode.nodeDrawSprite({fx: i, fy: j, col: this._grid._colorTxt, __onOff: false}); // off
    }
    mark(shape) {
        for (let b=0;b < shape._polyominoBlocks.length;b++)
            this._domNode.nodeDrawSprite({fx: shape._polyominoBlocks[b][0], fy: shape._polyominoBlocks[b][1], col: this._grid._colorTxt, __onOff: true}); // on
    }
    unMark(shape) { // optimized to remove only current previewed shape, and not all preview
        for (let b=0;b < shape._polyominoBlocks.length;b++)
            this._domNode.nodeDrawSprite({fx: shape._polyominoBlocks[b][0], fy: shape._polyominoBlocks[b][1], col: this._grid._colorTxt, __onOff: false }); // off
    }
}
// LOCKED BLOCKS Class, for locked blocks on the ground
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
    _grid                      : null,
    _lockedBlocksArray         : null,
    _lockedBlocksArrayByRow    : null, // -20 +40 +up que les boxes visibles
    _blocksCount             : 0,
    _searchDirections         : [[1, 0], [0, -1], [-1, 0], [0, 1]],// right, bottom, left, up
    destroyLockedBlocks() { // removes placed blocks
        for (let b=0; b < this._lockedBlocksArray.length; b++)
            if (this._lockedBlocksArray[b]) // if block exist
                this._lockedBlocksArray[b].destroyBlock();
    },
    chainSearchOrphan(mode) {
        if (mode === SEARCH_MODE.up)
            this._grid._fallingShape.unplaceShape(); // falling shape temporary removed, in testing mode
        let toProcessList = new List();
        // console.log('bbbbb');// $$$$$$$$
        console.table(this._lockedBlocksArray);
        // console.log('bb');
        for (let p in this._lockedBlocksArray)
            if (this._lockedBlocksArray[p] !== undefined) // _lockedBlocksArray has TetrisBlock or empty values
                toProcessList.putInList(this._lockedBlocksArray[p]._blockIndex, this._lockedBlocksArray[p]);
        let groups = []; // below we make isolated groups
        while (toProcessList.listSize > 0) { // equivalent to while (toProcessList.listSize)
            block = toProcessList.unList(); // block impossible to be null
            // block = toProcessList.listTable.shift(); toProcessList.listSize--;$$$$$$$$$$$$$
            let group = {jMin: RULES.verticalCellsCount, shape: []};
            group.jMin = Math.min(group.jMin, block._jPosition);
            group.shape.push(block);
            for (let dir=0;dir < 4;dir++)
                this.chainSearch3Ways(block, group, toProcessList, dir); // this.chainSearch3Ways is recursive
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
                this._grid._fallingShape.placeShape(); // falling is back
                for (let p in this._grid._lockedShapes)
                    if (this._grid._lockedShapes[p]._jPosition === 0) { // sub first row : j = 0
                        this._grid._lockedShapes[p]._jVector = 1;
                        this._grid._lockedShapes[p].shapesHitIfMove(0, 1);
                    }
                this._grid.unplaceAndMoveAndPlaceHardDroppingShape(this._grid._lockedShapes);
                switch (true) { // we exclusives cases
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
    chainSearch3Ways(blockFrom, group, toProcessList, dir) { // recursive
        let block = this._grid._matrix
            [blockFrom._iPosition + this._searchDirections[dir][0]]
            [blockFrom._jPosition + this._searchDirections[dir][1]];
        if (block && toProcessList.listTable[block._blockIndex] // if shape blocks contact
        && (blockFrom._blockColor === block._blockColor) ) { // if same shape blocks color #DEBUG rule to check here
            toProcessList.eraseItemFromList(block._blockIndex); // call del from list
            group.jMin = Math.min(group.jMin, block._jPosition);
            group.shape.push(block);
            for (let delta=-1;delta <= 1; delta++)
                this.chainSearch3Ways(block, group, toProcessList, (dir+4+delta)%4);
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
        let rowFilledSlots; // prepareNewRisingRowAt_jPos0
        let risingRowsHolesCountMax = Math.round(RULES.risingRowsHolesCountMaxRatio * RULES.horizontalCellsCount);
        rowFilledSlots = new Array(RULES.horizontalCellsCount).fill(true); // we fill all table with any value, 10 slots
        for (let c=0 ; c < risingRowsHolesCountMax ; c++) // we delete min 1 and max 30% of 10 columns, means 1 to 3 holes max randomly
            delete rowFilledSlots[Math.floor(Math.random()*RULES.horizontalCellsCount)]; // random() returns number between 0 (inclusive) and 1 (exclusive)
        rowFilledSlots.forEach( (uselessArg, slotIndex)=>{ // we skip delete rowFilledSlots
            let tempBlock = new TetrisBlock(BLOCK_TYPES.orphan, this._grid, slotIndex+1, 0, SPRITES._colors['grey']); }); // iPosition=[1-10], jPosition=0 just under game
        // end of prepareNewRisingRowAt_jPos0
        this.chainSearchOrphan(SEARCH_MODE.up); // this._grid._ghostBlocksNode.hide(); hide ghost shape before rising, not necessary
        this._grid._anims.rising1RowAnim.startAnim();
    }
};
// TETRIS BLOCK Class
class TetrisBlock {
    constructor(blockType, shapeOrGridOwnerOfThisBlock, i, j, blockColor) {
        this._blockType = blockType;
        this._iPosition = i;
        this._jPosition = j;
        this._grid;
        this._shape;
        this._domNode;
        //this._colorTxt;
        this._blockColor;
        this._blockIndex;
        this._domNode = new DomNode({type: 'canvas', width: '_pxBlockSize', height: '_pxBlockSize', sprite: SPRITES._spriteBlock}); // creating node
        this.setBlockColor(blockColor);
        switch (this._blockType) {
            case BLOCK_TYPES.ghost: // ghost shape for display only, no block index
                this._grid = shapeOrGridOwnerOfThisBlock;
                this.putBlockNodeIn(this._grid._ghostBlocksNode);
                this._domNode.setDomNode({opacity: SPRITES._ghostShapeOpacity});
                break;
            case BLOCK_TYPES.inShape: // falling ghape
                this._shape = shapeOrGridOwnerOfThisBlock;
                this._grid = this._shape._grid;
                this.putBlockNodeIn(this._shape._domNode);
                this._blockIndex = GAME._newBlockId++;
                break;
            case BLOCK_TYPES.orphan: // rising row coming from level j=0
                this._grid = shapeOrGridOwnerOfThisBlock; // use of shape as a grid, can be optimized
                this.putBlockInRealBlocksNode();
                this._blockIndex = GAME._newBlockId++;
                this.placeBlock();
                this.drawBlockInCell();
                break;
            default: console.log(this) // bug if this case occurs #DEBUG
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
         // if (this._grid._rowsToClearArray.lastIndexOf(this._jPosition) === -1)// check, if value not found
            this._grid._rowsToClearList.putInList(this._jPosition, true); // true to put something
            // this._grid._rowsToClearArray.push(this._jPosition); // preparing rows to clear, not negative values
    }
    unplaceBlock() {
        this._grid._matrix[this._iPosition][this._jPosition] = null;
        let locked = this._grid._lockedBlocks; // previously removeBlockFromLockedBlocks(this)
        delete locked._lockedBlocksArray[this._blockIndex]; // remove block from locked blocks
        delete locked._lockedBlocksArrayByRow[this._jPosition].blocks[this._blockIndex];
        locked._lockedBlocksArrayByRow[this._jPosition].rowBlocksCount--; // we decrement
        locked._blocksCount--; // we decrement
         if ( locked._lockedBlocksArrayByRow[this._jPosition].rowBlocksCount === RULES.horizontalCellsCount-1 ) // if we remove 1 from 10 blocks, it remains 9, so rowsToClear need to be updated
            this._grid._rowsToClearList.eraseItemFromList(this._jPosition);
            // this._grid._rowsToClearArray.splice( // necessary for correct exection
            // this._grid._rowsToClearArray.lastIndexOf(this._jPosition), 1 ); // we remove position of this._jPosition in _rowsToClearArra
    }
    setBlockColor(blockColor)  {
        //this._colorTxt = colorTxt;
        this._blockColor = blockColor;
        this._domNode.nodeDrawSprite({col: this._blockColor.name});
    }
    isFreeSlot(i, j)  { // can move on placed grid, put this into grid
        return (
            ( (j >= 1) || (j >= this._jPosition) ) // j === 0 is floor level, _jPosition useless$$$$$$$, same bug
            //    (j >= 1) // j=0 is floor level
            && (i >= 1) // i=0 is left wall
            && (i <=RULES.horizontalCellsCount) // i === 11 is right wall
            && (this._grid._matrix[i][j] === null) // _matrix[i][j] === null means free
        );
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
// TETRIS SCORE Class, based on riginal Nintendo scoring system
class Score {
    constructor(grid) {
        this._grid = grid;
        this._combos = -1;
        this._digitalScore = 0; // public real score
        this._displayedScore = 0;
        this._delta = 0;
        this._deltaShowed;
        this._factors = [null, 40, 100, 300, 1200, 6600]; // a single line clear is worth 400 points at level 0, clearing 4 lines at once (known as a Tetris) is worth 1200, max 5 lines with pento mode
        this._previousAnimDelta    = 0;
        this._totalSweptRows = 0;
        this._level = 0;
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
            timingAnimFunc(x) {
                return -(x-2*Math.sqrt(x));
            },
            animDuration: DURATIONS.displayingScoreDuration,
            optionalAnimOwner: this // otherwise, it's animation context by default
        });
        this.writeScore_(this._displayedScore);
    }
    displays() {
        if (this._delta !== 0) { // if delta changed !== 0
            this._grid._anims.score.endAnim(); // need to end before setting variables
            this._displayedScore = this._digitalScore;
            this._digitalScore += this._delta;
            this._grid._anims.score.startAnim();
        }
    }
    computeScoreDuringDrop(cellsTraveledCount, dropType) {
        this._delta += dropType * cellsTraveledCount;
    }
    computeScoreForSweptRowsAndDisplay(sweptRowsCount) {
        this._delta += this._factors[sweptRowsCount] * (this._level+1);
        this.computePerfectClear_(sweptRowsCount);
        this.displays();
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
            this._grid._dropTimer.setPeriod(this._grid._normalDropPeriod);
            this._grid._anims.messageAnim.startAnim({
                text: (this._level < RULES.topLevel) ? (`Level ${this._level}`) : (`<BR/>TOP<BR/> level ${this._level}`), // fit ES6
                fieldCharCount: 5 }); // last arg: higher for smaller text, not to queue, each new one replace previous one
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
    writeScore_(scoreText) {
        this._grid._domNode._childs.scoreZone.setTextIntoSizedField({text: scoreText}); // here all program write score, just comment for #DEBUG
    }
}
// VARIOUS BASIC FUNCTIONS
function isValued (item) { // requires declared and defined not to null
    return (isDeclaredAndDefined(item) && (item !== null));
}
function isDeclaredAndDefined (item) {
    return (typeof item !== 'undefined');
}
// LIST Class, to manage elements by index, indexed by string or number >=0 with size
function List() { with(this) {
    listTable = [];
}}
List.prototype = {
    listTable: null, // public read only
    listSize: 0, // public read only
    getNthIndex_: function(n) { with(this) {
        let orderedIndex = [];
        for (let p in listTable)
            orderedIndex.push(p)
        orderedIndex.sort();
        return orderedIndex[n];
    }},
    putInList: function(index, item) { with(this) {
        listTable[index] = item;
        listSize++;
    }},
    eraseItemFromList: function(index) { with(this) {
        delete listTable[index];
        // listTable.splice(index,1);            // don't work
        listSize--;
    }},
    /*get: function(index) { with(this) {        // old: typeof undefined if not found
        return listTable[index];
    }},
    getN: function(n) { with(this) {            // old: ordered get nth element [0, size-1] // n %= listSize;
        return listTable[getNthIndex_(n)];
    }},*/
    unList: function() { with(this) {            // not ordered
        /*listSize--;
        console.log(listTable);
        let pp = listTable.pop();
        console.log(listTable);
        console.log(listSize);
        return (pp);*/
        for (let p in listTable) {// $$$$$$$$$$
            // console.log(p);
            let item = listTable[p];
            // console.log(listTable);
            eraseItemFromList(p);
            // console.log(listTable);
            // console.log(listSize);
            return item;                            // one object only
        }    // return null;    // useless
    }},
    unListN: function(n) { with(this) {            // ordered
        let index = getNthIndex_(n);
        let item = listTable[index];                // old: get(index)
        eraseItemFromList(index);
        return item;
    }}
};
// LIST AUTO INDEX Class, list with first and last access, auto indexed by number with size and holes
function ListAutoIndex() { with(this) {            
    listAutoTable = [];
}}
ListAutoIndex.prototype = {
    listAutoTable     : null,    // public read only
    _listSize         : 0,
    _firstIndex        : 0,
    _lastIndex        : 0,
    _seek            : null,
    _nextCount        : null,
    putFirst: function(item) { with(this) {
        _firstIndex--;
        listAutoTable[_firstIndex] = item;
        _listSize++;
        return _firstIndex;
    }},
    putLast: function(item) { with(this) {
        _lastIndex++;
        listAutoTable[_lastIndex] = item;
        _listSize++;
        return _lastIndex;
    }},
    eraseItemFromListAuto: function(index) { with(this) {
        delete listAutoTable[index];
        _listSize--;
    }},
    /*get: function(index) { with(this) {    // old: typeof undefined if not found
        return listAutoTable[index];
    }},*/
    runForEachListElement: function(func, arg1) { with(this) {// allow to run a function on all list items
        resetNext();
        let item;
        while (item = next())
            func(item, arg1);    // voir call, [args]
    }},
    resetNext: function() { with(this) {    // init seek to first
        _seek = _firstIndex-1;
        _nextCount = 0;
    }},
    next: function() { with(this) {            // let item; resetNext(); while (item = myList.next());
        if (_nextCount < _listSize) {
            _nextCount++;
            _seek++;
            while (!isDeclaredAndDefined(listAutoTable[_seek]))
                _seek++;
            return listAutoTable[_seek];
        } else
            return false;
    }},
};
// TIMER Class, starts, pause and end a timer of a function to run in 'timerPeriod' ms
class Timer {
    constructor(timerObject) { // args never used here, so removed
        this._funcAtTimeOut = timerObject.funcAtTimeOut;
        this._timerPeriod = timerObject.timerPeriod;
        this._timerOwner = timerObject.timerOwner;
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
        this._timeOut = setTimeout(()=>{ this._funcAtTimeOut.call(null, this._timerOwner); }, this._timerPeriod); // setInterval is useless here, not used
    }
    isRunning() {
        return this._running; // useless for drop timer, not working!!!
    }
    pauseOrResume() { // works only if running, if not do nothing
        if (this._running) { // if paused, resume and return false
            if (this._paused) { // if not paused, pause and return true
                this._paused = false;
                this._timeOut = setTimeout(()=>{this._funcAtTimeOut.call(null, this._timerOwner)}, this._timerPeriod-(this._pauseTime-this._beginTime));
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
    setPeriod(timerPeriod) { // period will change on next call can be changed when running
        this._timerPeriod = timerPeriod;
    }
}
// EVENTS QUEUE Class
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
//SvgObject Class
//new(parent:): optional parent
//newChild(name:): optional unique attribute name
function SvgObject(svgDefinition) { //svgDefinition is attributes
    this._svgElement = document.createElementNS(SVG_NS, svgDefinition.type);
    this._childs = {};
    this._translateText = "";
    this._rotateText = "";
    if (svgDefinition.parent) //if parent is supplied OR is not null
        svgDefinition.parent.appendChild(this._svgElement);
    delete svgDefinition.parent; //to avoid it in set()
    set(svgDefinition);
}
SvgObject.prototype = {
    _count        : 0, //for unamed elements
    _svgElement   : null, //public, DOM SVG
    _childs       : null,
    _parent       : null, //pointer to parent
    _parentIndex  : null, //index of child in _childs, integer or name
    _translateText: null,
    _scaleText    : null,
    _rotateText   : null,
    del() { with(this) { //optional because garbbage collector
        for (var p in _childs)
            _childs[p].del(); //delete _childs[p] made by child
        _count = 0;
        if (_parent) delete _parent._childs[_parentIndex]; //manage parent
        delete _childs;
        _svgElement.parentNode.removeChild(_svgElement);
        delete _svgElement;
    }},
    get(svgDefinition) { with(this) {
        return _svgElement.getAttributeNS(null, svgDefinition);
    }},
    set1(svgDefinition, value) { with(this) {    
        _svgElement.setAttributeNS(null, svgDefinition, value);
    }},
    set(svgDefinition) { with(this) {
        for (var p in svgDefinition)
            if (!svgDefinition[p].type) //if sheet attribute without type
                _svgElement.setAttributeNS(null, p.replace(/_/, "-"), svgDefinition[p]); //<=> new RegExp("_","g"),
            else {
                svgDefinition[p].parent = _svgElement;
                _childs[p] = new SvgObject(svgDefinition[p]);
                _childs[p]._parent = this; //manage parent
                _childs[p]._parentIndex = p; //manage parent, create an instance for chars
            }
    }},
    getText() { with(this) { //works only if type == "text"
        return _svgElement.textContent;
    }},
    setText(text, width, maxHeightMinCharCount) { with(this) { //works only if type == "text"
        _svgElement.textContent = text;
        if (width) {
            var charCount = Math.max((""+text).length, maxHeightMinCharCount);
            set1("font-size", game._fontRatio*width/charCount); 
        }
    }},
    setTranslate(x, y) { with(this) {
        _translateText = "translate("+x+","+y+")";
        set({transform: _translateText});
    }},
    setScale(sx, sy) { with(this) { //sy optional
        if (!sy) sy = sx;
        _scaleText = "scale("+sx+","+sy+")";
        set({transform: _scaleText});
    }},
    setRotate(r, x, y) { with(this) { //sy optional
        _rotateText = "rotate("+r+","+x+","+y+")";
        set({transform: _rotateText});
    }},
    cancelTransform() { with(this) {
        _translateText        = "";
        _scaleText            = "";
        _rotateText            = "";
        set({transform:""});
    }},
    newChild(svgDefinition) { with(this) { //returns pointer to child
        svgDefinition.parent = _svgElement;
        //return _childs[svgDefinition.name?svgDefinition.name:_count++] = new SvgObject(svgDefinition);
        _childs[_count] = new SvgObject(svgDefinition);
        _childs[_count]._parent = this; //manage parent
        _childs[_count]._parentIndex = _count; //manage parent
        return _childs[_count ++];
    }},
    putChild(svg) { with(this) {
        if (svg._parent) delete svg._parent._childs[svg._parentIndex]; //manage parent
        if (typeof (svg._parentIndex) == "number")
            svg._parentIndex = _count ++;
        _childs[svg._parentIndex] = svg; //manage parent
        svg._parent = this; //manage parent
        _svgElement.appendChild(svg._svgElement);
    }},
    delChilds() { with(this) {
        for (var p in _childs)
            _childs[p].del();
        _count = 0;
    }},
    hide() { with(this) {
        _svgElement.setAttributeNS(null, "display", "none");
    }},
    show() { with(this) {
        this._svgElement.setAttributeNS(null, "display", "inherit");
    }},
    addChildCloneOf(svg) { with(this) {
        var id = svg._parentIndex;
        if (typeof (svg._parentIndex) == "number")
            id = _count ++;
        var child = _childs[id];
        child = new SvgObject({});
        child._parent = this;
        child._parentIndex = id;
        child._svgElement = svg._svgElement.cloneNode(false); //don't copy nodes here
        _svgElement.appendChild(child._svgElement);
        for (var p in svg._childs)
            child.addChildCloneOf(svg._childs[p], true); //copying nodes here
        return child;
    }}
};


// DOM NODE Class, manages HTML Elements, x:0 is implicit
function DomNode(definitionObject, parent=null, nameId=null) { // 2 last arguments for recursive calls and PutChild
    this._childs = {};
    this._domNodeType = isValued(definitionObject.type) ? 'canvas' : 'div'; // implicit div if type ommited
    // creating element into page window.document
    this._htmlElement = window.document.createElement(this._domNodeType); // create canvas or div
    this._htmlElement.style.position = 'absolute';
    // have a parent ?
    if (parent !== null) { // && (nameId !== null)
        this._parent = parent;
        this._nameId = nameId; // see if replace by this._htmlElement.id = this._nameId; in future
        this._parent._htmlElement.appendChild(this._htmlElement);
    }
    // run this code only 1 time for body MAIN dom node, then exit
    if (isValued(definitionObject.body)) {
        window.document.body.appendChild(this._htmlElement)
        this._htmlElement.style.width = '100%'; // all window
        this._width = this._htmlElement.offsetWidth; //this.getHeight();
        this._htmlElement.style.height = '100%'; // all window
        this._height = this._htmlElement.offsetHeight; //this.getHeight();
        return; // not proceed anymore, it's just one time
    }
    // checking width property
    if (isValued(definitionObject.width)) {
        this._widthVar = definitionObject.width;
        this.getWidth = ()=>{ return SPRITES[this._widthVar] };
        this.setWidth(this.getWidth());
    } else
        this.getWidth = ()=>{ return this._parent.getWidth() };
    // checking height property
    if (isValued(definitionObject.height)) {
        this._heightVar = definitionObject.height;
        this.getHeight = ()=>{ return SPRITES[this._heightVar] };
        this.setHeight(this.getHeight());
    } else
        this.getHeight = ()=>{ return this._parent.getHeight() };
    // checkingx position property
    if (isValued(definitionObject.x)) {
        this._xVar = definitionObject.x;
        this.getXInit = ()=>{ return SPRITES[this._xVar] };
    }
    // checking y position  property
    if (isValued(definitionObject.y)) {
        this._yVar = definitionObject.y;
        this.getYInit = ()=>{ return SPRITES[this._yVar] };
    }
    this.setX(this.getXInit());
    this.setY(this.getYInit());
    delete definitionObject.x;
    delete definitionObject.y;
    delete definitionObject.width;
    delete definitionObject.height;
    // checking y canvas  property
    if (this._domNodeType === 'canvas') {
        if (definitionObject.sprite) {
            this._vectorialSprite = definitionObject.sprite;
            delete definitionObject.sprite;
        }
        this._drawingContext2D = this._htmlElement.getContext('2d');
        this._htmlElement.width = this._width;
        //this._htmlElement.style.width = this._width*ratio+'px';
        this._htmlElement.height = this._height;
        //this._htmlElement.style.height = this._height*ratio+'px';
        this._drawStack = {};
    }
    this.setDomNode(definitionObject); // others attributes
}
DomNode.prototype = {
    _idCount                        : 0, // for unamed elements
    _htmlElement                                : null, // public, DOM DomNode or Div
    _childs                            : null,
    _parent                            : null, // pointer to parent
    _nameId                                : null, // =ID, index of child in this._childs, integer or name
    _x                                : 0,
    _y                                : 0,
    _width                            : 0,
    _height                            : 0,
    _xVar                            : null,
    _yVar                            : null,
    _widthVar                        : null,
    _heightVar                        : null,
    _domNodeType                    : null,
    _drawingContext2D             : null, // _drawingContext2D context
    _vectorialSprite                        : null,
    _scaleZoom                        : 1, // float
    _drawStack                        : null,
    _moveToGridCellStack                    : null,
    _text                            : null, // text node
    _textCharCountWidthMin            : null, // letter number in div width
    _textCharCountWidth                : null,
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
        if (!definitionObject.sprite) definitionObject.sprite = this._vectorialSprite;
        if (!definitionObject.x) definitionObject.x = 0; // px, int
        if (!definitionObject.y) definitionObject.y = 0; // px, int
        if (isValued(definitionObject.fx))
            definitionObject.x += definitionObject.sprite.fx(definitionObject.fx);
        if (isValued(definitionObject.fy))
            definitionObject.y += definitionObject.sprite.fy(definitionObject.fy);
        delete definitionObject.fx; // xy found, deleting functions
        delete definitionObject.fy;
        this._drawStack[this.getSortedXYArgs_(definitionObject)] = copyAtt; // remember xy only for index for redrawing
        let sortedArgs = this.getSortedArgs_(definitionObject);
        if (!definitionObject.sprite.hasImageData(sortedArgs)) {
            this._drawingContext2D.beginPath();
            definitionObject.sprite.drawSprite_(this._drawingContext2D, definitionObject.x, definitionObject.y, definitionObject, this.getWidth(), this.getHeight());
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
            if (p !== 'x' && p !== 'y' && p !== 'fx' && p !== 'fy' && p !== 'sprite')
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
            if (this._moveToGridCellStack !== null) // positionned with fx
                this.moveToGridCell(this._moveToGridCellStack); //before: this.moveToGridCell.apply(this, this._moveToGridCellStack); i// stacked [i, j] === this._moveToGridCellStack
        } // _moveToGridCellStack is never reset, used 1 time
        if (this._domNodeType === 'canvas') //$canvas
            this.redrawCanvas_(this._width, this._height);
        else { // type === div
            if (this._text)
                this.resizeText_();
            for (let p in this._childs)
                this._childs[p].redrawNode(true); //recursiveCalling === true
        }
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
        for (let p in definitionObject) //
            if (typeof definitionObject[p] === 'object')
                this._childs[p] = new DomNode(definitionObject[p], this, p); // if definitionObject[p] is div parent, create DomNode which runs setDomeNode
            else
                this._htmlElement.style[p.replace(/_/,'-')] = definitionObject[p]; // if definitionObject[p] is an attribute, opacity for example
    },
    pxVal_(val) {
        return val + 'px';
    },
    setX(x) {
        this._x = Math.round(x);
        this._htmlElement.style.left = this.pxVal_(this._x);
    },
    setY(y) {
        this._y = Math.round(y);
        this._htmlElement.style.top = this.pxVal_(this._y); // comemnt to disable any Y graphical move #DEBUG
    },
    getXCenter() {
        return this._x + Math.round(this.getWidth()/2);
    },
    setWidth(w) {
        this._width = w;
        this._htmlElement.style.width = this.pxVal_(this._width);
    },
    setHeight(h) {
        this._height = h;
        this._htmlElement.style.height = this.pxVal_(this._height);
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
        this.moveNodeTo(this._vectorialSprite.fx(cellPosition.i), this._vectorialSprite.fy(cellPosition.j));
    },
    moveCenterTo(x, y) {
        if (x) this.setX(Math.round(x-this.getWidth()/2));
        if (y) this.setY(Math.round(y-this.getHeight()/2));
    },
    newChild(definitionObject) { // returns pointer to child
        let id = this.getNewUId_();
        return (this._childs[id] = new DomNode(definitionObject, this, id));
        // return this._childs[definitionObject.name?definitionObject.name:id] = new DomNode(definitionObject, this, definitionObject.name?definitionObject.name:id);
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
    hide() {
        this._htmlElement.style.visibility = 'hidden'; // or this.setDomNode({opacity: 0});
    },
    show() {
        this._htmlElement.style.visibility = 'inherit';
    }
};
// VECTOR SPRITES Class, vectorial picture, emulates vectorial SVG graphics, generic
// functions : x, y, fx, fy, sprite, _nocache, reserved; 1 input
// use nomage: __funcToDoThis (intern)
// no '_' in String value of arguments
// for called functions: use one input parameter not object nor array (String, Number, Boolean)
class VectorialSprite {
    constructor(funcs) {
        this.drawSprite_; // context, x, y, args
        this.fx;
        this.fy;
        this._imagesData = []; // to work with _imagesData
        this._width;
        this._height;
        this._nocache;
        for (let p in funcs)
            if (p === '_nocache')
                this._nocache = funcs[p];
            else  // to reproduce same functions: drawSprite_, fy:, 'fx'
                this[p] = this[funcs[p]] ? this[funcs[p]] : funcs[p];
    }
    getWidth() {
        return SPRITES[this._width];
    }
    getHeight() {
        return SPRITES[this._height];
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
    static rgbaTxt(color, alpha=null) {
        //return 'rgba('+color[0]+','+color[1]+','+color[2]+','+((alpha===null)?1:alpha)+')';
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
// ANIMATION Class, to prepare an animation
class Animation {
    constructor(animObject) {
        this.startAnimFunc_  = isValued(animObject.startAnimFunc) ? animObject.startAnimFunc : false; // optional function when begin animation, value = null or defined
        this.animateFunc_    = animObject.animateFunc; // function to set THE movement to execute
        this.endAnimFunc_    = animObject.endAnimFunc; // function to set the last position after animation
        this.timingAnimFunc_ = animObject.timingAnimFunc; // f(x) defined on [0;1] to [-infinite;+infinite] give animation acceleration with animOutput, not dependant of declaring object, WARNING this fofbidden in the body
        this._duration       = animObject.animDuration; // duration of animation
        this._animOwner      = animObject.optionalAnimOwner; // object owner of animation
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
        this._paused         = false;
        this._animating      = false;
        this._elapsedFrames  = 0;
    }
    makeNextFrame_() {
        this.animateFunc_.call(this._animOwner, this.animOutput); // because score anim not declared in grid
        // this.animateFunc_(); // draw frame on display, as defined in the instance of Animation
        if ( (++this._elapsedFrames) < this._plannedFrames) {
            this.animOutput = this.timingAnimFunc_( this._elapsedFrames / this._plannedFrames ); // input [0;1] animOutput have any value
            this._windowNextFrameId = window.requestAnimationFrame(()=>{ this.makeNextFrame_(); }); // new 2015 feature, fast on Firefox, 60fps (this.makeNextFrame_) alone doesn't work, object context is Window instead Animation
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
        this._plannedFrames = RULES.fps * this._duration;
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
    setDuration(duration) { // can't set duration while animation running; return (if set correctly?) boolean
        if (this._animating) return false;
        else { this._duration = duration; return true; }
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