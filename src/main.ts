/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import VueApexCharts from 'vue3-apexcharts'
// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)
app.use(VueApexCharts)
app.component('apexchart', VueApexCharts)

app.mount('#app')
