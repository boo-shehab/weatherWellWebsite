
<script lang="ts" setup>
import { emailRule, passwordRule, NamesRule, requiredRule } from '@/utils/rules'

import { useRouter } from 'vue-router';

const router = useRouter();
const user = ref({
  Name: '',
  Email: '',
  Password: '',
  Location: '',
  Purpose: ''
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
const form = ref(null);

const postData = async() => {
  try {
    const isValid = await (form.value as any)?.validate();
    if (!isValid.valid) return;
    isLoading.value = true;

    const response = await fetch('http://192.168.223.69:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: user.value.Name,
        email: user.value.Email,
        password: user.value.Password,
        location: user.value.Location,
        purpose: user.value.Purpose
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    console.log(data)
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
  const response = await fetch('http://192.168.223.69:3000/api/purpose', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();
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
    const response = await fetch('http://192.168.223.69:3000/api/location', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    locations.value = data
    console.log(locations.value)

  } catch(e) {
    console.log(e);
  } finally {
    isLocationLoading.value = false
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
              :items="locations"
              item-title="name"
              item-value="name"
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
                :loading="isPurposeLoading"
                :items="purposes"
                item-title="name"
                item-value="name"
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
