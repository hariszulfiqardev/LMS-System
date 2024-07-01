import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios';

export default function useQuizzes() {
    const swal = inject('$swal')
    const processing = ref(false)
    const router = useRouter()
    const validationErrors = ref({})
    const quizzes = ref({})
    const quizDetailStore = ref({})

    const getQuizzes = async (
        page = 1,
        order_column = 'created_at',
        order_direction = 'desc',
        status = 'Pending'
    ) => {
        axios.get('/api/quizzes', {
            params: {
                page: page,
                order_column: order_column,
                order_direction: order_direction,
                status: status
            }
        })
            .then(response => {
                quizzes.value = response.data;
            })
    }

    const storeQuiz = async (quiz) => {
        if (processing.value) return

        processing.value = true
        validationErrors.value = {}

        axios.post('/api/quizzes', quiz)
            .then(response => {
                swal({
                    icon: 'success',
                    title: 'Quiz saved successfully'
                }).then(() => {
                    router.push({ name: 'teacher.courses.show', params: { id: quiz.course_id } })
                })
            })
            .catch(error => {
                if (error.response?.status === 401) {
                    router.push({ name: 'login' })
                    return
                }
                if (error.response?.status === 403) {
                    swal({
                        icon: 'error',
                        title: 'Access Denied',
                        text: error.response.data.message
                    }).then(() => {
                        router.push({ name: 'teacher.dashboard' })
                    })
                }
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors
                }
            })
            .finally(() => processing.value = false)
    }


    const acceptQuiz = async (id) => {
        swal({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this action!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, accept it!',
            confirmButtonColor: '#ef4444',
            timer: 20000,
            timerProgressBar: true,
            reverseButtons: true
        })
            .then(result => {
                if (result.isConfirmed) {
                    axios.post('/api/accept-quiz/' + id)
                        .then(response => {
                            getQuizzes()
                            router.push({ name: 'admin.quizzes' })
                            swal({
                                icon: 'success',
                                title: 'Quiz accepted successfully'
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

    const rejectQuiz = async (id) => {
        swal({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this action!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, reject it!',
            confirmButtonColor: '#ef4444',
            timer: 20000,
            timerProgressBar: true,
            reverseButtons: true
        })
            .then(result => {
                if (result.isConfirmed) {
                    axios.post('/api/reject-quiz/' + id)
                        .then(response => {
                            getQuizzes()
                            router.push({ name: 'admin.quizzes' })
                            swal({
                                icon: 'success',
                                title: 'Quiz rejected successfully'
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

    const quizDetail = async (
        id,
    ) => {
        axios.get('/api/quiz-detail/' + id, {})
            .then(response => {
                quizDetailStore.value = response.data;
            })
            .catch(error => {
                if (error.response?.status === 401) {
                    router.push({ name: 'login' })
                    return
                }
            })
    }

    return { storeQuiz, validationErrors, processing, quizzes, getQuizzes, acceptQuiz, rejectQuiz, quizDetail, quizDetailStore }
}
