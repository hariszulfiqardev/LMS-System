<template>
    <div class="row justify-content-center">
        <div class="col-2">
            <div class="card">
                <div class="card-body text-center">
                    <h5 class="card-text mb-0" style="color: #ba69c8;">{{ stats?.count?.admins }}</h5>
                    <p class="card-title text-muted">Admins</p>
                </div>
            </div>
        </div>
        <div class="col-2">
            <div class="card">
                <div class="card-body text-center">
                    <h5 class="card-text mb-0" style="color: #ba69c8;">{{ stats?.count?.teachers }}</h5>
                    <p class="card-title text-muted">Teachers</p>
                </div>
            </div>
        </div>
        <div class="col-2">
            <div class="card">
                <div class="card-body text-center">
                    <h5 class="card-text mb-0" style="color: #ba69c8;">{{ stats?.count?.students }}</h5>
                    <p class="card-title text-muted">Students</p>
                </div>
            </div>
        </div>
        <div class="col-2">
            <div class="card">
                <div class="card-body text-center">
                    <h5 class="card-text mb-0" style="color: #ba69c8;">{{ stats?.count?.courses }}</h5>
                    <p class="card-title text-muted">Courses</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import useStats from "@/composables/stats";

const { stats, getStats } = useStats()
onMounted(() => {
    getStats()
})
</script>

<style>
.card {
    border: 1px solid #c58ecf !important;
    box-shadow: 0px 2px 10px 0px #0000001A;
}
</style>
