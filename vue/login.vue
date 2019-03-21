<template>
  <div>
    <form @submit="onSubmit($event)">
      <h1>Login Below!</h1>
      <input
        type="text"
        name="username"
        placeholder="Enter username"
        v-model="userName"
        required="true"
      />
      <input
        type="password"
        name="password"
        placeholder="Enter password"
        v-model="password"
        required="true"
      />
      <input type="submit" value="Submit"/>
    </form>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      userName: '',
      password: '',
    }
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      fetch('/user/authenticate', {
        method: 'POST',
        body: JSON.stringify({userName: this.userName, password: this.password}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.status === 200) {
            console.log(this.urls);
            window.location.href = this.urls.homepage
          } else {
            throw 'authentication failed';
          }
        })
        .catch(err => {
          console.log(err);
          alert("Error logging in please try again");
        })
    },
  }
}
</script>
