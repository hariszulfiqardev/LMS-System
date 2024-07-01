import { createRouter, createWebHistory } from 'vue-router';

import AdminDashboard from '@/components/Admin/Dashboard.vue'
import AdminAdmins from '@/components/Admin/Admins.vue'
import AdminTeachers from '@/components/Admin/Teachers.vue'
import AdminStudents from '@/components/Admin/Students.vue'
import AdminCourses from '@/components/Admin/Courses.vue'
import AdminQuizzes from '@/components/Admin/Quizzes.vue'
import AdminCreateAdmin from '@/components/Admin/CreateAdmin.vue'
import AdminCreateTeacher from '@/components/Admin/CreateTeacher.vue'
import AdminCreateStudent from '@/components/Admin/CreateStudent.vue'
import AdminCreateCourse from '@/components/Admin/CreateCourse.vue'
import AdminEditAdmin from '@/components/Admin/EditAdmin.vue'
import AdminEditTeacher from '@/components/Admin/EditTeacher.vue'
import AdminEditStudent from '@/components/Admin/EditStudent.vue'
import AdminEditCourse from '@/components/Admin/EditCourse.vue'
import AdminEditQuiz from '@/components/Admin/EditQuiz.vue'
import AdminQuizAttempt from '@/components/Admin/QuizAttempt.vue'

import TeacherDashboard from '@/components/Teacher/Dashboard.vue'
import TeacherChat from '@/components/Teacher/Chat.vue'
import TeacherCourse from '@/components/Teacher/Course.vue'
import TeacherCreateQuiz from '@/components/Teacher/CreateQuiz.vue'
import TeacherQuizAttempt from '@/components/Teacher/QuizAttempt.vue'

import StudentDashboard from '@/components/Student/Dashboard.vue'
import StudentCourse from '@/components/Student/Course.vue'

import Home from '@/components/Home.vue'
import Login from '@/components/Auth/Login.vue'
import Register from '@/components/Auth/Register.vue'

import AdminLayout from '@/layouts/Admin.vue';
import TeacherLayout from '@/layouts/Teacher.vue';
import StudentLayout from '@/layouts/Student.vue';
import GuestLayout from '@/layouts/Guest.vue';
import AuthLayout from '@/layouts/Auth.vue';

import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

function adminAuth(to, from, next) {
    if (JSON.parse(sessionStorage.getItem('loggedIn'))) {
        if (JSON.parse(sessionStorage.getItem('role')) == 1)
            next()
    }

    next('/login')
}

function teacherAuth(to, from, next) {
    if (JSON.parse(sessionStorage.getItem('loggedIn'))) {
        if (JSON.parse(sessionStorage.getItem('role')) == 2)
            next()
    }

    next('/login')
}

function studentAuth(to, from, next) {
    if (JSON.parse(sessionStorage.getItem('loggedIn'))) {
        if (JSON.parse(sessionStorage.getItem('role')) == 0)
            next()
    }

    next('/login')
}

