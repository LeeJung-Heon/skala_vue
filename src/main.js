import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'

// 스타일 로드 순서가 곧 우선순위입니다.
// main(Vue 기본) → element-plus → practice(실습 공통) → exercise(과제 위젯) → layout(앱 셸 · 최종 조정)
import './assets/main.css'
import 'element-plus/dist/index.css'
import './assets/practice.css'
import './assets/exercise.css'
import './assets/layout.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
