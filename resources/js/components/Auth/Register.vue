<template>
    <div class="row w-full d-flex justify-content-center align-items-center p-5">

        <div class="col-6 p-5">
            <form @submit.prevent="storeStudent(student)">

                <div class="ps-5 pe-5 mb-4 text-center">
                    <h1>Signup!</h1>
                </div>

                <!-- Name -->
                <div class="ps-5 pe-5">
                    <label for="name" class="block font-medium text-sm text-gray-700">
                        Name
                    </label>
                    <input v-model="student.name" id="text" name="text"
                        class="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        required autofocus autocomplete="username">
                    <!-- Validation Errors -->
                    <div class="text-red-600 mt-1">
                        <div v-for="message in validationErrors?.name">
                            {{ message }}
                        </div>
                    </div>
                </div>

                <!-- Email -->
                <div class="mt-4 ps-5 pe-5">
                    <label for="email" class="block font-medium text-sm text-gray-700">
                        Email
                    </label>
                    <input v-model="student.email" id="email" type="email"
                        class="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        required autofocus autocomplete="username">
                    <!-- Validation Errors -->
                    <div class="text-red-600 mt-1">
                        <div v-for="message in validationErrors?.email">
                            {{ message }}
                        </div>
                    </div>
                </div>

                <!-- Password -->
                <div class="mt-4 ps-5 pe-5">
                    <label for="password" class="block font-medium text-sm text-gray-700">
                        Password
                    </label>
                    <input v-model="student.password" id="password" type="password"
                        class="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        required autocomplete="current-password">
                    <!-- Validation Errors -->
                    <div class="text-red-600 mt-1">
                        <div v-for="message in validationErrors?.password">
                            {{ message }}
                        </div>
                    </div>
                </div>

                <!-- Buttons -->
                <div class="flex items-center mt-4 ps-5 pe-5">
                    <button class="main-btn" :class="{ 'opacity-25': processing }" :disabled="processing">Signup</button>
                </div>

                <div class="mt-4 ps-5 pe-5">
                    <p>Already have an account? <router-link :to="{ name: 'login' }" class="text-blue-500">Log In</router-link></p>
                </div>

            </form>
        </div>

        <div class="col-6">
            <img src="@/assets/img/header.png" alt="" width="800">
        </div>

    </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import useStudents from '@/composables/students';

const student = reactive({
    name: '',
    email: '',
    password: ''
})
const { storeStudent, validationErrors, processing } = useStudents()

</script>
