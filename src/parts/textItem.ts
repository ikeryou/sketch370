import { MyDisplay } from "../core/myDisplay";
import { Tween } from "../core/tween";
import { Rect } from "../libs/rect";

// -----------------------------------------
//
// -----------------------------------------
export class TextItem extends MyDisplay {

  private _inner: HTMLElement;
  public get inner(): HTMLElement {
    return this._inner;
  }

  private _innerPos: Rect = new Rect();
  public get innerPos(): Rect {
    return this._innerPos;
  }

  private _pos: Rect = new Rect();
  public get pos(): Rect {
    return this._pos;
  }

  private _key: number;
  public get key(): number {
    return this._key;
  }

  private _center: Rect = new Rect();
  public get center(): Rect {
    return this._center;
  }

  private _offsetPos: Rect = new Rect();
  public get offsetPos(): Rect {
    return this._offsetPos;
  }

  constructor(opt:any) {
    super(opt)

    this._key = opt.key;

    Tween.set(this.el, {
      position: 'absolute',
      top: 0,
      left: 0,
      overflow: 'hidden',
    });

    this._inner = this.el.querySelector('p') as HTMLElement;
    this._inner.classList.remove('js-text-org');
    this._inner.classList.add('js-text-item-inner');
    Tween.set(this._inner, {
      position: 'absolute',
      top: 0,
      left: 0,
    })

    this.useGPU(this._inner);
    this.useGPU(this.el);
  }


  protected _update(): void {
    super._update();

    Tween.set(this._inner, {
      x: this._innerPos.x,
      y: this._innerPos.y,
    })
  }

  protected _resize(): void {
    super._resize();
  }
}