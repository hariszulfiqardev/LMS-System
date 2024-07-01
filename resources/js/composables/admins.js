import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios';

export default function useAdmins() {
    const swal = inject('$swal')
    const processing = ref(false)
    const isLoggedUser = ref(false)
    const admins = ref({})
    const admin = ref({})
    const router = useRouter()
    const validationErrors = ref({})

    const getAdmins = async (
        page = 1,
        order_column = 'created_at',
        order_direction = 'desc'
    ) => {
        axios.get('/api/admins', {
            params: {
                page: page,
                order_column: order_column,
                order_direction: order_direction
            }
        })
            .then(response => {
                admins.value = response.data;
            })
    }

    const storeAdmin = async (admin) => {
        if (processing.value) return

        processing.value = true
        validationErrors.value = {}

        axios.post('/api/admins', admin)
            .then(response => {
                swal({
                    icon: 'success',
                    title: 'Admin saved successfully'
                }).then(() => {
                    router.push({ name: 'admin.admins' })
                })
            })
            .catch(error => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors
                }
            })
            .finally(() => processing.value = false)
    }

    const getAdmin = async (id) => {
        axios.get('/api/admins/' + id)
            .then(response => {
                admin.value = response.data.data;
                if (JSON.stringify(response.data.data.email) == sessionStorage.getItem('email')) {
                    isLoggedUser.value = true
                }
                else {
                    isLoggedUser.value = false
                }
            })
    }

    const updateAdmin = async (admin) => {
        if (processing.value) return;

        processing.value = true
        validationErrors.value = {}

        axios.put('/api/admins/' + admin.id, admin)
            .then(response => {
                swal({
                    icon: 'success',
                    title: 'Admin updated successfully'
                }).then(() => {
                    router.push({ name: 'admin.admins' })
                    if (isLoggedUser.value) {
                        sessionStorage.removeItem('loggedIn')
                        location.assign('/login')
                    }
                })
            })
            .catch(error => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors
                }
            })
            .finally(() => processing.value = false)
    }

    const deleteAdmin = async (id) => {
        swal({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this action!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            confirmButtonColor: '#ef4444',
            timer: 20000,
            timerProgressBar: true,
            reverseButtons: true
        })
            .then(result => {
                if (result.isConfirmed) {
                    axios.delete('/api/admins/' + id)
                        .then(response => {
                            getAdmins()
                            router.push({ name: 'admin.admins' })
                            swal({
                                icon: 'success',
                                title: 'Admin deleted successfully'
                            })
                        })
                        .catch(error => {
                            swal({
                                icon: 'error',
                                title: 'Something went wrong'
                            })
                        })
                }
            })
    }

    const getIsLoggedUser = (email) => {
        if (JSON.stringify(email) == sessionStorage.getItem('email')) {
            return true
        }
        else {
            return false
        }
    }

    return { admins, getAdmins, storeAdmin, validationErrors, processing, admin, getAdmin, updateAdmin, isLoggedUser, deleteAdmin, getIsLoggedUser }
}
