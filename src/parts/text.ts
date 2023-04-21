import { MyDisplay } from "../core/myDisplay";
import { TextItem } from "./textItem";
import { Point } from "../libs/point";
import { Rect } from "../libs/rect";
import { Tween } from "../core/tween";
import { Func } from "../core/func";

// -----------------------------------------
//
// -----------------------------------------
export class Text extends MyDisplay {

  protected _parentTxt: HTMLElement;
  protected _blocksEl: HTMLElement;
  protected _line: number = 10;
  protected _items: Array<TextItem> = [];
  protected _blockSize: Rect = new Rect(0, 0, 100, 100);
  protected _fontSize: number = 10;
  protected _myPos: Point = new Point();
  protected _isOutline: boolean = false;

  constructor(opt:any) {
    super(opt)

    this._isOutline = opt.isOutline;

    if(this._isOutline) {
      this.addClass('-outline');
    }

    this._parentTxt = this.qs('.js-text-org') as HTMLElement;
    this._blocksEl = this.qs('.js-text-blocks') as HTMLElement;

    const num = this._line * this._line;
    for(let i = 0; i < num; i++) {
      const b = document.createElement('div');
      b.classList.add('js-text-item');
      this._blocksEl.append(b);
      b.append(this._parentTxt.cloneNode(true));

      const item = new TextItem({
        el: b,
        key: i,
      });
      this._items.push(item);
      this.useGPU(item.el);
    }
  }

  protected _updateItemSize(): void {
    const sw = Func.sw();
    const sh = Func.sh();

    // if(this._c % 20 == 0) {
    Tween.set(this._parentTxt, {
      fontSize: this._fontSize,
    });

    const txtSize = this.getRect(this._parentTxt);
    const txtWidth = txtSize.width * 1;
    const txtHeight = txtSize.height * 1;

    this._blockSize.width = (txtWidth / this._line);
    this._blockSize.height = (txtHeight / this._line);
    // }

    const fontSize = this._fontSize
    const blockWidth = this._blockSize.width;
    const blockHeight = this._blockSize.height;

    Tween.set(this._parentTxt, {
      x: 0,
      y: 0,
    })

    this._items.forEach((val,i) => {
      const ix = ~~(i / this._line);
      const iy = ~~(i % this._line);

      const x = ix * blockWidth + sw * 0.5 - (this._blockSize.width * this._line * 0.5);
      const y = iy * blockHeight + sh * 0.5 - (this._blockSize.height * this._line * 0.5);

      Tween.set(val.el, {
        width: blockWidth,
        height: blockHeight,
        top: 0,
        left: 0,
        x: x,
        y: y,
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

  public reset(t: string, color: string): void {
    this._parentTxt.innerHTML = t;
    this._c = 0;

    this._items.forEach((val) => {
      val.el.querySelector('.js-text-input').innerHTML = t;
    });

    this.qsAll('.js-text-item-inner').forEach((val) => {
      if(!this._isOutline) val.style.color = color;
    });

    this._update();
  }

  protected _update(): void {
    super._update();
    const sw = Func.sw();
    const sh = Func.sh();

    this._fontSize = Math.min(sw, sh) * Func.val(0.35, 0.35);

    if(this._isOutline) {
      if(this._c % 5 == 0) {
        this._updateItemSize();
      }
    }
  }
}