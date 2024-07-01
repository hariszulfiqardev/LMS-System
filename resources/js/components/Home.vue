<template>
    <div class="self-end me-5 mt-3">

        <div class="flex items-center" v-if="isStudentLoggedIn()">
            <div class="flex">
                <div>
                    <div>Hi, {{ user?.name }}</div>
                    <div class="text-sm text-gray-500">{{ user?.email }}</div>
                </div>
            </div>
            <div>
                <router-link :to="{ name: getUserRole() == 2 ? 'teacher.dashboard' : ( getUserRole() == 1 ? 'admin.dashboard' : 'student.dashboard') }"
                    class="px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:shadow-outline-gray transition ease-in-out duration-150 ml-4 text-decoration-none">
                    Go to Dashboard
                </router-link>
                <button @click="logout" type="button"
                    class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:shadow-outline-gray transition ease-in-out duration-150 ml-4"
                    :class="{ 'opacity-25': processing }" :disabled="processing">
                    Log out
                </button>
            </div>
        </div>

    </div>

    <div class="row d-flex align-items-center justify-content-center mt-5 mb-5">
        <div class="col-6">
            <h1><b>Quiz<span class="main-color">Prism</span></b></h1>
            <p class="mb-4">Sharpen your <span class="sec-color">skills</span> with every question</p>
            <router-link v-if="!isStudentLoggedIn()" :to="{ name: 'login' }" class="main-btn">
                Login
            </router-link>
            <router-link v-if="!isStudentLoggedIn()" :to="{ name: 'register' }" class="ms-3 main-btn-outline">
                Signup
            </router-link>
        </div>
        <div class="col-6">
            <img src="@/assets/img/header.png" alt="" width="800">
        </div>
    </div>

    <!-- <carousel :items-to-show="1" class="m-5 mt-3 mb-0">
        <slide key="2">
            <img src="@/assets/img/e-learning-banner2.jpg" class="banner" alt="Banner" />
        </slide>
        <slide key="3">
            <img src="@/assets/img/e-learning-banner3.png" class="banner" alt="Banner" />
        </slide>
        <slide key="1">
            <img src="@/assets/img/e-learning-banner.png" class="banner" alt="Banner" />
        </slide>

        <template #addons>
            <navigation />
            <pagination />
        </template>
    </carousel> -->

    <div class="row self-start mt-0 mb-3 ms-5">
        <div class="col-12">
            <input v-model="search" type="text" placeholder="Search..."
                class="w-full inline-block mt-1 rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
    </div>

    <div class="row m-5 mt-0 justify-content-center courses-row ">
        <div v-if="!courses.data || courses.data.length === 0" class="col-3">
            <img src="@/assets/img/no-data.png" class="" alt="no data" />
        </div>
        <div v-else class="col-md-4 col-lg-4 mb-4" v-for="course in courses.data" :key="course.id">
            <div class="card">
                <div class="card-body p-5">
                    <div class="d-flex align-items-center justify-content-between">
                        <h5 class="card-title">{{ course.name }}</h5>
                        <span :class="{
            'badge': true,
            'bg-success-transparent': course.is_paid,
            'bg-info-transparent': !course.is_paid
        }">{{ course.is_paid ? 'Paid' : 'Free' }}</span>
                    </div>
                    <p class="card-text mb-0 ">{{ course.category }}</p>
                    <p class="mb-0">By <span class="">{{ course.teacher.name }}</span></p>
                    <div class="d-flex align-items-center justify-content-between">
                        <p class="text-muted fs-11 mb-0">{{ course.created_at }}</p>
                        <span v-if="course.is_enrolled" class="text-muted text-success">Enrolled</span>
                        <button v-else @click="enroll(course)" class="main-btn">{{ (course.is_paid ? 'Enroll ($'
            +
            course.price + ')' : 'Enroll')
                            }}</button>
                    </div>
                </div>
            </div>
        </div>
        <TailwindPagination v-if="courses.data" :data="courses"
            @pagination-change-page="page => getCourses(page, orderColumn, orderDirection, search)"
            class="mt-2 justify-content-center" />
    </div>


    <div class="modal" tabindex="-1" id="paymentModal" aria-labelledby="paymentModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Make Payment</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <div>
                        <form id="payment-form">
                            <div id="payment-element">
                                <!-- Stripe will create form elements here -->
                            </div>
                            <button type="submit" @click="handleSubmit">Pay via Stripe</button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    </div>

