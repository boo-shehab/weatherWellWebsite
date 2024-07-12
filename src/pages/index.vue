
<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { useSocketStore } from '@/stores/WebSocket';
import { useRouter } from 'vue-router';
import axiosIns from '@/plugins/axios';

const router = useRouter();
const socketStore = useSocketStore();
const toggle = ref('Charts');
const user = JSON.parse(localStorage.getItem('user'));
const connected = computed(() => chatStore.connected);
const statistics = ref([]);
const statisticsLoading = ref(false);

const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  router.push('/login');
}

const changeType = (args) => {
  changeStatistics(args);
}
const changeStatistics = async (args) => {
  try {
    const sensor = socketStore.sensors.find(stat => stat.name === args.name);
    if (!sensor) {
      console.log('Sensor not found');
      return;
    }

    let response = null;
    if (args.type === 'day') {
      response = await axiosIns.get(`sensor-data/day/${sensor.sensorId}`);
    } else if (args.type === 'week') {
      response = await axiosIns.get(`sensor-data/week/${sensor.sensorId}`);
    } else {
      response = await axiosIns.get(`sensor-data/month/${sensor.sensorId}`);
    }

    const newDataValue = response.data.map((data) => data.dataValue);
    const statistic = statistics.value.find(stat => stat.name === args.name);
    if (statistic) {
      statistic.dataValue = newDataValue;
    }
  } catch (e) {
    console.log(e);
  }
}

const getStatistics = async (type) => {

  try{
    for(let i = 0 ; i < socketStore.sensors.length; i++){
      console.log(socketStore.sensors[i], sensorsLength.value)
      const response = await axiosIns.get(`sensor-data/day/${socketStore.sensors[i].sensorId}`);
      statistics.value.push({
        name: socketStore.sensors[i].name,
        dataValue: response.data.map((data) => data.dataValue)});
      console.log(statistics.value)
    }
  } catch(e) {
    console.log(e)
  }finally {
  }
}
onMounted(() => {
  // getStatistics('daily')
  socketStore.initializeSocket();
  // getSensorsType()
});

const sensorsLength = ref(0)
watch(socketStore.sensors, () => {
  if(socketStore.sensors.length !== sensorsLength.value && socketStore.sensors[0].sensorId){
    getStatistics('day')
    sensorsLength.value = socketStore.sensors.length;
  }
})

onBeforeUnmount(() => {
  socketStore.disconnectSocket();
});
</script>

<template>
  <VContainer class="">
    <VAppBar class="container" app dark>
      <VToolbarTitle>
      <VMenu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <VAvatar v-bind="attrs" v-on="on" v-if="userData !== undefined">
            <VImg src="@/assets/logo.png" />
          </VAvatar>
          <p class="d-none d-sm-block" v-bind="attrs" v-on="on" v-if="userData !== undefined">Health Insights</p>
        </template>
        <VList>
          <VListItem @click="logout">
            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      </VToolbarTitle>
      <VSpacer />

      <VBtn text to="/login" v-if="userData === undefined">Login</VBtn>
      <VBtn text to="/register" v-if="userData === undefined">Register</VBtn>
      <VBtn text @click="logout" v-if="userData !== undefined">log out</VBtn>
    </VAppBar>
    <VRow>
      <VCol cols="12" sm="6" md="4" lg="3" v-for="(sensor, index) in socketStore.sensors" :key="index">
        <VCard flat max-width="300" class="rounded-lg pa-3 mx-auto my-3 h-100">
          <VCardTitle>{{ sensor.name }}</VCardTitle>
          <VCardText>
            <!-- <RadialBarGauge /> -->
             <h1 class="my-4 text-center" style="font-size: 36px">{{sensor.value}}</h1>
            <h1 class="text-success text-center my-2"><span>{{ sensor.title}}</span></h1>
            {{ sensor.description}}
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

  <div class="d-flex flex-column align-center bg-grey-lighten-4 pa-6">
  </div>
  <GenerateChart v-for="(statistic, index) in statistics" :key="index" :data="statistic" @changeType="changeType"/>
    <VRow >

    </VRow>
  </VContainer>
</template>


<style>
.v-toolbar-title__placeholder {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
