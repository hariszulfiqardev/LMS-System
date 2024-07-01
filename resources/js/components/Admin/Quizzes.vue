<template>
    <div class="row justify-content-center">
        <div class="col-auto">
            <div class="d-flex">
                <div :class="{
                    'option-button': true,
                    'active-option': statusFilter === 'Pending',
                    }" @click="setActive('Pending')">Pending</div>
                <div :class="{
                    'option-button': true,
                    'active-option': statusFilter === 'Rejected',
                    }" @click="setActive('Rejected')">Rejected</div>
                <div :class="{
                    'option-button': true,
                    'active-option': statusFilter === 'Active',
                    }" @click="setActive('Active')">Active</div>
            </div>
        </div>
    </div>

    <div class="overflow-hidden overflow-x-auto p-6 bg-white border-gray-200">
        <div class="min-w-full align-middle">
            <table class="min-w-full divide-y divide-gray-200 border">
                <thead>
                    <tr>
                        <th class="px-6 py-3 bg-gray-50 text-left">
                            <div class="flex flex-row items-center justify-between cursor-pointer"
                                @click="updateOrdering('id')">
                                <div class="leading-4 font-medium text-gray-500 uppercase tracking-wider"
                                    :class="{ 'font-bold text-blue-600': orderColumn === 'id' }">
                                    ID
                                </div>
                                <div class="select-none">
                                    <span :class="{
                    'text-blue-600': orderDirection === 'asc' && orderColumn === 'id',
                    'hidden': orderDirection !== '' && orderDirection !== 'asc' && orderColumn === 'id',
                }">&uarr;</span>
                                    <span :class="{
                    'text-blue-600': orderDirection === 'desc' && orderColumn === 'id',
                    'hidden': orderDirection !== '' && orderDirection !== 'desc' && orderColumn === 'id',
                }">&darr;</span>
                                </div>
                            </div>
                        </th>
                        <th class="px-6 py-3 bg-gray-50 text-left">
                            <div class="flex flex-row items-center justify-between cursor-pointer"
                                @click="updateOrdering('title')">
                                <div class="leading-4 font-medium text-gray-500 uppercase tracking-wider"
                                    :class="{ 'font-bold text-blue-600': orderColumn === 'title' }">
                                    Title
                                </div>
                                <div class="select-none">
                                    <span :class="{
                    'text-blue-600': orderDirection === 'asc' && orderColumn === 'title',
                    'hidden': orderDirection !== '' && orderDirection !== 'asc' && orderColumn === 'title',
                }">&uarr;</span>
                                    <span :class="{
                    'text-blue-600': orderDirection === 'desc' && orderColumn === 'title',
                    'hidden': orderDirection !== '' && orderDirection !== 'desc' && orderColumn === 'title',
                }">&darr;</span>
                                </div>
                            </div>
                        </th>
                        <th class="px-6 py-3 bg-gray-50 text-left">
                            <span
                                class="text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Course</span>
                        </th>
                        <th class="px-6 py-3 bg-gray-50 text-left">
                            <span
                                class="text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Date</span>
                        </th>
                        <th class="px-6 py-3 bg-gray-50 text-center">
                            <span
                                class="text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Duration</span>
                        </th>
                        <th class="px-6 py-3 bg-gray-50 text-center">
                            <span
                                class="text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Status</span>
                        </th>
                        <th class="px-6 py-3 bg-gray-50 text-left">
                            <div class="flex flex-row items-center justify-between cursor-pointer"
                                @click="updateOrdering('created_at')">
                                <div class="leading-4 font-medium text-gray-500 uppercase tracking-wider"
                                    :class="{ 'font-bold text-blue-600': orderColumn === 'created_at' }">
                                    Created at
                                </div>
                                <div class="select-none">
                                    <span :class="{
                    'text-blue-600': orderDirection === 'asc' && orderColumn === 'created_at',
                    'hidden': orderDirection !== '' && orderDirection !== 'asc' && orderColumn === 'created_at',
                }">&uarr;</span>
                                    <span :class="{
                    'text-blue-600': orderDirection === 'desc' && orderColumn === 'created_at',
                    'hidden': orderDirection !== '' && orderDirection !== 'desc' && orderColumn === 'created_at',
                }">&darr;</span>
                                </div>
                            </div>
                        </th>
                        <th v-if="statusFilter === 'Pending' || statusFilter === 'Active'" class="px-6 py-3 bg-gray-50 text-left">
                            <span class="text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200 divide-solid">
                    <tr v-for="quiz in quizzes.data" :key="quiz.id">
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{{ quiz.id }}</td>
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{{ quiz.title }}</td>
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{{ quiz.course?.name }}</td>
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{{ quiz.date }}</td>
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900 text-center">{{ quiz.duration }}</td>
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900 text-center">{{ quiz.status }}</td>
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{{ quiz.created_at }}</td>
                        <td v-if="statusFilter === 'Pending'" class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">

                            <a href="#" @click.prevent="acceptQuiz(quiz.id)" class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-decoration-none ml-2">
                                <i class="bi bi-check">Accept</i></a>

                            <a href="#" @click.prevent="rejectQuiz(quiz.id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-decoration-none ml-2">
                                <i class="bi bi-x">Reject</i>
                            </a>
                        </td>
                        <td v-if="statusFilter === 'Active'" class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                            <router-link :to="{ name: 'admin.quiz.attempt', params: { id: quiz.id } }">
                                <i class="bi bi-eye"></i>
                            </router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
            <TailwindPagination :data="quizzes" @pagination-change-page="page => getQuizzes(page, orderColumn, orderDirection)"
                class="mt-4" />
        </div>
    </div>

</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { TailwindPagination } from 'laravel-vue-pagination';
import useQuizzes from "@/composables/quizzes";

const orderColumn = ref('created_at')
const orderDirection = ref('desc')

const { quizzes, getQuizzes, acceptQuiz, rejectQuiz } = useQuizzes()

const statusFilter = ref('Pending')

const setActive = (status) => {
    statusFilter.value = status
    getQuizzes(1, orderColumn.value, orderDirection.value, status)
}

onMounted(() => {
    getQuizzes()
})

const updateOrdering = (column) => {
    orderColumn.value = column
    orderDirection.value = (orderDirection.value === 'asc') ? 'desc' : 'asc'
    getQuizzes(1, orderColumn.value, orderDirection.value)
}

</script>
