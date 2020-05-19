<template>
  <div class="header">
    <a href="#/">
      <img class="logo" src="@/assets/logo1.png" width="25px" />
      <span class="company">梦学谷学员管理系统</span>
    </a>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{user.name}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a">修改密码</el-dropdown-item>
        <el-dropdown-item command="b">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width=400px>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" style="width:300px">
        <el-form-item label="原密码" prop="oldpass">
          <el-input type="password" v-model="ruleForm.oldpass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="$refs['ruleForm'].resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {logoout} from '@/api/login' 
import passwordApi from '@/api/password'
export default {
  data() {
    // 注意是在 return 上面
    // 校验原密码
    const validateOldPass = (rule,value,callback) => {
      passwordApi.checkPwd(this.user.id,value).then(response => {
        const resp = response.data
        if(resp.flag){
          callback()
        }else{
          callback(new Error(resp.message))
        }
      })
    }
    // 新密码和确认密码校验
    const validatePass = (rule,value,callback) => {
      //如果确认密码不等于新密码
      if(value != this.ruleForm.pass){
        callback(new Error('两次输入密码不一致!'));
      }else{
        callback()
      }
    }

    return {
       // user 获取用户信息
      user:this.$store.state.user.user,
      dialogFormVisible:false,
      ruleForm:{
        pass:'',
        oldpass:'',
        checkPass:''
      },
      rules:{
        oldpass:[
          {required:true,message:'旧密码不正确',trigger:'blur'},
          {validator:validateOldPass,trigger:'blur'}
        ],
        pass:[
          {required:true,message:'新密码不正确',trigger:'blur'}
        ],
        checkPass:[
          {required:true,message:'确认密码不正确',trigger:'blur'},
          {validator:validatePass,trigger:'change'}
        ]
      }
    }
  },
    methods:{
        handleCommand(command){
            
            switch (command) {
              case 'a':
                //修改密码
                this.handlePwd()
                break;
              case 'b':
                //退出系统
                  this.handleLogout()
                  break;
              default:
                break;
            }
        },
        //退出系统
        handleLogout(){
          this.$store.dispatch('Logout').then(response => {
            if(response.flag){
              this.$router.push('/login')
            }else{
              this.$message({
                        showClose: true,
                        message: resp.message,
                        type: 'warning'
               });
            }
          })
        },
        //修改密码
        handlePwd(){
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['ruleForm'].resetFields()
          })
        },
        //提交密码
        submitForm(ruleForm){
          this.$refs[ruleForm].validate(valid => {
            if(valid){
              //验证成功
              passwordApi.updatePwd(this.user.id,this.ruleForm.checkPass).then(response => {
                const resp = response.data
                //不管失败还是成功都提醒
                this.$message({
                  message:resp.message,
                  type:resp.flag ?'success':'warning'
                })
                if(resp.flag){
                  // 更新成功，退出系统，回到登陆页面
                  this.handleLogout()
                  // 关闭窗口
                  this.dialogFormVisible = false
                }
              })
            }else{
              // 验证失败
              return false
            }
          })
        }
    }
}
</script>

<style scoped>
.logo {
  vertical-align: middle;
  padding: 0 10px 0 40px;
}
.company {
  color: white;
  position: absolute;
}
.el-dropdown{
    float: right;margin-right: 40px;
}
.el-dropdown-link{
    color: white;
    cursor: pointer;
}
</style>