</template>
<script setup>
import { onMounted, ref, watch, inject } from "vue";
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import useCourses from "@/composables/courses";
import useAuth from "@/composables/auth";
import usePayment from "@/composables/payment";
import { TailwindPagination } from 'laravel-vue-pagination';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const swal = inject('$swal')

const stripe = ref(null)
const elements = ref(null)

const router = useRouter();

const search = ref('')

const selectedCourseId = ref(null)
const selectedCoursePrice = ref(null)

let payment_modal = ref(null)

const { courses, getCourses } = useCourses()
const { isStudentLoggedIn, user, processing, logout, getUserRole } = useAuth()

const { enrollCourse } = usePayment()

onMounted(async () => {
    getCourses()
    payment_modal = new bootstrap.Modal('#paymentModal', {})
    stripe.value = await loadStripe('pk_test_51PJ0Xu03NaXnGeareqvAkdQAcpsXW6kDxBntvxNvwzGXcw9w7GDKloAA3sQTvAQQAs13Xo6tp0USZsHbfrsHWE4h00A0luKzht');
})

const handleSubmit = async (e) => {
    e.preventDefault();

    const { response, error } = await stripe.value.confirmPayment({
        elements: elements.value,
        redirect: "if_required"
    });

    if (error === undefined) {
        enrollCourse(selectedCourseId.value)
        closeModal()
    } else {
        closeModal()
        swal({
            icon: 'error',
            title: 'Payment failed',
            text: 'Something went wrong'
        }).then(() => {
        })
    }
}

watch(search, (current, previous) => {
    getCourses(1, 'created_at', 'desc', search.value)
})

function dollarsToCents(dollars) {
    return Math.round(dollars * 100);
}

async function openModal() {
    const { data } = await axios.post('/api/make-payment', { amount: dollarsToCents(selectedCoursePrice.value) });
    const options = {
        clientSecret: data.clientSecret,
    }
    elements.value = stripe.value.elements(options);
    const paymentElement = elements.value.create('payment');
    paymentElement.mount('#payment-element');

    payment_modal.show()
}

function closeModal() {
    payment_modal.hide()
}

const enroll = (course) => {
    if (!isStudentLoggedIn()) {
        router.push({ name: 'login' });
        return
    }

    if (course.is_paid) {
        selectedCourseId.value = course.id
        selectedCoursePrice.value = course.price
        openModal()
    }
    else {
        enrollCourse(course.id)
    }
}

</script>
<style>
.banner {
    width: -webkit-fill-available;
    height: 25rem;
}

.courses-row {
    width: -webkit-fill-available;
}

.badge {
    padding: .25rem .45rem;
    text-transform: capitalize;
    font-weight: 600;
    letter-spacing: .5px;
    border-radius: 4px;
}

.bg-success-transparent,
.bg-success-transparent:hover {
    background-color: rgba(40, 199, 111, .1) !important;
    color: #28c76f !important;
}

.bg-danger-transparent,
.bg-danger-transparent:hover {
    background-color: rgba(199, 40, 40, 0.1) !important;
    color: #c72828 !important;
}

.bg-info-transparent,
.bg-info-transparent:hover {
    background-color: rgba(23, 162, 184, .1) !important;
    color: #17a2b8 !important;
}

.text-muted {
    color: #9595b5 !important;
}

.text-info {
    color: #17a2b8 !important;
    opacity: 1;
}

/* CSS Styling */
#payment-form>button[type="submit"] {
    background-color: #4CAF50;
    /* Green background */
    color: white;
    /* White text */
    padding: 10px 20px;
    /* Padding */
    border: none;
    /* No border */
    border-radius: 5px;
    /* Rounded corners */
    cursor: pointer;
    /* Pointer cursor on hover */
    font-size: 16px;
    /* Font size */
    margin-top: 10px;
}

#payment-form>button[type="submit"]:hover {
    background-color: #45a049;
    /* Darker green */
}

#payment-form>button[type="submit"]:focus {
    outline: none;
    /* Remove default focus outline */
    box-shadow: 0 0 5px #4CAF50;
    /* Add a custom focus outline */
}

.text-success {
    color: #45a049 !important;
}

.main-color{
    color: #b869c6 !important;
}

.sec-color{
    color: #c58ecf !important;
}

.bg-color{
    color: #f3ecf3 !important;
}

.main-btn{
    text-decoration: none;
    color: white;
    background: #ba69c8;
    padding: 6px 20px 8px 20px;
    border-radius: 5px;
}

.main-btn-outline{
    text-decoration: none;
    color: #ba69c8;
    padding: 6px 20px 8px 20px;
    border-radius: 5px;
    border: 1px solid #ba69c8;
}
</style>
