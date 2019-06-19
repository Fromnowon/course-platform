<template>
  <div class="content">
    <div :class="{'blur':uploading}">
      <br>
      <br>
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="标题" v-bind="formItemLayout">
          <a-input
            v-decorator="[
          'title',
          {rules: [{ required: true, message: '请输入课程标题' }]}
        ]"
          />
        </a-form-item>
        <a-form-item label="描述" v-bind="formItemLayout">
          <a-textarea
            :autosize="{ minRows: 4, maxRows: 10 }"
            v-decorator="[
          'description',
          {rules: [{ required: true, message: '请输入课程描述' }]}
        ]"
          />
        </a-form-item>
        <a-form-item label="年级" v-bind="formItemLayout">
          <a-select
            v-decorator="[
          'grade',
          {rules: [{ required: true, message: '请选择对应年级' }]}
        ]"
            placeholder="年级"
            @change="handleSelectChange"
          >
            <a-select-opt-group>
              <span slot="label">
                <span style="color:blue">高中</span>
              </span>
              <a-select-option value="1">高一</a-select-option>
              <a-select-option value="2">高二</a-select-option>
              <a-select-option value="3">高三</a-select-option>
            </a-select-opt-group>
            <a-select-opt-group>
              <span slot="label">
                <span style="color:green">初中</span>
              </span>
              <a-select-option value="4">初一</a-select-option>
              <a-select-option value="5">初二</a-select-option>
              <a-select-option value="6">初三</a-select-option>
            </a-select-opt-group>
            <a-select-opt-group>
              <span slot="label">
                <span>其他</span>
              </span>
              <a-select-option value="0">未分类</a-select-option>
            </a-select-opt-group>
          </a-select>
        </a-form-item>
        <a-form-item label="标签" v-bind="formItemLayout">
          <template v-for="(tag, index) in tags">
            <a-tooltip v-if="tag.length > 20" :key="'tag'+index" :title="tag">
              <a-tag
                :key="tag"
                :closable="true"
                :afterClose="() => handleClose(tag)"
              >{{`${tag.slice(0, 20)}...`}}</a-tag>
            </a-tooltip>
            <a-tag v-else :key="tag" :closable="true" :afterClose="() => handleClose(tag)">{{tag}}</a-tag>
          </template>
          <a-input
            v-if="inputVisible"
            ref="input"
            type="text"
            size="small"
            :style="{ width: '78px' }"
            :value="inputValue"
            @change="handleInputChange"
            @blur="handleInputConfirm"
            @keyup.enter="handleInputConfirm"
          />
          <a-tag v-else @click="showInput" style="background: #fff; borderStyle: dashed;">
            <a-icon type="plus"/>New Tag
          </a-tag>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="添加课程" class="courseUploadItem">
          <a-upload
            v-decorator="[
          'course',
          {rules: [{ required: true, message: '请选择课程文件' }]}
        ]"
            listType="text"
            :remove="courseRemoveHandler"
            :fileList="courseFile"
            @change="handleUploadChange"
            :beforeUpload="beforeCourseUpload"
          >
            <a-button :disabled="courseStatus">
              <a-icon type="upload"/>选择
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="添加附件">
          <a-upload
            v-decorator="[
          'attachment'
        ]"
            :multiple="true"
            listType="text"
            :remove="attachmentRemoveHandler"
            :fileList="fileList"
            @change="handleUploadChange"
            :beforeUpload="beforeAttachmentUpload"
          >
            <a-button>
              <a-icon type="upload"/>选择
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 6 }">
          <a-button type="primary" html-type="submit" ref="submit">提交</a-button>
          <a-button type="danger" style="margin-left:50px" @click="backToIndex">返回</a-button>
        </a-form-item>
      </a-form>
    </div>
    <transition
      name="fade"
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div v-show="uploading" class="uploading">
        <div class="progress">
          <a-progress type="circle" :percent="percent" :status="uploadingStatus"/>
          <div style="margin-top:20px;font-size:18px" v-html="uploadingTips"></div>
          <div class="btn" style="margin-top:20px">
            <a-button
              type="default"
              @click="retryBtn"
              :disabled="uploadingStatus=='normal'||uploadingStatus=='success'"
            >重试</a-button>
            <a-button
              v-if="uploadingStatus!='normal'"
              :disabled="uploadingStatus=='success'"
              type="danger"
              style="margin-left:20px"
              @click="backUpload"
            >返回</a-button>
            <a-button
              v-else-if="isUploadingFile"
              type="danger"
              style="margin-left:20px"
              @click="cancelUpload"
            >取消</a-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { setTimeout } from "timers";
