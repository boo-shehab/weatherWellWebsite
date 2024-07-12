
<script lang="ts" setup>
import axiosIns from '@/plugins/axios';
import { emailRule, passwordRule, NamesRule, requiredRule } from '@/utils/rules'

import { useRouter } from 'vue-router';

const router = useRouter();
const user = ref({
  Name: '',
  Email: '',
  Password: '',
  Location: '',
  Purpose: []
})
const visible = ref(false)
const confirmVisible = ref(false)
const isLoading = ref(false)
const isValid = ref(false);
const isPurposeLoading = ref(false);
const isLocationLoading = ref(false);
const confirmPassword = ref('')
const purposes = ref([]);
const locations = ref([])
const controllers = ref([])
const form = ref(null);

const postData = async() => {
  try {
    const isValid = await (form.value as any)?.validate();
    if (!isValid.valid) return;
    isLoading.value = true;

    const response = await axiosIns.post('user/register',{
      name: user.value.Name,
      email: user.value.Email,
        password: user.value.Password,
        locationId: user.value.Location,
      },
    );

    const data = await response.data;
    for(let i =0 ; i < user.value.Purpose.length; i++)
    await axiosIns.post('user-disease', {
      userId: data.userInfo.id,
      diseaseId: user.value.Purpose[i]
    })

    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('user', JSON.stringify(data.userInfo))

    router.push('/');

  }catch(e) {
    console.log(e);
  }finally {
    isLoading.value = false;
  }
}

const getPurpose = async () => {

try {
  isPurposeLoading.value = true;
  const response = await axiosIns.get('disease')

  const data = response.data;
  purposes.value = data

  console.log(purposes.value)

} catch(e) {
  console.log(e);
} finally {
  isPurposeLoading.value = false
}

}
const getLocation = async () => {

  try {
    isLocationLoading.value = true;
    const response = await axiosIns.get('location');

    const data = response.data;
    locations.value = data
    console.log(locations.value)
    locations.value.map((loc) => {
      getAllControler(loc)
    })

  } catch(e) {
    console.log(e);
  } finally {
    isLocationLoading.value = false
  }
}

const getAllControler = async(loc) => {
  try {
    const {data} = await axiosIns.get(`controller?locationId=${loc.id}`);
    for(let i = 0; i < data.length; i++) {
      data[i].name = `${loc.name}, ${data[i].name}`
    }
    controllers.value.push(...data)
  } catch(e) {
    console.log(e)
  }
}

onMounted(() => {
  getPurpose();
  getLocation();
})
</script>
<template>
  <VContainer>
    <div class="loginContainer">
      <VImg src="@/assets/logo.png" width="64" height="64" class="mx-auto " />
      <h1 class="mx-auto text-center">register</h1>
      <p class="mx-auto text-center pb-12">we are here to help you with your allergy </p>

      <VCard max-width="500" class="mx-auto mt-24 rounded-lg">
        <VCardText>
          <VForm ref="form" v-model="isValid" @submit.prevent="postData">

            <v-text-field
              v-model="user.Name"
              label="username"
              filled
              rounded="lg"
              dense
              :rules="NamesRule"
              variant="outlined"
              class="mt-2 mb-2"
              flat/>

              <VAutocomplete
              v-model="user.Location"
              label="Location"
              filled
              rounded="lg"
              dense
              :loading="isLocationLoading"
              :items="controllers"
              item-title="name"
              item-value="id"
              :rules="requiredRule"
              variant="outlined"
              class="mt-2 mb-2"
              flat />

              <VAutocomplete
                v-model="user.Purpose"
                label="Purpose"
                filled
                rounded="lg"
                dense
                multiple
                chips
                :loading="isPurposeLoading"
                :items="purposes"
                item-title="name"
                item-value="id"
                :rules="requiredRule"
                variant="outlined"
                class="mt-2 mb-2"
                flat />

            <VTextField
              v-model="user.Email"
              label="Email"
              filled
              rounded="lg"
              dense
              :rules="emailRule"
              variant="outlined"
              class="mt-2 mb-2"
              flat/>

              <VTextField
              v-model="user.Password"
              label="Password"
              :prepend-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
              :type="visible ? 'text' : 'password'"
              @click:prepend-inner="visible = !visible"
              filled
              rounded="lg"
              dense
              :rules="passwordRule"
              variant="outlined"
              class="mt-2 mb-2"
              flat/>

              <VTextField
              v-model="confirmPassword"
              label="Confirm Password"
              :prepend-inner-icon="confirmVisible ? 'mdi-eye' : 'mdi-eye-off'"
              :type="confirmVisible ? 'text' : 'password'"
              @click:prepend-inner="confirmVisible = !confirmVisible"
              filled
              rounded="lg"
              dense
              :rules="passwordRule"
              variant="outlined"
              class="mt-2 mb-2"
              flat/>

            <VBtn
              block
              :loading="isLoading"
              class=" rounded-lg mt-4"
              type="submit"
              color="primary">Login
            </VBtn>
          </VForm>
          <p class="mt-3">do you have an account? <router-link to="/login">login</router-link></p>
        </VCardText>
      </VCard>
    </div>
  </VContainer>
</template>


<style scoped>
.loginContainer {
  position: absolute;
  left: 50%;
  top: 50%;
  min-width: 500px;
  transform: translate(-50%, -50%);
}
</style>
