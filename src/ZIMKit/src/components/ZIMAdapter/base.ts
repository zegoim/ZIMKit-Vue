import { ZIMConversationQueryConfig, ZIMConversationListQueriedResult, ZIMGroupInfo, ZIMGroupAdvancedConfig, ZIMUserInfo, ZIMGroupCreatedResult, ZIMTokenRenewedResult, ZIMEventHandler, ZIMMessage, ZIMMessageSendConfig, ZIMMessageSentResult, ZIMConversationType, ZIMMessageQueryConfig, ZIMMessageQueriedResult, ZIMConversationUnreadMessageCountClearedResult, ZIMConversationDeleteConfig, ZIMConversationDeletedResult, ZIMGroupInfoQueriedResult, ZIMGroupMemberQueryConfig, ZIMGroupMemberListQueriedResult, ZIMGroupJoinedResult, ZIMGroupLeftResult } from './index.entity';

export abstract class ZIMBase {
  abstract on<K extends keyof ZIMEventHandler>(type: K, listener: ZIMEventHandler[K]): void;
  abstract off<K extends keyof ZIMEventHandler>(type: K): void;
  abstract login(userInfo: ZIMUserInfo, token: string): Promise<void>;
  abstract logout(): void;
  abstract destroy(): void;
  abstract renewToken(token: string): Promise<ZIMTokenRenewedResult>;
  abstract queryConversationList(config: ZIMConversationQueryConfig): Promise<ZIMConversationListQueriedResult>;
  abstract createGroup(groupInfo: ZIMGroupInfo, userIDs: string[], config?: ZIMGroupAdvancedConfig): Promise<ZIMGroupCreatedResult>;
  abstract sendPeerMessage(message: ZIMMessage, toUserID: string, config: ZIMMessageSendConfig): Promise<ZIMMessageSentResult>;
  abstract sendGroupMessage(message: ZIMMessage, toGroupID: string, config: ZIMMessageSendConfig): Promise<ZIMMessageSentResult>;
  abstract queryHistoryMessage(conversationID: string, conversationType: ZIMConversationType, config: ZIMMessageQueryConfig): Promise<ZIMMessageQueriedResult>;
  abstract deleteConversation(conversationID: string, conversationType: ZIMConversationType, config: ZIMConversationDeleteConfig): Promise<ZIMConversationDeletedResult>;
  abstract clearConversationUnreadMessageCount(conversationID: string, conversationType: ZIMConversationType): Promise<ZIMConversationUnreadMessageCountClearedResult>;
  abstract queryGroupInfo(groupID: string): Promise<ZIMGroupInfoQueriedResult>;
  abstract queryGroupMemberList(groupID: string, config: ZIMGroupMemberQueryConfig): Promise<ZIMGroupMemberListQueriedResult>;
  abstract joinGroup(groupID: string): Promise<ZIMGroupJoinedResult>;
  abstract leaveGroup(groupID: string): Promise<ZIMGroupLeftResult>;
}
