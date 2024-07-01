import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { createApp, onMounted } from 'vue'
import router from './routes/index'
import useAuth from './composables/auth';
import VueSweetalert2 from 'vue-sweetalert2';


createApp({
    setup() {
        const { getUser } = useAuth()
        onMounted(getUser)
    }
})
    .use(router)
    .use(VueSweetalert2)
    .mount('#app')
