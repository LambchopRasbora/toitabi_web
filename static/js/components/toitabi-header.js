/**
 * メニュー項目のデータ構造
 * @typedef {Object} MenuItem
 * @property {string} text - メニューに表示するテキスト
 * @property {string} icon - アイコン画像のパス
 * @property {string} url - 遷移先のURL
 */

const ToitabiHeader = {
  props: {
    title: {
      type: String,
      default: 'ヘッダーのタイトル'
    },
    logoSrc: {
      type: String,
      default: '/asset/images/logo.png'
    },
    // Thymeleafからログイン状態を受け取る
    isAuthenticated: {
      type: Boolean,
      default: false
    },
    // Thymeleafからユーザー名を受け取る
    username: {
      type: String,
      default: 'ログイン'
    },
    /** 
     * メニュー項目の配列 
     * @type {import('vue').PropType<MenuItem[]>} 
     */
    menuItems: {
      type: Array,
      default: () => [
        { text: 'ホーム画面へ戻る', icon: '/asset/images/icon/icon_home.png', url: '/' },
        { text: 'My図鑑', icon: '/asset/images/icon/icon_library.png', url: '/me/characterindex' },
        { text: 'トイスポット投稿', icon: '/asset/images/icon/icon_post.png', url: '/me/spotpost' },
        { text: '投稿したトイスポット', icon: '/asset/images/icon/icon_post.png', url: '/me/spotindex' },
        { text: '遊び方', icon: '/asset/images/icon/icon_library.png', url: '/howtoplay' },
        { text: '利用規約', icon: '/asset/images/icon/icon_chara.png', url: '/terms' },
        { text: 'プライバシーポリシー', icon: '/asset/images/icon/icon_chara.png', url: '/privacy' }
      ]
    }
  },
  data() {
    return {
      // メニューの開閉状態を管理するリアクティブデータ
      isMenuOpen: false
    };
  },
  methods: {
    // メニューの開閉をトグルする
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    // 指定されたURLへ画面遷移する
    navigate(url) {
      window.location.href = url;
    }
  },
  template: `
    <div>
      <!-- Header -->
      <header class="app-header">
        <img class="header-logo-img" :src="logoSrc" alt="Logo"/>
        <p class="lead" v-html="title"></p>
        <button class="menu-btn capsule-btn" id="menu-btn" type="button" @click="toggleMenu">
          <p>メニュー</p>
          <img class="icon-img" src="/asset/images/icon/icon_menu.png" alt="MenuIcon"/>
        </button>
      </header>
      
      <!-- メニューの画面 -->
      <nav id="side-menu" class="side-menu" :class="{ 'active': isMenuOpen }">
        <div class="menu-header">
          <h1 class="menu-title">メニュー</h1>
          
          <!-- ログイン情報 -->
          <button v-if="isAuthenticated" class="user-info-btn capsule-btn" type="button" @click="navigate('/me/mypage')">
            <span class="username">{{ username }}</span>
          </button>
          
          <!-- 未ログイン -->
          <button v-else class="user-info-btn capsule-btn" type="button" @click="navigate('/login')">
            <span class="username">ログイン</span>
          </button>
        </div>
        
        <!-- メニュー項目 -->
        <ul>
          <li v-for="(item, index) in menuItems" :key="index">
            <button class="menu-content-btn" type="button" @click="navigate(item.url)">
              <img class="icon-img" :src="item.icon" :alt="item.text"/>
              <p>{{ item.text }}</p>
            </button>
          </li>
        </ul>
        
        <button class="menu-close-btn" type="button" @click="toggleMenu">閉じる</button>
      </nav>
    </div>
  `
};

export default ToitabiHeader;