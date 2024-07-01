<template>
    <div class="row justify-content-center">

        <div v-if="!enrolledCoursesStore.data || enrolledCoursesStore.data.length === 0" class="col-3">
            <img src="@/assets/img/no-data.png" class="" alt="no data" />
        </div>
        <template v-else v-for="course in enrolledCoursesStore.data" :key="course.id">
            <div class="col-md-4 mb-3">
                <router-link :to="{ name: 'student.courses.show', params: { id: course.id } }"
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
import useStudents from "@/composables/students";
import { onMounted } from "vue";

const { enrolledCourses, enrolledCoursesStore } = useStudents()

onMounted(() => {
    enrolledCourses()
})

</script>
<style>
.custom-card {
    border: 1px solid #ba69c8;
    border-radius: 10px;
    transition: box-shadow 0.3s ease-in-out;
    height: 200px;
}

.custom-card:hover {
    box-shadow: 0 4px 8px rgba(165, 9, 185, 0.3);
}

.custom-card-title {
    font-size: 1.25rem;
    font-weight: 600;
    text-align: center;
    color: #ba69c8;
}

.custom-card-text {
    font-size: 1rem;
    color: #ddd;
    text-align: center;
}

.custom-card-body {
    padding: 1.5rem;
}

.custom-router-link {
    text-decoration: none;
}
</style>
