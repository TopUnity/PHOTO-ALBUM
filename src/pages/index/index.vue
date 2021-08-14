<template>
  <view class="index">
    <nut-toast
      :msg="toast.msg"
      v-model:visible="toast.visual"
      :type="toast.type"
      :cover="toast.cover"
    /><!-- 设置一个提示，用于滚动加载的状态提示，里面的属性值通过reactive响应值-->
    <nut-cell>
      <view class="infiniteUl"><!-- 滚动加载的UI-->
        <nut-infiniteloading
          pull-txt="loading"
          load-more-txt="没有内容啦"
          container-id="scrollDemo"
          :is-open-refresh="infiniteloading.isOpenRefresh"
          :has-more="infiniteloading.hasMore"
          @load-more="loadMore"
        >
              <view
                class="infiniteLi"
                v-for="(item, index) in pictures"
                :key="item.id"
              >
                <img
                  :src="`https://picsum.photos/id/${item.id}/200`"
                  class="resize"
                  @tap="toDetail(index)"
                />
                <view>
                  {{ index + "-" + item.author +"-"+item.width+"  "+"x"+"  "+item.height}}
                  <nut-icon
                    :name="item.is_collect == false ? 'addfollow' : 'heart-fill'"
                    :key="item.id"
                    class="collect"
                    @tap="collect(item, index)"
                  />
                </view>
              </view>
        </nut-infiniteloading>
      </view>
    </nut-cell>      
  </view>
</template>

<script>
import { toRefs, reactive, onMounted, computed } from "vue";
import { useStore } from "vuex";
import Taro from "@tarojs/taro";
export default {
  name: "Index",
  setup() {
    const store = useStore();
    const state = reactive({
      pictures: computed(() => store.state.pictures),
      page: 1,
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
      openToast: (type, msg, cover = false) => {
        state.toast.visual = true;
        state.toast.msg = msg;
        state.toast.type = type;
        state.toast.cover = cover;
      },

      loadPage: async (page) => {
        methods.openToast("loading", "加载中", true);
        try {
          const res = await store.dispatch("LOAD_PHOTOS_MUTATIONS", {
            page: page,
          });
        } catch (error) {
          methods.openToast("fail", "加载失败");
          console.log(error.message());
        } finally {
          state.toast.visual = false;
        }
      },

      loadMore: (done) => {
        methods.loadPage(++state.page);
        done();
      },

      toDetail: (index) => {
        Taro.navigateTo({
          url: `/pages/details/index?idx=${index}`,
        });
      },

      collect: (item, index) => {
        item.is_collect == false
          ? methods.addcollect(index)
          : methods.delcollect(item.id, index);
      },

      addcollect: (index) => {
        store.commit("ADD_TO_MYCOLLECT", index);
        methods.openToast("success", "已添加至收藏", false);
      },

      delcollect: (id, index) => {
        store.commit("DEL_MYCOLLECT", { id: id, index: index });
        methods.openToast("success", "已取消收藏", false);
      },

      init: () => {
        try {
          let pictures = Taro.getStorageSync("pictures");
          let mycollect = Taro.getStorageSync("mycollect");
          if (pictures) {
            store.commit("UPDATE_PICTURE", JSON.parse(pictures));
          } else {
            methods.loadPage(state.page);
          }
          if (mycollect) {
            store.commit("UPDATE_MYCOLLECT", JSON.parse(mycollect));
          }
        } catch (error) {
          console.log(error);
        } finally {
          state.toast.visual = false;
        }
      },
    };

    onMounted(() => {
      methods.init();
    });
    return {
      ...toRefs(state),
      ...methods,
    };
  },
};
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
.resize {
  max-width: 100%;
  height: 260px;
  width: 95%;
  margin: 10px;
  border-radius: 8px;
  box-shadow: 0 13px 27px -5px hsl(240deg 30% 28% / 25%),
    0 8px 16px -8px hsl(0deg 0% 0% / 30%), 0 -6px 16px -6px hsl(0deg 0% 0% / 3%);
}

.collect {
  left: 30px;
  top: 7px;
  color: red;
}
</style>

