<template>
  <div>
    <ul>
      <li><a :href="urls.secretpage">secret</a></li>
      <li><a :href="urls.homepage">home</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      greeting: 'hey',
    }
  }

}
</script>
