<template>
    <div class="overflow-hidden overflow-x-auto p-6 bg-white border-gray-200">
        <div class="min-w-full align-middle">
            <div class="mb-4">
                <router-link :to="{ name: 'admin.admins.create' }" class="main-btn"><i
                        class="bi bi-plus">Create</i></router-link>
            </div>
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
                                @click="updateOrdering('name')">
                                <div class="leading-4 font-medium text-gray-500 uppercase tracking-wider"
                                    :class="{ 'font-bold text-blue-600': orderColumn === 'name' }">
                                    Name
                                </div>
                                <div class="select-none">
                                    <span :class="{
                    'text-blue-600': orderDirection === 'asc' && orderColumn === 'name',
                    'hidden': orderDirection !== '' && orderDirection !== 'asc' && orderColumn === 'name',
                }">&uarr;</span>
                                    <span :class="{
                    'text-blue-600': orderDirection === 'desc' && orderColumn === 'name',
                    'hidden': orderDirection !== '' && orderDirection !== 'desc' && orderColumn === 'name',
                }">&darr;</span>
                                </div>
                            </div>
                        </th>
                        <th class="px-6 py-3 bg-gray-50 text-left">
                            <span
                                class="text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Email</span>
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
                        <th class="px-6 py-3 bg-gray-50 text-left">
                            <span
                                class="text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200 divide-solid">
                    <tr v-for="admin in admins.data" :key="admin.id">
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{{ admin.id }}</td>
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{{ admin.name }}</td>
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{{ admin.email }}</td>
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{{ admin.created_at }}
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">

                            <router-link :to="{ name: 'admin.admins.edit', params: { id: admin.id } }"><i
                                    class="bi bi-pencil-square"></i></router-link>

                            <a v-if="!getIsLoggedUser(admin.email)" href="#" @click.prevent="deleteAdmin(admin.id)"
                                class="ml-2 text-red-600"><i class="bi bi-trash"></i></a>

                            <a :href="`/chatify/${admin.id}`"><i class="bi bi-chat-left-dots-fill me-2 chat-icon ms-2"></i></a>

                        </td>
                    </tr>
                </tbody>
            </table>
            <TailwindPagination :data="admins"
                @pagination-change-page="page => getAdmins(page, orderColumn, orderDirection)" class="mt-4" />
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import { TailwindPagination } from 'laravel-vue-pagination';
import useAdmins from "@/composables/admins";

const orderColumn = ref('created_at')
const orderDirection = ref('desc')

const { admins, getAdmins, deleteAdmin, getIsLoggedUser } = useAdmins()

onMounted(() => {
    getAdmins()
})

const updateOrdering = (column) => {
    orderColumn.value = column
    orderDirection.value = (orderDirection.value === 'asc') ? 'desc' : 'asc'
    getAdmins(1, orderColumn.value, orderDirection.value)
}

</script>
