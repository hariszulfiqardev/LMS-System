<template>
    <form @submit.prevent="storeQuiz(quiz)">

        <div class="mb-4">
            <!-- validationErrors -->
            <div class="text-red-600 mt-1">
                <div v-for="message in validationErrors">
                    {{ message }}
                </div>
            </div>
        </div>

        <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700">
                Title
            </label>
            <input v-model="quiz.title" id="title" type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">

        </div>

        <div class="mb-4">
            <label for="date" class="block text-sm font-medium text-gray-700">
                Date
            </label>
            <input v-model="quiz.date" id="date" type="date"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">

        </div>

        <div class="mb-5">
            <label for="duration" class="block text-sm font-medium text-gray-700">
                Duration (in minutes)
            </label>
            <select name="duration" v-model="quiz.duration" id="duration"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
            </select>
        </div>


        <div class="mb-4 text-center">
            <h3 for="">MCQS</h3>
        </div>
        <div v-for="(mcq, mcqIndex) in quiz.mcqs" :key="mcqIndex" class="mb-6">
            <div class="mb-4">
                <label :for="'question-' + mcqIndex" class="block text-sm font-medium text-gray-700">
                    Question {{ mcqIndex + 1 }}
                </label>
                <input v-model="mcq.question" :id="'question-' + mcqIndex" type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            </div>
            <div class="ms-5">
                <label for="">Options</label>
                <div v-for="(option, optionIndex) in mcq.options" :key="optionIndex" class="mb-2 flex items-center">

                    <div class="row">
                        <div class="col-md-8">
                            <input v-model="option.text" :id="'option-' + mcqIndex + '-' + optionIndex" type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                        </div>
                        <div class="col-md-3">
                            <label class="ml-2">
                                <input type="radio" v-model="mcq.correctOption" :value="optionIndex">
                                Correct
                            </label>
                        </div>
                        <div class="col-md-1">
                            <button type="button" @click="removeOption(mcqIndex, optionIndex)"
                                class="ml-2 text-red-500">Remove</button>
                        </div>
                    </div>

                </div>
                <br>
                <button type="button" @click="addOption(mcqIndex)" class="text-blue-500">Add Option</button>
            </div>
            <br>
            <button type="button" @click="removeMcq(mcqIndex)" class="text-red-500">Remove Question</button>
        </div>
        <hr>
        <button type="button" @click="addMcq" class="text-blue-500">Add More MCQ</button>


        <!-- Buttons -->
        <div class="flex items-center justify-end mt-4">
            <router-link :to="{ name: 'teacher.courses.show', params: { id: quiz.course_id } }"
                class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:shadow-outline-gray transition ease-in-out duration-150 ml-4 text-decoration-none">
                Cancel
            </router-link>
            <button
                class="inline-flex items-center px-5 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 active:bg-green-900 focus:outline-none focus:border-green-900 focus:shadow-outline-green transition ease-in-out duration-150 ml-4"
                :class="{ 'opacity-25': processing }" :disabled="processing">Save</button>
        </div>

    </form>

</template>

<script setup>

import { onMounted, reactive } from 'vue';
import useQuizzes from '@/composables/quizzes';
import { useRoute } from 'vue-router';

const route = useRoute()

const quiz = reactive({
    course_id: route.params.id,
    title: '',
    date: '',
    duration: '10',
    mcqs: [
        {
            question: '',
            options: [
                { text: '' },
                { text: '' }
            ],
            correctOption: null
        }
    ]
});

const { storeQuiz, validationErrors, processing } = useQuizzes()

const addMcq = () => {
    quiz.mcqs.push({
        question: '',
        options: [
            { text: '' },
            { text: '' }
        ],
        correctOption: null
    });
};

const removeMcq = (index) => {
    quiz.mcqs.splice(index, 1);
};

const addOption = (mcqIndex) => {
    quiz.mcqs[mcqIndex].options.push({ text: '' });
};

const removeOption = (mcqIndex, optionIndex) => {
    quiz.mcqs[mcqIndex].options.splice(optionIndex, 1);
};

</script>
