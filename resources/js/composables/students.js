import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios';

export default function useStudents() {
    const swal = inject('$swal')
    const processing = ref(false)
    const students = ref({})
    const student = ref({})
    const router = useRouter()
    const validationErrors = ref({})
    const enrolledCoursesStore = ref({})
    const enrolledCourseDetailStore = ref({})

    const getStudents = async (
        page = 1,
        order_column = 'created_at',
        order_direction = 'desc'
    ) => {
        axios.get('/api/students', {
            params: {
                page: page,
                order_column: order_column,
                order_direction: order_direction
            }
        })
            .then(response => {
                students.value = response.data;
            })
    }

    const enrolledCourses = async () => {
        axios.get('/api/student-enrolled-courses', {})
            .then(response => {
                enrolledCoursesStore.value = response.data;
            })
            .catch(error => {
                if (error.response?.status === 401) {
                    router.push({ name: 'login' })
                    return
                }
            })
    }

    const enrolledCourseDetail = async (id) => {
        axios.get('/api/student-enrolled-course-detail/' + id, {})
            .then(response => {
                console.log(response.data);
                enrolledCourseDetailStore.value = response.data;
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
                        router.push({ name: 'student.dashboard' })
                    })
                }
            })
    }

    const startQuiz = async (id) => {
        if (processing.value) return

        processing.value = true

        return axios.post('/api/student/start-quiz/' + id)
            .then(response => {
                return true
            })
            .catch(error => {
                if (error.response?.status === 401) {
                    router.push({ name: 'login' })
                    return;
                }
                return false;
            })
            .finally(() => processing.value = false)
    }

    const submitQuiz = async (id, answers) => {
        if (processing.value) return

        processing.value = true

        return axios.post('/api/student/submit-quiz/' + id, {
            answers: answers
        })
            .then(response => {
                return true
            })
            .catch(error => {
                return false;
            })
            .finally(() => processing.value = false)
    }

    const storeStudent = async (student) => {
        if (processing.value) return

        processing.value = true
        validationErrors.value = {}

        axios.post('/api/students', student)
            .then(response => {
                const role = JSON.parse(sessionStorage.getItem('role'))

                swal({
                    icon: 'success',
                    title: role == 1 ? 'Student saved successfully' : 'Account created successfully'
                }).then(() => {
                    if(role == 1){
                        router.push({ name: 'admin.students' })
                    }
                    else{
                        router.push({ name: 'login' })
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

    const getStudent = async (id) => {
        axios.get('/api/students/' + id)
            .then(response => {
                student.value = response.data.data;
            })
    }

    const updateStudent = async (student) => {
        if (processing.value) return;

        processing.value = true
        validationErrors.value = {}

        axios.put('/api/students/' + student.id, student)
            .then(response => {
                swal({
                    icon: 'success',
                    title: 'Student updated successfully'
                }).then(() => {
                    router.push({ name: 'admin.students' })
                })
            })
            .catch(error => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors
                }
            })
            .finally(() => processing.value = false)
    }

    const deleteStudent = async (id) => {
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
                    axios.delete('/api/students/' + id)
                        .then(response => {
                            getStudents()
                            router.push({ name: 'admin.students' })
                            swal({
                                icon: 'success',
                                title: 'Student deleted successfully'
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

    return { students, getStudents, storeStudent, validationErrors, processing, student, getStudent, updateStudent, deleteStudent,
         enrolledCourses, enrolledCoursesStore, enrolledCourseDetail, enrolledCourseDetailStore, startQuiz, submitQuiz }
}
