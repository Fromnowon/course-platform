<template>
  <div class="captcha_div" v-html="svg" @click="getCaptcha"></div>
</template>
<script>
export default {
  data() {
    return {
      svg: ""
    };
  },
  methods: {
    getCaptcha() {
      this.$axios
        .get("api/captcha", {
          params: {
            //拉取验证码的参数
            size: 4, //验证码长度
            width: 100,
            height: 32,
            background: "#ffff00", //干扰线条数
            noise: 2,
            fontSize: 32,
            ignoreChars: "0o1i", //验证码字符中排除'0o1i'
            // color: true // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
          }
        })
        .then(res => {
        //   console.log(res);
          this.svg = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  mounted() {
    this.getCaptcha();
  }
};
</script>
<style scope>
.captcha_div {
  padding-top: 4px;
  height: 32px;
  cursor: pointer;
}
.captcha_div svg {
  box-shadow: 0 0 3px rgb(198, 198, 198);
  margin-left: 10px;
}
</style>