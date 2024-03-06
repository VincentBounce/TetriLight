# 🧱TetriLight - JavaScript 3-player Tetris on the same monitor

Pure HTML5 fully resizable and animated JS Canvas Tetris. *No image, no framework, no imported API, no imported library.*

Tested on 2024-03-06: Chrome 122✅ | Edge 122✅ | Brave 1.63✅ | Opera 106✅ | Safari 17.3✅ | Firefox 123✅.

It fits [ECMAScript 6 (2015)](https://262.ecma-international.org/6.0/) + HTML5 Canvas + [JS Standard Style](https://standardjs.com/rules.html) + [Airbnb style](https://github.com/airbnb/javascript)

Music [Tayga Minila by JC`zic](https://soundcloud.com/jczic/tayga-minimal).

## To Play

Use keys `WASD`, `IJKL` and `<∧∨>` respectively for player 1, 2 and 3. I you're less than 3 players, just let zombie games losing .

When you are 1 or 2 players remaining, to add a new player, just click on the upper-left corner of the page with the mouse.

## Tetris game rules

When a player clears 3 or more `RULES.pentominoesRowsCountMin` lines together, then he have 1 to 3 blocks per shape,
and others players have 5 blocks per shape, during 15 or 20 seconds (it's called Pentominoes/Trominoes mode).

When a player clears 2 or more `RULES.transferRowsCountMin` lines together, then he drops same quantity of bad grey lines to others players.

Game is lost when new shape can't be placed `!_fallingShape.canMoveToPlaced`.

Game starts at level 0

Level starts 0, increments +1 every 10 rows cleared
Hard drops double travelled cells count

Cleared rows count formula is 40 for 1, 100 for 2, 300 for 3, 1200 for 4, 6600 for 5 at level 0, then *(level + 1)

Combos rows count formula is same * 50%
Bonus same as 2 rows when all is cleared (Perfect clear)

## Wording

```
to clear = to sweep, cleared = swept
a row = a line
a cell = a slot = a box
sprites = graphics = gfx
pivot = orientation
```

---

# 🛠️Code

## Github

**remote**

- `tetrilight-github` instead `origin`

**branches**

- `canvas` canvas dev (playable)
- `svg` SVG dev (dev not finished)
- `main` started canvas dev here (archived)
- `es5-fit-ie11` latest version compatible [JS ES5=ECMAScript 2009] to fit Internet Explorer 11 (archived)
- `async` trial using async functions (archived)

## Graphic choice

**Canvas (currently used)**

- each canvas element is obscur in Elements Explorer
- blur because `window.devicePixelRatio !== 1` 1.75 for example in 4K screen
- move without calculation
- computing page resize zoom with JS explicit code
- `window.devicePixelRatio` read only, ratio 1.75 on my 4K LCD === physical px / px independant device

```
DIV
    _htmlElement: DIV
    _htmlElement: CANVAS
        _drawingContext2D: CanvasRenderingContext2D (choose smooth)
            globalAlpha, imageSmoothingEnabled, imageSmoothingQuality
```

**SVG (not finished)**

- each SVG element is visible in Elements Explorer
- gradient possible on fonts
- small blur because sizes in %
- calculate render on each move
- implicit built-in page resize zoom

**WebGL (not developed)**

## Naming convention

- `#DEBUG` to track bug
- `$$$` to check or fix later
- `$function` used to track bug
- `GLOBAL_VARIABLE_OR_CONSTANT` global variable to handle a class, or global constant
- `MyClass` public class with first letter uppercase (Pascal Case)
- `_privateVariable` private variable accessible only by class
- `privateMethod_` private method accessible only by class
- `privateMethodBody_` private method body called only by 1 method
- `publicMethod` public method (Lower Camel Case)
- `publicVariable` public variable (Lower Camel Case)
- `destroyMyClass` class destructor function
- `let myVariable` is local variable in the fonction
- `let x, y` are positions on browser, in pixels (x -> right, y -> down)
- `let i, j` are positions of blocks into grid (i -> right, j -> up)
- `let o` is generic object
- `let p` is variable to browse in object
- `let item` is generic item, object or array or string boolean number
- `forEach( (myVar)=>{ return myVar++; } );`

## Animation sequences

**Events program, reacts to**

- timeouts after animations, after drop period on each slot
- keys pressed
- mouse clicks

**Queuing new actions, new exclusive anims when**

- `(hardDrop > quake)0-1 > (clearRows > hardDrop > quake)0-*` riseGreyBlocks actions are stuck
- `(riseGreyBlocks)1-* > (hitShape > (clearRows > hardDrop > quake)0-* )0-1 >` fallingShape is stuck
- messages and scores anims are not exclusive, each new one replace previous one
- 0-1 means iterating from 0 to 1 time. `0-*` from 0 to x times
- `pauseOrResume` stops every timers, music. It lets FX finish. It blocks controls.

## Classes

```
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
```

# 😉 Author

**🇫🇷 ꓱꓛꓠꓵꓳꓭ ꓕꓠꓱꓛꓠꓲꓥ** | **𝕏 [@VincentBounce](https://x.com/VincentBounce)** | **YouTube [@VincentBounce](https://www.youtube.com/@VincentBounce/)** | **Instagram [@VincentBounce](https://instagr.am/vincentbounce/)**

TetriLight v0.4 edited in 2011, 2020 and 2024
