import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios';

export default function useTeachers() {
    const swal = inject('$swal')
    const processing = ref(false)
    const teachers = ref({})
    const teacher = ref({})
    const router = useRouter()
    const validationErrors = ref({})
    const coursesStore = ref({})
    const courseDetailStore = ref({})


    const getTeachers = async (
        page = 1,
        order_column = 'created_at',
        order_direction = 'desc'
    ) => {
        axios.get('/api/teachers', {
            params: {
                page: page,
                order_column: order_column,
                order_direction: order_direction
            }
        })
            .then(response => {
                teachers.value = response.data;
            })
    }

    const courses = async () => {
        axios.get('/api/teacher-courses', {})
            .then(response => {
                coursesStore.value = response.data;
            })
            .catch(error => {
                if (error.response?.status === 401) {
                    router.push({ name: 'login' })
                    return
                }
            })
    }

    const courseDetail = async (
        id,
    ) => {
        axios.get('/api/teacher-course-detail/' + id, {})
            .then(response => {
                courseDetailStore.value = response.data;
            })
            .catch(error => {
                if (error.response?.status === 401) {
                    router.push({ name: 'login' })
                    return
                }
                if(error.response?.status === 403) {
                    swal({
                        icon: 'error',
                        title: 'Access Denied',
                        text: error.response.data.message
                    }).then(() => {
                        router.push({ name: 'teacher.dashboard' })
                    })
                }
            })
    }

    const storeTeacher = async (teacher) => {
        if (processing.value) return

        processing.value = true
        validationErrors.value = {}

        axios.post('/api/teachers', teacher)
            .then(response => {
                swal({
                    icon: 'success',
                    title: 'Teacher saved successfully'
                }).then(() => {
                    router.push({ name: 'admin.teachers' })
                })
            })
            .catch(error => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors
                }
            })
            .finally(() => processing.value = false)
    }

    const getTeacher = async (id) => {
        axios.get('/api/teachers/' + id)
            .then(response => {
                teacher.value = response.data.data;
            })
    }

    const updateTeacher = async (teacher) => {
        if (processing.value) return;

        processing.value = true
        validationErrors.value = {}

        axios.put('/api/teachers/' + teacher.id, teacher)
            .then(response => {
                swal({
                    icon: 'success',
                    title: 'Teacher updated successfully'
                }).then(() => {
                    router.push({ name: 'admin.teachers' })
                })
            })
            .catch(error => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors
                }
            })
            .finally(() => processing.value = false)
    }

    const deleteTeacher = async (id) => {
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
                    axios.delete('/api/teachers/' + id)
                        .then(response => {
                            getTeachers()
                            router.push({ name: 'admin.teachers' })
                            swal({
                                icon: 'success',
                                title: 'Teacher deleted successfully'
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

    return { teachers, getTeachers, storeTeacher, validationErrors, processing, teacher, getTeacher, updateTeacher, deleteTeacher, courses, coursesStore, courseDetail, courseDetailStore }
}
