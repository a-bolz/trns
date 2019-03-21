<template>
  <div>
    <ul>
      <li><a :href="urls.secretpage">secret</a></li>
      <li><a :href="urls.homepage">home</a></li>
    </ul>
    <span>the secret is: {{secret}}</span>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      secret: 'unknown',
    }
  },
  mounted() {
    this.getSecret()
  },
  methods: {
    getSecret() {
      fetch(this.urls.secret)
        .then(res => {
          if (res.status === 200) return res.json();
          if (res.status === 401) window.location.href = this.urls.login;
          throw res.statusText
        })
        .then(res => this.secret = res.secret)
        .catch(err => console.log(err))
    }
  }
}
</script>
