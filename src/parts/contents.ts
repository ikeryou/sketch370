import { MyDisplay } from "../core/myDisplay";
import { Util } from "../libs/util";
import { Text } from "./text";
import { TextMatter } from "./textMatter";
import { Color } from "three/src/math/Color";

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {

  private _num: number = 2;
  private _text: Array<Text> = [];

  constructor(opt:any) {
    super(opt)

    for(let i = 0; i < this._num; i++) {
      const el = document.createElement('div');
      el.classList.add('js-text')

      const el_p = document.createElement('p');
      el_p.classList.add('js-text-org');

      const input = document.createElement('div');
      input.innerHTML = Util.numStr(0, 4);
      input.classList.add('js-text-input');
      el_p.append(input);
      el.append(el_p);

      const el_div = document.createElement('div');
      el_div.classList.add('js-text-blocks');
      el.append(el_div);

      document.querySelector('main')?.append(el);

      if(i == 0) {
        this._text.push(
          new Text({
            el: el,
            isOutline: true
          })
        );
      } else {
        this._text.push(
          new TextMatter({
            el: el,
            isOutline: false
          })
        );
      }

    }
  }


  protected _update(): void {
    super._update();

    const color = new Color(Util.random(0, 1), Util.random(0, 1), Util.random(0, 1)).getStyle()
    const t = Util.numStr(Util.randomInt(0, 100), 4);
    if(this._c % 180 == 0) {
      this._text.forEach((val) => {
        val.reset(t, color);
      })
    }
  }
}