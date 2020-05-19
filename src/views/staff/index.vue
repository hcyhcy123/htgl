<template>
  <div>
      <!-- 查询 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top:20px">
      <!-- // 在 el-form-item 标签属性 prop 上, 指定了字段名, 重置才会生效 -->
      <el-form-item prop="code">
        <el-input v-model="searchMap.code" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="handleAdd">新增</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="list"
      height="380"
      border
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="code" label="账号"></el-table-column>
      <el-table-column prop="name" label="姓名" width="80"></el-table-column>
      <el-table-column prop="age" label="年龄"></el-table-column>
      <el-table-column prop="phone" label="电话" width="120"></el-table-column>
      <el-table-column prop="salary" label="薪酬" width="120"></el-table-column>
      <el-table-column prop="birthday" label="入职时间" width="120"></el-table-column>
      <!-- slot-slot-scope="scope">
      <spcope="scope 获取当前行数据-->
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout= "total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 新增 -->
    <el-dialog title="员工编辑" :visible.sync="dialogFormVisible">
      <el-form
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        :rules="rules"
        label-position="right"
      >
        <el-form-item label="账号" prop="code">
          <el-input v-model="pojo.code"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="pojo.age"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="pojo.phone" ></el-input>
        </el-form-item>
        <el-form-item label="薪酬" prop="salary">
          <el-input v-model="pojo.salary" ></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="birthday">
          <el-date-picker
            value-format="yyyy-mm-dd"
            v-model="pojo.birthday"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="pojo.id === null ?addData('pojoForm') :updateData('pojoForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import staffApi from "@/api/staff";
export default {
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 10,
      total:0,
      dialogFormVisible:false,
      searchMap: {
          currentPage:'',
          pageSize:''
      },
      pojo:{
          id:null,
          code:'',
          name:'',
          age:'',
          phone:'',
          salary:'',
          birthday:''
      },
      rules:{
          name:[
              {required:true, message:"名字不能为空",trigger:"blur"}
          ],
          phone:[
              {required:true, message:"电话不能为空",trigger:"blur"}
          ]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      staffApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          this.list = response.data.data.rows;
          this.total = response.data.data.total
        });
    },
    handleEdit(id) {
        this.handleAdd();
      // 查询数据
      staffApi.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
        }
      });
    },
    handleDelete(id) {
        this.$confirm("确认删除这条记录吗?","提示",{
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }).then(() => {
            staffApi.deleteById(id).then(response => {
                const resp = response.data
                this.$message({
                    message:resp.message,
                    type:resp.flag ?"scuess" :"error"
                })
                if(resp.flag){
                    this.fetchData()
                }
            })
        })
    },
    handleSizeChange(val){
        this.pageSize = val
        this.fetchData()
    },
    handleCurrentChange(val){
        this.currentPage = val
        this.fetchData()

    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleAdd(){
        this.dialogFormVisible = true
        this.$nextTick(() => {
            this.$refs["pojoForm"].resetFields()
        })
    },
    addData(formName){
        this.$refs[formName].validate(valid => {
            if(valid){
                staffApi.add(this.pojo).then(response => {
                    const resp = response.data
                    if(resp.flag){
                        this.fetchData()
                        this.dialogFormVisible = false
                    }else{
                        this.$message({
                            message:resp.message,
                            type:"warning"
                        })
                    }
                })
            }else{
                return false
            }
        })
    },
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 页面校验验通过，提交添加
          staffApi.update(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
        }
      });
    },
  }
};
</script>