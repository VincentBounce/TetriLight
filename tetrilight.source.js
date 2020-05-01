/* ===========================================================================================================
								 TetriLight - Vincent BOURDEAU
 									Copyright (c) 2011-2020
 =============================================================================================================
Pure HTML5 JS CANVAS, no picture, no framework, no API, fully resizable
Tested on 2020 05 01, fit Chrome, Brave, Edge, Opera, Safari, Firefox (slow)
Fit ECMAScript 6 (2015) + HTML5 Canvas
All browsers support MP3 and WAV, excepted Edge/IE for WAV

====================VOCABULARY====================
to sweep = to clear
a row = a line
a cell = a slot

====================GAME RULES====================
When a player clears 3 or more (RULES.pentominoesRowsCountMin) lines together, then he have 1 to 3 blocks per shape,
and others players have 5 blocks per shape, during 15 or 20 seconds (it's called Pentominoes/Trominoes mode).
When a player clears 2 or more (RULES.transferRowsCountMin) lines together, then he drops same quantity of bad grey lines to others players.
Game is lost when new shape can't be placed (!_fallingShape.canMoveToPlaced).
Game starts at level 0
Level increments +1 every 10 rows
Hard drops double travelled cells count
Cleared rows count formula is 40 for 1, 100 for 2, 300 for 3, 1200 for 4, 6600 for 5 at level 0, then *(level + 1)
Combos rows count formula is same * 50%
Bonus same as 2 rows when all is cleared (Perfect clear)

====================MINOR BUGS====================
Small bug, if riseGreyBlocks and 1 or more row appears, need to wait next drop to clear this row
If top line only is cleared AND top line has blocks under, then the anim and sound of droping occurs again
$$$ test browser when start!
$$$ display fps
$$$ ListAutoIndex called 1x, useless?
$$$ too low rows qty who rise when 5 columns
$$$ pentomode blinking to solve
$$$ pause doesn't pause coming grid movements

====================CHANGES FROM ECMAScript 5 (2009)====================
window.requestAnimationFrame, window.cancelAnimationFrame: W3C 2015: Firefox 23 / IE 10 / Chrome / Safari 7
IE11 (standard with Windows 10) not working with:
	(`Level ${this._level}`)
	var myFunc = function(x){return x;} --> var myFunc = (x)=>{return x;}
	cloneSheeps = sheeps.slice(); --> cloneSheepsES6 = [...sheeps]
	func(arg=false)
	myArray.fill()
ECMAScript 2015: let, const, Transform: IE11 OK
ECMAScript 2017: async await

====================CODE JS====================
SVG: can change in realtime, retained mode (gradient evaluated on each change)
	for large surface, small number of objects
HTML5 Canvas: draw and forget, immediate mode (gradient done): CHOOSEN!
	for small surface, large number of objects
JS editor: Visual Studio Code with "Monokay" theme
Debugger: Chrome with CTRL+SHIFT+I
delete myObject.myAttribute: not exist anymore, [undefined], then garbage collector comes
myObject.myAttribute = null: value is [null], then garbage collector comes
var = cond ? if_true : if_false
var x = {}; x = null (typeof == "object") / x = undefined (typeof == "undefined")
typeof: item[undefined, boolean, number, string, object[array, set], function]
'' == "" == `` / item <> element
console.log() to log object into console (F12 key) on Chrome;
console.clear() to clear before
console.table() to have a clear table
var result = myClassInstance.publicMethod(); <> var myMethod = myClassInstance.publicMethod;
callee function (appelée), calling function (appelante)
(function () { ...instructions... })(); it's IIFE, means Immediately invoked function expression
=> to define a func <> >= operator
only Object or Array variables can be assigned by references
myMethod.call(this, arg1, arg2...) == myMethod.apply(this, [arg1, arg2...])

====================CODE JS ARRAY====================
queue(fifo) / gridAnimsStackPush(filo)
shift<<, unshift>> [array] <<push, >>pop
delete myArray[0]: just set slot to undefined
myArray.shift(): remove the slot from the table, even an Empty slot
for (let p in MyArray) delete myArray[p]: set to undefined / not Empty slots
instrument = [...instrument, 'violin', 'guitar'] //same as push violin, push guitar
instrument = ['violin', 'guitar', ...instrument] //same as unshift violin, unshift guitar
objectName.propertyName == objectName["propertyName"]
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
	KO:	_matrix = [...[new Array(RULES.horizontalBoxesCount+2).fill(null).forEach( (column, index, matrix)=>{
			column = []; //column is READ ONLY, use matrix[index] instead
			for (let j=GAME._matrixBottom;j <= GAME._matrixHeight;j++) column[j] = null; //height -1 to +(2x20)	})]]; //WARNING column is READ ONLY, use matrix[index][j] instead
	OK:	_matrix = new Array(RULES.horizontalBoxesCount+2).fill(null); //need to fill whole table, to make forEach browsing all slots
		_matrix.forEach( (column, index, matrix)=>{ //left and right boxes as margins columns, program fail if removed
			matrix[index] = [];
			for (let j=GAME._matrixBottom;j <= GAME._matrixHeight;j++) matrix[index][j] = null; //height -1 to +(2x20) });
merge 2 objects with different properties: myNewObject = Object.assign(firstOject, secondObject, {myThirdObjectProperty: 555}); or myNewObject = {...firstOject, ...secondObject, myThirdObjectProperty: 555};

====================CODE GITHUB====================
remove a remote: git remote rm old
rename a local branch: git branch -m es5-fit-ie9 es5-fit-ie11
rename a remote branch : git push tetrilight-github :es5-fit-ie9 es5-fit-ie11
solve git fatal no configured push destination: git push --set-upstream tetrilight-github 2-players-menu

====================NAMING CONVENTION====================
//#DEBUG: to track bug
//$$$: to check or fix later
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
var event is generic event
var item is generic item

====================ANIMATIONS SEQUENCES====================
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

====================CLASS====================
MainMenu [1 instance]
	DomNode [1 instance]
	GFX: GameGraphics [1 instance] ()
		DomNode [same instance]
	GAME: Game [1 instance]
		_gameEventsQueue
		PentominoesBriefMode
		Grid [x instance]
			_playedPolyominoesType
			_keyboard
			_animsStack
			_anims: all grid anims
			_gridEventsQueue
			_gridMessagesQueue
			lose()
			_nextShape
				Blocks
			_lockedBlocks: []
			_lockedShapes
				Shapes
					Blocks
						Node
			_fallingShape
				Blocks
			FrozenBlocks
				Blocks
			Score
				_score
				_level
Examples of list: toProcessList / _freeColors
Examples of listAutoIndex: _gridsListAuto
*/
//"use strict";
//GLOBAL VARIABLES, each one handle one class instance only
let BROWSER, MAIN_MENU, GAME, AUDIO, GFX;			//GFX: GameGraphics
//GLOBAL CONSTANTS
const RULES 						= {				//tetris rules
	gameSpeedRatio					: 1.5,			//default 1 normal speed, decrease speed < 1 < increase global game speed #DEBUG
	initialVolume					: 0.1,			//default 0.6, 0 to 1, if #DEBUG
	transferRowsCountMin			: 1, 			//default 2, min height of rows to drop bad grey lines to others players, decrease for #DEBUG
	pentominoesRowsCountMin			: 1, 			//default 3, min height of rows to start pentominoes mode, decrease for #DEBUG
	horizontalBoxesCount			: 5,			//default 10, min 5 #DEBUG
	verticalBoxesCount				: 21, 			//default 21 = (20 visible + 1 hidden) #DEBUG
	topLevel						: 25,			//default 25, max level (steps of drop acceleration)
	risingRowsHolesCountMaxRatio	: 0.3,			//default 0.3, <=0.5, max holes into each rising row, example: 0.5=50% means 5 holes for 10 columns
	fps								: 60/1000 };	//default 60/1000 = 60frames per 1000ms, average requestAnimationFrame() browser frame rate
const DURATIONS						= {				//tetris durations, periods in ms
	pentominoesModeDuration			: 10000,		//5000 ms, 15s for 3 lines cleared, 20s for 4 lines cleared
	movingGridsDuration				: 350,			//0350 ms
	clearingRowsDuration			: 350,			//0350 ms or 500, increase for #DEBUG, incompressible by any key excepted pause
	rising1RowDuration				: 150,			//0150 ms or 250, increase for #DEBUG
	rotatingDuration				: 400,	 		//0400 ms
	gridQuakeDuration				: 150,			//0150 ms or 200, increase for #DEBUG, incompressible by any key excepted pause
	centralMessagesDuration			: 1500,			//1500 ms, central messages displaying duration, replaced, not queued
	displayingScoreDuration			: 1500,			//1500 ms
	hardDropDuration				: 200,			//0200 ms, increase for #DEBUG
	lostMessageDuration				: 3500,			//3500 ms, period to display score
	softDropPeriod 					: 50,			//0050 ms, if this is max DropDuration
	initialDropPeriod				: 1100 }; 		//0700 ms, >= _softDropPeriod, decrease during game, increase for #DEBUG, incompressible duration by any key excepted pause
const FONTS							= {	scoreFont: 'Ubuntu', messageFont: 'Rock Salt' };
const SOUNDS						= {
	landFX: 						{ext:'wav'},
	rotateFX:						{ext:'wav'},
	moveFX:							{ext:'wav', vol:0.2},
	clearFX:						{ext:'wav'},
	quadrupleFX:					{ext:'wav'},
	selectFX:						{ext:'wav'},
	musicMusic:						{ext:'mp3', vol:0.5} };
//values > 0 to avoid (value == false == 0)
const GAME_STATES					= {paused: 1, running: 2, waiting: 3};
const GRID_STATES					= {connected: 1, playing: 2, lost: 3}; //connected but not started
const BLOCK_TYPES					= {ghost: 1, inShape: 2, orphan: 3};
const SEARCH_MODE					= {down: 1, up: 2};
const DROP_TYPES					= {soft: 1, hard: 2}; //1 and 2 are usefull for score: hard drop is double points

