<template>
    <div class="mb-4">
        <h3>{{ quizDetailStore?.data?.title }} <span class="text-muted">({{ quizDetailStore?.data?.course?.name }})</span></h3>
        <p class="mb-0">No. of questions: {{ quizDetailStore?.data?.questions?.length }}</p>
        <p class="mb-0">Date: {{ quizDetailStore?.data?.date }}</p>
        <p class="mb-0">Duration: {{ quizDetailStore?.data?.duration }} minutes</p>
    </div>
    <div class="row justify-content-center mb-3">
        <div class="col-auto">
            <h5>Attempts</h5>
        </div>
    </div>

    <div class="card mb-3" v-for="(attempt, index) in quizDetailStore?.data?.attempts" :key="attempt.id">
        <div class="card-body d-flex justify-content-between align-items-center">
            {{ index + 1 }}.
            <div>
                <div class="d-flex align-items-center">
                    <h5 class="mb-0">{{ attempt.user?.name }}</h5>
                    <a :href="`/chatify/${attempt.user?.id}`"><i class="bi bi-chat-left-dots-fill chat-icon ms-2"></i></a>
                </div>
                <p class="mb-0 text-muted">{{ attempt.user?.email }}</p>
            </div>

            <p class="text-muted mb-0">Correct answers: {{ attempt.correct_questions }}</p>

            <div v-if="attempt.status === 'Completed'">
                <p :class="{
                    'badge mb-0': true,
                    'bg-danger-transparent ': attempt.score < 50,
                    'bg-success-transparent': attempt.score >= 50
                    }">{{ attempt.score }}%</p>
            </div>

            <button v-else type="button" class="btn btn-info cursor-pointer-none">Started</button>
        </div>
    </div>

</template>
<script setup>
import useQuizzes from "@/composables/quizzes";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute()

const { quizDetail, quizDetailStore } = useQuizzes()

onMounted(() => {
    quizDetail(route.params.quiz_id)
})

</script>
