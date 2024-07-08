<script setup>
import { ref, watch } from 'vue';
// import { useStatisticsStore } from '@/store/StatisticsStore';

// const usersOverview = useStatisticsStore();
const isLoading = ref(false);

const items = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const month = ref(items[new Date().getMonth()]);

function getLast12MonthsDatesWithNames() {
  const currentDate = new Date();
  const last12MonthsDates = {};

  for (let i = 0; i < 12; i++) {
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);

    const monthName = items[firstDayOfMonth.getMonth()];

    last12MonthsDates[monthName] = {
      start: firstDayOfMonth.toISOString(),
      end: lastDayOfMonth.toISOString()
    };
  }

  return last12MonthsDates;
}

const last12MonthsDatesWithNames = getLast12MonthsDatesWithNames();

const series = ref([{
  name: 'Generated',
  data: []
}]);
const chartOptions = ref({
  chart: {
    height: 350,
    type: 'bar',
    toolbar: false
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  xaxis: {
    type: 'string',
    categories: []
  },
  tooltip: {
    x: {
      format: 'dd/MM/yy HH:mm'
    },
  },
});

const fetchDummyData = () => {
  const dummyCategories = Array.from({ length: 30 }, (_, i) => `User ${i + 1}`);
  const dummyData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 100));

  chartOptions.value.xaxis.categories = dummyCategories;
  series.value[0].data = dummyData;
  isLoading.value = false;
}

const fetchData = async () => {
  isLoading.value = true;
  const { start, end } = last12MonthsDatesWithNames[month.value];
  // await usersOverview.usersOverview(start, end);
  // chartOptions.value.xaxis.categories = usersOverview.users.data.map(item => item.name);
  // series.value[0].data = usersOverview.users.data.map(item => item.count);
  fetchDummyData();
  isLoading.value = false;
}

watch(month, fetchData, { immediate: true });
</script>

<template>
  <v-sheet class="pa-6 rounded-xl">
    <v-row>
      <v-col>
        <p class="text-primary weight-700">Users Overview</p>
      </v-col>
      <v-spacer></v-spacer>
      <v-col>
        <v-combobox v-model="month" :items="items" class="input-border combobox" flat></v-combobox>
      </v-col>
    </v-row>
    <div v-if="isLoading">
      <v-progress-linear indeterminate color="primary"></v-progress-linear>
    </div>
    <div id="chart" v-else>
      <apexchart type="bar" :zoom="false" height="350" :options="chartOptions" :series="series"></apexchart>
    </div>
  </v-sheet>
</template>

<style>
.combobox .v-field__outline{
  display: none;
}
.combobox .v-field__overlay {
  width: 107px;
  height: 40px;
  padding: 8px 16px;
  background-color: white;
}
</style>
