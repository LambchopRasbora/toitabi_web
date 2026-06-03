/**
 * フッターボタンのデータ構造
 * @typedef {Object} FooterButton
 * @property {string|import('vue').Ref<string>} text - ボタンに表示するテキスト（文字列またはVueのref）
 * @property {string} class - ボタンに付与するCSSクラス名（例: 'sns-btn', 'home-btn'）
 * @property {string} icon - アイコン画像のパス（例: '/asset/images/icon/icon_xx.png '）
 * @property {Function} action - ボタンがクリックされたときに実行されるコールバック関数
 */

const ToitabiFooter={
    props:{
        ratio:{
          type:String,
          default:'1fr 1fr'
        },
        /** * 左側に配置するボタンの配列
         * @type {import('vue').PropType<FooterButton[]>} 
         */
        leftcontents:{
          type:Array,
          default:()=>[]
        },
        /** * 右側に配置するボタンの配列
         * @type {import('vue').PropType<FooterButton[]>} 
         */
        rightcontents:{
          type:Array,
          default:()=>[]
        }
    },
    template:`
    <footer class="app-footer">
      <div class="bottom-actions" :style="{'grid-template-columns': ratio}">
        <div class ="footer-button-container">
          <button 
            v-for="(btn, index) in leftcontents"
            :key="index"
            class="action-btn c-card"
            :class="btn.class"
             type="button" 
             @click="btn.onClick"> 
            <div class ="caption">{{btn.caption}}</div>
            <img class = "icon-img" :src="btn.icon"/>
          </button>
        </div>
        <div class ="footer-button-container">
          <button 
            v-for="(btn, index) in rightcontents"
            :key="index"
            class="action-btn c-card"
            :class="btn.class"
             type="button" 
             @click="btn.onClick"> 
            <div class ="caption">{{btn.caption}}</div>
            <img class = "icon-img" :src="btn.icon"/>
          </button>
        </div>
      </div>
    </footer>
    `
}
export default ToitabiFooter;