<template>
    <div class="mb-4">
        <h3>{{ enrolledCourseDetailStore?.data?.name }} <span class="text-muted">({{
            enrolledCourseDetailStore?.data?.category }})</span></h3>
        <p class="mb-0 text-muted">By: {{ enrolledCourseDetailStore?.data?.teacher?.name }} <a :href="`/chatify/${enrolledCourseDetailStore?.data?.teacher_id}`"><i class="bi bi-chat-left-dots-fill chat-icon ms-2"></i></a></p>
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
            'option-button me-3': true,
            'active-option': activeStatus === 'Upcoming',
        }" @click="setActive('Upcoming')">Upcoming</div>
                <div :class="{
            'option-button': true,
            'active-option': activeStatus === 'Past',
        }" id="past-tab" @click="setActive('Past')">Past</div>
            </div>
        </div>
    </div>

    <template v-if="activeStatus === 'Upcoming'">
        <div class="card mb-3" v-for="(quiz, index) in enrolledCourseDetailStore?.data?.student_quizzes?.Upcoming"
            :key="quiz.id">
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
                <div v-if="quiz.student_attempt?.status === 'Completed'">
                    <p :class="{
            'badge mb-0': true,
            'bg-danger-transparent': quiz.student_attempt?.score < 50,
            'bg-success-transparent': quiz.student_attempt?.score >= 50
        }">{{ quiz.student_attempt?.score }}%</p>
                    <p class="text-muted mb-0">Correct answers: {{ quiz.student_attempt?.correct_questions }}</p>
                </div>
                <button v-if="quiz.student_attempt?.status === 'Started'" type="button"
                    class="btn btn-info cursor-pointer-none">Started</button>
                <button v-else-if="quiz.student_attempt?.status === 'Completed'" type="button"
                    class="btn btn-danger cursor-pointer-none">Completed</button>
                <button v-else type="button" class="main-btn" @click="openModal(quiz)">Start Quiz</button>

            </div>
        </div>
    </template>

    <template v-if="activeStatus === 'Past'">
        <div class="card mb-3" v-for="(quiz, index) in enrolledCourseDetailStore?.data?.student_quizzes?.Past"
            :key="quiz.id">
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
                <div v-if="quiz.student_attempt?.status === 'Completed'">
                    <p :class="{
            'badge mb-0': true,
            'bg-danger-transparent': quiz.student_attempt?.score < 50,
            'bg-success-transparent': quiz.student_attempt?.score >= 50
        }">{{ quiz.student_attempt?.score }}%</p>
                    <p class="text-muted mb-0">Correct answers: {{ quiz.student_attempt?.correct_questions }}</p>
                </div>
                <button v-if="quiz.student_attempt?.status === 'Started'" type="button"
                    class="btn btn-info cursor-pointer-none">Started</button>
                <button v-else-if="quiz.student_attempt?.status === 'Completed'" type="button"
                    class="btn btn-danger cursor-pointer-none">Completed</button>
                <button v-else type="button" class="btn btn-warning cursor-pointer-none">Not Appeared</button>
            </div>
        </div>
    </template>

    <div class="modal" tabindex="-1" id="quizModal" aria-labelledby="quizModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Start Quiz</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="ms-4">
                        <h3>Instructions</h3>
                    </div>
                    <div>
                        <ul>
                            <li>
                                <p class="mb-0">1. Complete your quiz in the given time.</p>
                                <p class="text-danger mb-0">2. Do not refresh the page.</p>
                                <p class="text-danger">3. Do not leave the page.</p>
                                <span>Otherwise, your progress will be <span class="text-danger">lost</span>.</span>
                            </li>
                        </ul>
                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="main-btn" @click="start()">Continue</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal" tabindex="-1" id="quizAttemptModal" aria-labelledby="quizAttemptModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen">
            <div class="modal-content" style="background-color: #f3ecf3;">
                <div class="modal-header">
                    <div class="timer">{{ formattedTime }}</div>

                </div>
                <div class="modal-body">
                    <div>
                        <div class="ms-4">
                            <h3>Instructions</h3>
                        </div>
                        <div>
                            <ul>
                                <li>
                                    <p class="mb-0">1. Complete your quiz in the given time.</p>
                                    <p class="text-danger mb-0">2. Do not refresh the page.</p>
                                    <p class="text-danger">3. Do not leave the page.</p>
                                    <span>Otherwise, your progress will be <span class="text-danger">lost</span>.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <hr>

                    <div class="m-5">

                        <form @submit.prevent="submit">

                            <div v-for="(question, qIndex) in currentQuiz?.questions" :key="question.id"
                                class="mb-5 pb-5 border-bottom">
                                <h5>Question {{ qIndex + 1 }}: </h5>
                                <div class="ms-5">
                                    <p>{{ question.question }}</p>
                                    <div v-for="(option, oIndex) in question.options" :key="option.id"
                                        class="form-check">
                                        <input class="form-check-input" type="radio" :name="'question-' + question.id"
                                            :id="'question-' + question.id + '-option-' + oIndex" :value="option.id"
                                            v-model="selectedAnswers[question.id]">
                                        <label class="form-check-label"
                                            :for="'question-' + question.id + '-option-' + oIndex">
                                            {{ option.option }}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" class="main-btn">Submit Quiz</button>
                        </form>

                    </div>

                </div>
            </div>
        </div>
    </div>

