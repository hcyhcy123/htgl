<template>
  <div>
    <!-- 查询 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top:20px">
      <!-- // 在 el-form-item 标签属性 prop 上, 指定了字段名, 重置才会生效 -->
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="searchMap.code" placeholder="商品编号"></el-input>
      </el-form-item>
      <el-form-item prop="supplierName">
        <el-input
          readonly
          @click.native="dialogSupplierVisible = true"
          v-model="searchMap.supplierName"
          placeholder="请选择供应商"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="$refs['searchForm'].resetFields()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" height="380" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
      <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
      <el-table-column prop="code" label="商品编码" width="80" align="center"></el-table-column>
      <el-table-column prop="spec" label="商品规格" align="center"></el-table-column>
      <el-table-column prop="retailPrice" label="零售价" width="120" align="center"></el-table-column>
      <el-table-column prop="purchasePrice" label="进货价" align="center"></el-table-column>
      <el-table-column prop="storageNum" label="库存数量" align="center"></el-table-column>
      <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
      <el-table-column prop="supplierID" label="会员地址" width="180" align="center"></el-table-column>
      <el-table-column label="操作" width="150" align="center">
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
    <!-- 选择供应商 -->
    <el-dialog title="选择供应商" :visible.sync="dialogSupplierVisible" width="500px">
      <supplier :isDialog="true" @option-supplier="optionSupplier"></supplier>
    </el-dialog>
    <!-- 新增 -->
    <el-dialog title="编辑商品" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        :rules="rules"
        label-position="right"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="商品编码" prop="code">
          <el-input v-model="pojo.code"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" prop="spec">
          <el-input v-model="pojo.spec"></el-input>
        </el-form-item>
        <el-form-item label="零售价" prop="retailPrice">
          <el-input v-model="pojo.retailPrice"></el-input>
        </el-form-item>
        <el-form-item label="进货价" prop="purchasePrice">
          <el-input v-model="pojo.purchasePrice"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="storageNum">
          <el-input v-model="pojo.storageNum"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierName">
          <el-input
            v-model="pojo.supplierName"
            @click.native="editOptionSupplier"
            readonly
            placeholder="选择供应商"
          ></el-input>
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
import goodsApi from "@/api/goods";
import Supplier from "@/views/supplier";
export default {
  components: {
    Supplier
  },
  data() {
    return {
      list: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页, 默认第1页
      pageSize: 10, // 每页显示条数， 10条
      searchMap: {
        name: "",
        code: "",
        supplierName: ""
      },
      dialogSupplierVisible: false,
      dialogFormVisible: false,
      pojo: {
        id: null,
        name: "",
        code: "",
        spec: "",
        retailPrice: 0.0,
        purchasePrice: 0.0,
        storageNum: 0,
        supplierName: "",
        supplierId: null
      },
      isEdit:false,
      rules: {
        name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "商品编码不能为空", trigger: "blur" }
        ],
        retailPrice: [
          { required: true, message: "零售价不能为空", trigger: "blur" }
        ]
      }
    };
  },

  created() {
    this.fetchData();
  },

  methods: {
    fetchData() {
      goodsApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          this.total = resp.data.total;
          this.list = resp.data.rows;
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },

    optionSupplier(currentRow) {
      console.log(currentRow);
      if(this.isEdit){
          this.pojo.supplierName = currentRow.name;
          this.pojo.supplierID = currentRow.id;
      }else{
        this.searchMap.supplierName = currentRow.name;
        this.searchMap.supplierID = currentRow.id;
      }
      this.isEdit = false;
      this.dialogSupplierVisible = false;
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        // this.$nextTick()它是一个异步事件，当渲染结束 之后 ，它的回调函数才会被执行
        // 弹出窗口打开之后 ，需要加载Dom, 就需要花费一点时间，我们就应该等待它加载完dom之后，再进行调
        // 用resetFields方法，重置表单和清除样式
        this.$refs["pojoForm"].resetFields();
      });
    }, // 提交新增数据
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //验证通过，提交添加
          goodsApi.add(this.pojo).then(response => {
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
        } else {
          return false;
        }
      });
    },
    editOptionSupplier() {
      this.isEdit = true; // 是编辑窗口
      this.dialogSupplierVisible = true;
    },
    // 打开编辑窗口
    handleEdit(id){
        // 重用打开新增窗口方法, 不要少了 this
        this.handleAdd()
        goodsApi.getById(id).then(response => {
            const resp = response.data
            if(resp.flag){
                this.pojo = resp.data 
            }
        })
    },
    updateData(formName){
        this.$refs[formName].validate(valid => {
            if(valid){
                goodsApi.update(this.pojo).then(response => {
                    const resp = response.data
                    if(resp.flag){
                        this.fetchData()
                        this.dialogFormVisible = false
                    }else{
                        this.$message({
                            message:resp.message,
                            type:'warning'
                        })
                    }
                })
            }else{
                return false
            }
        })
    },
    handleDelete(id) {
      //console.log('删除')
      this.$confirm("确认删除这条记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //确认
        goodsApi.deleteById(id).then(response => {
          const resp = response.data;
          this.$message({
            message: resp.message,
            type: resp.flag ? "success" : "error"
          });
          if(resp.flag){
            //删除成功，刷新列表
            this.fetchData()
          }
        });
      }).catch(() => {
        // 取消删除，不理会
      })
    }
  }
};
</script>