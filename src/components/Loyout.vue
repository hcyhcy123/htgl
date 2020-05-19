<template>
  <div>
    <app-header></app-header>
    <app-navbar></app-navbar>
    <app-main></app-main>
  </div>
</template>
<script>
import AppHeader from './AppHeader'
import AppNavbar from './AppNavbar'
import AppMain from './AppMain'

export default {
    components:{AppHeader,AppNavbar,AppMain}
}
</script>

<style >
    .header{
        position: absolute;
        top:0;left: 0;right: 0;
        line-height: 50px;
        background: #2d3a4b;
    }
    .navbar{
        position: absolute;
        width: 230px;
        top:50px;left: 0;bottom:0;
        line-height: 50px;
        background:#545c64;
        overflow-y: auto;
    }
    .main{
        position: absolute;
        top:50px;left:230px;bottom: 0;right: 0;
        padding: 10px;
        /* background: cornflowerblue; */
        overflow-y: auto;

    }
</style>