const routes = [

    {
        path: '',
        redirect: '/home',
        component: GuestLayout,
        children: [
            {
                path: '/home',
                name: 'home',
                component: Home
            },
        ],
    },

    {
        component: AuthLayout,
        children: [
            {
                path: '/login',
                name: 'login',
                component: Login
            },
        ],
    },
    {
        component: AuthLayout,
        children: [
            {
                path: '/register',
                name: 'register',
                component: Register
            },
        ],
    },

    // Admin Routes
    {
        component: AdminLayout,
        beforeEnter: adminAuth,
        children: [
            // Dashboard
            {
                path: '/admin/dashboard',
                name: 'admin.dashboard',
                component: AdminDashboard,
                meta: { title: 'Dashboard' }
            },
            // Admins
            {
                path: '/admin/admins',
                name: 'admin.admins',
                component: AdminAdmins,
                meta: { title: 'Admins' }
            },
            {
                path: '/admin/admins/create',
                name: 'admin.admins.create',
                component: AdminCreateAdmin,
                meta: { title: 'Create Admin' }
            },
            {
                path: '/admin/admins/edit/:id',
                name: 'admin.admins.edit',
                component: AdminEditAdmin,
                meta: { title: 'Edit Admin' }
            },
            // Teachers
            {
                path: '/admin/teachers',
                name: 'admin.teachers',
                component: AdminTeachers,
                meta: { title: 'Teachers' }
            },
            {
                path: '/admin/teachers/create',
                name: 'admin.teachers.create',
                component: AdminCreateTeacher,
                meta: { title: 'Create Teacher' }
            },
            {
                path: '/admin/teachers/edit/:id',
                name: 'admin.teachers.edit',
                component: AdminEditTeacher,
                meta: { title: 'Edit Teacher' }
            },
            // Students
            {
                path: '/admin/students',
                name: 'admin.students',
                component: AdminStudents,
                meta: { title: 'Students' }
            },
            {
                path: '/admin/students/create',
                name: 'admin.students.create',
                component: AdminCreateStudent,
                meta: { title: 'Create Student' }
            },
            {
                path: '/admin/students/edit/:id',
                name: 'admin.students.edit',
                component: AdminEditStudent,
                meta: { title: 'Edit Student' }
            },
            // Courses
            {
                path: '/admin/courses',
                name: 'admin.courses',
                component: AdminCourses,
                meta: { title: 'Courses' }
            },
            {
                path: '/admin/courses/create',
                name: 'admin.courses.create',
                component: AdminCreateCourse,
                meta: { title: 'Create Course' }
            },
            {
                path: '/admin/courses/edit/:id',
                name: 'admin.courses.edit',
                component: AdminEditCourse,
                meta: { title: 'Edit Course' }
            },
            // Quizzes
            {
                path: '/admin/quizzes',
                name: 'admin.quizzes',
                component: AdminQuizzes,
                meta: { title: 'Quizzes' }
            },
            {
                path: '/admin/quizzes/edit/:id',
                name: 'admin.quizzes.edit',
                component: AdminEditQuiz,
                meta: { title: 'Edit Quiz' }
            },
            {
                path: '/admin/quiz/:id/attempt',
                name: 'admin.quiz.attempt',
                component: AdminQuizAttempt,
                meta: { title: 'Quiz Attempts' }
            }
        ]
    },

    {
        component: TeacherLayout,
        beforeEnter: teacherAuth,
        children: [
            {
                path: '/teacher/dashboard',
                name: 'teacher.dashboard',
                component: TeacherDashboard,
                meta: { title: 'Dashboard' }
            },
            // {
            //     path: '/teacher/chat',
            //     name: 'teacher.chat',
            //     component: TeacherChat,
            //     meta: { title: 'Chat' }
            // },
            {
                path: '/teacher/courses/:id',
                name: 'teacher.courses.show',
                component: TeacherCourse,
                meta: { title: 'Course' }
            },
            {
                path: '/teacher/courses/:id/create-quiz',
                name: 'teacher.courses.create-quiz',
                component: TeacherCreateQuiz,
                meta: { title: 'Create Quiz' }
            },
            {
                path: '/teacher/courses/:id/quiz/:quiz_id/attempt',
                name: 'teacher.courses.quiz-attempt',
                component: TeacherQuizAttempt,
                meta: { title: 'Quiz Attempts' }
            }
        ]
    },

    {
        component: StudentLayout,
        beforeEnter: studentAuth,
        children: [
            {
                path: '/student/dashboard',
                name: 'student.dashboard',
                component: StudentDashboard,
                meta: { title: 'Dashboard' }
            },
            {
                path: '/student/courses/:id',
                name: 'student.courses.show',
                component: StudentCourse,
                meta: { title: 'Course' }
            }
        ]
    },

    // Wildcard route to redirect to home if route not found
    {
        path: '/:catchAll(.*)',
        redirect: '/home'
    }

]

export default createRouter({
    history: createWebHistory(),
    routes
})
