<template>
  <div class="login-container">
    <el-form ref="form" :model="form" label-width="80px" class="login-form" :rules="rules">
      <h2 class="login-title">梦学谷会员管理系统</h2>
      <el-form-item label="账号:" prop="username">
        <el-input v-model="form.username" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="密码:" prop="password">
        <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item class="login-submit">
        <el-button type="primary" @click="submitForm('form')">登陆</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login, getUserInfo } from "@/api/login";

export default {
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入有效帐号", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入有效密码", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        // console.log(valid);
        if (valid) {
          //提交表单给后台进行验证是否正确
          this.$store.dispatch('Login',this.form).then(response => {
            console.log(response.flag)
            // response就是响应回来的那个真实对象
            if(response.flag){
              this.$router.push('/')
            }else{
              this.$message({
                message:response.message,
                type:'warning'
              })
            }
          }).catch(error => {

          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.login-form {
  width: 350px;
  margin: 200px auto;
  background: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 20px;
}
.login-title {
  text-align: center;
}
.login-container {
  width: 100%;
  height: 100%;
  background: url(../../assets/login.jpg);
  position: absolute;
}
.login-submit {
  /* width: 200px; */
  margin: 0 auto;
  /* text-align: center; */
}
</style>