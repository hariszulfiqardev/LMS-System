import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios';

export default function useCourses() {
    const swal = inject('$swal')
    const processing = ref(false)
    const courses = ref({})
    const teachers = ref({})
    const course = ref({})
    const router = useRouter()
    const validationErrors = ref({})

    const getCourses = async (
        page = 1,
        order_column = 'created_at',
        order_direction = 'desc',
        search = ''
    ) => {
        axios.get('/api/get-courses', {
            params: {
                page: page,
                order_column: order_column,
                order_direction: order_direction,
                search: search
            }
        })
            .then(response => {
                console.log(response.data);
                courses.value = response.data;
            })
    }

    const storeCourse = async (course) => {
        if (processing.value) return

        processing.value = true
        validationErrors.value = {}

        axios.post('/api/courses', course)
            .then(response => {
                swal({
                    icon: 'success',
                    title: 'Course saved successfully'
                }).then(() => {
                    router.push({ name: 'admin.courses' })
                })
            })
            .catch(error => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors
                }
            })
            .finally(() => processing.value = false)
    }

    const getCourse = async (id) => {
        axios.get('/api/courses/' + id)
            .then(response => {
                course.value = response.data.data;
            })
    }

    const updateCourse = async (course) => {
        if (processing.value) return;

        processing.value = true
        validationErrors.value = {}

        axios.put('/api/courses/' + course.id, course)
            .then(response => {
                swal({
                    icon: 'success',
                    title: 'Course updated successfully'
                }).then(() => {
                    router.push({ name: 'admin.courses' })
                })
            })
            .catch(error => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors
                }
            })
            .finally(() => processing.value = false)
    }

    const deleteCourse = async (id) => {
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
                    axios.delete('/api/courses/' + id)
                        .then(response => {
                            getCourses()
                            router.push({ name: 'admin.courses' })
                            swal({
                                icon: 'success',
                                title: 'Course deleted successfully'
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


    const getTeachers = async () => {
        axios.get('/api/teachers-list')
            .then(response => {
                teachers.value = response.data;
            })
    }

    return { courses, getCourses, storeCourse, validationErrors, processing, course, getCourse, updateCourse, deleteCourse, teachers, getTeachers }
}
