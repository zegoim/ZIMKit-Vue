import { event } from '../Constant/event';
export default class ZIMKitEventHandler {
  private static instance: ZIMKitEventHandler = {} as ZIMKitEventHandler;
  private eventList: { [index: string]: Array[] } = {
    [event.zimError]: [],
    [event.zimConnectionStateChanged]: [],
    [event.zimTokenWillExpire]: [],
    [event.zimReceivePeerMessage]: [],
    [event.zimReceiveGroupMessage]: [],
    [event.zimConversationChanged]: [],
    [event.zimConversationTotalUnreadMessageCountUpdated]: [],
    [event.zimKitDeleteConversation]: [],
    [event.zimKitCurrentConversationUpdate]: [],
    [event.zimKitConversationListUpdate]: [],
    [event.zimKitCreateGroup]: [],
    [event.zimKitCurrentChatUpdated]: [],
    [event.zimKitCurrentMessageListUpdated]: [],
    [event.zimKitIsLoggedIn]: [],
    [event.zimKitLoginUserUpdate]: [],
  };
  //   private constructor() {}
  public static getInstance(): ZIMKitEventHandler {
    if (Object.keys(ZIMKitEventHandler.instance).length === 0) {
      ZIMKitEventHandler.instance = new ZIMKitEventHandler();
    }
    return ZIMKitEventHandler.instance;
  }
  public addEventListener(key: string, id: any, callBack: any) {
    if (!this.eventList[key]) {
      console.error('zc.o.0 event ' + key + ' no found');
      return false;
    }

    if (typeof callBack !== 'function') {
      console.error('zc.o.0 listener callBack must be function');
      return false;
    }

    this.eventList[key].indexOf(callBack) == -1 && this.eventList[key].push(callBack);
    return true;
  }
  public removeEventListener(key: string, id: any, callBack: any) {
    if (!this.eventList[key]) {
      console.error('zc.o.1 listener no found');
      return false;
    }

    const li = this.eventList[key];

    if (callBack) {
      li.splice(li.indexOf(callBack), 1);
    } else {
      this.eventList[key] = [];
    }

    return true;
  }
  public actionListener(event: string, ...args: Array<any>): void {
    this.eventList[event] &&
      this.eventList[event].forEach((func) => {
        func(...args);
      });
  }
}
