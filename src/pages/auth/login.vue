
<script lang="ts" setup>
import { emailRule, passwordRule } from '@/utils/rules'
import { useRouter } from 'vue-router';

const router = useRouter();
const visible = ref(false)
const isLoading = ref(false)
const isValid = ref(false)
const user = ref({
email: '',
password: ''
})

const form = ref(null);

const postData = async() => {
  try {
    const isValid = await (form.value as any)?.validate();
    if (!isValid.valid) return;
    isLoading.value = true;

    const response = await fetch('http://192.168.223.69:3000/api/auth/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user.value),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('user', JSON.stringify(data.userInfo))
    router.push('/')


  }catch(e) {
    console.log(e);
  }finally {
    isLoading.value = false;
  }
}
</script>
<template>
  <VContainer>
    <div class="loginContainer">
      <VImg src="@/assets/logo.png" width="64" height="64" class="mx-auto " />
      <h1 class="mx-auto text-center">Login</h1>
      <p class="mx-auto text-center pb-12">good to see you again :)</p>

      <VCard max-width="500" class="mx-auto mt-24 rounded-lg">
        <VCardText>
          <VForm ref="form" v-model="isValid" @submit.prevent="postData">

            <VTextField
              v-model="user.email"
              label="Email"
              filled
              rounded="lg"
              dense
              :rules="emailRule"
              variant="outlined"
              class="mt-2 mb-2"
              flat/>

            <VTextField
              v-model="user.password"
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

            <VBtn
              block
              :loading="isLoading"
              :disabled="!isValid"
              class=" rounded-lg mt-4"
              type="submit"
              color="primary">Login</VBtn>
          </VForm>
          <p class="mt-3">Don't have an account? <router-link to="/register">Register</router-link></p>
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
