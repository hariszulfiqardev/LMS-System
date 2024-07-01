<template>
    <form @submit.prevent="updateAdmin(admin)">
        <div class="mb-4" v-if="isLoggedUser">
            <span class="text-gray-400">(<b>Note:</b> you will be logged out after saving because you are editing your own profile)</span>
        </div>
        <!-- Name -->
        <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
                Name
            </label>
            <input v-model="admin.name" id="name" type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            <!-- Validation Errors -->
            <div class="text-red-600 mt-1">
                <div v-for="message in validationErrors?.name">
                    {{ message }}
                </div>
            </div>
        </div>

        <!-- Email -->
        <div class="mt-4">
            <label for="email" class="block text-sm font-medium text-gray-700">
                Email
            </label>
            <input v-model="admin.email" id="email" type="email"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            <!-- Validation Errors -->
            <div class="text-red-600 mt-1">
                <div v-for="message in validationErrors?.email">
                    {{ message }}
                </div>
            </div>
        </div>

        <!-- Password -->
        <div class="mt-4">
            <label for="password" class="block text-sm font-medium text-gray-700">
                Password <span class="text-gray-400">(leave blank to keep the same)</span>
            </label>
            <input v-model="admin.password" id="password" type="password"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            <!-- Validation Errors -->
            <div class="text-red-600 mt-1">
                <div v-for="message in validationErrors?.password">
                    {{ message }}
                </div>
            </div>
        </div>

        <!-- Buttons -->
        <div class="flex items-center justify-end mt-4">
            <router-link :to="{ name: 'admin.admins' }" class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:shadow-outline-gray transition ease-in-out duration-150 ml-4 text-decoration-none">
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
import useAdmins from '@/composables/admins';

const route = useRoute()

const { updateAdmin, validationErrors, processing, admin, getAdmin, isLoggedUser } = useAdmins()

onMounted(() => {
    getAdmin(route.params.id)
})

</script>
