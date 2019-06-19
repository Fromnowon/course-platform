<template>
  <div class="content">
    <div class="header">
      <Header></Header>
    </div>
    <div class="header_bg" :style="{'background-image': url}">
      <br>
      <br>
      <br>
    </div>
    <div class="nav_and_carousel">
      <NavAndCarousel @changeBg="changeBgHandler"></NavAndCarousel>
      <CoursesRecommend></CoursesRecommend>
    </div>
    <div class="lastest">
      <CoursesLastest></CoursesLastest>
    </div>
  </div>
</template>
<script>
import Header from "../components/IndexHeader";
import NavAndCarousel from "../components/NavAndCarousel";
import CoursesRecommend from "../components/CoursesRecommend";
import CoursesLastest from "../components/CoursesLastest";

export default {
  data() {
    return {
      url: 'url("/img/timg1.jpg")'
    };
  },
  methods: {
    changeBgHandler(data) {
      this.url = 'url("/img/timg' + (data + 1) + '.jpg")';
      // console.log(this.url);
    }
  },
  components: {
    Header,
    NavAndCarousel,
    CoursesRecommend,
    CoursesLastest
  }
};
</script>
<style lang="scss" scoped>
$line-height: 72px;
.content {
  min-width: 1200px;
  .nav_and_carousel {
    margin-top: 30px;
    box-shadow: 0 2px 8px 0 rgba(7, 17, 27, 0.06);
    position: relative;
    z-index: 5;
  }
  .lastest {
    position: relative;
    z-index: 4;
    background-color: rgb(252, 252, 252);
  }
  .header_bg {
    $blur_px: 100px;
    height: 260px;
    opacity: 0.4;
    -webkit-filter: blur($blur_px);
    -moz-filter: blur($blur_px);
    -o-filter: blur($blur_px);
    -ms-filter: blur($blur_px);
    filter: blur($blur_px);
    width: 100%;
    position: absolute;
    top: 0px;
    background-size: cover;
    transition: all 0.5s;
  }
}
</style>
