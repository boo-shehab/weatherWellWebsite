<script setup>
import { ref, watch } from 'vue';

const props = defineProps(['data']);
const emit = defineEmits(['changeType']);
const isLoading = ref(false);
const type = ref(['day', 'week', 'month']);
const year = ref('day');

const series = ref([
  { name: props.data.name, data: props.data.dataValue }
]);

const chartOptions = ref({
  chart: {
    toolbar: false
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
  },
  tooltip: {
    x: {
      format: 'dd/MM/yy'
    },
  },
  fill: {
    opacity: 0
  }
});

watch(year, () => {
  emit('changeType', {type: year.value, name: props.data.name} );
});

watch(props.data, (newData) => {
  series.value[0].data = newData.dataValue;
});
</script>

<template>
  <v-sheet class="pa-6 rounded-xl">
    <v-row>
      <v-col>
        <p class="text-primary weight-700">{{props.data?.name}}</p>
      </v-col>
      <v-spacer></v-spacer>
      <v-col>
        <v-combobox v-model="year" :items="type" class="input-border combobox" flat></v-combobox>
      </v-col>
    </v-row>
    <div v-if="isLoading">
      <v-progress-linear indeterminate color="primary"></v-progress-linear>
    </div>
    <div id="chart" v-else>
      <apexchart type="area" height="350" :zoom="false" :options="chartOptions" :series="series"></apexchart>
    </div>
  </v-sheet>
</template>

<style>
.combobox .v-field__outline {
  display: none;
}

.combobox .v-field__overlay {
  width: 107px;
  height: 40px;
  padding: 8px 16px;
  opacity: 0;
  background-color: white !important;
}
</style>
