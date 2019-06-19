<template>
  <div class="content">
    <div class="sub_title" style="text-align:center">最新上传</div>
    <a-row>
      <template v-for="(item,index) in list">
        <a-col :span="1" v-if="index!=0" :key="'list_empty_'+index"></a-col>
        <a-col :span="4" :key="'list_item_'+index">
          <div class="preview" v-hover="'blur'">
            <a-icon type="caret-right" class="play_btn"/>
            <div class="duration">00 : 00 : 00</div>
            <img
              :src="api+'/'+item.dir+'/cover/pic_'+item.cover+'.jpg'"
              alt="pic"
              class="preview_img"
            >
          </div>
          <div style="text-align:center">{{ item.title }}</div>
        </a-col>
      </template>
      <!-- <a-col :span="4" v-for="(item,index) in list" :key="'item'+index">
        <img class="preview" :src="api+'/'+item.dir+'/cover/pic_'+item.cover+'.jpg'" alt="pic">
      </a-col>-->
    </a-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      api: this.API,
      list: []
    };
  },
  mounted() {
    //请求数据
    this.$axios
      .get("api/lastest")
      .then(res => {
        this.list = JSON.parse(res.data.msg);
        console.log(this.list);
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>
<style lang="scss" scoped>
.content {
  width: 1200px;
  margin: 0 auto;
  padding: 50px 0;
  .sub_title {
    font-size: 20px;
    font-weight: bold;
  }
  .duration {
    position: absolute;
    cursor: default;
    right: 10px;
    bottom: 10px;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.3);
    color: white;
    padding: 0 5px;
    font-size: 12px;
  }
  .preview img {
    width: 100%;
    transition: filter 0.3s;
  }
  .preview {
    cursor: pointer;
    position: relative;
    overflow: hidden;
    // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
    .play_btn {
      font-size: 42px;
      color: white;
      opacity: 0;
      svg {
        position: absolute;
        z-index: 999;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        margin: auto;
      }
    }
  }
}
.blur {
  filter: blur(20px);
}
</style>
