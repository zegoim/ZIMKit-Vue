export interface ZIMKitGroupMember {
    memberNickname: string;
    memberRole: number;
    userID: string;
    userName: string;
}

export interface ZIMKitGroupInfo {
    groupID: string;
    groupName: string;
    groupNotice: string;
    groupAttribution: [];
}