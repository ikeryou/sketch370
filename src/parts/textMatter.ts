import { Bodies, Body, Composite, Engine, Events, Render, Runner, Mouse, MouseConstraint } from "matter-js";
import { Func } from "../core/func";
import { Tween } from "../core/tween";
import { Util } from "../libs/util";
import { Text } from "./text";

// -----------------------------------------
//
// -----------------------------------------
export class TextMatter extends Text {

  public engine:Engine;
  public render:Render;

  private _body:Array<Body> = [];
  private _frame:Array<Body> = [];
  private _isMatterVisible: boolean = false;

  constructor(opt:any) {
    super(opt)

    this.engine = Engine.create();

    // 重力方向
    this.engine.gravity.x = 0;
    this.engine.gravity.y = 0;

    // レンダラー
    this.render = Render.create({
      element: document.body,
      engine: this.engine,
      options: {
        width: Func.sw(),
        height: Func.sh(),
        showAngleIndicator: false,
        showCollisions: false,
        showVelocity: false,
        pixelRatio: 1,
      }
    });
    this.render.canvas.classList.add('matter')
    Tween.set(this.render.canvas, {
      opacity: this._isMatterVisible ? 0.5 : 0,
    });

    for(let i = 0; i < this._line * this._line; i++) {
      const isStatic = false;
      const size = Math.min(Func.sw(), Func.sh()) * Func.val(0.25, 0.25) / this._line;
      const item: Body = Bodies.rectangle(0, 0, size * 1.5, size, {
        isStatic: isStatic,
        mass: Util.random(0.1, 1),
        render: {visible: this._isMatterVisible}
      });
      this._body.push(item);

      Composite.add(this.engine.world, [
        item
      ]);
    }

    // マウス
    const mouse = Mouse.create(this.render.canvas);
    const mouseConstraint = MouseConstraint.create(this.engine, {
      mouse: mouse,
    });
    Composite.add(this.engine.world, mouseConstraint)
    this.render.mouse = mouse

    // run the renderer
    Render.run(this.render);

    // create runner
    const runner:Runner = Runner.create();

    // run the engine
    Runner.run(runner, this.engine);

    // 描画後イベント
    Events.on(this.render, 'afterRender', () => {
      //
    })

    this._resize();
  }

  protected _updateItemSize(): void {
    const fontSize = this._fontSize
    const blockWidth = this._blockSize.width;
    const blockHeight = this._blockSize.height;

    if(this._c % 20 == 0) {
      const rect = this.getOffset(this.el)
      this._myPos.x = rect.x;
      this._myPos.y = rect.y;
    }

    Tween.set(this._parentTxt, {
      x: 0,
      y: 0,
    })

    this._items.forEach((val,i) => {
      const ix = ~~(i / this._line);
      const iy = ~~(i % this._line);

      const body = this._body[i];
      const x = body.position.x - this._blockSize.width * 0.5;
      const y = body.position.y - this._blockSize.height * 0.5;

      Tween.set(val.el, {
        width: blockWidth,
        height: blockHeight,
        top: 0,
        left: 0,
        x: x,
        y: y,
        rotationZ: Util.degree(body.angle)
      })

      Tween.set(val.inner, {
        fontSize: fontSize,
      })

      val.center.x = this._myPos.x + blockWidth * 0.5;
      val.center.y = this._myPos.y + blockHeight * 0.5;

      val.pos.width = blockWidth;
      val.pos.x = x + blockWidth * 0.5;
      val.pos.y = y + blockHeight * 0.5;

      val.innerPos.x = -ix * blockWidth;
      val.innerPos.y = -iy * blockHeight;
    })
  }


  protected _update(): void {
    super._update();

    const isRender = this._c >= 60 * 0.5;
    if(!isRender) {
      this._updateMatterjsBodies();
    }

    if(this._c % 2 == 0) {
      this._updateItemSize();
    }
  }

  protected _resize(): void {
    super._resize();
    this._makeFrame();
  }

  private _updateMatterjsBodies(): void {
    const sw = Func.sw();
    const sh = Func.sh();

    if(this._c % 2 == 0) {
      Tween.set(this._parentTxt, {
        fontSize: this._fontSize,
      });

      const txtSize = this.getRect(this._parentTxt);
      const txtWidth = txtSize.width * 1;
      const txtHeight = txtSize.height * 1;

      this._blockSize.width = (txtWidth / this._line);
      this._blockSize.height = (txtHeight / this._line);
    }

    this._body.forEach((val, i) => {
      const ix = ~~(i / this._line);
      const iy = ~~(i % this._line);

      const x = ix * this._blockSize.width + sw * 0.5 - (this._blockSize.width * this._line * 0.5) + this._blockSize.width * 0.5;
      const y = iy * this._blockSize.height + sh * 0.5 - (this._blockSize.height * this._line * 0.5) + this._blockSize.height * 0.5;
      Body.setPosition(val, {x: x, y: y});
      Body.setAngle(val, 0);
      Body.setVelocity(val, {x: 0, y: 0});
      Body.setAngularVelocity(val, 0);

      // val.bounds.min.x = this._blockSize.width * -0.5;
      // val.bounds.max.x = this._blockSize.width * 0.5;
      // val.bounds.min.y = this._blockSize.height * -0.5;
      // val.bounds.max.y = this._blockSize.height * 0.5;
    });
  }

  // 枠作成
  private _makeFrame(): void {
    // 一旦破棄
    if(this._frame.length > 0) {
      Composite.remove(this.engine.world, this._frame[0])
      Composite.remove(this.engine.world, this._frame[1])
      Composite.remove(this.engine.world, this._frame[2])
      Composite.remove(this.engine.world, this._frame[3])
      this._frame = [];
    }

    const sw = Func.sw();
    const sh = Func.sh();

    // 外枠
    const size = 10

    const opt = {isStatic: true, render: {visible: this._isMatterVisible}};

    this._frame[0] = Bodies.rectangle(0, 0, 9999, size, opt);
    this._frame[1] = Bodies.rectangle(sw, 0, size, 9999, opt);
    this._frame[2] = Bodies.rectangle(0, sh, 9999, size, opt);
    this._frame[3] = Bodies.rectangle(0, 0, size, 9999, opt);

    if(this._frame.length > 0) {
      Composite.add(this.engine.world, [
        this._frame[0],
        this._frame[1],
        this._frame[2],
        this._frame[3],
      ])
    }
  }
}