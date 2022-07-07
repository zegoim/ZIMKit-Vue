import Vue from 'vue';
import ZIMKitConversationVM from '../../ZIMKitConversation/VM/ZIMKitConversationVM';
import ZIMKitMessageVM from '../../ZIMKitMessage/VM/ZIMKitMessageVM';
import ZIMKitEventHandler from './ZIMKitEventHandler';
import { ZIMAdapter } from '../../ZIMAdapter/index';
import { ZIMUserInfo } from '../../ZIMAdapter/index.entity';
import VueI18n from 'vue-i18n';
import { event } from '../Constant/event';
export default class ZIMKitManager {
  private static instance: ZIMKitManager = {} as ZIMKitManager;
  public zim!: ZIMAdapter;
  public conversation!: ZIMKitConversationVM;
  public chat!: ZIMKitMessageVM;
  public eventHandler = ZIMKitEventHandler.getInstance();
  public userInfo: ZIMUserInfo = {} as ZIMUserInfo;
  private appConfig = {};
  isLoggedIn = false;
  token: string;
  constructor() {
    if (Object.keys(ZIMKitManager.instance).length === 0) {
      ZIMKitManager.instance = this;
    }
    return ZIMKitManager.instance;
  }
  public static getInstance(): ZIMKitManager {
    if (Object.keys(ZIMKitManager.instance).length === 0) {
      ZIMKitManager.instance = new ZIMKitManager();
    }
    return ZIMKitManager.instance;
  }
  public async createZIM(appConfig: { appID: number }) {
    await ZIMAdapter.initPlatform();
    this.appConfig = appConfig;
    this.zim = ZIMAdapter.create(appConfig.appID);
    this.zim.on('error', () => {
      this.eventHandler.actionListener('error');
    });
    this.zim.on(event.zimConnectionStateChanged, (zim: any, data: ZIMEventOfConnectionStateChangedResult) => {
      this.eventHandler.actionListener(event.zimConnectionStateChanged, data);
      if (data.state === 0) {
        if (data.event === 3) {
          // If no operation is performed for a long time, you need to log in again
          if (this.userInfo.userID) {
            this.zim.login(this.userInfo, this.token);
          }
        } else if (data.event === 4) {
          // kicked offline
          this.logout();
        }
      }
    });
    this.zim.on('receivePeerMessage', (zim: any, res: any) => {
      this.eventHandler.actionListener('receivePeerMessage', res);
    });
    this.zim.on('receiveGroupMessage', (zim, res) => {
      this.eventHandler.actionListener('receiveGroupMessage', res);
    });
    this.zim.on('conversationTotalUnreadMessageCountUpdated', (zim, { totalUnreadMessageCount }) => {
      // 获取会话总未读数用于 UI 展示
      this.eventHandler.actionListener('conversationTotalUnreadMessageCountUpdated', totalUnreadMessageCount);
    });
    this.zim.on('conversationChanged', (zim, res) => {
      this.eventHandler.actionListener('conversationChanged', res);
    });
  }
  public loginWithUserInfo(userInfo: { userID: string; userName: string }, token: string) {
    this.userInfo = userInfo;
    return this.zim.login(userInfo, token).then(() => {
      this.token = token;
      this.isLoggedIn = true;
      this.eventHandler.actionListener(event.zimKitIsLoggedIn);
      this.eventHandler.actionListener(event.zimKitLoginUserUpdate, userInfo);
    });
  }
  public logout(): void {
    return this.zim.logout();
  }
  public destroy(): void {
    this.offEvent();
    this.zim.destroy();
  }
  registerConnectionCallback(callback: (data: ZIMEventOfConnectionStateChangedResult) => void) {
    this.eventHandler.addEventListener(event.zimConnectionStateChanged, this, callback);
  }
  removeConnectionCallback(callback: (data: ZIMEventOfConnectionStateChangedResult) => void) {
    this.eventHandler.removeEventListener(event.zimConnectionStateChanged, this, callback);
  }
  private offEvent() {
    this.zim.off(event.zimError);
    this.zim.off(event.zimConversationChanged);
    this.zim.off(event.zimTokenWillExpire);
    this.zim.off(event.zimReceivePeerMessage);
    this.zim.off(event.zimReceiveGroupMessage);
    this.zim.off(event.zimConversationTotalUnreadMessageCountUpdated);
  }
  createView() {
    Vue.use(VueI18n);
    // 多语言配置
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
    this.vm = new Vue({
      // render: (h) => h(common),
      i18n,
    }).$mount(`#app`);
  }
}
