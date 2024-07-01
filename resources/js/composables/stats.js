import { ref } from 'vue'
import axios from 'axios';

export default function useStats() {
    const stats = ref([])

    const getStats = async () => {
        axios.get('/api/stats')
            .then(response => {
                stats.value = response.data;
            })
    }

    return { stats, getStats }

}
