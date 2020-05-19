<template>
  <div>
    <!-- 查询 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top:20px">
      <!-- // 在 el-form-item 标签属性 prop 上, 指定了字段名, 重置才会生效 -->
      <el-form-item prop="cardNnm">
        <el-input v-model="searchMap.cardNnm" placeholder="会员卡号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="会员名称"></el-input>
      </el-form-item>
      <el-form-item prop="region" style="width:110px">
        <el-select v-model="searchMap.region" placeholder="支付类型">
          <el-option
            v-for="option in payTypeOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="birthday">
        <!-- value-format 是指定绑定值的格式 -->
        <el-date-picker
          value-format="yyyy-mm-dd"
          v-model="searchMap.birthday"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="restForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <el-table :data="list" height="380" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="cardNum" label="会员卡号"></el-table-column>
      <el-table-column prop="name" label="会员姓名" width="80"></el-table-column>
      <el-table-column prop="birthday" label="会员生日"></el-table-column>
      <el-table-column prop="phone" label="手机号码" width="120"></el-table-column>
      <el-table-column prop="integra" label="可用积分"></el-table-column>
      <el-table-column prop="money" label="开卡金额"></el-table-column>
      <el-table-column prop="payType" label="支付类型">
        <!-- slot-scope="scope 获取当前行数据 -->
        <template slot-scope="scope">
          <span>{{scope.row.payType | payTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="会员地址" width="180"></el-table-column>
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
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 新增 -->
    <el-dialog title="会员编辑" :visible.sync="dialogFormVisible">
      <el-form
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        :rules="rules"
        label-position="right"
      >
        <el-form-item label="会员卡号" prop="cardNum">
          <el-input v-model="pojo.cardNum"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="会员生日" prop="birthday">
          <el-date-picker
            value-format="yyyy-mm-dd"
            v-model="pojo.birthday"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="开卡金额" prop="money">
          <el-input v-model="pojo.money"></el-input>
        </el-form-item>
        <el-form-item label="可用积分" prop="integral">
          <el-input v-model="pojo.integral"></el-input>
        </el-form-item>
        <el-form-item label="支付类型" prop="payType">
          <el-select v-model="pojo.payType" placeholder="请点击选择">
            <el-option
              v-for="option in payTypeOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址" prop="address">
          <el-input v-model="pojo.address" type="textarea" placeholder="请输入地址"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="pojo.id === null ?addData('pojoForm') :updateData('pojoForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import memberApi from "@/api/member";

//支付类型
const payTypeOptions = [
  { type: "1", name: "现金" },
  { type: "2", name: "微信" },
  { type: "3", name: "支付宝" },
  { type: "4", name: "银行卡" }
];

export default {
  data() {
    return {
      list: [],
      total: 0, //总记录数
      currentPage: 1, //当前页码
      pageSize: 10, //每页显示10条
      searchMap: {
        //条件查询绑定的条件值
        cardNnm: "",
        name: "",
        region: "",
        birthday: ""
      },
      payTypeOptions,
      pojo: {
        id: null,
        cardNum: "",
        name: "",
        birthday: "",
        phone: "",
        money: "",
        integral: 0,
        payType: "",
        address: ""
      },
      rules: {
        cardNum: [{ required: true, message: "卡号不能为空", trigger: "blur" }],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        payType: [
          { required: true, message: "请选择支付类型", trigger: "change" }
        ]
      },
      dialogFormVisible: false
    };
  },

  created() {
    //初始化获取列表数据
    this.fetchData();
  },
  methods: {
    // 表单重置，
    // 在 el-form-item 标签属性 prop 上, 指定了字段名, 重置才会生效
    restForm(formName) {
      console.log("重置");
      this.$refs[formName].resetFields();
    },
    //当美页显示条数改变后，被触发，val是最新的每页显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      console.log(val);
      this.fetchData();
    },
    // 当页码改变后被触发
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log(val);
      this.fetchData();
    },
    // 打开新增窗口
    handleAdd() {
       this.dialogFormVisible = true
       this.$nextTick(() => {
       // this.$nextTick()它是一个异步事件，当渲染结束 之后 ，它的回调函数才会被执行
       // 弹出窗口打开之后 ，需要加载Dom, 就需要花费一点时间，我们就应该等待它加载完dom之后，再进行调
        // 用resetFields方法，重置表单和清除样式
      this.$refs['pojoForm'].resetFields()
       })
    },
    fetchData() {
      //调用分页查询数据
      memberApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          this.list = resp.data.rows;
          // console.log(resp)
          this.total = resp.data.total;
        });
    },
    //打开编辑窗口
    handleEdit(id) {
    //   console.log("编辑");
    // 清空原数据
    this.handleAdd()
    // 通过Id查询数据
    memberApi.getById(id).then(response => {
        const resp = response.data
        if(resp.flag){
            this.pojo = resp.data
        }
    })
    },
    // 更新数据
    updateData(formName) {
        this.$refs[formName].validate(valid => {
            if(valid){
                // 验证通过，提交
                memberApi.update(this.pojo).then(response => {
                    const resp = response.data
                    if(resp.flag){
                        this.fetchData()// 刷新列表数据
                         this.dialogFormVisible = false // 关闭窗口
                    }else{
                        // 失败, 弹出提示
                        this.$message({
                            message:resp.message,
                            type:'warning'
                        })
                    }
                })
            }else{
                // 验证不通过
                return false
            }
            
        })
    },
    //删除会员
    handleDelete(id) {
    //   console.log("删除");
        this.$confirm('确认删除这条记录吗？', '提示', {
            confirmButtonText:'确认',
            cancelButtonText:'取消',
        }).then(() => {
            //确认
            // console.log('qr')
            memberApi.deleteById(id).then(response => {
                const resp = response.data
                this.$message({
                    message:resp.message,
                    type:resp.flag ? 'success' :'error'
                })

                if(resp.flag){
                    //删除成功，刷新列表
                    this.fetchData()
                }
            })
        }).catch(() => {
            //取消，不需要理会
            console.log('qx')
        })

    },
    // 提交新增数据
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //提交表单
          console.log("adddata");
          memberApi.add(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              //新增成功，刷新列表数据
              this.fetchData();
              this.dialogFormVisible = false; //关闭窗口
            } else {
              //失败，来点提升信息
              this.$message({
                message: resp.message,
                type: "warning"
              })
            }
          })
        }else{
            return false
        }
      })
      }
    },
  filters: {
    // filters 中 this 指向的不是vue实例, 所有无法直接获取 data 中的数据
    payTypeFilter(type) {
      // 全局的 payTypeOptions , 返回一个满足条件的对象
      const objs = payTypeOptions.find(obj => obj.type === type);
      // 非空返回类型名称
      return objs ? objs.name : null;
    }
  }
}
</script>