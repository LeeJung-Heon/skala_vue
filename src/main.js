/**
 * [실습] Pinia · Vue Router 등록
 * - createPinia(): 전역 스토어 (configStore · weatherStore)
 * - router: 클라이언트 사이드 라우팅
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
