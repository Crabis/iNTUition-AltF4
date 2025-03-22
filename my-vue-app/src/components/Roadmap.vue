<template>
  <div class="roadmap">
    <h2>{{ data.title }}</h2>
    <ul>
      <li v-for="(milestone, index) in data.milestones" :key="index">
        {{ milestone.name }} - {{ milestone.date }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Roadmap',
  props: {
    data: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.roadmap {
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
}
</style>
