<template>
  <view class="detail">
    <view>
      <img :src="download_url" class="picture" />
      <nut-cell-group>
        <nut-cell title="作者" icon="people" :desc = "author" ></nut-cell>
        <nut-cell title="长度" icon="retweet" :desc = "width" ></nut-cell>
        <nut-cell title="宽度" icon="retweet" :desc = "height" ></nut-cell>
        <nut-cell title="博客地址" icon="link" :desc = "url" ></nut-cell>
        <nut-cell title="下载地址" icon="link" :desc = "download_url" ></nut-cell>
      </nut-cell-group>
    </view>
  </view>
</template>
<script>
import Taro from "@tarojs/taro";
import { useStore } from "vuex";
import { computed, onMounted, reactive, toRefs } from "@vue/runtime-core";
export default {
  setup() {
    const store = useStore();
    const params = Taro.getCurrentInstance().router.params;
    const state = reactive({
      pictures: computed(() => store.state.pictures),
      author: "",
      width: "",
      height: "",
      url: "",
      download_url: "",
    });

    const methods = {
      init: ({ idx }) => {
        const data = state.pictures[idx];
        state.author = String(data.author);
        state.width = String(data.width);
        state.height = String(data.height);
        state.url = String(data.url);
        state.download_url = String(data.download_url);
      },
    };

    onMounted(() => {
      methods.init(params);
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss">
.detail {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.picture {
  max-width: 100%;
  height: 270px;
  width: 95%;
  margin: 10px;
  border-radius: 8px;
  box-shadow: 0 13px 27px -5px hsl(240deg 30% 28% / 25%),
    0 8px 16px -8px hsl(0deg 0% 0% / 30%), 0 -6px 16px -6px hsl(0deg 0% 0% / 3%);
}
</style>
