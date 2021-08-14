<template>
  <view class="index">
    <nut-toast
      :msg="toast.msg"
      v-model:visible="toast.visual"
      :type="toast.type"
      :cover="toast.cover"
    />
    <nut-cell>
      <view class="infiniteUl">
          <view class="infiniteLi" v-for="item in mycollect" :key="item.id">
            <img
              :src="`https://picsum.photos/id/${item.id}/1000`"
              class="collectphotos"
              @tap="toDetail(item.photos_index)"
            />
            <view>
              {{ item.author }}
              <nut-icon
                name="del"
                class="delcollect"
                @tap="delcollect(item.id, item.photos_index)"
              />
            </view>
          </view>
        </view>
    </nut-cell>
  </view>
</template>
<script>
import { toRefs, reactive, onMounted, computed } from "vue";
import { useStore } from "vuex";
import Taro from "@tarojs/taro";
export default {
    name: 'Collect',
    setup() {
        const store = useStore();
        const state = reactive({
            mycollect: computed(() => store.state.mycollect),
            toast: {
                msg: "toast",
                type: "text",
                visual: false,
                cover: false,
            },
            infiniteloading: {
                isOpenRefresh: false,
                hasMore: true,
            },
        });
        const methods = {
            delcollect: (id, index) => {
                store.commit("DEL_MYCOLLECT", { id: id, index: index });
            },

            GoIndex: () => {
                Taro.switchTab({
                    url: `/pages/index/index`,
                });
            },
            toDetail: (index) => {
                Taro.navigateTo({
                    url: `/pages/detail/index?idx=${index}`,
                });
            },
        };
        onMounted(() => {
            try {
                let pictures = Taro.getStorageSync("pictures");
                let mycollect = Taro.getStorageSync("mycollect");
                if (pictures) {
                    store.commit("UPDATE_PICTURE", JSON.parse(pictures));
                }
                if (mycollect) {
                    store.commit("UPDATE_MYCOLLECT", JSON.parse(mycollect));
                }
            } catch (error) {
                console.log(error.message());
            } finally {
                state.toast.visual = false;
            }
        });
        return {
            ...toRefs(state),
            ...methods,
        };
    }
}
</script>
<style lang="scss">
.index {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.infiniteUl {
  height: 550px;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
.infiniteLi {
  margin-top: 10px;
  font-size: 14px;
  color: rgba(100, 100, 100, 1);
  text-align: center;
}
.collectphotos {
  max-width: 100%;
  height: 260px;
  width: 95%;
  margin: 10px;
  border-radius: 8px;
  box-shadow: 0 13px 27px -5px hsl(240deg 30% 28% / 25%),
    0 8px 16px -8px hsl(0deg 0% 0% / 30%), 0 -6px 16px -6px hsl(0deg 0% 0% / 3%);
}
.delcollect {
  left: 30px;
  top: 7px;
}
</style>