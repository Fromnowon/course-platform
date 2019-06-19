<!--分类导航与幻灯片-->
<template>
  <div class="content">
    <div class="menu">
      <div class="item">
        <a href="javascript:void(0)">
          <span class="group">前沿 / 区块链 / 人工智能</span>
          <i class="fa fa-caret-right"></i>
        </a>
      </div>
      <div class="item">
        <a href="javascript:void(0)">
          <span class="group">前沿 / 区块链 / 人工智能</span>
          <i class="fa fa-caret-right"></i>
        </a>
      </div>
      <div class="item">
        <a href="javascript:void(0)">
          <span class="group">前沿 / 区块链 / 人工智能</span>
          <i class="fa fa-caret-right"></i>
        </a>
      </div>
      <div class="item">
        <a href="javascript:void(0)">
          <span class="group">前沿 / 区块链 / 人工智能</span>
          <i class="fa fa-caret-right"></i>
        </a>
      </div>
      <div class="item">
        <a href="javascript:void(0)">
          <span class="group">前沿 / 区块链 / 人工智能</span>
          <i class="fa fa-caret-right"></i>
        </a>
      </div>
      <div class="item">
        <a href="javascript:void(0)">
          <span class="group">前沿 / 区块链 / 人工智能</span>
          <i class="fa fa-caret-right"></i>
        </a>
      </div>
      <div class="item">
        <a href="javascript:void(0)">
          <span class="group">前沿 / 区块链 / 人工智能</span>
          <i class="fa fa-caret-right"></i>
        </a>
      </div>
    </div>
    <div class="carousel">
      <a-carousel ref="carousel" autoplay :afterChange="carouselhandler">
        <div v-for="index in 3" :key="'img'+index">
          <img :src="'/img/timg'+index+'.jpg'" alt="img" style="width:100%">
        </div>
      </a-carousel>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      carouselIntervel: ""
    };
  },
  mounted() {
    //自定义轮播图间隔
    // this.carouselIntervel = setInterval(() => {
    //   this.$refs.carousel.next();
    // }, 3000);
  },
  methods: {
    carouselhandler(current) {
      this.$emit("changeBg", current);
    }
  }
};
</script>
<style scoped>
.content {
  position: relative;
  width: 1200px;
  height: 500px;
  margin: 0 auto;
  box-shadow: 0 12px 24px 0 rgba(7, 17, 27, 0.2);
}
.menu {
  position: relative;
  float: left;
  width: 300px;
  height: 100%;
  z-index: 2;
  box-sizing: border-box;
  background: #2b333b;
  padding-top: 10px;
  font-weight: 400;
}
.menu .item {
  height: 80px;
  line-height: 80px;
  font-size: 15px;
  cursor: pointer;
  padding-left: 50px;
  position: relative;
}
.menu .item:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
.menu .item > a {
  display: block;
  color: rgba(255, 255, 255, 0.6);
  padding: 0 16px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  /* border-bottom: 1px solid rgba(255,255,255,0.2); */
  height: 60px;
}
.menu .item i {
  margin-left: 10px;
}
.carousel {
  position: relative;
  z-index: 2;
  width: 900px;
  float: left;
}
.ant-carousel >>> .slick-slide {
  text-align: center;
  height: 500px;
  line-height: 500px;
  background: #364d79;
  overflow: hidden;
}

.ant-carousel >>> .slick-slide h3 {
  color: #fff;
}
</style>
