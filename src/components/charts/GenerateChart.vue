<script setup>
import { ref, watch } from 'vue';
// import { useStatisticsStore } from '@/store/StatisticsStore';

// const usersOverview = useStatisticsStore();
const props = defineProps(['data']);
const emit = defineEmits(['changeType']);
const isLoading = ref(false);
const startedYear = 2012;
const type = ref(['daily', 'weekly']);
const year = ref('daily');

const tempC = ref([]);
const humi = ref([]);
const dsmConsentrate = ref([]);
const sensorValue = ref([]);

const series = ref([
  { name: 'Temperature (C)', data: [] },
  { name: 'Humidity', data: [] },
  { name: 'DSM Concentrate', data: [] },
  { name: 'Sensor Value', data: [] }
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

const fetchData = async () => {
  isLoading.value = true;
  const { start, end } = years[year.value];
  console.log("Fetching data for year:", year.value);
  console.log("Start date:", start);
  console.log("End date:", end);
  // await usersOverview.generationsOverview(start, end);
  // series.value[0].data = usersOverview.generations.data;
  isLoading.value = false;
};

watch(year, () => {
  emit('changeType', year.value);
});

watch(() => props.data, (newData) => {
  console.log("Received new data:", newData);
  tempC.value = [];
  humi.value = [];
  dsmConsentrate.value = [];
  sensorValue.value = [];

  newData.forEach(item => {
    tempC.value.push(item.tempC);
    humi.value.push(item.humi);
    dsmConsentrate.value.push(item.dsmConsentrate);
    sensorValue.value.push(item.sensorValue);
  });

  console.log("Temperature data:", tempC.value);
  console.log("Humidity data:", humi.value);
  console.log("DSM Concentrate data:", dsmConsentrate.value);
  console.log("Sensor Value data:", sensorValue.value);

  series.value[0].data = tempC.value;
  series.value[1].data = humi.value;
  series.value[2].data = dsmConsentrate.value;
  series.value[3].data = sensorValue.value;
});
</script>

<template>
  <v-sheet class="pa-6 rounded-xl">
    <v-row>
      <v-col>
        <p class="text-primary weight-700">Air quality</p>
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
  background-color: white;
}
</style>
