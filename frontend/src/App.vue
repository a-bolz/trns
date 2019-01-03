<template>
  <div id="app">
    <div id="container">
      <h1>Admin Panel</h1>
      <div id="controls">
        <div class="menu_item" v-for="(item, index) in menu_items" :key="`${item}_${index}`">
          <span>{{item}}</span>
          <span class="arrow" @click="selected_module = item"> >>> </span>
        </div>
      </div>
      <div id="module">
        <div class="credentials">
          <button style="float: left" @click="hidec = !hidec">hide credentials</button>
          <br><br>
          <div v-if="!hidec" v-for="(value, k) in env">
            <span style="float:left">{{k}}: {{value}}</span>
            <br>
          </div>
        </div>
        <br><br>
        <div class="auth_res">
        <button @click="auth_teamleader">authenticate teamleader</button>
          {{auth_res}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'app',
  data() {
    return {
      hidec: false,
      menu_items: [
        'teamleader',
        'gmail',
      ],
      selected_module: 'teamleader',
      base_url: 'http://localhost:5000',
      env: {},
      auth_res: {},
    }
  },
  methods: {
    get_env() {
      return axios.get(`${this.base_url}/teamleader/get_env`);
    },
    auth_teamleader() {
      return axios.get(`${this.base_url}/auth/teamleader`).then(res => this.auth_res = res);
    },
  },
  created() {
    this.get_env().then(res => this.env = res.data);
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  height: 100%;
}

#container {
  margin: auto;
  width: 70%;
  height: 100%;
}

#controls {
  display: block;
  float: left;
  width: 20%;
  background-color: #f8f8f8;
  min-height: 80vh;
}

.menu_item {
  font-size: 22px;
  text-align: left;
  margin: 10px 20px;
}

.arrow {
  float: right;
  cursor: pointer;
  color: #e96900;
}

#module {
  width: 75%;
  background-color: #f8f8f8;
  float: right;
  min-height: 80vh;
}

.credentials {
  margin: 20px 20px;
}
</style>