import { userInfo } from "os";
export default {
  data() {
    return {
      formLayout: "horizontal",
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
      },
      courseFile: [], //课程
      courseStatus: false, //是否已选择课程文件
      fileList: [], //待上传附件列表
      tags: [],
      inputVisible: false,
      inputValue: "",
      percent: 0,
      uploading: false,
      uploadingStatus: "normal",
      uploadingTips: '<a-icon type="loading"/>&nbsp;&nbsp;&nbsp;正在上传...',
      source: null, //取消上传
      isUploadingFile: false,
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      //鉴权
      vm.$axios
        .get("api/authenticate")
        .then(res => {
          if (res.data.code !== 1) {
            vm.$error({
              title: "错误",
              content: "您的角色无法发布课程"
            });
            next("/index");
          }
        })
        .catch(err => {
          console.log(err);
        });
    });
  },
  methods: {
    cancelUpload() {
      this.source.cancel("取消上传");
    },
    backUpload() {
      //返回上传编辑界面
      this.uploading = false;
      let vm = this;
      setTimeout(() => {
        vm.uploadingStatus = "normal";
        vm.uploadingTips =
          '<a-icon type="loading"/>&nbsp;&nbsp;&nbsp;正在上传...';
      }, 1500);
    },
    retryBtn() {
      //重试
      this.uploadingTips =
        '<a-icon type="loading"/>&nbsp;&nbsp;&nbsp;正在上传...';
      this.percent = 0;
      this.uploadingStatus = "normal";

      setTimeout(() => {
        this.$refs.submit.$el.click();
      }, 1000);
    },
    handleSubmit(e) {
      let vm = this;
      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        if (!err) {
          this.uploading = true;
          this.uploadingTips =
            '<a-icon type="loading"/>&nbsp;&nbsp;&nbsp;正在上传...';
          this.percent = 0;
          this.uploadingStatus = "normal";
          // console.log("Received values of form: ", values);
          //加入tags，账号
          values["tags"] = this.tags;
          values["account"] = sessionStorage.getItem("userInfo");
          //上传
          let uploadInfoResult = await this.uploadInfoHandler(values);
          console.log(uploadInfoResult);
          if (uploadInfoResult.data.code === 1) {
            this.isUploadingFile = true;
            this.uploadFileHandler();
          } else {
            // console.log(uploadInfoResult);
            vm.uploadingStatus = "exception";
            vm.percent = 0;
            vm.uploadingTips =
              '<span style="color:red">错误，' +
              uploadInfoResult.data.msg +
              "</span>";
          }
        }
      });
    },
    async uploadInfoHandler(values) {
      //上传信息,同时鉴权。同步，若出错则不进行文件上传
      delete values.course;
      delete values.attachment;
      return await this.$axios
        .post("api/uploadInfo", values)
        .then(res => {
          return res;
        })
        .catch(err => {
          return err;
        });
    },
    uploadFileHandler() {
      //上传文件
      const vm = this;
      const { courseFile, fileList } = this;
      const formData = new FormData();
      let list = courseFile.concat(fileList); //合并数组，课程必须置于首位
      list.forEach(file => {
        formData.append("files[]", file);
      });
      //this.uploading = true;
      //进度配置
      this.source = this.$axios.CancelToken.source();
      let config = {
        onUploadProgress: progressEvent => {
          let complete =
            ((progressEvent.loaded / progressEvent.total) * 100) | 0;
          this.percent = complete;
        },
        cancelToken: this.source.token //取消事件
      };
      this.$axios
        .post("api/uploadFile", formData, config)
        .then(res => {
          if (res.data.code === 1) {
            this.uploadingStatus = "success";
            this.uploadingTips = "上传成功，即将打开配置界面";
            //延迟跳转
            setTimeout(() => {
              //this.$router.push("/courseConfig");
              this.$router.push("/config?action=1&id=" + res.data.msg);
            }, 3000);
          }
        })
        .catch(err => {
          console.log(err);
          if (this.$axios.isCancel(err)) {
            //被取消上传，通知服务器清理缓存
            this.$axios.get("api/uploadCancel");
            this.uploadingStatus = "exception";
          } else {
            this.$message.error("上传失败！");
          }
        });
    },
    handleSelectChange(value) {
      console.log(value);
    },
    handleUploadChange(e) {
      console.log(e);
    },
    beforeCourseUpload(file) {
      //this.fileList = [file, ...this.fileList];
      this.courseFile.push(file);
      return false;
    },
    beforeAttachmentUpload(file) {
      this.fileList.push(file);
      return false;
    },
    courseRemoveHandler() {
      this.courseFile = [];
    },
    attachmentRemoveHandler(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    handleClose(removedTag) {
      const tags = this.tags.filter(tag => tag !== removedTag);
      console.log(tags);
      this.tags = tags;
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(function() {
        this.$refs.input.focus();
      });
    },

    handleInputChange(e) {
      this.inputValue = e.target.value;
    },

    handleInputConfirm() {
      const inputValue = this.inputValue;
      let tags = this.tags;
      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue];
      }
      // console.log(tags);
      Object.assign(this, {
        tags,
        inputVisible: false,
        inputValue: ""
      });
    },
    backToIndex() {
      this.$router.push("/index");
    }
  },
  watch: {
    courseFile(value) {
      this.courseStatus = value.length > 0 ? true : false;
      if (value.length > 1) {
        this.courseFile.pop();
      }
    }
  },
};
</script>
<style scoped>
.content {
  width: 1000px;
  margin: 0 auto;
  padding-top: 3vh;
}
.content >>> .courseUploadItem .ant-upload-list {
  zoom: 1.5;
  color: dodgerblue;
  font-weight: bold;
}
.blur {
  -webkit-filter: blur(12px);
  -moz-filter: blur(12px);
  -o-filter: blur(12px);
  -ms-filter: blur(12px);
  filter: blur(12px);
}
.uploading {
  position: absolute;
  display: table;
  text-align: center;
  width: 100%;
  height: 100%;
  z-index: 999;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.3);
}
.progress {
  display: table-cell;
  vertical-align: middle;
}
</style>
