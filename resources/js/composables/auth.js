import { ref, reactive, inject } from 'vue'
import { useRouter } from "vue-router";
import axios from 'axios';

const user = reactive({
    name: '',
    email: '',
    token: '',
})

let userRole = ref(0)

export default function useAuth() {
    const processing = ref(false)
    const validationErrors = ref({})
    const router = useRouter()
    const swal = inject('$swal')
    const loginForm = reactive({
        email: '',
        password: '',
        remember: false
    })

    const submitLogin = async () => {
        if (processing.value) return

        processing.value = true
        validationErrors.value = {}

        axios.post('/login', loginForm)
            .then(async response => {
                loginUser(response)
            })
            .catch(error => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors
                }
            })
            .finally(() => processing.value = false)
    }

    const loginUser = (response) => {
        user.name = response.data.user.name
        user.email = response.data.user.email
        user.token = response.data.token
        sessionStorage.setItem('loggedIn', JSON.stringify(true))
        sessionStorage.setItem('token', JSON.stringify(response.data.token))
        sessionStorage.setItem('name', JSON.stringify(response.data.user.name))
        sessionStorage.setItem('email', JSON.stringify(response.data.user.email))
        sessionStorage.setItem('role', JSON.stringify(response.data.user.role))
        userRole.value = response.data.user.role
        if (response.data.user.role == 0) {
            router.push({ name: 'home' })
        }
        else if (response.data.user.role == 1) {
            router.push({ name: 'admin.dashboard' })
        }
        else if (response.data.user.role == 2) {
            router.push({ name: 'teacher.dashboard' })
        }
    }

    const getUser = () => {
        if (JSON.parse(sessionStorage.getItem('loggedIn'))) {
            user.name = JSON.parse(sessionStorage.getItem('name'))
            user.email = JSON.parse(sessionStorage.getItem('email'))
            user.token = JSON.parse(sessionStorage.getItem('token'))
        }
    }

    const logout = async () => {
        if (processing.value) return

        processing.value = true

        axios.post('/logout')
            .then(response => {
                user.name = ''
                user.email = ''
                user.token = ''
                sessionStorage.removeItem('loggedIn')
                sessionStorage.removeItem('token')
                sessionStorage.removeItem('name')
                sessionStorage.removeItem('email')
                sessionStorage.removeItem('role')
                userRole.value = 0
                swal({
                    icon: 'success',
                    title: 'Logout Success',
                    text: 'You have been logged out!'
                }).then(() => {
                    router.push({ name: 'login' })
                })
            })
            .catch(error => {
                swal({
                    icon: 'error',
                    title: error.response.status,
                    text: error.response.statusText
                })
            })
            .finally(() => {
                processing.value = false
            })
    }

    const isStudentLoggedIn = () => {
        if (JSON.parse(sessionStorage.getItem('loggedIn'))) {
            // if (JSON.parse(sessionStorage.getItem('role')) == 0)
                return true
        }
        return false
    }

    const getUserRole = () => {
        if (JSON.parse(sessionStorage.getItem('loggedIn'))) {
            return JSON.parse(sessionStorage.getItem('role'))
        }
        return 0
    }

    return { loginForm, validationErrors, processing, submitLogin, user, getUserRole, getUser, logout, isStudentLoggedIn }
}
