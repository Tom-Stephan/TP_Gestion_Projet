<script setup>
import { useMissionStore } from '../stores/useMissionStore';
import { ref, onMounted, onUnmounted, computed } from 'vue';

const missionStore = useMissionStore();
const fileInput = ref(null);

// Timer Logic
const now = ref(Date.now());
let intervalId;

onMounted(() => {
    intervalId = setInterval(() => {
        now.value = Date.now();
    }, 1000);
});

onUnmounted(() => {
    clearInterval(intervalId);
});

const formattedTime = computed(() => {
    if (!missionStore.startTime) return "00:00:00";
    
    // Calculates difference based on real-time now()
    const end = missionStore.startTime + (3 * 60 * 60 * 1000);
    const diff = Math.max(0, end - now.value);
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

const triggerCamera = () => {
    fileInput.value.click();
};

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        missionStore.addPhoto(file);
    }
};

const finishMission = () => {
    if (confirm("Valider la mission et envoyer les preuves ?")) {
        // Logic to send to API would go here
        alert("Mission accomplie ! Félicitations ! +500 XP");
        missionStore.stopMission();
    }
};
</script>

<template>
  <div v-if="missionStore.isActive" class="fixed inset-0 pointer-events-none z-[100] flex flex-col justify-between">
    
    <!-- Top HUD: Countdown -->
    <div class="pointer-events-auto w-full bg-red-600/90 backdrop-blur-sm p-4 text-center shadow-lg pt-12 md:pt-4 transition-all animate-slide-down">
        <div class="text-white text-xs font-bold uppercase tracking-[0.2em] mb-1 opacity-80 animate-pulse">Temps Restant</div>
        <div class="text-4xl md:text-5xl font-black text-white font-mono shadow-text leading-none tracking-widest">
            {{ formattedTime }}
        </div>
    </div>

    <!-- Bottom HUD: Actions -->
    <div class="pointer-events-auto bg-slate-900 border-t border-white/10 p-6 pb-8 flex items-end justify-between gap-4 animate-slide-up shadow-2xl">
        
        <!-- Photo Button -->
        <div class="flex flex-col gap-2">
            <!-- Photo Thumbnails -->
            <div class="flex gap-2 mb-2">
                <div v-for="(photo, index) in missionStore.photos" :key="index" class="w-12 h-12 rounded border-2 border-white bg-gray-800 overflow-hidden shadow-lg transform hover:scale-110 transition">
                    <img :src="photo" class="w-full h-full object-cover" />
                </div>
            </div>

            <button 
                @click="triggerCamera" 
                class="bg-blue-600 hover:bg-blue-500 text-white font-black p-4 rounded-2xl shadow-xl flex items-center gap-2 transition active:scale-95 border-b-4 border-blue-800 active:border-b-0 translate-y-0 active:translate-y-1"
            >
                <span class="text-2xl">📷</span>
                <span class="hidden md:inline uppercase">Preuve</span>
            </button>
            <input type="file" ref="fileInput" accept="image/*" capture="environment" class="hidden" @change="handleFileUpload" />
        </div>

        <!-- Finish Button -->
        <button 
            @click="finishMission" 
            class="flex-1 bg-alert-red hover:bg-red-500 text-white font-black py-4 px-6 rounded-2xl shadow-xl text-center uppercase tracking-wider text-lg transition active:scale-95 border-b-4 border-red-900 active:border-b-0 translate-y-0 active:translate-y-1 animate-pulse"
        >
            Terminer la Mission 🛑
        </button>
    </div>

  </div>
</template>

<style scoped>
.shadow-text {
    text-shadow: 2px 2px 0px rgba(0,0,0,0.5);
}

@keyframes slide-down {
    from { transform: translateY(-100%); }
    to { transform: translateY(0); }
}
.animate-slide-down {
    animation: slide-down 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slide-up {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
}
.animate-slide-up {
    animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
