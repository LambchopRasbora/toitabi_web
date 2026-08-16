/**
 * question.js
 * 画面個別スクリプト (Vueルートインスタンス初期化およびイベント制御)
 */
import  LocationPickerMap  from "./components/locationPickerMap.js";

document.addEventListener('DOMContentLoaded', () => {
  const { createApp } = Vue;

  const app = createApp({
    data() {
      return {
        fetchedPoints: []
      };
    },
    methods: {
      // ref 経由で LocationPickerMap の getRegisteredPoints を実行
      fetchPoints() {
        if (this.$refs.locationPicker) {
          this.fetchedPoints = this.$refs.locationPicker.RegisterPoint(34.985160,135.758429);
          console.log("取得マーカー配列:", this.fetchedPoints);
        }
      },
    }
  });

  // コンポーネント登録とマウント
  app.component('location-picker-map', LocationPickerMap);
  app.mount('#app');
});