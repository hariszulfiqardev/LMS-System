<template>
    <div class="row justify-content-center">

        <div v-if="!coursesStore.data || coursesStore.data.length === 0" class="col-3">
            <img src="@/assets/img/no-data.png" class="" alt="no data" />
        </div>
        <template v-else v-for="course in coursesStore.data" :key="course.id">
            <div class="col-md-4 mb-3">
                <router-link :to="{ name: 'teacher.courses.show', params: { id: course.id } }"
                    class="custom-router-link">
                    <div class="custom-card d-flex align-items-center justify-content-center cursor-pointer">
                        <div class="card-body custom-card-body text-center">
                            <h5 class="card-title custom-card-title">{{ course.name }}</h5>
                            <p class="card-text custom-card-text">{{ course.category }}</p>
                            <span
                                :class="{ 'badge': true, 'bg-success-transparent': course.is_paid, 'bg-info-transparent': !course.is_paid }">
                                {{ course.is_paid ? 'Paid' : 'Free' }}</span>
                        </div>
                    </div>
                </router-link>
            </div>
        </template>

    </div>
</template>

<script setup>
import useTeachers from "@/composables/teachers";
import { onMounted } from "vue";

const { courses, coursesStore } = useTeachers()

onMounted(() => {
    courses()
})

</script>
<style>
</style>
