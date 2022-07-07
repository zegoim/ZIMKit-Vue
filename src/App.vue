<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ZIMKitManager from './ZIMKit/src/components/ZIMKitCommon/VM/ZIMKitManager';
import { getCacheUserInfo } from './util/index';
import { generateToken } from './util/token';
import appConfig from './config';
@Component({
  components: {},
})
export default class App extends Vue {
  cacheUserInfo = getCacheUserInfo();
  async beforeMount() {
    const zimKit = new ZIMKitManager();
    await zimKit.createZIM(appConfig);
    if (this.cacheUserInfo) {
      const token = generateToken(this.cacheUserInfo.userID, 0, appConfig);
      await ZIMKitManager.getInstance()
        .loginWithUserInfo(this.cacheUserInfo, token)
        .then(() => {
          this.$store.commit('login');
          this.$router.push({ name: 'Main' });
        });
    }
  }
}
</script>
<style lang="less">
body {
  margin: 0;
  background-color: #fafafa;
  font-family: PingFangSC-Medium, PingFang SC;
}
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
