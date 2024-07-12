<template>
  <div>
    <apexchart type="radialBar" :options="chartOptions" :series="series" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps(['dataTitle']);

const series = ref([props.dataTitle || 0]);
const chartOptions = ref({
  chart: {
    height: 350,
    type: 'radialBar',
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: '70%',
      },
      dataLabels: {
        show: true,
        name: {
          show: true,
          offsetY: -10,
        },
        value: {
          show: true,
          fontSize: '22px',
          offsetY: 10,
        },
      },
    },
  },
  colors: ['#4CAF50'],
  labels: [`${props.dataTitle}` || ''],
});

// Watch for changes in props.dataTitle and update series and labels
watch(() => props.dataTitle, (newValue) => {
  series.value = [newValue];
  chartOptions.value.labels = [`${newValue}`];
});
</script>

<style scoped>
/* Add any necessary styling here */
</style>
