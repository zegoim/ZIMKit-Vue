import VueI18n from 'vue-i18n';
import Vue from 'vue';
import { en } from '../../locales/en-class';
import { zh } from '../../locales/zh-class';
Vue.use(VueI18n);
let browserLang = 'en_US';
if (navigator.language === 'zh' || navigator.language === 'zh-CN') {
  browserLang = 'zh_CN';
}
const i18n = new VueI18n({
  locale: browserLang,
  fallbackLocale: 'en_US', // 预设的语言环境
  messages: {
    en_US: en,
    zh_CN: zh,
  },
});
export default i18n;
