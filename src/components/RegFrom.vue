<template>
  <a-form :form="form" @submit="handleSubmit">
    <a-form-item v-bind="formItemLayout" label="用户名">
      <a-input
        v-decorator="[
          'username',
          {
            rules: [{
              required: true, message: '请输入用户名！',
            }]
          }
        ]"
      />
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="密 码">
      <a-input
        v-decorator="[
          'password',
          {
            rules: [{
              required: true, message: '请输入密码！',
            }, {
              validator: validateToNextPassword,
            }],
          }
        ]"
        type="password"
      />
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="密码确认">
      <a-input
        v-decorator="[
          'confirm',
          {
            rules: [{
              required: true, message: '请重新输入密码！',
            }, {
              validator: compareToFirstPassword,
            }],
          }
        ]"
        type="password"
        @blur="handleConfirmBlur"
      />
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="姓名">
      <a-input
        v-decorator="[
          'name',
          {
            rules: [{
              required: true, message: '请输入姓名！',
            }]
          }
        ]"
      />
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="E-mail">
      <a-input
        v-decorator="[
          'email',
          {
            rules: [{
              type: 'email', message: '邮箱格式错误！',
            }, {
              required: true, message: '请输入邮箱！',
            }]
          }
        ]"
      />
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="验证码">
      <a-row :gutter="8">
        <a-col :span="12">
          <a-input
            v-decorator="[
              'captcha',
              {rules: [{ required: true, message: '请输入验证码！' }]}
            ]"
          />
        </a-col>
        <a-col :span="12">
          <Captcha ref="captcha"></Captcha>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item>
      <div style="text-align:center">
        <a-button type="primary" html-type="submit" :loading="loading">注 册</a-button>
        <a-button type="danger" @click="cancelReg" style="margin-left:5vh">取 消</a-button>
      </div>
    </a-form-item>
  </a-form>
</template>

<script>
import Captcha from "./Captcha";
import md5 from "js-md5";
export default {
  data() {
    return {
      loading: false,
      confirmDirty: false,
      autoCompleteResult: [],
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 }
        }
      }
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    cancelReg() {
      this.$emit("cancelReg");
    },
    handleSubmit(e) {
      e.preventDefault();
      let vm = this;
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          vm.loading = true;
          //console.log("Received values of form: ", values);
          //密码md5加密
          let data = {
            username: values.username,
            password: md5(values.password),
            name: values.name,
            email: values.email,
            captcha: values.captcha
          };
          this.$axios
            .post("api/reg", data)
            .then(res => {
              switch (res.data.code) {
                case -2: {
                  //用户名冲突
                  this.form.setFields({
                    ["username"]: {
                      value: this.form.getFieldValue("username"),
                      errors: [
                        {
                          message: "请重新输入用户名"
                        }
                      ]
                    }
                  });
                  //刷新验证码
                  vm.$refs.captcha.getCaptcha();
                  //清空验证码
                  vm.form.setFieldsValue({
                    captcha: ""
                  });
                }
                case -1: {
                  this.$error({
                    title: "错误",
                    content: res.data.msg
                  });
                  break;
                }
                case 1: {
                  this.$message.success("注册成功");
                  this.$emit(
                    "regComplete",
                    this.form.getFieldValue("username")
                  );
                  break;
                }
              }
              vm.loading = false;
              console.log(res);
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    },
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("password")) {
        callback("两次输入密码不一致！");
      } else {
        callback();
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(["confirm"], { force: true });
      }
      callback();
    }
  },
  components: {
    Captcha
  }
};
</script>
<style scoped>
</style>

