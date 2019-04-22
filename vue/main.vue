<template>
  <div class="wrapper">
    <div class="deal" v-for="deal in deals">
      <span class="name">{{deal.contactFirstName}} {{ deal.contactLastName }}</span>
      <span class="company">{{ deal.companyName }}</span>
      <span class="rating">{{ deal.rating }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      greeting: 'hey',
      deals: null,
    }
  },
  mounted() {
    console.log(this.deals);
  },
}
</script>

<style>
 .wrapper {
   margin: auto;
   width:1000px;
   background: lightgray;
 }
 .deal {
   width: 90%;
   background: green;
   margin: auto;
 }
</style>
