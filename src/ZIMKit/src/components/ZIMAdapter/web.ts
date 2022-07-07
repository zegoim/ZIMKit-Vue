import { ZIM, ZIMEventHandler, ZIMUserInfo, ZIMTokenRenewedResult, ZIMConversationQueryConfig, ZIMConversationListQueriedResult, ZIMGroupInfo, ZIMGroupAdvancedConfig, ZIMGroupCreatedResult, ZIMMessage, ZIMMessageSendConfig, ZIMMessageSentResult, ZIMConversationType, ZIMMessageQueryConfig, ZIMMessageQueriedResult, ZIMConversationUnreadMessageCountClearedResult, ZIMConversationDeleteConfig, ZIMConversationDeletedResult, ZIMGroupInfoQueriedResult, ZIMGroupMemberQueryConfig, ZIMGroupMemberListQueriedResult, ZIMGroupJoinedResult, ZIMGroupLeftResult } from './index.entity';
import { ZIMBase } from './base';

export class ZIMWeb extends ZIMBase {
  static instance: ZIM;
  static create(appID: number): ZIM {
    if (!ZIMWeb.instance) {
      ZIMWeb.instance = ZIM.create(appID) as ZIM;
    }
    return ZIMWeb.instance;
  }
  static getInstance() {
    return ZIMWeb.instance;
  }
  on<K extends keyof ZIMEventHandler>(type: K, listener: ZIMEventHandler[K]): void {
    return ZIMWeb.instance.on(type, listener);
  }
  off<K extends keyof ZIMEventHandler>(type: K): void {
    return ZIMWeb.instance.off(type);
  }
  login(userInfo: ZIMUserInfo, token: string): Promise<void> {
    return ZIMWeb.instance.login(userInfo, token);
  }
  logout() {
    return ZIMWeb.instance.logout();
  }
  destroy() {
    return ZIMWeb.instance.destroy();
  }
  renewToken(token: string): Promise<ZIMTokenRenewedResult> {
    return ZIMWeb.instance.renewToken(token);
  }
  queryConversationList(config: ZIMConversationQueryConfig): Promise<ZIMConversationListQueriedResult> {
    return ZIMWeb.instance.queryConversationList(config);
  }
  createGroup(groupInfo: ZIMGroupInfo, userIDs: string[], config?: ZIMGroupAdvancedConfig): Promise<ZIMGroupCreatedResult> {
    return ZIMWeb.instance.createGroup(groupInfo, userIDs, config);
  }
  sendPeerMessage(message: ZIMMessage, toUserID: string, config: ZIMMessageSendConfig): Promise<ZIMMessageSentResult> {
    return ZIMWeb.instance.sendPeerMessage(message, toUserID, config);
  }
  sendGroupMessage(message: ZIMMessage, toGroupID: string, config: ZIMMessageSendConfig): Promise<ZIMMessageSentResult> {
    return ZIMWeb.instance.sendGroupMessage(message, toGroupID, config);
  }
  queryHistoryMessage(conversationID: string, conversationType: ZIMConversationType, config: ZIMMessageQueryConfig): Promise<ZIMMessageQueriedResult> {
    return ZIMWeb.instance.queryHistoryMessage(conversationID, conversationType, config);
  }
  deleteConversation(conversationID: string, conversationType: ZIMConversationType, config: ZIMConversationDeleteConfig): Promise<ZIMConversationDeletedResult> {
    return ZIMWeb.instance.deleteConversation(conversationID, conversationType, config);
  }
  clearConversationUnreadMessageCount(conversationID: string, conversationType: ZIMConversationType): Promise<ZIMConversationUnreadMessageCountClearedResult> {
    return ZIMWeb.instance.clearConversationUnreadMessageCount(conversationID, conversationType);
  }
  queryGroupInfo(groupID: string): Promise<ZIMGroupInfoQueriedResult> {
    return ZIMWeb.instance.queryGroupInfo(groupID);
  }
  queryGroupMemberList(groupID: string, config: ZIMGroupMemberQueryConfig): Promise<ZIMGroupMemberListQueriedResult> {
    return ZIMWeb.instance.queryGroupMemberList(groupID, config);
  }
  joinGroup(groupID: string): Promise<ZIMGroupJoinedResult> {
    return ZIMWeb.instance.joinGroup(groupID);
  }
  leaveGroup(groupID: string): Promise<ZIMGroupLeftResult> {
    return ZIMWeb.instance.leaveGroup(groupID);
  }
}
