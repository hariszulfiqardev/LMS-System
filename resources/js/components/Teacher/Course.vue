<template>
    <div class="mb-4 d-flex justify-content-between">
        <h3>{{ courseDetailStore?.data?.name }} <span class="text-muted">({{ courseDetailStore?.data?.category
                }})</span></h3>
        <router-link class="main-btn"
            :to="{ name: 'teacher.courses.create-quiz', params: { id: courseDetailStore?.data?.id } }"><i class="bi bi-plus">Create Quiz</i></router-link>
    </div>
    <div class="row justify-content-center mb-2">
        <div class="col-auto">
            <h5>Quizzes</h5>
        </div>
    </div>
    <div class="row justify-content-center mb-5">
        <div class="col-auto">
            <div class="d-flex">
                <div :class="{
            'option-button': true,
            'active-option': activeStatus === 'Pending',
        }" @click="setActive('Pending')">Pending</div>
                <div :class="{
            'option-button': true,
            'active-option': activeStatus === 'Rejected',
        }" @click="setActive('Rejected')">Rejected</div>
                <div :class="{
            'option-button': true,
            'active-option': activeStatus === 'Upcoming',
        }" @click="setActive('Upcoming')">Upcoming</div>
                <div :class="{
            'option-button': true,
            'active-option': activeStatus === 'Past',
        }" @click="setActive('Past')">Past</div>
            </div>
        </div>
    </div>

    <template v-if="activeStatus === 'Pending'">
        <div class="card mb-3" v-for="(quiz, index) in courseDetailStore?.data?.quizzes?.Pending" :key="quiz.id">
            <div class="card-body d-flex justify-content-between align-items-center">
                {{ index + 1 }}.
                <div>
                    <h5>{{ quiz.title }}</h5>
                    <p class="mb-0">No. of questions: {{ quiz.questions.length }}</p>
                </div>
                <div>
                    <p class="mb-0">Date: {{ quiz.date }}</p>
                    <p class="mb-0">Duration: {{ quiz.duration }} minutes</p>
                </div>
            </div>
        </div>
    </template>

    <template v-if="activeStatus === 'Rejected'">
        <div class="card mb-3" v-for="(quiz, index) in courseDetailStore?.data?.quizzes?.Rejected" :key="quiz.id">
            <div class="card-body d-flex justify-content-between align-items-center">
                {{ index + 1 }}.
                <div>
                    <h5>{{ quiz.title }}</h5>
                    <p class="mb-0">No. of questions: {{ quiz.questions.length }}</p>
                </div>
                <div>
                    <p class="mb-0">Date: {{ quiz.date }}</p>
                    <p class="mb-0">Duration: {{ quiz.duration }} minutes</p>
                </div>
            </div>
        </div>
    </template>

    <template v-if="activeStatus === 'Upcoming'">
        <template v-for="(quiz, index) in courseDetailStore?.data?.quizzes?.Upcoming" :key="quiz.id">
            <router-link class="custom-router-link"
                :to="{ name: 'teacher.courses.quiz-attempt', params: { id: quiz.course_id, quiz_id: quiz.id } }">
                <div class="card mb-3">
                    <div class="card-body d-flex justify-content-between align-items-center">
                        {{ index + 1 }}.
                        <div>
                            <h5>{{ quiz.title }}</h5>
                            <p class="mb-0">No. of questions: {{ quiz.questions.length }}</p>
                        </div>
                        <div>
                            <p class="mb-0">Date: {{ quiz.date }}</p>
                            <p class="mb-0">Duration: {{ quiz.duration }} minutes</p>
                        </div>
                    </div>
                </div>
            </router-link>
        </template>
    </template>

    <template v-if="activeStatus === 'Past'">
        <template v-for="(quiz, index) in courseDetailStore?.data?.quizzes?.Past" :key="quiz.id">
            <router-link class="custom-router-link"
                :to="{ name: 'teacher.courses.quiz-attempt', params: { id: quiz.course_id, quiz_id: quiz.id } }">
                <div class="card mb-3">
                    <div class="card-body d-flex justify-content-between align-items-center">
                        {{ index + 1 }}.
                        <div>
                            <h5>{{ quiz.title }}</h5>
                            <p class="mb-0">No. of questions: {{ quiz.questions.length }}</p>
                        </div>
                        <div>
                            <p class="mb-0">Date: {{ quiz.date }}</p>
                            <p class="mb-0">Duration: {{ quiz.duration }} minutes</p>
                        </div>
                    </div>
                </div>
            </router-link>
        </template>
    </template>

</template>
<script setup>
import useTeachers from "@/composables/teachers";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute()

const activeStatus = ref('Pending')

const setActive = (status) => {
    activeStatus.value = status
}

const { courseDetail, courseDetailStore } = useTeachers()

onMounted(() => {
    courseDetail(route.params.id)
})
</script>
