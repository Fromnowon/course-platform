<template>
  <div class="content">
    <a-skeleton/>
    <a-skeleton/>
    <a-skeleton/>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  mounted() {
    let data = JSON.parse(this.data);
    this.$axios
      .get("api/courseConfig", {
        param: {
          userID: data.userID,
          courseID: data.courseID
        }
      })
      .then(result => {
          
      })
      .catch(err => {});
  },
  props: ["data"]
};
</script>
<style lang="scss" scoped>
</style>
