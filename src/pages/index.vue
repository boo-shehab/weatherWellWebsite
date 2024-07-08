
<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { useSocketStore } from '@/stores/WebSocket';
import { useRouter } from 'vue-router';

const router = useRouter();

const socketStore = useSocketStore();
const toggle = ref('Charts');
const connected = computed(() => chatStore.connected);
const statistics = ref([]);
const statisticsLoading = ref(false);

const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  router.push('/login');
}

const changeType = (year) => {
  getStatistics(year);
}

const getStatistics = async (type) => {

  try{
    statistics.value = []
    let response;
    if(type === 'daily') {
      response = await fetch(`http://192.168.223.69:3000/api/sensors-data/daily/baghdad`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      response = await fetch('http://192.168.223.69:3000/api/sensors-data/weekly/baghdad', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data)
    if(type === 'daily')
      statistics.value = data;
    else
      statistics.value = data.reverse();

  } catch(e) {
    console.log(e)
  }finally {
  }
}
getStatistics('daily')
onMounted(() => {
  socketStore.initializeSocket();
  const userData = localStorage.getItem('user');
  console.log(userData)
});

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
      <VCol cols="12" sm="6" md="4" lg="3">
        <VCard flat max-width="300" class="rounded-lg pa-3 mx-auto my-3 h-100">
          <VCardTitle>gas</VCardTitle>
          <VCardText>
            <!-- <RadialBarGauge /> -->
             <h1 class="my-4 text-center" style="font-size: 36px">{{socketStore.data?.sensorValue}}</h1>
            <h1 class="text-success text-center my-2"><span>{{ socketStore.data?.sensorValueTitle}}</span></h1>
            {{ socketStore.data?.sensorValueDescription}}
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" md="4" lg="3">
        <VCard flat max-width="300" class="rounded-lg pa-3 mx-auto my-3 h-100">
          <VCardTitle>Dust</VCardTitle>
          <VCardText>
            <!-- <RadialBarGauge /> -->

            <h1 class="my-4 text-center" style="font-size: 36px">{{socketStore.data?.dsmConsentrate}}</h1>
            <h1 class="text-success text-center my-2"><span>{{socketStore.data?.airQualityLabel}}</span></h1>
            {{  socketStore.data?.dsmConsentrateDescription }}
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" md="4" lg="3">
        <VCard flat max-width="300" class="rounded-lg pa-3 mx-auto my-3 h-100">
          <VCardTitle>temperature</VCardTitle>
          <VCardText>
            <!-- <RadialBarGauge :dataTitle="socketStore.data?.tempC" /> -->
            <h1 class="my-4 text-center my-2" style="font-size: 36px">{{socketStore.data?.tempC}}</h1>
            <h1 class="text-success text-center"><span>{{ socketStore.data?.tempCTitle}}</span></h1>
            {{ socketStore.data?.tempCDescription }}
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" md="4" lg="3">
        <VCard flat max-width="300" class="rounded-lg pa-3 mx-auto my-3 h-100">
          <VCardTitle>humidity</VCardTitle>
          <VCardText>
            <!-- <RadialBarGauge :dataTitle="socketStore.data?.humi"/> -->
            <h1 class="my-4 text-center" style="font-size: 36px">{{socketStore.data?.humi}}</h1>
            <h1 class="text-success text-center my-2"><span>{{ socketStore.data?.humiTitle}}</span></h1>
            {{ socketStore.data?.humiConsentrateDescription }}
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

  <div class="d-flex flex-column align-center bg-grey-lighten-4 pa-6">
    <!-- <v-btn-toggle
      v-model="toggle"
      color="primary"
      mandatory
    >
      <v-btn icon="mdi-chart-line" value="Charts"></v-btn>
      <v-btn icon="mdi-table" value="Table"></v-btn>
    </v-btn-toggle> -->
  </div>
  <GenerateChart :data="statistics" @changeType="changeType"/>
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
