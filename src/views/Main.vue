<template>
  <div class="main">
    <Common></Common>
    <!-- <Conversation></Conversation> -->
    <!-- <Message></Message> -->
    <!-- <Group></Group> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Common from '../ZIMKit/src/components/ZIMKitCommon/UI/Common.vue';
import Conversation from '../ZIMKit/src/components/ZIMKitConversation/UI/ZIMKitConversationUI.vue';
import Message from '../ZIMKit/src/components/ZIMKitMessage/UI/ZIMKitMessageUI.vue';
import Group from '../ZIMKit/src/components/ZIMKitGroup/UI/ZIMKitGroupUI.vue';
import ZIMKitManager from '../ZIMKit/src/components/ZIMKitCommon/VM/ZIMKitManager';
import { ZIMEventOfConnectionStateChangedResult } from '../ZIMKit/src/components/ZIMAdapter/index.entity';
import { clearCacheUserInfo } from '../util';
@Component({
  components: {
    Common,
    Conversation,
    Message,
    Group,
  },
})
export default class Main extends Vue {
  beforeMount() {
    if (!this.$store.state.isLoggedIn) {
      this.$router.push({ name: 'Login' });
    }
    ZIMKitManager.getInstance().registerConnectionCallback(this.connectionCallback());
  }
  beforeDestroy() {
    ZIMKitManager.getInstance().removeConnectionCallback(this.connectionCallback());
  }
  connectionCallback() {
    return (data: ZIMEventOfConnectionStateChangedResult) => {
      if ((data.state === 0 && data.event === 4) || (data.state === 0 && data.event === 0)) {
        this.$router.push({ name: 'Login' });
        this.$store.commit('logout');
        clearCacheUserInfo();
      }
    };
  }
}
</script>
