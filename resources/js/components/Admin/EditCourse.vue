<template>
    <form @submit.prevent="updateCourse(course)">
        <!-- Name -->
        <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">
                Name
            </label>
            <input v-model="course.name" id="name" type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            <!-- Validation Errors -->
            <div class="text-red-600 mt-1">
                <div v-for="message in validationErrors?.name">
                    {{ message }}
                </div>
            </div>
        </div>

        <div class="mb-4">
            <label for="category" class="block text-sm font-medium text-gray-700">
                Category
            </label>
            <input v-model="course.category" id="category" type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            <!-- Validation Errors -->
            <div class="text-red-600 mt-1">
                <div v-for="message in validationErrors?.category">
                    {{ message }}
                </div>
            </div>
        </div>

        <div class="mb-4">
            <label for="teacher" class="block text-sm font-medium text-gray-700">
                Teacher
            </label>
            <select v-model="course.teacher_id" name="teacher_id" id="teacher"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                <option v-for="teacher in teachers.data" :value="teacher.id">{{ teacher.name }}</option>
            </select>
            <!-- Validation Errors -->
            <div class="text-red-600 mt-1">
                <div v-for="message in validationErrors?.teacher_id">
                    {{ message }}
                </div>
            </div>
        </div>

        <div class="mb-4">
            <label for="is_paid" class="block text-sm font-medium text-gray-700">
                Is Paid?
            </label>
            <select v-model="course.is_paid" name="is_paid" id="is_paid"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                <option value="1">Yes</option>
                <option value="0">No</option>
            </select>
            <!-- Validation Errors -->
            <div class="text-red-600 mt-1">
                <div v-for="message in validationErrors?.is_paid">
                    {{ message }}
                </div>
            </div>
        </div>

        <div class="mb-4">
            <label for="price" class="block text-sm font-medium text-gray-700">
                Price <span class="text-gray-400">(required for paid courses)</span>
            </label>
            <input v-model="course.price" id="price" type="number" min="1"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            <!-- Validation Errors -->
            <div class="text-red-600 mt-1">
                <div v-for="message in validationErrors?.price">
                    {{ message }}
                </div>
            </div>
        </div>


        <!-- Buttons -->
        <div class="flex items-center justify-end mt-4">
            <router-link :to="{ name: 'admin.courses' }" class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:shadow-outline-gray transition ease-in-out duration-150 ml-4 text-decoration-none">
                Cancel
            </router-link>
            <button class="inline-flex items-center px-5 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 active:bg-green-900 focus:outline-none focus:border-green-900 focus:shadow-outline-green transition ease-in-out duration-150 ml-4"
                    :class="{ 'opacity-25': processing }"
                    :disabled="processing"
            >Save</button>
        </div>
    </form>
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted, reactive } from 'vue';
import useCourses from '@/composables/courses';

const route = useRoute()

const { updateCourse, validationErrors, processing, course, getCourse, teachers, getTeachers } = useCourses()

onMounted(() => {
    getCourse(route.params.id)
    getTeachers()
})

</script>