//INIT called by HTML browser
function init() {
	for (let p in DURATIONS) DURATIONS[p]/=RULES.gameSpeedRatio;	//change durations with coeff, float instead integer no pb, to slowdown game
	BROWSER = new Browser();
	AUDIO = new Audio(SOUNDS);
	AUDIO.changeVolume(false);
	MAIN_MENU = new MainMenu();
	//if (GAME) GAME.destroyGame();
	GAME = new Game();
	GAME.addGrid();
	GAME.addGrid(); //#DEBUG
}
//MENU MANAGER Class (make new to open web GAME)
function MainMenu() { with(this) { //queue or stack
	let commands = {
		rotate: function(grid) {
			if ( (GAME._gameState == GAME_STATES.running) && !grid.isBusy() )
				grid._fallingShape.fallingShapeTriesRotate();
		},
		softdrop: function(grid) {
			if ( (GAME._gameState == GAME_STATES.running) && !grid.isBusy() )
				grid._fallingShape.beginSoftDropping(true);
		},
		left: function(grid) {
			if ( (GAME._gameState == GAME_STATES.running) && !grid.isBusy() )
				grid._fallingShape.fallingShapeTriesMove(-1,0);
		},
		right: function(grid) {
			if ( (GAME._gameState == GAME_STATES.running) && !grid.isBusy() )
				grid._fallingShape.fallingShapeTriesMove(1,0);
		},
		pauseOrResume: function() {
			if (GAME._gameState != GAME_STATES.waiting)
				GAME.pauseOrResume();
		}
	};//init below
	document.documentElement.addEventListener('keydown', keyCapture_, false); 		//document.documentElement root
	document.documentElement.addEventListener('keyup', keyCapture_, false);
	document.documentElement.addEventListener('keypress', keyPressCapture_, false);
	document.documentElement.oncontextmenu = function(event){ cancelEvent_(event); };
	_domNode = new DomNode({
		onBody: true, width:100, height:100	});
	GFX = new GameGraphics(_domNode);
	_domNode.set({	//menus on top of the screen
		top: {
			type:'canvas', width:'_pxGameWidth', height:'_pxTopMenuZoneHeight', gfx:GFX._gfxBackground },//to create an HTML top free space above the tetris game
		message1: {
			width:'_pxTopMenuZoneHeight', height:'_pxTopMenuZoneHeight', vertical_align:'middle' },
		background: {
			type:'canvas', y:'_pxTopMenuZoneHeight', width:'_pxGameWidth', height:'_pxGameHeight', gfx:GFX._gfxBackground }
		});
	_domNode._childs.background.drawGfx();
	_domNode._childs.message1.createText('FONTS.messageFont', 'bold', 'black', '');
	//_domNode._childs.message1.setTex('totototo');
	_domNode._o.addEventListener('click',
		function(event) {
			if ((event.offsetX < GFX._pxButtonSize) && (event.offsetY < GFX._pxButtonSize))
					GAME.addGrid(); //top left square click capture to add another grid
		}, false);
	window.onresize = function() { GAME.organizeGrids({resize:true}) };		//on IE : load at start ; or window.onresize = organizeGrids;
}}
MainMenu.prototype = {
	_domNode	: null,
	cancelEvent_: function(event) { with(this) {
	    event.stopPropagation();
	    event.preventDefault();
	}},
	keyCapture_: function(event) { with(this) {
		//let s='';for (let p in event) {s += p+' '+event[p]+'\n'};
		MAIN_MENU.cancelEvent_(event);
		switch (event.keyCode) {
			case 'P'.charCodeAt(0):
				if ((GAME._gameState != GAME_STATES.waiting) && (event.type=='keydown'))
					GAME.pauseOrResume(); //to enter pause
				break; //always exit after this instruction
			default:
				if (GAME._gameState == GAME_STATES.running) {
					GAME.chooseAction(event);
				}
				break;
		}
	}},
	keyPressCapture_: function(event) { with(this) { //#DEBUG changing volume seems to not work
		switch (event.keyCode) {
	    case 43: // +
			changeVolume(1);
			break;
	    case 45: // -
			changeVolume(-1);
			break;	
		}
	}}
};
//BROWSER Class
function Browser() { with(this) {
}}
Browser.prototype = {
	isFullScreen: function() { with(this) {
		return (innerWidth == screen.width && innerHeight > screen.height-5); //Firefox use 1px in height
	}}
};
//AUDIO Class (for sounds)
function Audio(sounds) { with(this) {	//constructor
	_sounds = {};
	for (let p in sounds)
		addSound(p, sounds[p].ext, sounds[p].vol);
}}
Audio.prototype = {
	_mainVolume					: RULES.initialVolume,
	_muted						: false,
	_sounds						: null,
	addSound: function(name, ext, volume) { with(this) {	//when new is called, add all sounds in _sounds let, 2nd arg volume is optional
		_sounds[name] = {};
		_sounds[name].sound = document.createElement('audio');
		document.body.appendChild(_sounds[name].sound);
		//_sounds[name].sound.setAttribute('preload', 'auto');	//old
		//_sounds[name].sound.autoplay = true;	//old
		//_sounds[name].sound.controls = true;	//displays controls for #DEBUG
		if (name.indexOf('Music') !== -1)	//check if contains Music in name, if so then play with loop
			_sounds[name].sound.loop = 'loop';
		_sounds[name].sound.setAttribute('src', 'audio/' + name + '.' + ext); //(ext ? ext : 'wav')
		_sounds[name].volumeFactor = (volume ? volume : 1);
		_sounds[name].paused = false;
	}},
	audioPlay: function(name) { with(this) {
		_sounds[name].paused = false;
		_sounds[name].sound.play();
	}},
	audioStop: function(name) { with(this) {
		_sounds[name].paused = false;
		_sounds[name].sound.pause();	//old: _sounds[name].sound.currentTime = 0;
	}},
	/*audioStopAll: function() { with(this) {
		for (let p in _sounds)
			stop(_sounds[p]);
	}},*/
	pauseOrResume: function(name) { with(this) {
		_sounds[name].paused = !_sounds[name].paused;
		if (_sounds[name].paused)
			_sounds[name].sound.pause();
		else
			audioPlay(name);
	}},
	changeVolume: function(up) { with(this) {	//-1 or +1, return false if not changed
		let volume = _mainVolume + up*0.1;
		if ((volume < 0) || (volume > 1))
			return false;						//we can't change
		else {
			_mainVolume = volume;
			refreshVolume(_mainVolume);
			return true;
		}
	}},
	muteUnmute: function() { with(this) {
		muted = !muted;
		if (muted)
			refreshVolume(0);
		else
			refreshVolume(_mainVolume);
	}},
	refreshVolume: function(volume) { with(this) {
		for (let sound in _sounds)
			_sounds[sound].sound.volume	= volume * _sounds[sound].volumeFactor;
	}},
	getDuration: function(name) { with(this) {
		return _sounds[name].sound.duration;
	}}
};
//TETRIS GRAPHICS Class
function GameGraphics(rootNode) { with(this) {
	_rootNode = rootNode;
	zoom1Step(0);
	create_();
}}
GameGraphics.prototype = {
	_rootNode							: null,
	_zoomRatio							: 1,				//default 1, float current zoom ratio
	_scaleFactor						: 33,				//default 33, int scale unit < _pxBlockSize && >= 1
	_pxTopMenuZoneHeight				: 60, 				//default 0 or 20, Y top part screen of the game, to displays others informations #DEBUG
	_pxGameWidth						: null,
	_pxGameHeight						: null,
		_pxHalfGameHeight				: null,
	_pxBlockSize						: 34,
		_pxBoxSize						: null,
	_pxGridBorder						: null,
	_pxGridLineWidth					: null,
	_pxGridWidth						: null,
		_pxFullGridWidth				: null,
			_pxGridMargin				: null,
	_pxGridHeight						: null,
		_pxFullGridHeight				: null,
	_XPreviewPosition					: null,
	_YPreviewPosition					: null,
	_XScorePosition						: null,
	_YScorePosition						: null,
	_XMessagePosition					: null,
	_YMessagePosition					: null,
	_pxCeilHeight						: null,
	_pxFullGridAndCeil					: null,
	_pxPreviewFullSize					: null,				//2*36=72
	_pxPreviewBlockSize					: null,
	_pxPreviewLineWidth					: null,
	_pxButtonSize						: 50,				//default 50
	_gfxBackground						: null,
	_gfxBlock							: null,
	_gfxGridFront						: null,
	_gfxGridBackground					: null,
	_gfxPreviewBlock					: null,
	_gfxPreviewBlockFrame				: null,
	_backgroundColor					: 'black',			//default 'black'
	_ghostShapeOpacity					: 0.15,				//default 0.15
	_previewOpacity						: 0.2,				//default 0.2, opacity for preview grid
	_lostShapeOpacity					: 0.5,				//default 0.5, to show a ghost of shape wich makes losing
	_shapesSpan							: 2,				//span : envergure =(5-1)/2
	_colors: {
		pink: 		{light:[248, 190, 232], medium:[224, 107, 169], dark:[189,  66, 111]},
		purple:		{light:[210, 172, 241], medium:[136, 100, 208], dark:[ 90,  64, 177]},
		red: 		{light:[245, 140, 140], medium:[219,  78,  78], dark:[187,  48,  48]},
		green:  	{light:[199, 233,  88], medium:[115, 176,  13], dark:[ 75, 127,   0]},
		yellow: 	{light:[255, 250, 134], medium:[218, 190,  13], dark:[184, 147,   0]},
		orange:		{light:[250, 197, 115], medium:[240, 143,   0], dark:[212,  87,   0]},
		blue:  		{light:[  0, 215, 246], medium:[ 13, 134, 222], dark:[  0,  87, 190]},
		grey_white:	{light:[255, 255, 255], medium:[188, 197, 204], dark:[ 97, 109, 121]},
		grey_blue :	{light:[192, 216, 231], medium:[127, 150, 188], dark:[ 73,  85, 118]},
		grey:  		{light:[207, 207, 207], medium:[134, 134, 134], dark:[ 88,  88,  88]}
	},
	condition_: function(gridCount) { with(this) {	//gridCount = GAME._playersCount
		return ( ( //#DEBUG: to compact grids together
				//(_pxGameWidth > _pxFullGridWidth * gridCount + _pxGridMargin * (gridCount+1) ) && (_pxGameHeight > _pxFullGridHeight + 5*_pxGridMargin)
				(_pxGameWidth >= _pxFullGridWidth * gridCount )	&& (_pxGameHeight >= _pxFullGridAndCeil )
			) || (!(_scaleFactor-1)) );
	}},
	zoomToFit: function(gridCount) { with(this) { //used for scaling if needed
		if (condition_(gridCount)) {
			while (condition_(gridCount))
				zoom1Step(1);
			zoom1Step(-1);
		} else
			while (!condition_(gridCount))
				zoom1Step(-1);
	}},
	zoom1Step: function(step) { with(this) {	//computing for zoom with pixels into web browser
		_scaleFactor += step;
		let oldGridWidth = _pxFullGridWidth;
		_pxBlockSize += step;
		_pxGameWidth = _rootNode.getWidth();
		_pxGameHeight = _rootNode.getHeight() - _pxTopMenuZoneHeight;
		_pxHalfGameHeight = Math.round(_pxGameHeight/2);
		_pxGridLineWidth = Math.max(Math.round(_pxBlockSize/14), 1);
		_pxGridWidth = RULES.horizontalBoxesCount*_pxBlockSize + (RULES.horizontalBoxesCount+1)*_pxGridLineWidth;
		_pxGridHeight = RULES.verticalBoxesCount*_pxBlockSize + (RULES.verticalBoxesCount+1)*_pxGridLineWidth;
		_pxBoxSize = _pxBlockSize + _pxGridLineWidth;
		_pxGridBorder = Math.ceil(_pxBoxSize/3);	//bordure de grille en dégradé
		_pxFullGridWidth = _pxGridWidth + 2*_pxGridBorder;	//largeur grille + bordure
		_pxFullGridHeight = _pxGridHeight + _pxGridBorder;	//hauteur grille + bordure
		_pxGridMargin = Math.round(_pxFullGridWidth/8);
		_pxPreviewBlockSize = Math.round(_pxBlockSize/2.6);
		_pxPreviewLineWidth	= _pxGridLineWidth;	//valeur arbitraire, aurait pu etre différente
		_pxPreviewFullSize = (_pxPreviewBlockSize + _pxPreviewLineWidth) * (2*_shapesSpan+1) ;
		_pxCeilHeight = _pxPreviewFullSize + _pxPreviewBlockSize + _pxPreviewLineWidth;	//hauteur de la zone posée sur la grille old: + _pxBoxSize
		_pxFullGridAndCeil = _pxFullGridHeight + _pxCeilHeight;
		_XPreviewPosition = Math.round(_pxFullGridWidth/2-_pxPreviewFullSize/2);
		_YPreviewPosition = 0;
		_XScorePosition = _XPreviewPosition + _pxPreviewFullSize;	//Math.round(3*_pxFullGridWidth/4);
		_YScorePosition = 0;
		_XMessagePosition = Math.round(_pxFullGridWidth/2);
		_YMessagePosition = Math.round(_pxFullGridHeight/2);
		_zoomRatio = !oldGridWidth ? 1 : _pxFullGridWidth / oldGridWidth;
	}},
	create_: function()  { with(this) {		//creating all graphics
		_gfxBackground = new VectorGfx({
			_nocache: true,
			draw_: function(c, x, y, a, w, h) {			//context, x, y, args, canvas width, canvas height
				c.fillStyle=linearGradient(c,0,0,0,h,0.5,_backgroundColor,1,'#AAAAAA');
				c.fillRect(x,y,w,h)	}
		});
		_gfxGridFront = new VectorGfx({	//on dessine 3 trapèzes qu'on assemble
			_width:	'_pxFullGridWidth',
			_height: '_pxFullGridHeight',
			_nocache: true,
			draw_: function(c, x, y, a) { //context, x, y, args
				let col = _colors[a.col];
				c.moveTo(x,y);c.lineTo(x+_pxGridBorder,y); //left border
				c.lineTo(x+_pxGridBorder,y+_pxGridHeight);
				c.lineTo(x,y+_pxFullGridHeight);
				c.fillStyle=linearGradient(c,0,0,_pxGridBorder,0,1,rgbaTxt(col.dark),0,rgbaTxt(col.light));
				c.fill();
				c.beginPath();c.moveTo(x+_pxFullGridWidth,y); //right border
				c.lineTo(x+_pxGridBorder+_pxGridWidth,y);
				c.lineTo(x+_pxGridBorder+_pxGridWidth,y+_pxGridHeight);
				c.lineTo(x+_pxFullGridWidth,y+_pxFullGridHeight);
				c.fillStyle=linearGradient(c,_pxGridWidth+_pxGridBorder,0,_pxGridBorder,0,0,rgbaTxt(col.dark),1,rgbaTxt(col.light));
				c.fill();
				c.beginPath();c.moveTo(0,_pxFullGridHeight); //bottom border
				c.lineTo(_pxGridBorder,_pxGridHeight);
				c.lineTo(_pxGridBorder+_pxGridWidth,_pxGridHeight);
				c.lineTo(_pxFullGridWidth,_pxFullGridHeight);
				c.fillStyle=linearGradient(c,0,_pxGridHeight,0,_pxGridBorder,0,rgbaTxt(col.dark),1,rgbaTxt(col.light));
				c.fill();
				c.fillStyle=linearGradient(c,0,0,0,_pxBoxSize*2,0, rgbaTxt([0,0,0],1),1, rgbaTxt([0,0,0],0));	//top grid shadow
				c.fillRect(0,0,_pxFullGridWidth,_pxFullGridHeight);	//#DEBUG
			}
		});
		_gfxGridBackground = new VectorGfx({
			_width:	'_pxFullGridWidth',
			_height: '_pxFullGridHeight',
			_nocache: true,
			draw_: function(c, x, y, a) {			//context, x, y, args
				let col = _colors[a.col];
				c.fillStyle='#111';c.fillRect(x,y,_pxGridWidth,_pxGridHeight);
				let colo = ['#000','#222'];
				for (let p=colo.length-1;p>=0;p--) {
					c.beginPath();
					let margin = -(p*_pxGridLineWidth)+_pxGridLineWidth/2;
					for (let i=1;i < RULES.verticalBoxesCount;i++) {
						c.moveTo(x, y+_pxBoxSize*i+margin);
						c.lineTo(x+_pxGridWidth, y+(_pxBoxSize)*i+margin);
						c.lineWidth=_pxGridLineWidth;c.strokeStyle=colo[p];c.stroke();
					}
					for (let i=1;i < RULES.horizontalBoxesCount;i++) {
						c.moveTo(x+_pxBoxSize*i+margin, y);
						c.lineTo(x+_pxBoxSize*i+margin, y+_pxGridHeight);
						c.lineWidth=_pxGridLineWidth;c.strokeStyle=colo[p];c.stroke();
					}
				}
				c.rect(x,y,_pxGridWidth,_pxGridHeight);
				c.fillStyle=radialGradient(c,x+_pxGridWidth/2,y+_pxGridHeight,0,0,0,3*_pxGridHeight/4,
					0, rgbaTxt(col.medium, 0.3),		1, rgbaTxt(col.medium, 0));	c.fill();
				c.fillStyle=linearGradient(c,x,y,_pxGridWidth,0,
					0, rgbaTxt([0,0,0],0.5),	0.1, rgbaTxt([0,0,0],0),
					0.9, rgbaTxt([0,0,0],0),	1, rgbaTxt([0,0,0],0.5));	c.fill();	},
			fx:	function(x)	{	return _pxGridBorder	},
			fy:	'fx'
		});
		_gfxPreviewBlock = new VectorGfx({		//args a: gradient if true, uniform if false
			_width:	'_pxPreviewBlockSize',
			_height: '_pxPreviewBlockSize',
			draw_: function(c, x, y, a) {	//context, x, y, args
				let col = _colors[a.col]; //c.clearRect(x,y,_pxPreviewBlockSize,_pxPreviewBlockSize); //useful if we don't erase previous value
				c.fillStyle=(a.__onOff?
					linearGradient(c,x,y,_pxPreviewBlockSize,_pxPreviewBlockSize, 0, rgbaTxt(col.dark), 1, rgbaTxt(col.light))
					:rgbaTxt(col.medium, _previewOpacity)
				);
				c.fillRect(x,y,_pxPreviewBlockSize,_pxPreviewBlockSize)	},
			fx:	function(x)	{	return (_shapesSpan+x)*(_pxPreviewBlockSize+_pxPreviewLineWidth)	},
			fy:	function(y)	{	return (_shapesSpan-y)*(_pxPreviewBlockSize+_pxPreviewLineWidth)	}
		});
		_gfxPreviewBlockFrame = new VectorGfx({	//!!!
			_width: '_pxPreviewBlockSize',
			_height: '_pxPreviewBlockSize',
			draw_: function(c, x, y, a) {	//context, x, y, args
				let col = _colors[a.col];
				c.moveTo(x,y);c.lineTo(x+_pxGridBorder,y);		//left border
				c.lineTo(x+_pxGridBorder,y+_pxGridHeight);
				c.lineTo(x,y+_pxFullGridHeight);
				c.fillStyle=(rgbaTxt(col.light, _previewOpacity));
				c.fill(); },
			fx:	function(x)	{	return (_shapesSpan+x)*(_pxPreviewBlockSize+_pxPreviewLineWidth)	},
			fy:	function(y)	{	return (_shapesSpan-y)*(_pxPreviewBlockSize+_pxPreviewLineWidth)	}
		});
		_gfxBlock = new VectorGfx({
			_width: '_pxBlockSize',
			_height: '_pxBlockSize',
			draw_: function(c, x, y, a) {	//context, x, y, args
				let half = Math.round(_pxBlockSize/2);
				let margin = Math.round(_pxBlockSize/7);
				let col = _colors[a.col];
				c.fillStyle=rgbaTxt(col.medium);
				c.fillRect(x,y,_pxBlockSize,_pxBlockSize);
				c.beginPath();c.moveTo(x,y);c.lineTo(x+half,y+half);c.lineTo(x+_pxBlockSize,y);
				c.fillStyle=rgbaTxt(col.light);c.fill();
				c.beginPath();c.moveTo(x,y+_pxBlockSize);c.lineTo(x+half,y+half);
				c.lineTo(x+_pxBlockSize,y+_pxBlockSize);c.fillStyle=rgbaTxt(col.dark);c.fill();c.beginPath();
				c.fillStyle=linearGradient(c,x,y,_pxBlockSize-2*margin,_pxBlockSize-2*margin,0,rgbaTxt(col.dark),1,rgbaTxt(col.light));
				c.fillRect(x+margin,y+margin,_pxBlockSize-2*margin,_pxBlockSize-2*margin)	},
			fx: function (i) { return _pxGridLineWidth + ( i-1 ) * _pxBoxSize },
			fy: function (j) { return _pxGridLineWidth + ( RULES.verticalBoxesCount-j ) * _pxBoxSize }
		})
	}},
};
//TETRIS GAME Class
function Game() { with(this) {
	_matrixHeight				= RULES.verticalBoxesCount * 2;				//GAME blocks rise (massively sometimes) by unqueuing animated sequences: if lost, need to finish these sequences before noticing losing with new falling shape unable to place
	_iPositionStart				= Math.ceil(RULES.horizontalBoxesCount/2);	//shape start position
	_jPositionStart				= RULES.verticalBoxesCount - 1;
	_gridsListAuto				= new ListAutoIndex();						//players' grids' lists
	_pentominoesBriefMode		= new PentominoesBriefMode();
	_gameShapesWithRotations 	= new Array(_storedPolyominoes.length);		//table of all shapes with rotations
	for (let s=0;s < _storedPolyominoes.length;s++) {      					//creating all shapes variations: browsing shapes
		shapeBlocksCount		= _storedPolyominoes[s].blocks.length;
		quarters				= _storedPolyominoes[s].quarters;
		_gameShapesWithRotations[s]	= new Array(quarters);
		for (let pivot=0;pivot < quarters;pivot++) { 						//creating all shapes rotations: browsing rotations
			_gameShapesWithRotations[s][pivot] = new Array(shapeBlocksCount);
			if(pivot == 0)
				for (let b=0;b < shapeBlocksCount;b++)						//browsing 4 blocks
					_gameShapesWithRotations[s][pivot][b] = [
						_storedPolyominoes[s].blocks[b][0],
						_storedPolyominoes[s].blocks[b][1]	];
			else
				for (let b=0;b < shapeBlocksCount;b++)						//browsing 4 blocks
					_gameShapesWithRotations[s][pivot][b] = [
						- _gameShapesWithRotations[s][pivot-1][b][1],		//minus here (default) for unclockwise
						  _gameShapesWithRotations[s][pivot-1][b][0] 	]	//minus here for clockwise
		}
	}
	_freeColors = new List();
	for (let p in GFX._colors)
		if (p != 'grey')
			_freeColors.putInList(p, p);//to know available colors
	_anims.moveGridsAnim = new Animation({	//make tetris grid coming and leaving
		animateFunc: function(animOutput) { with(this) {
			_gridsListAuto.resetNext();
			let grid;
			while (grid = _gridsListAuto.next())
				grid._domNode.moveTemporaryRelatively(grid._vector[0]*animOutput, grid._vector[1]*animOutput)
		}},
		endAnimFunc: function() { with(this) {
			_gridsListAuto.resetNext();
			let grid;
			while (grid = _gridsListAuto.next()) {
				grid._domNode.moveRelatively(grid._vector[0], grid._vector[1]);
				grid._vector = [0, 0];
			}
			_gameEventsQueue.dequeue();
		}},
		timingAnimFunc: function(x) {
			return -(x-2*Math.sqrt(x));	//old: return -(x-2*Math.sqrt(x));
		},
		animDuration: DURATIONS.movingGridsDuration
	});
	_gameEventsQueue = new EventsQueue();	//animating applied on _anims.moveGridsAnim
}}
Game.prototype = {
	_gridsListAuto					: null,
	_matrixHeight					: null,
	_matrixBottom					: -1,					//1 rising row by 1 and queued, to avoid unchained blocks levitating 
	_iPositionStart					: null,
	_jPositionStart					: null,
	_playersCount					: 0,
	_gameState						: GAME_STATES.waiting,	//others: GAME_STATES.paused, GAME_STATES.running
	_shapeIdTick					: 0,
	_newBlockId						: 0,
	_pentominoesBriefMode			: null,			
	_gameShapesWithRotations		: null,
	_shelf							: null,
	_gameEventsQueue				: null,
	_anims							: {},					//only 1 instance of game
	_freeColors						: null,					//for name of free colors for players
	_keyboards : [					//up down left right
		{symbols:['Z','S','Q','D'], keys:['Z'.charCodeAt(0), 'S'.charCodeAt(0), 'Q'.charCodeAt(0), 'D'.charCodeAt(0)], free:true}, //$$$ manage W for QWERTY
		{symbols:['I','K','J','L'], keys:['I'.charCodeAt(0), 'K'.charCodeAt(0), 'J'.charCodeAt(0), 'L'.charCodeAt(0)], free:true},
		{symbols:['\u2227','\u2228','<','>'], keys:[38, 40, 37, 39], free:true}
	],
	_storedPolyominoes : [ 																//5x5 shapes only, coordinates, angles count
		//4 trominoes or domino or monomino
		{blocks:[[ 0, 0]], 								quarters:1, color:'grey_blue'},		// - default quarters 1
		{blocks:[[ 0, 1],[0, 0]], 						quarters:2, color:'grey_white'},	// -- default quarters 2
		{blocks:[[ 0, 1],[0, 0],[0,-1]], 				quarters:2, color:'grey_blue'},		// --- default quarters 2
		{blocks:[[ 0, 1],[0, 0],[1, 0]], 				quarters:4, color:'grey_white'},	// |_
		//7 tetrominoes
		{blocks:[[ 0, 1],[0, 0],[0,-1],[0,-2]], 		quarters:2, color:'green' },		// I default quarters 2
		{blocks:[[-1, 0],[0, 0],[1, 0],[1,-1]],			quarters:4, color:'blue'  },		// J
		{blocks:[[-1, 0],[0, 0],[1, 0],[1, 1]],			quarters:4, color:'orange'},		// L
		{blocks:[[ 0, 0],[0, 1],[1, 0],[1, 1]], 		quarters:1, color:'pink'  },		// O default quarters 1
		{blocks:[[-1,-1],[0,-1],[0, 0],[1, 0]], 		quarters:2, color:'purple'},		// S default quarters 2
		{blocks:[[-1, 0],[0, 0],[0,-1],[1,-1]], 		quarters:2, color:'red'   },		// Z default quarters 2
		{blocks:[[-1, 0],[0, 0],[0, 1],[1, 0]],			quarters:4, color:'yellow'},		// T
		//14 pentominoes
		{blocks:[[ 0, 0],[0, 1],[1, 0],[1, 1],[ 0,-1]],	quarters:4, color:'pink'  },		// O¨
		{blocks:[[ 0, 0],[0, 1],[1, 0],[1, 1],[-1, 0]],	quarters:4, color:'pink'  },		// O_
		{blocks:[[-1,-1],[0,-1],[0, 0],[1, 0],[ 2, 0]],	quarters:4, color:'purple'},		// S¨
		{blocks:[[-1, 1],[0, 1],[0, 0],[1, 0],[ 2, 0]],	quarters:4, color:'red'   },		// ¨Z
		{blocks:[[ 0, 2],[0, 1],[0, 0],[0,-1],[ 0,-2]],	quarters:2, color:'green' },		// -----
		{blocks:[[-1, 0],[0, 1],[0, 0],[0,-1],[ 0,-2]],	quarters:4, color:'green' },		// T¨
		{blocks:[[ 1, 0],[0, 1],[0, 0],[0,-1],[ 0,-2]],	quarters:4, color:'green' },		// ¨T
		{blocks:[[-1, 0],[0, 0],[0, 1],[1, 0],[ 0,-1]],	quarters:4, color:'yellow'},		// -|- default quarters 1
		{blocks:[[-1, 1],[-1,0],[-1,-1],[0,-1],[1,-1]],	quarters:4, color:'orange'},		// L_
		{blocks:[[-1, 0],[0, 0],[0, 1],[1, 0],[-1,-1]],	quarters:4, color:'orange'},		// -L
		{blocks:[[-1, 0],[0, 0],[0, 1],[1, 0],[ 1,-1]],	quarters:4, color:'blue'  },		// J-
		{blocks:[[-1, 1],[-1,0],[ 0, 0],[1, 0],[1,-1]],	quarters:2, color:'purple'},		// J¨
		{blocks:[[-1,-1],[-1,0],[ 0, 0],[1, 0],[1, 1]],	quarters:2, color:'red'   },		// ¨L
		{blocks:[[-1, 1],[-1,0],[ 0, 0],[1, 0],[1, 1]],	quarters:4, color:'blue'  }			// L¨
	],
	_playedPolyominoesType: {
		trominoes:		{index: 0, count: 4},	//range of 3 blocks shapes
		tetrominoes: 	{index: 4, count: 7},	//range of 4 blocks shapes
		pentominoes: 	{index: 11, count:14}	//range of 5 blocks shapes
	},
	destroyGame: function() { with(this) {
		_gridsListAuto.runForEachListElement(function(o){o.destroyDomNode()});
		_newBlockId = 0;
		_domNode.destroyDomNode();
		//_pentominoesBriefMode.destroyPentoMode();//old, remove all timers
	}},
	pauseOrResume: function() { with(this) {//pause or resume
		_gameState = (_gameState == GAME_STATES.running) ? GAME_STATES.paused : GAME_STATES.running;
		AUDIO.pauseOrResume('musicMusic');	//pause or resume playing music only, because FX sounds end quickly
		AUDIO.audioPlay('selectFX');		//always play sound FX for pause or resume
		_pentominoesBriefMode.pauseOrResume();	//if pentominoes mode, pause it
		_gridsListAuto.runForEachListElement( function(o){o.pauseOrResume()} );	//all players
	}},
	addGrid: function() { with(this) {		//return true if added
		_gameEventsQueue.execNowOrEnqueue(this, addGridBody_);
	}},
	addGridBody_: function() { with(this) {	//return true if added
		if (_freeColors.listSize > 0) {
			_playersCount ++;
			let p; for (p in _keyboards)
				if ( _keyboards[p].free)
					break;
			_keyboards[p].free = false;
			let grid = new Grid( _keyboards[p], _freeColors.unListN( Math.floor(Math.random()*_freeColors.listSize)) );
			//old: grid._gridId = (_playersCount%2)?_gridsListAuto.putFirst(grid):_gridsListAuto.putLast(grid);	//from left or right
			organizeGrids({newGrid:grid});
			return grid;
		} else
			_gameEventsQueue.dequeue();
			return null;
	}},
	removeGrid: function(grid) { with(this) {
		_gridsListAuto.eraseItemFromListAuto(grid._gridId);
		grid._keyboard.free = true;						//release if keys used
		_freeColors.putInList(grid._colorTxt, grid._colorTxt);//we reput color on free colors
		_playersCount--;
		grid.destroyGrid();	//stops timers etc..
		organizeGrids({oldGrid:true});
	}},
	organizeGrids: function(att) { with(this) {	//horizontal organization only, zoomToFit makes the correct zoom
		GFX.zoomToFit(_playersCount);
		MAIN_MENU._domNode._childs.background.redrawNode();	//redraw background
		let realIntervalX = (GFX._pxGameWidth-(GFX._pxFullGridWidth*_playersCount)) / (_playersCount+1);
		if (att.newGrid || att.oldGrid) {
			if (att.newGrid)
				if (_playersCount%2) {	//from left or right
					att.newGrid._gridId = _gridsListAuto.putFirst(att.newGrid);
					att.newGrid._domNode.moveCenterTo(-GFX._pxFullGridWidth, null);
				} else {
					att.newGrid._gridId = _gridsListAuto.putLast(att.newGrid);
					att.newGrid._domNode.moveCenterTo(GFX._pxGameWidth+GFX._pxFullGridWidth, null);				
				}
			_gridsListAuto.resetNext();
			let grid;
			let count = 0;
			while (grid = _gridsListAuto.next()) {
				count++;
				grid._domNode.redrawNode();				//we change all sizes
				grid._domNode.moveCenterTo(null, GFX._pxTopMenuZoneHeight + GFX._pxHalfGameHeight);
				grid._vector = [
					count*realIntervalX + (count-1)*GFX._pxFullGridWidth - grid._domNode.getX(),
					0	];
			}
			//old: _gameEventsQueue.execNowOrEnqueue(_anims.moveGridsAnim, _anims.moveGridsAnim.startAnim); //#DEBUG above, $alert(att);
			_anims.moveGridsAnim.startAnim();
			if (att.newGrid)
				att.newGrid.startGrid();	//enqueue?
		} else {
			let grid;
			let count = 0;
			_gridsListAuto.resetNext();
			while (grid = _gridsListAuto.next()) {
				count++;
				grid._domNode.redrawNode();	//we change all sizes
				grid._domNode.moveCenterTo(null, GFX._pxTopMenuZoneHeight + GFX._pxHalfGameHeight);
				grid._domNode.moveNodeTo(count*realIntervalX + (count-1)*GFX._pxFullGridWidth, null);
			}
		}
	}},
	averageBlocksByPlayingGrid: function() { with(this) {
		let allGridsBlocksCount = 0;
		let playingGridsCount = 0;
		let grid;
		_gridsListAuto.resetNext();
		while (grid = _gridsListAuto.next())
			if (grid._gridState == GRID_STATES.playing) {
				playingGridsCount ++;
				allGridsBlocksCount += grid._lockedBlocks._blocksCount;
			}
		return allGridsBlocksCount/playingGridsCount;
	}},
	startGame: function() { with(this) {
		_gameState = GAME_STATES.running;
		AUDIO.audioStop('musicMusic');
		//AUDIO.audioPlay('musicMusic');
	}},
	chooseAction: function(event) { with(this) {
		_gridsListAuto.runForEachListElement( function(o){ o.chooseAction(event); } );
	}},
	transferRows: function(from, count) { with(this) {	//from grid
		let toGrid = [];
		for (let p in _gridsListAuto.listAutoTable)
			if ( (_gridsListAuto.listAutoTable[p] != from) && (_gridsListAuto.listAutoTable[p]._gridState == GRID_STATES.playing) )
				toGrid.push(_gridsListAuto.listAutoTable[p]);
		if (toGrid.length)
			while ((count--) > 0) { //decrement AFTER evaluation, equivalent to 'while (count--)'
				//toGrid[ (Math.floor(Math.random()*toGrid.length)+count) % toGrid.length ]._lockedBlocks.put1NewRisingRow(); //same call as earlier
				let destGrid = toGrid[ (Math.floor(Math.random()*toGrid.length)+count) % toGrid.length ];
				destGrid._gridEventsQueue.execNowOrEnqueue(
					destGrid._lockedBlocks,
					destGrid._lockedBlocks.put1NewRisingRow ); //we exec or enqueue
			}	
	}},
};
//PENTOMINOES TIMER Class, to manage pentominoes mode, a special mode with 5 blocks shapes, which happens after a trigger
class PentominoesBriefMode {
	constructor() {
		this._pentoModeTimer = new Timer( function() {
			GAME._pentominoesBriefMode.finishPentoMode();	//run in this class, because not with this for Timer, to delete$$$$$
		}, 0 );
	}
	/*destroyPentoMode() { with(this) { //to replace by anim timer
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
				if (myGrid._gridState == GRID_STATES.playing) {
					myGrid._playedPolyominoesType = 'tetrominoes'
					myGrid._nextShapePreview.unMark(myGrid._nextShape); //to mark immediately next shape on preview
					myGrid._nextShape = new Shape(myGrid); //previous falling shape is garbage collected
					myGrid._nextShapePreview.mark(myGrid._nextShape);
				}
			});
	}
	runPentoMode(gridWichTriggeredPentoMode, clearedLinesCount) {
		if (this.isRunning()) this.finishPentoMode();
		GAME._gridsListAuto.runForEachListElement(
			(myGrid)=>{ //here, argument is used
				if (myGrid._gridState == GRID_STATES.playing) {
					myGrid._playedPolyominoesType = (myGrid != gridWichTriggeredPentoMode) ? 'pentominoes' : 'trominoes';
					myGrid._nextShapePreview.unMark(myGrid._nextShape); //to mark immediately next shape on preview
					myGrid._nextShape = new Shape(myGrid); //previous falling shape is garbage collected
					myGrid._nextShapePreview.mark(myGrid._nextShape);
				}
			}, gridWichTriggeredPentoMode ); //this way to pass argument1 to pointed function
		this._pentoModeTimer.setPeriod(DURATIONS.pentominoesModeDuration*clearedLinesCount); //*3 for 3 lines cleared, *4 for 4 lines cleared
		this._pentoModeTimer.runTimer();
		gridWichTriggeredPentoMode._anims.pentominoesModeAnim.setDuration(DURATIONS.pentominoesModeDuration*clearedLinesCount);
		gridWichTriggeredPentoMode._anims.pentominoesModeAnim.startAnim();
	}
}
//TETRIS GRID Class
function Grid(keyboard, colorTxt) { with(this) {
	_colorTxt						= colorTxt;
	_color							= GFX._colors[_colorTxt];
	_keyboard						= keyboard;									//[up down left right]
	_lockedBlocks					= new LockedBlocks(this);
	_gridEventsQueue				= new EventsQueue();
	_animsStack						= [];
	_lockedShapes					= [];
	//_rowsToClearArray				= [];										//no row to clear at the begining
	_rowsToClearList				= new List();
	_matrix = new Array(RULES.horizontalBoxesCount + 2);//12 columns, left and right boxes as margins columns, program fail if removed
	for (let i=0;i < _matrix.length;i++) {
		_matrix[i] = [];
		for (let j=GAME._matrixBottom;j <= GAME._matrixHeight;j++) //height -1 to +(2x20)
			_matrix[i][j] = null;
	}
	_dropTimer = new Timer( function() {with(this) {
		_fallingShape.fallingShapeTriesMove(0,-1); }},
		DURATIONS.initialDropPeriod );
	_softDropTimer = new Timer( function() {with(this) {
		_fallingShape.startSoftDropping(); }},
		DURATIONS.softDropPeriod );
	_domNode = MAIN_MENU._domNode.newChild({		//creating gmae graphics
		width: '_pxFullGridWidth', height: '_pxFullGridAndCeil',
		frameZone: {
			x:'_pxGridBorder', y:'_pxCeilHeight',
			width:'_pxGridWidth', height:'_pxGridHeight',
			overflow:'hidden',
			back: {	//tetris background
				background: {type:'canvas', gfx:GFX._gfxGridBackground},				
				ghostBlocks:{},
				realBlocks: {}	}	},
		frontZone: {
			y:'_pxCeilHeight', type:'canvas', gfx:GFX._gfxGridFront, height: '_pxFullGridHeight' },
		controlZone: {
			y:'_YPreviewPosition', width:'_XPreviewPosition', height:'_pxPreviewFullSize', vertical_align:'middle' },
		nextShapePreview: {
			x:'_XPreviewPosition', y:'_YPreviewPosition',
			type:'canvas', width:'_pxPreviewFullSize', height:'_pxPreviewFullSize', gfx:GFX._gfxPreviewBlock },
		scoreZone: {
			x:'_XScorePosition', y:'_YScorePosition',
			width:'_XPreviewPosition', height:'_pxPreviewFullSize', vertical_align:'middle'	},
		messageZone: {
			y:'_pxCeilHeight', width:'_pxFullGridWidth', height:'_pxFullGridHeight', vertical_align:'middle' }
	});
	_domNode._childs.frontZone.drawGfx({col:_colorTxt});
	_realBlocksNode = _domNode._childs.frameZone._childs.back._childs.realBlocks; //shortcut
	_ghostBlocksNode = _domNode._childs.frameZone._childs.back._childs.ghostBlocks; //shortcut
	_domNode._childs.frameZone._childs.back._childs.background.drawGfx({col:_colorTxt});
	_domNode._childs.controlZone.createText(FONTS.scoreFont, 'bold', rgbaTxt(_color.light), '0 0 0.4em '+rgbaTxt(_color.light));	//_textCharCountWidthMin : 1 or 7
	_domNode._childs.controlZone.setTextIntoSizedField({
		text: _keyboard.symbols[0]+'</BR>'+_keyboard.symbols[2]+' '+_keyboard.symbols[1]+' '+_keyboard.symbols[3],
		fieldCharCount: 8 }); //up down left right
	_domNode._childs.scoreZone.createText(FONTS.scoreFont, 'bold', rgbaTxt(_color.light), '0 0 0.4em '+rgbaTxt(_color.light), 3);
	_domNode._childs.messageZone.createText(FONTS.messageFont, 'bold', rgbaTxt(_color.light), '0.05em 0.05em 0em '+rgbaTxt(_color.dark));
	_nextShapePreview = new NextShapePreview(this);
	_anims = {};	//need to initialize before creating new score which contains anim
	_score = new Score(this);	//contains animation, 
	_anims.quakeAnim = new Animation({
		animateFunc: function(animOutput) { with(this) {							//to use context of this Animation
			_domNode._childs.frameZone._childs.back.moveTemporaryRelatively(0, GFX._pxBoxSize*2/4*animOutput);	//default 2/4 or 3/4, proportionaly to deep 20 _domNode use context of this Grid
		}},
		endAnimFunc: function() { with(this) {
			_domNode._childs.frameZone._childs.back.moveTemporaryRestore();
			gridAnimsStackPop();												//to have exclusive quake anim
		}},
		timingAnimFunc: function(x) {
			return Math.sin(x*Math.PI);									//or return Math.sin(x*Math.PI*2)*(1-x);
		},
		animDuration: DURATIONS.gridQuakeDuration
	});
	_anims.pentominoesModeAnim = new Animation({
		animateFunc: function(animOutput) { with(this) {							//to use context of this Animation //console.log(animOutput); $alert(animOutput);
			_domNode._childs.frontZone.set({opacity: Math.abs(animOutput)});
		}},
		endAnimFunc: function() { with(this) {
			_domNode._childs.frontZone.set({opacity: 1});				//1 = totalement opaque, visble
		}},
		timingAnimFunc: function(x) {									//console.log(x); $alert(x);
			return -Math.cos(Math.pow(3,(x*3))*Math.PI)/2+0.5;			//f(x)=-cos(3^(x*3)*pi)/2+0.5
		},
		animDuration: 0	//need to set duration for this animation before running
	});
	_anims.clearRowsAnim = new Animation({ //loading animation to use later
		animateFunc: function(animOutput) { with(this) { //called n times recursively, this: current object AND Animation
			//for (let r in _rowsToClearArray) //for each row to clear
			//	for (let i=1;i <= RULES.horizontalBoxesCount;i++) //for each column
			//		_matrix[i][_rowsToClearArray[r]]._domNode.setScale(animOutput); //with blocks' _domNodes, programs goes here for each block of each row to clear
			for (let r in _rowsToClearList.listTable) //for each row to clear
				for (let i=1;i <= RULES.horizontalBoxesCount;i++)
					_matrix[i][r]._domNode.setScale(animOutput); //with blocks' _domNodes, programs goes here for each block of each row to clear
		}},
		endAnimFunc: function() { with(this) { //NOT GRAPHIC PROCESS
			//_rowsToClearArray.forEach(function(myRow) {
			//	clearFullRowAfterClearingAnim(myRow); }); //now erasing animated cleared rows datas //bad code:_rowsToClearArray = [];
			for (let r in _rowsToClearList.listTable)
				clearFullRowAfterClearingAnim(r); //so erasing previous
			_lockedBlocks.chainSearchOrphan(SEARCH_MODE.down);
			gridAnimsStackPop();
		}},
		timingAnimFunc: function(x) {
			return 1 - Math.pow(x, 2);
		},
		animDuration: DURATIONS.movingGridsDuration
	});
	_anims.shapeHardDropAnim = new Animation({	//animation for 1 shape, falling or after clearing
		animateFunc: function(animOutput) { with(this) {
			for (let p in _lockedShapes)
				_lockedShapes[p]._domNode.moveNodeTo(0, - _lockedShapes[p]._jVector * animOutput * GFX._pxBoxSize);
		}},
		endAnimFunc: function() { with(this) {
			for (let p in _lockedShapes) { //fetch rows to remove
				_lockedShapes[p]
					.putShapeInRealBlocksNode() //remove from moving div
					.drawShape()
					._domNode.destroyDomNode();
			}
			_lockedShapes = [];
			gridAnimsStackPush(_anims.quakeAnim, _anims.quakeAnim.startAnim); //startAnim() function stacked
			gridAnimsStackPush(AUDIO, AUDIO.audioPlay, 'landFX'); //we stack AUDIO.audioPlay('landFX');
			gridAnimsStackPop();
			//old: _anims.quakeAnim.startAnim();
			//old: gridAnimsStackPop();
		}},
		timingAnimFunc: function(x) {
			return Math.pow(x, 3);
		},
		animDuration: DURATIONS.hardDropDuration
	});
	_anims.rising1RowAnim = new Animation({
		animateFunc: function(animOutput) { with(this) {		//"this" display animation instancied object
			for (let p in _lockedShapes)
				_lockedShapes[p]._domNode.moveNodeTo(0, - _lockedShapes[p]._jVector * animOutput * GFX._pxBoxSize);
		}},
		endAnimFunc: function() { with(this) {
			for (let p in _lockedShapes) {
				_lockedShapes[p].putShapeInRealBlocksNode();
				_lockedShapes[p].drawShape();
				_lockedShapes[p]._domNode.destroyDomNode(); //_isLockedShape always true, so optimized
			}
			_lockedShapes = [];
			_ghostBlocksNode.show();
			gridAnimsStackPop(); //unstack all countandclearrows and _gridEventsQueue.dequeue() in stack
		}},
		timingAnimFunc: function(x) {
			return x; //linear rising of rows, not (2*Math.sqrt(x)-x);
		},
		animDuration: DURATIONS.rising1RowDuration
	});
	_anims.shapeRotateAnim = new Animation({ 	//loading animation to use later
		startAnimFunc: function() { with(this) {
			_fallingShape._domNode.setTransformOrigin(GFX._gfxBlock.fx(_fallingShape._iPosition+0.5)+"px "+GFX._gfxBlock.fy(_fallingShape._jPosition-0.5)+"px");
		}},
		animateFunc: function(animOutput) { with(this) {
			if ((_fallingShape._pivotsCount==2) && (_fallingShape._pivot==0))
				_fallingShape._domNode.setRotate(-90 + animOutput);
			else
				_fallingShape._domNode.setRotate(90 - animOutput);
		}},
		endAnimFunc: function() { with(this) {
			_fallingShape._domNode.delTransform();	//see if draw prefered
		}},
		timingAnimFunc: function(x) {
			return -90*(x-2*Math.sqrt(x));
		},
		animDuration: DURATIONS.rotatingDuration
	});
	_anims.messageAnim = new Animation({
		startAnimFunc: function(textInfos) { with(this) {
			_domNode._childs.messageZone.setTextIntoSizedField.call(_domNode._childs.messageZone, textInfos);
		}},
		animateFunc: function(animOutput) { with(this) {
			_domNode._childs.messageZone.moveTemporaryRelatively(0, animOutput*3*GFX._pxBoxSize);//_YMessagePosition);
			_domNode._childs.messageZone.set({opacity: 1-Math.abs(animOutput)});	//animOutput from -1 to +1
		}},
		endAnimFunc: function() { with(this) {
			_domNode._childs.messageZone.moveTemporaryRestore();
			_domNode._childs.messageZone.set({opacity: 0});
			_gridMessagesQueue.dequeue();
		}},
		timingAnimFunc: function(x) {
			return Math.pow(2*(x-0.5), 3);	//bad effect: return (x<0.3)?Math.sin(x*Math.PI*8)*(0.3-x):0;
		},
		animDuration: DURATIONS.centralMessagesDuration,
	});
	_gridMessagesQueue = new EventsQueue();	//used only when lost
}};
Grid.prototype = {
	_gridId							: null,
	_gridState						: GRID_STATES.connected,
	_colorTxt						: null,
	_color							: null,
	_domNode						: null,
	_realBlocksNode					: null,
	_ghostBlocksNode				: null,
	_fallingShape					: null,			//falling shape or locked shapes prepared to fall after sweeping
	_lockedShapes					: null,			
	_nextShape						: null,			//next shape about to be place
	_nextShapePreview				: null,			//preview on top of grid
	_score							: null,
	_dropTimer						: null,
	_softDropTimer					: null, 		//animation
	_softDropping					: false,		//animation
	_softDroppingReloaded			: true,			//keyup
	_playedPolyominoesType			: 'tetrominoes',//starts tetris with 4 blocks shape
	_keyboard						: null,
	_lockedBlocks					: null,			//placed blocks in grid or locked?
	_matrix							: null,
	_anims							: null,
	_animsStack						: null,			//to stack anims sequences of (hardDrop > quake)0-1 > (clearRows > hardDrop > quake)0-* : riseGreyBlocks actions are stuck
	_gridEventsQueue				: null,			//queue for rising rows, etc..
	_gridMessagesQueue				: null,			//used only when lost $$$
	//_rowsToClearArray				: null,			//arrays to prepare rows to clear to anim when animating clearing rows
	_rowsToClearList				: null,			//arrays to prepare rows to clear to anim when animating clearing rows
	_vector							: null,
	destroyGrid: function() { with(this) {
		if (GAME._gameState != GAME_STATES.paused)
			pauseOrResume();						//to stop all timers, all anims
		_lockedBlocks.destroyLockedBlocks();
		_domNode.destroyDomNode();
	}},
	isBusy: function() { with(this) { //if grid is busy, doesn't care about message displaying
		return ( (_gridState != GRID_STATES.playing) //if grid is losing/finishing, return busy
			|| _anims.clearRowsAnim.isAnimating()
			|| _anims.shapeHardDropAnim.isAnimating()
			|| _anims.rising1RowAnim.isAnimating()
			|| _anims.quakeAnim.isAnimating() //to have exclusive quake anim
		);
	}},
	gridAnimsStackPush: function(o, func, param) { with(this) {//o object who contains func method, this by default
		_animsStack.push([o, func, param]);
	}},
	gridAnimsStackPop: function() { with(this) {
		while (!isBusy() && (_animsStack.length > 0)) {//unstack only when not busy, 2nd condition equivalent to while (_animsStack.length)
			let last = _animsStack.pop();
			last[1].call(last[0], last[2]);
		}
		if (_animsStack.length == 0) //dequeue at end of anims stack, equivalent to (!_animsStack.length), #DEBUG before
			_gridEventsQueue.dequeue();
	}},
	startGrid: function() { with(this) {
		if (GAME._gameState == GAME_STATES.waiting)
			GAME.startGame();
		_gridState = GRID_STATES.playing
		_nextShape = new Shape(this);
		newFallingShape();
		//putRowsAtStart, 0 when no shape
		let myRowsCount = Math.round( GAME.averageBlocksByPlayingGrid() //average blocks per grid
			/ (RULES.horizontalBoxesCount * (1-RULES.risingRowsHolesCountMaxRatio)) ); //divided by 10, or 10*(100%-30%) = 7
		while (myRowsCount-- > 0) //we put same quanity of rows
			_gridEventsQueue.execNowOrEnqueue(_lockedBlocks, _lockedBlocks.put1NewRisingRow);
		//end putRowsAtStart
		if (GAME._gameState == GAME_STATES.paused)
			pauseOrResume();
	}},
	newFallingShape: function() { with(this) {
		_fallingShape = _nextShape;
		_fallingShape.putShapeInGame();
		if (_fallingShape.canMoveToPlaced(0, 0)) {//test if lost: can move at starting position, so it's playing
			_nextShapePreview.unMark(_fallingShape); //change current shape preview by a new shape
			_nextShape = new Shape(this); //change current shape preview by a new shape
			_nextShapePreview.mark(_nextShape); //change current shape preview by a new shape
			_fallingShape.moveAndPutShapeToPlaced(0, 0) //only place with call without previous removeShapeFromPlace()
				.drawShape()
				.drawGhostAfterCompute();
			_dropTimer.runTimer();
		} else { //it's lost
			_fallingShape.drawShape()
				.clearGhostBlocks()
				._domNode.set({opacity: GFX._lostShapeOpacity});
			lose();
		}
	}},
	lockFallingShapePrepareMoving: function() { with(this) { //can be called recursively, when falling shape or locked shapes in game hit floor
		gridAnimsStackPush(this, newFallingShape); //newFallingShape()
		_lockedShapes = []; //release for garbage collector
		_lockedShapes[_fallingShape._shapeIndex] = _fallingShape;
		if (!_fallingShape.finishSoftDropping(false)); //drop timer stopped without running again
			_dropTimer.finishTimer(); //drop timer stopped, others to end?
		_anims.shapeRotateAnim.endAnim(); //because made by drop period
		moveShapesInMatrix(_lockedShapes);
		if (_fallingShape._jVector == 0) { //if played single falling shape
			_fallingShape.putShapeInRealBlocksNode()
				._domNode.destroyDomNode();
			//AUDIO.audioPlay('landFX');
			_gridEventsQueue.execNowOrEnqueue(this, countAndClearRows);	//exec countAndClearRows immediately
		} else { //if locked shapes to drop, have to make animation before next counting
			gridAnimsStackPush(this, countAndClearRows); //firstly stack countAndClearRows() for later
			_gridEventsQueue.execNowOrEnqueue(_anims.shapeHardDropAnim, _anims.shapeHardDropAnim.startAnim); //secondly exec hard drop startAnim() immediately
			//sound played before after hardDrop and before Quake
		}
	}},
	moveShapesInMatrix: function(myShapes) { with(this) { //move locked shapes to drop (after clearing rows) into matrix
		myShapes.forEach( (myShape)=>{ myShape.removeShapeFromPlaced(); }) //move to a tested place
		myShapes.forEach( (myShape)=>{ myShape.moveAndPutShapeToPlaced(0, myShape._jVector, DROP_TYPES.hard); }) //move to placed on grid
	}},
	countAndClearRows: function() { with(this) { //locks block and computes rows to transfer and _scores
		//old: AUDIO.audioPlay('landFX');
		if (_fallingShape) //for recursive calls with fallingshape = null
			_fallingShape.clearGhostBlocks();
		//let rowsToClearCount = _rowsToClearArray.length;
		let rowsToClearCount = _rowsToClearList.listSize;
		if (rowsToClearCount > 0) { //if there's rows to clear
			_score.combosCompute();
			_score.computeScoreForSweptRowsAndDisplay(rowsToClearCount);
			if (rowsToClearCount >= RULES.transferRowsCountMin)	//if 2 rows cleared, tranfer rule
				GAME.transferRows(this, rowsToClearCount);
			if (rowsToClearCount >= RULES.pentominoesRowsCountMin) {//if 3 rows cleared, pentominoes rule: player have 3 blocks per shape, and others players have 5 blocks per shape
				GAME._pentominoesBriefMode.runPentoMode(this, rowsToClearCount);//duration of pentominoes is proportional to rowsToClearCount, 3 or 4, it auto stops by timer
				AUDIO.audioPlay('quadrupleFX');
			} else
				AUDIO.audioPlay('clearFX');
			_fallingShape = null; //to avoid combo reset scores
			_anims.clearRowsAnim.startAnim();
		} else {
			_score.displays(); //to refresh score
			if (_fallingShape)
				_score.combosReset();
			gridAnimsStackPop();
		}
	}},
	lose: function() { with(this) {	//lives during _score duration
		_score.displays();
		_anims.messageAnim.setDuration(DURATIONS.lostMessageDuration); //empty queues necessary?
		_gridMessagesQueue.execNowOrEnqueue(
			_anims.messageAnim,
			_anims.messageAnim.startAnim,
			[{text: 'You<BR/>lose', fieldCharCount: 4}]);
		_gridMessagesQueue.execNowOrEnqueue(this, afterLost_);
		//AUDIO.audioStop('musicMusic');
		_gridState = GRID_STATES.lost;
		for (let p in _lockedBlocks._lockedBlocksArray)
			_lockedBlocks._lockedBlocksArray[p].setColor('grey');
	}},
	setVectorLost_: function() { with(this) {
		_vector = [0,	-GFX._pxTopMenuZoneHeight -GFX._pxGameHeight	]; //prepare vector
		GAME._gameEventsQueue.dequeue();
	}},
	afterLost_: function() { with(this) {
		GAME._gameEventsQueue.execNowOrEnqueue(this, setVectorLost_);
		GAME._gameEventsQueue.execNowOrEnqueue(GAME._anims.moveGridsAnim, GAME._anims.moveGridsAnim.startAnim);	//prepare move up
		GAME._gameEventsQueue.execNowOrEnqueue(GAME, GAME.removeGrid, [this]);	//prepare remove
	}},
	putBlockInMatrix: function(block) { with(this) { //only put placed block on grid, not testing one, set to block
		_matrix[block._iPosition][block._jPosition] = block;
	}},
	removeBlockFromMatrix: function(block) { with(this) { //only remove placed block on grid, not testing one, set to null
		_matrix[block._iPosition][block._jPosition] = null;
	}},
	clearFullRowAfterClearingAnim: function(jRow) { with(this) { //we suppose that row is full
		for (let i=1;i <= RULES.horizontalBoxesCount;i++)
			_matrix[i][jRow].destroyBlock();
	}},
	chooseAction: function(event) { with(this) {
		if (event.type == 'keyup') {								//touche relevée
			if (event.keyCode == _keyboard.keys[1]) 
				_softDroppingReloaded = true;
		}
		else if (!isBusy())
			switch (event.keyCode) {
				case _keyboard.keys[0]: _fallingShape.fallingShapeTriesRotate();	break; //up
				case _keyboard.keys[1]: _fallingShape.beginSoftDropping();			break; //down
				case _keyboard.keys[2]: _fallingShape.fallingShapeTriesMove(-1,0);	break; //left
				case _keyboard.keys[3]: _fallingShape.fallingShapeTriesMove(1,0);	break; //right
			}
	}},
	pauseOrResume: function() { with(this) {	//pause or resume this grid
		for (let p in _anims) //_anims is object, not array, contains animations of this grid
			_anims[p].pauseOrResume();
		_softDropTimer.pauseOrResume();
		_dropTimer.pauseOrResume();
	}}
};
//TETRIS SHAPE Class
function Shape(grid, group=false) { //default falling shape means not group argument
	this._grid = grid;
	this._shapeIndex = GAME._shapeIdTick++;
	if (!group)
		this.newControlledShape_();
	else
		this.newShapeForExistingLockedBlocks_(group);	//old: this[shapeOrChain](group);
}
Shape.prototype = {
	_grid						: null,
	_shapeIndex				: null,
	_iPosition					: null,
	_jPosition					: null,
	_shapeType					: null,
	_pivotsCount				: null,
	_pivot						: null,
	_colorTxt					: null,
	_color						: null,
	_shapeBlocks				: null,
	_polyominoBlocks			: null, //READ ONLY, reference that points to current shape in GAME shapes store
	_ghostBlocks				: null, //shadowed blocks
	_domNode					: null,
	_jVector					: 0, //vector upper (+) and under (-) shape
	newControlledShape_: function() {	//pick a new shape falling ramdomly (for next part) to control fall
		this._iPosition				= GAME._iPositionStart;
		this._jPosition				= GAME._jPositionStart;
		this._shapeType				= GAME._playedPolyominoesType[this._grid._playedPolyominoesType].index //to reach right polyomino type
			+ Math.floor(Math.random() * GAME._playedPolyominoesType[this._grid._playedPolyominoesType].count);
		this._pivotsCount			= GAME._gameShapesWithRotations[this._shapeType].length;
		this._pivot					= Math.floor(Math.random() * this._pivotsCount);
		this._colorTxt				= GAME._storedPolyominoes[this._shapeType].color;
		this._color					= GFX._colors[this._colorTxt];
		this._polyominoBlocks		= GAME._gameShapesWithRotations[this._shapeType][this._pivot]; //refers to current shape in stored in GAME, it's a shortcut
		//this._polyominoBlocks		= [...GAME._gameShapesWithRotations[this._shapeType][this._pivot] ]; or .slice(1) //cloning array of shapes with rotations, useless
	},
	newShapeForExistingLockedBlocks_: function(group) { //shape prepared to fall after clearing rows, need to be called from down to upper
		this._domNode				= this._grid._realBlocksNode.newChild({});
		this._shapeBlocks			= group.shape;
		this._jPosition				= group.jMin;
		for (let b=0;b < this._shapeBlocks.length;b++)
			this._shapeBlocks[b]._shape = this; //link to shape
		this.putShapeNodeIn();
	},
	getjVectorUnderShape: function() {	//return negative slots count from falling shape to floor where it can be placed
		let result = 0;
		while (this.canMoveFromPlacedToPlaced(0, --result));	//compute result decrement BEFORE calling function
		return (++result);								//compute result increment BEFORE calling function
	},
	putShapeInGame: function() {
		this._shapeBlocks = new Array(this._polyominoBlocks.length);
		this._ghostBlocks = new Array(this._shapeBlocks.length); //without putPositions
		this._domNode = this._grid._realBlocksNode.newChild({});
		for (let b=0 ; b < this._shapeBlocks.length ; b++) {
			this._shapeBlocks[b] = new Block(
				BLOCK_TYPES.inShape, this,
				this._iPosition + this._polyominoBlocks[b][0],
				this._jPosition + this._polyominoBlocks[b][1],
				this._colorTxt);
			this._ghostBlocks[b] = new Block(
				BLOCK_TYPES.ghost, this._grid,
				this._iPosition + this._polyominoBlocks[b][0],
				this._jPosition + this._polyominoBlocks[b][1],
				this._colorTxt);
		}
		return this;
	},
	putShapeInRealBlocksNode: function() {
		this._shapeBlocks.forEach( (myBlock)=>{ myBlock.putBlockInRealBlocksNode(); });
		return this;
	},
	putShapeNodeIn: function() {
		this._shapeBlocks.forEach( (myBlock)=>{ myBlock.putBlockNodeIn(this._domNode); }, this); //this == Shape context necessary fot this._domNode
		return this;
	},
	drawShape: function() { //show hidden shapes
		this._shapeBlocks.forEach( (myBlock)=>{ myBlock.drawBlock(); });
		return this;
	},
	drawGhostAfterCompute: function() {
		if (this._ghostBlocks) {
			this._jVector = this.getjVectorUnderShape(); //if not not placed so deleted so ghost deleted
			this._shapeBlocks.forEach(function(myBlock, b) {
				this._ghostBlocks[b]._iPosition = this._shapeBlocks[b]._iPosition;
				this._ghostBlocks[b]._jPosition = this._shapeBlocks[b]._jPosition + this._jVector;
				this._ghostBlocks[b].drawBlock();
			}, this) //this = Window context by default, puting this here makes this == Shape
		}
		return this;
	},
	clearGhostBlocks: function() {
		if (this._ghostBlocks) {								//if ghost blocks (not in chain)
			this._ghostBlocks.forEach(function(myBlock){ myBlock._domNode.destroyDomNode(); });
			this._ghostBlocks = null;
		}
		return this;
	},
	moveFalling: function(iRight, jUp) {	//iRight == 0 or jUp == 0, jUp negative to fall
		this._grid._anims.shapeRotateAnim.endAnim();			//comment/remove this line to continue animating rotation when drop #DEBUG
		this._iPosition += iRight;
		this._jPosition += jUp;
		this.removeShapeFromPlaced();
		this.moveAndPutShapeToPlaced(iRight, jUp, DROP_TYPES.soft);
		this.drawShape();
		if (jUp == 0) this.drawGhostAfterCompute(); //if we move left or right
		else this._jVector -= jUp; //if ghostshape covered, new block layer hides it
		AUDIO.audioPlay('moveFX');
		return this;
	},
	removeShapeFromPlaced: function() { //move in testing mode
		this._shapeBlocks.forEach(
			(myBlock)=>{
				this._grid.removeBlockFromMatrix(myBlock);
				this._grid._lockedBlocks.removeBlockFromLockedBlocks(myBlock);
			}, this);
		return this;
	},
	moveAndPutShapeToPlaced: function(iRight, jUp, dropType=false) { //move to placed
		this._shapeBlocks.forEach(
			(myBlock)=>{
				myBlock._iPosition += iRight; //updating position
				myBlock._jPosition += jUp; //updating position //after 'without this' change, this is Windows object here
				myBlock._grid.putBlockInMatrix(myBlock); //put to new slot
				myBlock._grid._lockedBlocks.putBlockInLockedBlocks(myBlock); //put block with new position
			});
		if (dropType && (jUp < 0))
			this._grid._score.computeScoreDuringDrop(-jUp, dropType); //function receive slots count traveled, and dropType
		return this;
	},
	canMoveFromPlacedToPlaced: function(iRight, jUp) { //can move into grid
		this.shapeSwitchFromTestToPlaced(false);
		let result = this.canMoveToPlaced(iRight, jUp);
		this.shapeSwitchFromTestToPlaced(true);
		return result;
	},
	canMoveToPlaced: function(iRight, jUp) {
		let result = true;
		for (let b=0;b < this._shapeBlocks.length;b++)
			if (!this._shapeBlocks[b].isFreeSlot(this._shapeBlocks[b]._iPosition + iRight, this._shapeBlocks[b]._jPosition + jUp)) {
				result = false;
				break;									//exit loop
			}
		return result;
	},
	fallingShapeTriesMove: function(iRight, jUp) {		//return true if moved (not used), called by left/right/timer
		if (this.canMoveFromPlacedToPlaced(iRight, jUp)) {
			if (iRight == 0)
				this._grid._dropTimer.runTimer();					//shape go down, new period
			else										//shape move side
				if (this._grid._softDropping)				//if falling
					this.finishSoftDropping(true);
			this.moveFalling(iRight, jUp);
		} else {										//shape can't move...
			if (jUp < 0)								//...player or drop timer try move down
				this._grid.lockFallingShapePrepareMoving();
		}
		return this;
	},
	rotateDataInMatrix: function() { //1 is clockwiseQuarters
		this._pivot = (this._pivot+1+this._pivotsCount) % this._pivotsCount;//we test need rotating in this.canShapeRotate()
		for (let b=0;b < this._shapeBlocks.length;b++) {
	        this._grid.removeBlockFromMatrix(this._shapeBlocks[b]);
			this._grid._lockedBlocks.removeBlockFromLockedBlocks(this._shapeBlocks[b]);
			this._shapeBlocks[b]._iPosition = this._iPosition + GAME._gameShapesWithRotations[this._shapeType][this._pivot][b][0];
			this._shapeBlocks[b]._jPosition = this._jPosition + GAME._gameShapesWithRotations[this._shapeType][this._pivot][b][1];
	        this._grid.putBlockInMatrix(this._shapeBlocks[b]);
			this._grid._lockedBlocks.putBlockInLockedBlocks(this._shapeBlocks[b]);
		}
		return this;
	},
	canShapeRotate: function() { //1 is clockwiseQuarters
		if (this._pivotsCount == 1)
			return false;
		else {
			let result = true;
			this.shapeSwitchFromTestToPlaced(false);
			for (let b=0;b < this._shapeBlocks.length;b++)
				if ( !this._shapeBlocks[b].isFreeSlot(
					this._iPosition + GAME._gameShapesWithRotations[this._shapeType][(this._pivot+1) % this._pivotsCount][b][0],
					this._jPosition + GAME._gameShapesWithRotations[this._shapeType][(this._pivot+1) % this._pivotsCount][b][1]
					) ) {
						result = false;
						break; //exit loop
				}
			this.shapeSwitchFromTestToPlaced(true);
			return result;
		}
	},
	fallingShapeTriesRotate: function() { //do rotation if possible, else nothing
		this.finishSoftDropping(true); //stopping fall by continuing normal timer
		if (this.canShapeRotate()) { //+this._pivotsCount before modulo % ?
			this._grid._anims.shapeRotateAnim.endAnim();
			this.rotateDataInMatrix();
			this.drawShape();
			this._grid._anims.shapeRotateAnim.startAnim();
			this.drawGhostAfterCompute();
			AUDIO.audioPlay('rotateFX');
		}
		return this;
	},
	shapesHitIfMove: function(iRight, jUp) {	//if all shapes AND moving verticaly ; test only and assign getjVectorUnderShape if necessary
		this.shapeSwitchFromTestToPlaced(false);
		let shapesHit = [];
		let blockHit;
		for (let b=0;b < this._shapeBlocks.length;b++) {
			blockHit = this._grid._matrix[this._shapeBlocks[b]._iPosition + iRight][this._shapeBlocks[b]._jPosition + jUp];
			if ( ( blockHit != null) && (blockHit._shape._jVector != 1) ) {	//check if jvector not +1
					blockHit._shape._jVector = 1;
					this._grid._lockedShapes[blockHit._shape._shapeIndex] = blockHit._shape;
					shapesHit.push(blockHit._shape);
				}
		}
		this.shapeSwitchFromTestToPlaced(true);
		while (shapesHit.length > 0) //equivalent to while (shapesHit.length)
			shapesHit.pop().shapesHitIfMove(iRight, jUp);
		return this;
	},
	shapeSwitchFromTestToPlaced: function(fromTestToPlaced) {
		this._shapeBlocks.forEach( (myBlock)=>{ myBlock.blockSwitchFromTestToPlaced(fromTestToPlaced); })  //only called here
		return this;
	},
	beginSoftDropping: function(force) {		//full falling, called by keydown, call falling()
		if (!this._grid._softDropping && (this._grid._softDroppingReloaded || force) ) {	//if not falling and reloaded
			this._grid._softDroppingReloaded = false;			//keydown
			if (this.canMoveFromPlacedToPlaced(0, -1))
				this.startSoftDropping();								//we run fall
			else											//if shape is on floor and wants fall
				this._grid.lockFallingShapePrepareMoving();
		} else if (this._grid._softDropping) {
				this._grid._softDroppingReloaded = false;
				this.finishSoftDropping();
				this._grid.lockFallingShapePrepareMoving();
			}												//nothing if key stay pressed
		return this;
	},
	startSoftDropping: function() {					//full falling iterative
		this._grid._dropTimer.finishTimer();
		this._grid._softDropping = true;			
		if (this.canMoveFromPlacedToPlaced(0, -1)) {
			this.moveFalling(0, -1);
			this._grid._softDropTimer.runTimer();
		} else
			this.finishSoftDropping(true);						//ends fall and launching drop timer
		return this;
	},
	finishSoftDropping: function(keep) {		//stop fall in all cases, keep if new period, return false if not falling
		if (this._grid._softDropping) {
			this._grid._softDropTimer.finishTimer();
			this._grid._softDropping = false;
			if (keep)
				this._grid._dropTimer.runTimer();						//shape can move after fall or stopped
		}
		return this; //this._grid._softDropping;
	},
	hardDropping: function() {
		this._grid._dropTimer.finishTimer();
		this.finishSoftDropping();
		this._grid.lockFallingShapePrepareMoving();
		return this;
	}
};
//TETRIS NEXT SHAPE PREVIEW Class
class NextShapePreview {
    constructor(grid) {
        this._grid = grid;
        this._domNode = this._grid._domNode._childs.nextShapePreview;
        for (let i=-GFX._shapesSpan;i <= GFX._shapesSpan;i++)
            for (let j=-GFX._shapesSpan;j <= GFX._shapesSpan;j++)
                this._domNode.drawGfx({fx: i, fy: j, col: this._grid._colorTxt, __onOff: false}); //off
    }
	mark(shape) {
        for (let b=0;b < shape._polyominoBlocks.length;b++)
			this._domNode.drawGfx({fx: shape._polyominoBlocks[b][0], fy: shape._polyominoBlocks[b][1], col: this._grid._colorTxt, __onOff: true}); //on
	}
	unMark(shape) {//optimized to remove only current previewed shape, and not all preview
		for (let b=0;b < shape._polyominoBlocks.length;b++)
			this._domNode.drawGfx({fx: shape._polyominoBlocks[b][0], fy: shape._polyominoBlocks[b][1], col: this._grid._colorTxt, __onOff: false }); //off
	}
}
//LOCKED BLOCKS Class, for locked blocks on the ground
function LockedBlocks(grid) { with(this) {
	_grid 				= grid;
	_lockedBlocksArray		= [];
	_lockedBlocksArrayByRow	= [];
	for (let row=GAME._matrixBottom;row <= GAME._matrixHeight;row++) {
		_lockedBlocksArrayByRow[row] = {};
		_lockedBlocksArrayByRow[row].rowBlocksCount = 0;	//0 boxes on floor (row=0) and 0 boxes on ceil (row=RULES.verticalBoxesCount+1)
		_lockedBlocksArrayByRow[row].blocks = [];
	}
}}
LockedBlocks.prototype = {
	_grid					: null,
	_lockedBlocksArray 		: null,
	_lockedBlocksArrayByRow	: null,								//-20 +40 +up que les boxes visibles
	_blocksCount 			: 0,
	_searchDirections 		: [[1, 0], [0, -1], [-1, 0], [0, 1]],//right, bottom, left, up
	destroyLockedBlocks: function() { with(this) {	//removes placed blocks
		for (let b=0;b < _lockedBlocksArray.length;b++)
			if (_lockedBlocksArray[b])	//if block exist
				_lockedBlocksArray[b].destroyBlock();
	}},
	putBlockInLockedBlocks: function(block) { with(this) {	//here we fill _lockedBlocksArray
		_lockedBlocksArray[block._blockIndex] = block;
		_blocksCount++;
		_lockedBlocksArrayByRow[block._jPosition].blocks[block._blockIndex] = block;
    	_lockedBlocksArrayByRow[block._jPosition].rowBlocksCount++;
		 if ( _lockedBlocksArrayByRow[block._jPosition].rowBlocksCount == RULES.horizontalBoxesCount ) //if full row to clear
		 //if (_grid._rowsToClearArray.lastIndexOf(block._jPosition) == -1)//$$$$$$$ if value not found
			_grid._rowsToClearList.putInList(block._jPosition, true); //true to put something
			//_grid._rowsToClearArray.push(block._jPosition); //preparing rows to clear, not negative values
	}},
	removeBlockFromLockedBlocks: function(block) { with(this) {
		delete _lockedBlocksArray[block._blockIndex]; //remove block from locked blocks
		delete _lockedBlocksArrayByRow[block._jPosition].blocks[block._blockIndex];
		_lockedBlocksArrayByRow[block._jPosition].rowBlocksCount--;
		_blocksCount--;
     	if ( _lockedBlocksArrayByRow[block._jPosition].rowBlocksCount == RULES.horizontalBoxesCount-1 ) //if we remove 1 from 10 blocks, it remains 9, so rowsToClear need to be updated
			_grid._rowsToClearList.eraseItemFromList(block._jPosition);
		//_grid._rowsToClearArray.splice( //necessary for correct exection
		//		_grid._rowsToClearArray.lastIndexOf(block._jPosition), 1 ); //we remove position of block._jPosition in _rowsToClearArra
				
	}},
	chainSearchOrphan: function(mode) { with(this) {
		if (mode == SEARCH_MODE.up)
			_grid._fallingShape.shapeSwitchFromTestToPlaced(false);//falling shape temporary removed, in testing mode
		let toProcessList = new List();
		//console.log('bbbbb');//$$$$$$$$
		//console.log(_lockedBlocksArray);
		//console.log('bb');
		for (let p in _lockedBlocksArray)
			if (_lockedBlocksArray[p] != undefined)
				toProcessList.putInList(_lockedBlocksArray[p]._blockIndex, _lockedBlocksArray[p]);
		let groups = []; //below we make isolated groups
		while (toProcessList.listSize > 0) { //equivalent to while (toProcessList.listSize)
			block = toProcessList.unList(); //block impossible to be null
			//block = toProcessList.listTable.shift(); toProcessList.listSize--;$$$$$$$$$$$$$
			let group = {jMin: RULES.verticalBoxesCount, shape: []};
			group.jMin = Math.min(group.jMin, block._jPosition);
			group.shape.push(block);
			for (let dir=0;dir < 4;dir++)
				chainSearch3Ways(block, group, toProcessList, dir); //chainSearch3Ways is recursive
			if ((( mode == SEARCH_MODE.down) && (group.jMin >= 2 ))
				|| mode == SEARCH_MODE.up )
				groups.push(group);
		}; //below, (groups.length == 0) occured 3 times between 2020 05 01 and 2020 04 30 with SEARCH_MODE.down == 1, no pb
		if (groups.length > 0) { //here we decide, we have at least 1 group equivalent. Normally, if (groups.length == 0) the mode == SEARCH_MODE.down, to avoid error of not calling pair shapeSwitchFromTestToPlaced false then true
			_grid._lockedShapes = [];
			groups.sort(function(a, b) {return a.jMin - b.jMin;}); //regular sort: lines full disapear
			let jEquals = []; let group, shape; //[if shape blocks color]			
			while (groups.length > 0) { //equivalent to while (groups.length)
				group = groups.shift(); //lower block
				shape = new Shape(_grid, group); //creating new dropable shape based on locked blocks ready to run drop animation
				_grid._lockedShapes[shape._shapeIndex] = shape; //add
				if (mode == SEARCH_MODE.down) { //[if shape blocks color] to sort equals
					if ( !jEquals.length || (group.jMin == jEquals[jEquals.length-1].jMin) )
						jEquals.push({jMin: group.jMin, shape: shape});
					else {
						tryMoveShapesSamejEquals(jEquals);
						jEquals = [{jMin: group.jMin, shape: shape}]; //[if shape blocks color]
					}
				}
			}
			if (mode == SEARCH_MODE.down) {
				tryMoveShapesSamejEquals(jEquals);
				_grid.gridAnimsStackPush(_grid, _grid.countAndClearRows); //countAndClearRows()
				_grid._anims.shapeHardDropAnim.startAnim();
			} else { //mode == SEARCH_MODE.up
				_grid._fallingShape.shapeSwitchFromTestToPlaced(true); //falling is back
				for (let p in _grid._lockedShapes)
					if (_grid._lockedShapes[p]._jPosition == 0) { //sub first row : j = 0
						_grid._lockedShapes[p]._jVector = 1;
						_grid._lockedShapes[p].shapesHitIfMove(0, 1);
					}
				_grid.moveShapesInMatrix(_grid._lockedShapes);
				if (_lockedBlocksArrayByRow[GAME._jPositionStart + GFX._shapesSpan + 1].rowBlocksCount)
					_grid.gridAnimsStackPush(_grid, _grid.lose); //lose()
				else if (_grid._fallingShape._shapeIndex in _grid._lockedShapes) { //if falling shape hit ground
					_grid.gridAnimsStackPush(_grid, _grid.newFallingShape); //newFallingShape()
					_grid.gridAnimsStackPush(_grid, _grid.countAndClearRows); //countAndClearRows()
				} else {
					_grid.gridAnimsStackPush(_grid._fallingShape, _grid._fallingShape.drawGhostAfterCompute); //drawGhostAfterCompute()
					_grid.gridAnimsStackPush(_grid._dropTimer, _grid._dropTimer.runTimer); //runTimer()
				}
			}
		}
	}},
	chainSearch3Ways: function(blockFrom, group, toProcessList, dir) { with(this) { //recursive
		let block = _grid._matrix
			[blockFrom._iPosition + _searchDirections[dir][0]]
			[blockFrom._jPosition + _searchDirections[dir][1]];
		if (block && toProcessList.listTable[block._blockIndex]	//[if shape blocks contact]
		&& (blockFrom._color == block._color) ) {				//[if shape blocks color]
			toProcessList.eraseItemFromList(block._blockIndex);	//call del from list
			group.jMin = Math.min(group.jMin, block._jPosition);
			group.shape.push(block);
			for (let delta=-1;delta <= 1; delta++)
				chainSearch3Ways(block, group, toProcessList, (dir+4+delta)%4);
		}
	}},
	tryMoveShapesSamejEquals: function(jEquals) { with(this) { //if shape blocks color
		let changed = true;
		while (changed) {
			changed = false;
			for (let p in jEquals) {
				let j = jEquals[p].shape.getjVectorUnderShape();
				if (j != 0) { //getjVectorUnderShape() negative or zero, equivalent if (j) or if (j < 0)
					jEquals[p].shape._jVector = j;
					jEquals[p].shape.removeShapeFromPlaced();
					jEquals[p].shape.moveAndPutShapeToPlaced(0, j, DROP_TYPES.hard);
					changed = true;
				}
			}
		}
	}},
	put1NewRisingRow: function() { with(this) { //will stack all countandclearrows callee
		_grid._anims.shapeRotateAnim.endAnim();
		_grid._dropTimer.finishTimer();
		_grid._softDropTimer.finishTimer();
		let rowFilledSlots, tempBlock; //prepareNewRisingRowAt_jPos0
		let risingRowsHolesCountMax = Math.round(RULES.risingRowsHolesCountMaxRatio * RULES.horizontalBoxesCount);
		rowFilledSlots = new Array(RULES.horizontalBoxesCount).fill(true); //we fill all table with any value, 10 slots
		for (let c=0 ; c < risingRowsHolesCountMax ; c++) //we delete min 1 and max 30% of 10 columns, means 1 to 3 holes max randomly
			delete rowFilledSlots[Math.floor(Math.random()*RULES.horizontalBoxesCount)]; //random() returns number between 0 (inclusive) and 1 (exclusive)
		rowFilledSlots.forEach( (uselessArg, slotIndex)=>{ //we skip delete rowFilledSlots
			tempBlock = new Block(BLOCK_TYPES.orphan, _grid, slotIndex+1, 0, 'grey'); }); //iPosition=[1-10], jPosition=0 just under game
		//end of prepareNewRisingRowAt_jPos0
		chainSearchOrphan(SEARCH_MODE.up); //old: _grid._ghostBlocksNode.hide(); hide before rising, not necessary
		_grid._anims.rising1RowAnim.startAnim();
	}}
};
//TETRIS BLOCK Class
class Block {
	constructor(blockType, shapeOrGridOwnerOfThisBlock, i, j, blockColorTxt) {
		this._blockType = blockType;
		this._iPosition	= i;
		this._jPosition	= j;
		this._grid;
		this._shape;
		this._domNode;
		this._colorTxt;
		this._color;
		this._blockIndex;
		this._domNode = new DomNode({type: 'canvas', width: '_pxBlockSize', height: '_pxBlockSize', gfx: GFX._gfxBlock}); //creating node
		this.setColor(blockColorTxt);
		switch (this._blockType) {
			case BLOCK_TYPES.ghost: //ghost shape for display only, no block index
				this._grid = shapeOrGridOwnerOfThisBlock;
				this.putBlockNodeIn(this._grid._ghostBlocksNode);
				this._domNode.set({opacity: GFX._ghostShapeOpacity});
				break;
			case BLOCK_TYPES.inShape: //falling ghape
				this._shape = shapeOrGridOwnerOfThisBlock;
				this._grid = this._shape._grid;
				this.putBlockNodeIn(this._shape._domNode);
				this._blockIndex = GAME._newBlockId++;
				break;
			case BLOCK_TYPES.orphan: //rising row coming from level j=0
				this._grid = shapeOrGridOwnerOfThisBlock; //use of shape as a grid, can be optimized
				this.putBlockInRealBlocksNode();
				this._blockIndex = GAME._newBlockId++;
				this._grid.putBlockInMatrix(this);
				this._grid._lockedBlocks.putBlockInLockedBlocks(this);
				this.drawBlock();
				break;
			default: console.log(this) //bug if this case occurs #DEBUG
		}
	}
	destroyBlock() { //destructor, remove block anywhere
		this._domNode.destroyDomNode();
		this._grid.removeBlockFromMatrix(this);
		this._grid._lockedBlocks.removeBlockFromLockedBlocks(this);
	}
	setColor(colorTxt)  {
		this._colorTxt = colorTxt;
		this._color = GFX._colors[this.colorTxt];
		this._domNode.drawGfx({col: this._colorTxt});
	}
	isFreeSlot(i, j)  { //can move on placed grid, put this into grid
		return (
			( (j >= 1) || (j >= this._jPosition) ) //j==0 is floor level, _jPosition useless$$$$$$$, same bug
			//   (j >= 1) //j=0 is floor level
			&& (i >= 1) //i=0 is left wall
			&& (i <=RULES.horizontalBoxesCount) //i==11 is right wall
			&& (this._grid._matrix[i][j] == null) //_matrix[i][j]==null means free
		);
	}
	drawBlock() { //here you can hide top block outside grid
		this._domNode.moveToStep(this._iPosition, this._jPosition);
	}
	blockSwitchFromTestToPlaced(fromTestToPlaced)  { //called only by pairs Shape.shapeSwitchFromTestToPlaced(false) then (true)
		if (fromTestToPlaced) {
			this._grid.putBlockInMatrix(this);
			this._grid._lockedBlocks.putBlockInLockedBlocks(this)
		} else {
			this._grid.removeBlockFromMatrix(this);
			this._grid._lockedBlocks.removeBlockFromLockedBlocks(this)
		}
	}
	putBlockInRealBlocksNode() {
		this._grid._realBlocksNode.putChild(this._domNode);
	}
	putBlockNodeIn(myParentNode) {
		myParentNode.putChild(this._domNode);
	}
};
//TETRIS SCORE Class, based on riginal Nintendo scoring system
class Score {
	constructor(grid) {
		this._grid = grid;
		this._combos = -1;
		this._score = 0; //public real score
		this._scoreShowed = 0;
		this._delta = 0;
		this._deltaShowed;
		this._factors = [null, 40, 100, 300, 1200, 6600]; //a single line clear is worth 400 points at level 0, clearing 4 lines at once (known as a Tetris) is worth 1200, max 5 lines with pento mode
		this._previousAnimDelta	= 0;
		this._totalSweptRows = 0;
		this._level = 0;
		this._grid._anims.score = new Animation({ //anim here because it's easier to access to score properties
			startAnimFunc: function() {
				this._deltaShowed = this._delta;
				this._delta = 0;
			},
			animateFunc: function(animOutput) {
				this.writeScore_(Math.ceil(this._scoreShowed + animOutput*this._deltaShowed));
			},
			endAnimFunc: function() {
				this.writeScore_(this._scoreShowed += this._deltaShowed);
			},
			timingAnimFunc: function(x) {
				return -(x-2*Math.sqrt(x));
			},
			animDuration: DURATIONS.displayingScoreDuration,
			optionalAnimOwner: this //because score anim not declared in grid
		});
		this.writeScore_(this._scoreShowed);
	}
	displays() {
		if (this._delta) {						//if delta changed != 0
			this._grid._anims.score.endAnim();	//need to end before setting variables
			this._scoreShowed = this._score;
			this._score += this._delta;
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
		if (this._grid._lockedBlocks._blocksCount == sweptRowsCount * RULES.horizontalBoxesCount) { //means same cleared blocks qty than grid currently had
			this._grid._anims.messageAnim.startAnim({text: 'Perfect<BR/>clear'});
			this._delta += this._factors[2] * (this._level+1);
		}
	}
	computeLevel_(sweptRowsCount) {
		this._totalSweptRows += sweptRowsCount;
		let newLevel = Math.min(Math.floor(this._totalSweptRows/10), RULES.topLevel);
		if (this._level < newLevel) {
			this._level = newLevel;
			this._grid._dropTimer.setPeriod(
				DURATIONS.softDropPeriod
				+ (DURATIONS.initialDropPeriod - DURATIONS.softDropPeriod)
				* (1 - this._level/RULES.topLevel ) ); //changing timerPeriod, approaching DURATIONS.softDropPeriod
			this._grid._anims.messageAnim.startAnim({
				text: (this._level < RULES.topLevel) ? (`Level ${this._level}`) : (`<BR/>TOP<BR/> level ${this._level}`), //fit ES6
				fieldCharCount: 5 }); //last arg: higher for smaller text, not to queue, each new one replace previous one
		}
	}
	combosReset() {
		this._combos = -1;
	}
	combosCompute() {
		this._combos++;
		if (this._combos >= 1) {
			this._delta += this._factors[Math.min(this._combos, 5)] * (this._level+1) * 0.5; //50% of lines swept together
			this._grid._anims.messageAnim.startAnim({text: this._combos+((this._combos<2)?' combo':' x')});
			//$$$sound of coins
		}
	}
	writeScore_(scoreText) {
		this._grid._domNode._childs.scoreZone.setTextIntoSizedField({text: scoreText}); //here all program write score, just comment for #DEBUG
	}
}
//VARIOUS BASIC FUNCTIONS
function isValued(item) { //requires declared and defined not to null
	return (isDeclaredAndDefined(item) && (item != null));
}
function isDeclaredAndDefined(item) {
	return (typeof item !== 'undefined');
}
//LIST Class, to manage elements by index, indexed by string or number >=0 with size
function List() { with(this) {
	listTable = [];
}}
List.prototype = {
	listTable 		: null,	//public read only
	listSize 		: 0,	//public read only
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
		//listTable.splice(index,1);			//don't work
		listSize--;
	}},
	/*get: function(index) { with(this) {		//old: typeof undefined if not found
		return listTable[index];
	}},
	getN: function(n) { with(this) {			//old: ordered get nth element [0, size-1] //n %= listSize;
		return listTable[getNthIndex_(n)];
	}},*/
	unList: function() { with(this) {			//not ordered
		/*listSize--;
		console.log(listTable);
		let pp = listTable.pop();
		console.log(listTable);
		console.log(listSize);
		return (pp);*/
		for (let p in listTable) {//$$$$$$$$$$
			//console.log(p);
			let item = listTable[p];
			//console.log(listTable);
			eraseItemFromList(p);
			//console.log(listTable);
			//console.log(listSize);
			return item;							//one object only
		}	//return null;	//useless
	}},
	unListN: function(n) { with(this) {			//ordered
		let index = getNthIndex_(n);
		let item = listTable[index];				//old: get(index)
		eraseItemFromList(index);
		return item;
	}}
};
//LIST AUTO INDEX Class, list with first and last access, auto indexed by number with size and holes
function ListAutoIndex() { with(this) {			
	listAutoTable = [];
}}
ListAutoIndex.prototype = {
	listAutoTable 	: null,	//public read only
	_listSize 		: 0,
	_firstIndex		: 0,
	_lastIndex		: 0,
	_seek			: null,
	_nextCount		: null,
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
	/*get: function(index) { with(this) {	//old: typeof undefined if not found
		return listAutoTable[index];
	}},*/
	runForEachListElement: function(func, arg1) { with(this) {//allow to run a function on all list items
		resetNext();
		let item;
		while (item = next())
			func(item, arg1);	//voir call, [args]
	}},
	resetNext: function() { with(this) {	//init seek to first
		_seek = _firstIndex-1;
		_nextCount = 0;
	}},
	next: function() { with(this) {			//let item; resetNext(); while (item = myList.next());
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
//TIMER Class, starts, pause and end a timer of a function to run in 'timerPeriod' ms
class Timer {
	constructor(func, timerPeriod) {	//args never used here, so removed
		this._funcAtTimeOut		= func;
		this._timerPeriod		= timerPeriod;
		this._paused 			= false;
		this._running			= false;
		this._beginTime;
		this._pauseTime;
		this._funcAtTimeOut;
		this._timerPeriod;
		this._args;
		this._timeOut;
	}
	runTimer() { //return true if killing previous
		let needToKill			= this.finishTimer();
		this._running			= true;
		this._beginTime 		= (new Date).getTime();
		this._timeOut 			= setTimeout(this._funcAtTimeOut, this._timerPeriod); //setInterval is useless here, not used
		return needToKill;
	}
	isRunning() {
		return this._running;
	}
	pauseOrResume() { //works only if running, if not do nothing
		if (this._running) { //if paused, resume and return false
			if (this._paused) { //if not paused, pause and return true
				this._paused	= false;
				this._timeOut 	= setTimeout(this._funcAtTimeOut, this._timerPeriod-(this._pauseTime-this._beginTime));
			} else {
				clearTimeout(this._timeOut);
				this._paused	= true;
				this._pauseTime	= (new Date).getTime();
			}
			return				this._paused;
		}
	}
	finishTimer() { //return true if killing previous timer
		this._paused			= false; //turn pause off, necessary ?
		if (this._running) {
			clearTimeout(this._timeOut);
			this._running		= false;
			return				true
		} else
			return				false;
	}
	setPeriod(timerPeriod) { //timer can be changed when running
		this._timerPeriod = timerPeriod;
	}
}
//EVENTS QUEUE Class
class EventsQueue {
	constructor() {
		this._funcsQueue;
		this._oCond;
		this._busy = false,
			this._funcsQueue = [];
	}
	execNowOrEnqueue(o, func, argsArray) { //exec o.func(argsArray) or enqueue if busy
		if (this._busy)				//can't use arguments from the function, because in the call, func is just a pointer without ()
		this._funcsQueue.push([o, func, argsArray]);
		else {
			this._busy = true; //#DEBUG before
			func.apply(o, argsArray); //#DEBUG after, apply() works because argsArray is [], if 1 arg it's call() instead
		}
	}
	dequeue() {
		this._busy = false;
		while (!this._busy && this._funcsQueue.length) {	//dequeue only when not busy
			let first = this._funcsQueue.shift();
			this._busy = true;
			first[1].apply(first[0], first[2]);
		}
	}
}
//Graphic function, convert a [RGB] array + alpha value to text
function rgbaTxt(color, alpha) {
	return 'rgba('+color[0]+','+color[1]+','+color[2]+','+((arguments.length==2)?alpha:1)+')';
}
//Graphic function, to make a linear gradient
function linearGradient(ctx, startX, startY, vectorX, vectorY) {
let grad = ctx.createLinearGradient(startX, startY, startX+vectorX, startY+vectorY);
	for (let p=5;p < arguments.length;p+=2) 
		grad.addColorStop(arguments[p], arguments[p+1]);
	return grad;
}
//Graphic function, to make a radial  gradient
function radialGradient(ctx, startX, startY, startRadius, vectorX, vectorY, endRadius) {
	let grad = ctx.createRadialGradient(startX, startY, startRadius, startX+vectorX, startY+vectorY, endRadius);
	for (let p=7;p < arguments.length;p+=2) 
		grad.addColorStop(arguments[p], arguments[p+1]);
	return grad;
}
//DOM NODE Class, manages HTML Elements, x:0 is implicit
function DomNode(att, parent, id) { with(this) {														//att is attributes
	_childs = {};
	_domNodeType = isValued(att.type) ? att.type : 'div';					//implicit div if type ommited
	if (parent) { _parent = parent; _id = id; }
	_o = document.createElement(_domNodeType);
	_o.id = _id;							//#DEBUG
	_o.style.position = 'absolute';
	if (att.onBody) {
		document.body.appendChild(_o);
		delete att.onBody;					//to avoid it in set()
	} else if (parent)
		_parent._o.appendChild(_o);
	if (isValued(att.width))
		if (typeof att.width == 'number') {
			_o.style.width = att.width+'%';	//all window
			_width = getWidth();
		} else {
			_widthVar = att.width;
			getWidth = function() {return GFX[_widthVar]};
			setWidth(getWidth());
		}
	else {
		if (_parent)
			getWidth = function() {return _parent.getWidth()};
		else
			setWidth(0);
	}
	if (isValued(att.height))
		if (typeof att.height == 'number') {
			_o.style.height = att.height+'%';			//all window
			_height = getHeight();
		} else {
			_heightVar = att.height;
			getHeight = function() {return GFX[_heightVar]};
			setHeight(getHeight());
		}
	else {
		if (_parent)
			getHeight = function() {return _parent.getHeight()};
		else
			setHeight(0);
	}
	if (isValued(att.x)) {
		_xVar = att.x;
		getXInit = function() {return GFX[_xVar]};
	} 
	if (isValued(att.y)) {
		_yVar = att.y;
		getYInit = function() {return GFX[_yVar]};
	}
	setX(getXInit());
	setY(getYInit());
	delete att.x;
	delete att.y;
	delete att.width;
	delete att.height;	
	if (_domNodeType == 'canvas') {
		if (att.gfx) {
			_vectorGfx = att.gfx;
			delete att.gfx;
		}
		_ctx = _o.getContext('2d');
		_o.width =  _width;
		_o.height =  _height;
		_drawStack = {};
	}
	set(att);				//others attributes
}}
DomNode.prototype = {
	_idCount						: 0,				//for unamed elements
	_o								: null,				//public, DOM DomNode or Div
	_childs							: null,
	_parent							: null,				//pointer to parent
	_id								: null,				//=ID, index of child in _childs, integer or name
	_x								: 0,
	_y								: 0,
	_width							: 0,
	_height							: 0,
	_xVar							: null,
	_yVar							: null,
	_widthVar						: null,
	_heightVar						: null,
	_domNodeType					: null,
	_ctx							: null,
	_vectorGfx						: null,
	_scaleZoom						: 1,				//float
	_drawStack						: null,
	_moveStepStack					: null,
	_text							: null,				//text node
	_textCharCountWidthMin			: null,				//letter number in div width
	_textCharCountWidth				: null,
	destroyDomNode: function() { with(this) {	//destroy all childs, optional because garbbage collector
		for (let p in _childs)
			_childs[p].destroyDomNode();		//delete _childs[p] made by child
		if (_parent)
			delete _parent._childs[_id];		//manage parent
		delete _childs;
		_o.parentNode.removeChild(_o);
	}},
	getUId_: function() { with(this) {
		return ++DomNode.prototype._idCount;
	}},
	setTransformOrigin: function(origin) { with(this) {
		_o.style['transformOrigin'] = origin;
	}},
	setRotate: function(degres) { with(this) {
		_o.style['transform'] = 'rotate('+degres+'deg)';
	}},
	setScale: function(factor) { with(this) {
		_o.style['transform'] = 'scale('+factor+')';	//scale with ratio
	}},
	delTransform: function() { with(this) {
		_o.style['transform'] = '';
	}},
	drawGfx: function(attributes=false) { with(this) {	//MAIN FUNCTION to draw a graphic, following attributes
		let att = attributes ? attributes : {}; //if attributes not supplied, we make new Object
		let copyAtt = {}; //recording process to redraw
		for (let p in att)
			copyAtt[p] = att[p];
		if (!att.gfx) att.gfx = _vectorGfx;
		if (!att.x) att.x = 0; //px, int
		if (!att.y) att.y = 0; //px, int
		if (isValued(att.fx))
			att.x += att.gfx.fx(att.fx);
		if (isValued(att.fy))
			att.y += att.gfx.fy(att.fy);
		delete att.fx; //xy found, deleting functions
		delete att.fy;
		_drawStack[getSortedXYArgs_(att)] = copyAtt; //remember xy only for index for redrawing
		let sortedArgs = getSortedArgs_(att);
		if (!att.gfx.hasImageData(sortedArgs)) {
			_ctx.beginPath();
			att.gfx.draw_(_ctx, att.x, att.y, att, getWidth(), getHeight());
			_ctx.closePath();
		}
		if (att.gfx.hasImageData(sortedArgs)) {
			let imageData = att.gfx.getImageData(sortedArgs);
			_ctx.putImageData(imageData, att.x, att.y);			//scaling position
		} else if (!att.gfx._nocache) {
			let imageData = _ctx.getImageData(att.x, att.y, att.gfx.getWidth(), att.gfx.getHeight());
			att.gfx.putImageData(sortedArgs, imageData);
		}
	}},
	getSortedArgs_: function(att) { with(this) { //return sorted args as String
		let result = [];
		for (let p in att)
			if (p!='x' && p!='y' && p!='fx' && p!='fy' && p!='gfx')
				result.push(p + att[p]);
		return GFX._scaleFactor + result.sort().join();		//we can put separator char in args here
	}},
	getSortedXYArgs_: function(att) { with(this) { //return sorted coord args as String
		let result = [];
		for (let p in att)
			if (p=='x' || p=='y')
				result.push(p + att[p]);
		return GFX._scaleFactor + result.sort().join();		//we can put separator char in args here
	}},
	redrawNode: function(after2ndCall) { with(this) {
		setWidth(getWidth());
		setHeight(getHeight());
		if (after2ndCall) {
			moveNodeTo(getXInit(), getYInit());						//init x y
			if (_moveStepStack) 								//positionned with fx
				moveToStep.apply(this, _moveStepStack);
		}
		if (_domNodeType == 'canvas')
			redrawCanvas_(_width, _height);
		else {														//type == div
			if (_text)
				resizeText_();
			for (let p in _childs)
				_childs[p].redrawNode(true);
		}
	}},
	redrawCanvas_: function(newWidth, newHeight) { with(this) {	//redraw at new size, no moving
		_o.width = newWidth?newWidth:getWidth();
		_o.height = newHeight?newHeight:getHeight();
		let redrawStack = {}
		for (let p in _drawStack)						//copy stack
			redrawStack[p] = _drawStack[p];
		_drawStack = {};
		for (let p in redrawStack)						//redrawing
			drawGfx(redrawStack[p]);
	}},
	get: function(att) { with(this) {
		return _o.getAttribute(att);
	}},
	set: function(att) { with(this) {
		for (let p in att)
			if (typeof att[p] != 'object')				//if not sub type and not sub group
				_o.style[p.replace(/_/,'-')] = att[p];
			else
				_childs[p] = new DomNode(att[p], this, p);
	}},
	pxVal_: function(val) { with(this) {
		return val + 'px';
	}},
	setX: function(x) { with(this) {
		_x = Math.round(x);
		_o.style.left = pxVal_(_x);
	}},
	setY: function(y) { with(this) {
		_y = Math.round(y);
		_o.style.top = pxVal_(_y);		//comemnt to disable any Y graphical move #DEBUG
	}},
	getXCenter: function() { with(this) {
		return _x + Math.round(getWidth()/2);
	}},
	setWidth: function(w) { with(this) {
		_width = w;
		_o.style.width = pxVal_(_width);
	}},
	setHeight: function(h) { with(this) {
		_height = h;
		_o.style.height = pxVal_(_height);
	}},
	getXInit: function() { with(this) {	//function by default, can be overwritten by return GFX value
		return 0;
	}},
	getYInit: function() { with(this) {	//function by default, can be overwritten by return GFX value
		return 0;
	}},
	getX: function() { with(this) {
		return _x;//_o.offsetLeft;
	}},
	getY: function() { with(this) {
		return _y;//_o.offsetTop;
	}},
	getWidth: function() { with(this) {	//function by default, can be overwritten by return GFX value
		return _o.offsetWidth;
	}},
	getHeight: function() { with(this) {//function by default, can be overwritten by return GFX value
		return _o.offsetHeight;
	}},
	moveRelatively: function(left, down) { with(this) {	//move relatively
		if (left) setX(_x + left);
		if (down) setY(_y + down);
	}},
	moveTemporaryRelatively: function(left, down) { with(this) {	//move temporary relatively, used for quake
		if (left) _o.style.left = pxVal_(_x + left);
		if (down) _o.style.top = pxVal_(_y + down);
	}},
	moveTemporaryRestore: function() { with(this) {	//restore before move, used for quake
		_o.style.left = _x;
		_o.style.top = _y;
	}},
	moveNodeTo: function(x, y) { with(this) {
		if (x) setX(x);
		if (y) setY(y);
	}},
	moveToStep: function(i, j) { with(this) {
		_moveStepStack = [i, j];
		moveNodeTo(_vectorGfx.fx(i), _vectorGfx.fy(j));
	}},
	moveCenterTo: function(x, y) { with(this) {
		if (x) setX(Math.round(x-getWidth()/2));
		if (y) setY(Math.round(y-getHeight()/2));
	}},
	newChild: function(att) { with(this) {						//returns pointer to child
		let id = getUId_();
		return (_childs[id] = new DomNode(att, this, id));
		//return _childs[att.name?att.name:id] = new DomNode(att, this, att.name?att.name:id);
	}},
	putChild: function(canvas) { with(this) {
		if (canvas._parent)
			delete canvas._parent._childs[canvas._id];			//manage parent
		if ( !canvas._id || (typeof (canvas._id) == 'number') )
			canvas._id = getUId_();//++ _count;
		_childs[canvas._id] = canvas;							//manage parent
		canvas._parent = this;									//manage parent
		canvas.moveNodeTo(canvas._x, canvas._y);
		_o.appendChild(canvas._o);
	}},
	createText: function(font, fontWeight, color, textShadow, textCharCountWidthMin) { with(this) {
		_textCharCountWidthMin = textCharCountWidthMin?textCharCountWidthMin:1; 
		let table = document.createElement('table');
		let tr = document.createElement('tr');
		_text = document.createElement('td');
		table.style.width = '100%';
		table.style.height = '100%';
		table.style.textAlign = 'center';
		table.style.fontFamily = font;
		table.style.fontWeight = fontWeight;
		table.style.textShadow = textShadow;
		table.style.color = color;
		tr.appendChild(_text);
		table.appendChild(tr);
		_o.appendChild(table);
	}},
	setTextIntoSizedField: function(textInfos) { with(this) {
		_textCharCountWidth = isValued(textInfos.fieldCharCount)
			? textInfos.fieldCharCount //value >= text.length, example, 3 chars represents 100% of width of this HTML Node
			: (''+textInfos.text).length; //to convert if text is a number
		_text.innerHTML = textInfos.text;
		resizeText_(); //resize field
	}},
	resizeText_: function() { with(this) {
		//_o.style.width = 'auto';
		//_o.style.height = 'auto';
		//console.log(_o.clientHeight + ' ' + _o.clientWidth); //#DEBUG
		_o.firstChild.style.fontSize = pxVal_(
			getWidth()/Math.max(_textCharCountWidth, _textCharCountWidthMin)
		);
	}},
	hide: function() { with(this) {
		_o.style.visibility = 'hidden';	//or set({opacity: 0});
	}},
	show: function() { with(this) {
		_o.style.visibility = 'inherit';
	}}
};
"use strict";
//VECTOR GFX Class, manage graphic layout
//functions : x y fx fy gfx _nocache reserved; 1 input
//use nomage: __funcToDoThis (intern)
//no '_' in String value of arguments
//for called functions: use one input parameter not object nor array (String, Number, Boolean)
class VectorGfx {
	constructor(funcs) {
		this.draw_; //context, x, y, args
		this.fx;
		this.fy;
		this._imagesData = []; //to work with _imagesData
		this._width;
		this._height;
		this._nocache;
		for (let p in funcs)
			if (p == '_nocache')
				this._nocache = !!funcs[p];
			else
				this[p] = this[funcs[p]] ? this[funcs[p]] : funcs[p]; //to reproduce sames functions fy: 'fx'
	}
	getWidth() {
		return GFX[this._width];
	}
	getHeight() {
		return GFX[this._height];
	}
	getImageData(sortedArgs) { //return {imageData, xD, yD}, no check if exist
		return this._imagesData[sortedArgs];
	}
	putImageData(sortedArgs, imageData) { //no check if already exist
		this._imagesData[sortedArgs] = imageData;
	}
	hasImageData(sortedArgs) { //return boolean
		return !!this._imagesData[sortedArgs];
	}
}
//ANIMATION Class, to prepare an animation
class Animation {
	constructor(att) {
		this.startAnimFunc_ = isValued(att.startAnimFunc) ? att.startAnimFunc : false; //optional function when begin animation, value = null or defined
		this.animateFunc_				= att.animateFunc;		//function to set THE movement to execute
		this.endAnimFunc_				= att.endAnimFunc;		//function to set the last position after animation
		this.timingAnimFunc_			= att.timingAnimFunc;	//f(x) defined on [0;1] to [-infinite;+infinite] give animation acceleration with animOutput, not dependant of declaring object, WARNING this fofbidden in the body
		this._duration					= att.animDuration;		//duration of animation
		this._animOwner = isValued(att.optionalAnimOwner) ? att.optionalAnimOwner : this; //because score anim not declared in grid
		this.animOutput;										//public value of f(x), current animation position after timingAnimFunc_, any value possible
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
		this._paused					= false;
		this._animating					= false;
		this._elapsedFrames				= 0;
	}
	makeNextFrame_() {
		this.animateFunc_.call(this._animOwner, this.animOutput); //because score anim not declared in grid
		//this.animateFunc_(); //draw frame on display, as defined in the instance of Animation
		if ( (++this._elapsedFrames) < this._plannedFrames) {
			this.animOutput					= this.timingAnimFunc_( this._elapsedFrames / this._plannedFrames ); //input [0;1] animOutput have any value
			this._windowNextFrameId			= window.requestAnimationFrame(()=>{ this.makeNextFrame_(); }); //new 2015 feature, fast on Firefox, 60fps (this.makeNextFrame_) doesn't work, object context is not passed
		} else
			this.endAnim();
	}
	isAnimating() {
		return this._animating;
	}
	startAnim() { //start animation, optional arguments are stocked in the 'arguments' array, return true if kill previous same anim
		this.endAnim();	//return true if killing previous
		this._animating					= true;
		//if (this.startAnimFunc_)		this.startAnimFunc_.apply(arguments); //launch optional startAnimFunc_ function, arguments is array
		if (this.startAnimFunc_)		 this.startAnimFunc_.apply(this._animOwner, arguments); //launch optional startAnimFunc_ function, arguments is array
		this._beginTime					= performance.now();
		this._plannedFrames				= RULES.fps * this._duration;
		this.animOutput					= this.timingAnimFunc_( (++this._elapsedFrames) / this._plannedFrames ); //input [0;1] animOutput have any value
		this.makeNextFrame_();
	}
	pauseOrResume() { //bug rare when often pause/resume
		if (this._animating) { //if animating running
			if (this._paused) { //if paused, resume
				this._paused 			= false;
				this._beginTime 		+= performance.now()-this._pauseTime;
				this.makeNextFrame_();
			} else { //if playing, pausing
				this._paused 			= true;
				this._pauseTime 		= performance.now();
				window.cancelAnimationFrame(this._windowNextFrameId);
			}
			return this._paused;
		}
	}
	setDuration(duration) { //can't set duration while animation running; return (if set correctly?) boolean
		if (this._animating) 			return false;
		else							{ this._duration = duration; return true; }
	}
	endAnim() { //return true if killing previous
		if (this._animating) {
			window.cancelAnimationFrame(this._windowNextFrameId);
			this.reset_(); //_animating needs to be set to false to consider grid not busy
			//this.endAnimFunc_();
			this.endAnimFunc_.apply(this._animOwner, arguments); //because score anim not declared in grid
		}
	}
}