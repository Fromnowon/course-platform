<!--顶部菜单-->
<template>
  <div class="header">
    <a-row>
      <a-col :span="4" class="item">
        <div class="logo">
          <img :src="logoSrc" alt="logo">
        </div>
      </a-col>
      <a-col :span="1" class="item">菜单1</a-col>
      <a-col :span="1" class="item">菜单2</a-col>
      <a-col :span="1" class="item">菜单3</a-col>
      <a-col :span="10" class="item">
        <div class="search">
          <input type="text" v-model="search_key" @keyup.enter="onSearch">
          <i class="fa fa-search search_btn" @click="onSearch"></i>
        </div>
      </a-col>
      <a-col :span="2" class="item"></a-col>
      <a-col :span="3" class="item">
        <a-button type="default" @click="uploadBtn">
          <a-icon type="upload"/>上传课程
        </a-button>
      </a-col>

      <a-col :span="2" class="item">
        <a-dropdown placement="bottomRight" href="javascript:;">
          <a class="ant-dropdown-link" href="#">
            {{ user_info.name}}
            <a-icon type="down"/>
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">
                <a-icon type="user"/>&nbsp;&nbsp;个人中心
              </a>
            </a-menu-item>
            <a-menu-item>
              <a-divider style="margin:0"></a-divider>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;" style="color:red;font-weight:bold" @click="logout">
                <a-icon type="poweroff"/>&nbsp;&nbsp;退出账号
              </a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-col>
    </a-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      logoSrc: "./img/logo.png",
      user_info: {},
      search_key: ""
    };
  },
  methods: {
    uploadBtn() {
      //鉴权
      this.$axios
        .get("api/authenticate")
        .then(res => {
          if (res.data.code !== 1) {
            this.$error({
              title: "错误",
              content: "当前角色无法发布课程"
            });
            this.$router.push("/index");
          } else {
            this.$router.push("/upload");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onSearch() {
      alert(this.search_key);
    },
    logout() {
      // 抹除服务器缓存
      this.$axios.get("api/logout");
      sessionStorage.removeItem("userInfo");
      this.$router.push("/login");
    }
  },
  mounted() {
    this.user_info = JSON.parse(sessionStorage.getItem("userInfo"));
  }
};
</script>
<style lang="scss" scoped>
$line-height: 72px;
.header {
  background-color: #fff !important;
  width: auto;
  height: $line-height;
  padding-right: 10px;
  z-index: 900;
  box-shadow: 0 4px 8px 0 rgba(7, 17, 27, 0.1);
  position: relative;
  .logo {
    text-align: center;
    line-height: $line-height;
    img {
      height: $line-height;
    }
  }
  .item {
    line-height: $line-height;
    text-align: center;
  }
  .search {
    input {
      width: 240px;
      height: 32px;
      border: 0;
      outline: none;
      border-bottom: 2px solid grey;
      transition: border 0.5s;
    }
    input:focus {
      border-bottom: 2px solid red;
    }
    .search_btn {
      margin-left: 10px;
      cursor: pointer;
      font-size: 18px;
      transition: all 0.5s;
    }
    .search_btn:hover {
      color: red;
    }
  }
}
</style>
