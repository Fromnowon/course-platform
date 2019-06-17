<template>
  <div class="content">
    <div class="sub_title" style="text-align:center">最新上传</div>这里是推荐课程
    <div v-for="(item,index) in list" :key="'item'+index">{{ item }}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
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
  padding: 50px;
  .sub_title {
    font-size: 20px;
    font-weight: bold;
  }
}
</style>