</template>
<script setup>
import useStudents from "@/composables/students";
import { computed, onMounted, ref, nextTick } from "vue";
import { useRoute } from "vue-router";

const route = useRoute()

const activeStatus = ref('Upcoming')

let quiz_modal = ref(null)
let quiz_attempt_modal = ref(null)

const currentQuiz = ref(null)

const setActive = (status) => {
    activeStatus.value = status
}

const { enrolledCourseDetail, enrolledCourseDetailStore, startQuiz, submitQuiz } = useStudents()

onMounted(() => {
    enrolledCourseDetail(route.params.id)
    quiz_modal = new bootstrap.Modal('#quizModal', {})
    quiz_attempt_modal = new bootstrap.Modal('#quizAttemptModal', {})
    if (timerInterval) {
        clearInterval(timerInterval);
    }
})

const timeLeft = ref(0);
let timerInterval = null;

const formattedTime = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60);
    const seconds = timeLeft.value % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});

const selectedAnswers = ref({});

const submit = async () => {

    const quizModal = document.getElementById('quizAttemptModal');
    const modalContent = quizModal.querySelector('.modal-content');

    modalContent.style.opacity = '0.5';

    // Display "Submitting quiz..." message
    const submittingMessage = document.createElement('div');
    submittingMessage.className = 'submitting-message text-center';
    submittingMessage.textContent = 'Submitting quiz...';
    modalContent.appendChild(submittingMessage);

    // Optionally, disable form inputs
    const formInputs = modalContent.querySelectorAll('input');
    formInputs.forEach(input => {
        input.disabled = true;
    });

    setTimeout(async () => {
        let response = await submitQuiz(currentQuiz.value.id, selectedAnswers.value)
        closeAttemptModal()
        modalContent.style.opacity = '1';
        modalContent.removeChild(submittingMessage);
        formInputs.forEach(input => {
            input.disabled = false;
        })
        selectedAnswers.value = {};
        enrolledCourseDetail(route.params.id)
    }, 2000);

};

function openModal(quiz) {
    currentQuiz.value = quiz
    quiz_modal.show()
}

function openAttemptModal() {
    quiz_attempt_modal.show()
}

async function start() {
    let response = await startQuiz(currentQuiz.value.id);
    if (response) {
        enrolledCourseDetail(route.params.id)
        closeModal()
        openAttemptModal()
        timeLeft.value = currentQuiz.value.duration * 60; // convert minutes to seconds
        timerInterval = setInterval(() => {
            if (timeLeft.value > 0) {
                timeLeft.value--;
            } else {
                clearInterval(timerInterval);
                submit();
            }
        }, 1000);
    }
}

function closeModal() {
    quiz_modal.hide()
}

function closeAttemptModal() {
    quiz_attempt_modal.hide()
}
</script>
<style>
.option-button {
    padding: 10px 20px;
    border: 1px solid transparent;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
}

.option-button:hover {
    background-color: #c58ecf;
}

.active-option {
    background-color: #ba69c8;
    color: #fff;
    border-color: #ba69c8;
}

.cursor-pointer-none {
    cursor: not-allowed !important;
}

.timer {
    font-size: 1.5em;
    color: #ffffff;
    text-align: center;
    padding: 5px 20px;
    background-color: #ff2d20;
    border-radius: 10px;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.submitting-message {
    background: #ffc107;
    padding: 2px 20px;
}
</style>
