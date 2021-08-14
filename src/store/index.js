import { createStore } from 'vuex';
import Taro from '@tarojs/taro';

const store = createStore({
    state() {
        return {
            pictures: [], //用于存放首页的图片
            mycollect: [], //用于存放收藏页的图片
        };
    },
    //处理同步
    mutations: {
        LOAD_PHOTOS_MUTATIONS: (state, pictures) => {
            for (var a in pictures) {
                pictures[a].is_collect = false;
            }
            state.pictures = state.pictures.concat(pictures);
        },
        SAVE_DEAL: state => {
            Taro.setStorage({
                key: 'pictures',
                data: JSON.stringify(state.pictures),
            });

            Taro.setStorage({
                key: 'mycollect',
                data: JSON.stringify(state.mycollect),
            });
        },
        //添加图片到收藏页
        ADD_TO_MYCOLLECT: (state, index) => {
            state.pictures[index].is_collect = true;
            state.pictures[index].photos_index = index;
            state.mycollect.push(state.pictures[index]);
            store.commit('SAVE_DEAL');
        },
        //移除收藏夹里面的图片
        DEL_MYCOLLECT: (state, { id, index }) => {
            for (let i in state.mycollect) {
                if (state.mycollect[i].id == id) {
                    state.mycollect.splice(i, 1);
                    state.pictures[index].is_collect = false;
                    store.commit('SAVE_DEAL');
                }
            }
        },
        //更新图库
        UPDATE_MYCOLLECT: (state, mycollect) => {
            Taro.showToast({
                title: '图库更新成功',
                icon: 'none',
                duration: 2000,
            });
            state.mycollect = mycollect;
        },
        //更新首页
        UPDATE_PICTURE: (state, pictures) => {
            state.pictures = pictures;
        },
    },
    //处理异步
    actions: {
        LOAD_PHOTOS_MUTATIONS: async (context, { page = 1, limit = 8 }) => {
            const url = `https://picsum.photos/v2/list?page=${page}&limit=${limit}`;
            const res = await Taro.request({ url });
            context.commit('LOAD_PHOTOS_MUTATIONS', res.data);
            return res.data;
        },
    },
});

export default store;
