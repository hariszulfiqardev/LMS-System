import { inject } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios';

export default function usePayment() {
    const swal = inject('$swal')
    const router = useRouter()

    const enrollCourse = async (courseId) => {

        axios.post('/api/enroll-course/' + courseId)
            .then(response => {
                swal({
                    icon: 'success',
                    title: 'Course enrolled successfully',
                    text: 'Redirecting to the dashboard...'
                }).then(() => {
                    router.push({ name: 'student.dashboard' })
                })
            })
            .catch(error => {
                if (error.response?.status === 401) {
                    router.push({ name: 'login' })
                    return
                }
                swal({
                    icon: 'error',
                    title: 'Course enrolled failed',
                    text: 'Something went wrong'
                }).then(() => {
                })
            })
            .finally()
    }

    return { enrollCourse }
}
