<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

const router = useRouter();
const userStore = useUserStore();

const fileInput = ref(null);
const previewUrl = ref(null);
const isAnalyzing = ref(false);
const analysisStep = ref('');
const progress = ref(0);
const showReward = ref(false);
const rewardData = ref(null);

// Analysis Steps for Fake AI Effect
const analysisLog = [
    "Initialisation de la caméra...",
    "Acquisition de l'image...",
    "Analyse spectrale...",
    "Détection des contours...",
    "Identification du matériau : POLYMÈRE",
    "Calcul de l'impact carbone...",
    "Génération de la récompense..."
];

const triggerCamera = () => {
    fileInput.value.click();
};

const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        // Create local preview
        previewUrl.value = URL.createObjectURL(file);
    }
};

const cancelScan = () => {
    previewUrl.value = null;
    isAnalyzing.value = false;
    progress.value = 0;
};

const startAnalysis = async () => {
    if (!previewUrl.value) return;

    isAnalyzing.value = true;
    progress.value = 0;

    // Simulate AI Steps sequence
    let stepIndex = 0;
    const interval = setInterval(() => {
        if (stepIndex < analysisLog.length) {
            analysisStep.value = analysisLog[stepIndex];
            progress.value += (100 / analysisLog.length);
            stepIndex++;
        } else {
            clearInterval(interval);
            submitScan();
        }
    }, 600); // 600ms per step ~ 4.2s total
};

const submitScan = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/scan/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userStore.currentUser._id })
        });
        
        if (response.ok) {
            const data = await response.json();
            rewardData.value = data.rewards;
            showReward.value = true;
            
            // Update local user store with returned user data
            userStore.currentUser = data.user;
            localStorage.setItem('user', JSON.stringify(data.user));
        } else {
            alert("Erreur lors de l'envoi. Réessayez.");
            isAnalyzing.value = false;
        }
    } catch (e) {
        console.error(e);
        alert("Erreur connexion serveur");
        isAnalyzing.value = false;
    }
};

const closeReward = () => {
    showReward.value = false; // Reset
    router.push('/profile');
};

</script>

<template>
  <div class="min-h-screen bg-black text-white relative flex flex-col items-center justify-center overflow-hidden font-mono">
    
    <!-- Background Grid Effect -->
    <div class="absolute inset-0 z-0 opacity-20 pointer-events-none" 
         style="background-image: linear-gradient(#0f0 1px, transparent 1px), linear-gradient(90deg, #0f0 1px, transparent 1px); background-size: 40px 40px;">
    </div>
    
    <!-- === STATE 1: CAMERA UI === -->
    <div v-if="!previewUrl" class="z-10 w-full h-full flex flex-col items-center justify-center p-6">
        <h1 class="text-2xl font-bold text-green-500 mb-8 uppercase tracking-widest border border-green-500 px-4 py-2">
            [ Système de Scan Actif ]
        </h1>
        
        <div 
          @click="triggerCamera"
          class="w-64 h-64 border-4 border-dashed border-green-500/50 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-green-900/20 hover:border-green-400 transition-all group"
        >
            <div class="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <span class="text-5xl">📷</span>
            </div>
            <span class="font-bold text-green-400 uppercase tracking-widest text-sm">Capturer Déchet</span>
            <span class="text-xs text-green-600 mt-2">Ramassage Spontané</span>
        </div>

        <p class="mt-8 text-center text-gray-500 max-w-xs text-xs">
            Utilisez ce scanner pour analyser et valider vos collectes hors mission. Gain d'XP immédiat.
        </p>
        
        <!-- Hidden Input -->
        <input 
            type="file" 
            ref="fileInput" 
            accept="image/*" 
            capture="environment" 
            class="hidden" 
            @change="handleFileChange"
        />
    </div>

    <!-- === STATE 2: PREVIEW & ANALYSIS === -->
    <div v-else class="z-10 w-full h-full absolute inset-0 bg-black flex flex-col">
        <!-- Header HUD -->
        <div class="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20 bg-gradient-to-b from-black/80 to-transparent">
            <button @click="cancelScan" :disabled="isAnalyzing" class="text-white/80 hover:text-white font-bold p-2 bg-black/50 rounded-lg backdrop-blur text-sm">
                ◀ ANNULER
            </button>
            <div class="text-red-500 font-bold animate-pulse text-xs tracking-widest border border-red-500/50 px-2 py-1 bg-black/50">
                ● REC
            </div>
        </div>

        <!-- Image Container -->
        <div class="relative flex-1 bg-gray-900 overflow-hidden">
            <img :src="previewUrl" class="w-full h-full object-cover opacity-80" />
            
            <!-- HUD Grid Overlay -->
            <div class="absolute inset-0 pointer-events-none border-[20px] border-black/30">
                <!-- Center Target -->
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-green-500/50 rounded-lg flex items-center justify-center">
                    <div class="w-44 h-44 border border-green-500/30"></div>
                    <div class="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-green-500"></div>
                    <div class="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-green-500"></div>
                    <div class="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-green-500"></div>
                    <div class="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-green-500"></div>
                </div>
                
                <!-- Scanning Line -->
                <div v-if="isAnalyzing" class="absolute left-0 right-0 h-1 bg-green-500 shadow-[0_0_20px_#0f0] animate-scan-line"></div>
            </div>
        </div>

        <!-- Analysis UI (Bottom Sheet) -->
        <div class="bg-slate-900 border-t border-green-900 p-6 flex flex-col gap-4 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
            
            <div v-if="!isAnalyzing">
                 <button 
                    @click="startAnalysis"
                    class="w-full bg-green-600 hover:bg-green-500 text-black font-black py-4 rounded-xl text-lg uppercase tracking-widest shadow-lg shadow-green-900/50 transform active:scale-95 transition"
                 >
                    ANALYSER LA PREUVE
                 </button>
            </div>

            <div v-else class="space-y-3">
                 <div class="flex justify-between text-xs font-mono text-green-400">
                     <span class="animate-pulse">> {{ analysisStep }}</span>
                     <span>{{ Math.min(100, Math.round(progress)) }}%</span>
                 </div>
                 
                 <!-- Progress Bar -->
                 <div class="h-2 bg-black rounded-full overflow-hidden border border-green-900">
                     <div class="h-full bg-green-500 transition-all duration-300 shadow-[0_0_10px_#0f0]" :style="{ width: `${progress}%` }"></div>
                 </div>

                 <!-- Decoding Text Effect -->
                 <div class="h-8 font-mono text-[10px] text-green-800 overflow-hidden opacity-50 leading-tight">
                     010101 MATERIAL_DETECT STRUCTURAL_INTEGRITY_CHECK 0x4F GPS_LOCK_CONFIRMED ...
                 </div>
            </div>
        </div>
    </div>

    <!-- === STATE 3: REWARD MODAL === -->
    <div v-if="showReward" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
         <div class="bg-gradient-to-b from-slate-800 to-slate-900 border border-yellow-500/30 rounded-3xl p-8 max-w-sm w-full text-center relative shadow-[0_0_50px_rgba(234,179,8,0.2)] overflow-hidden">
             
             <!-- Confetti / Rays Background -->
             <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-spin-slow"></div>

             <div class="relative z-10">
                 <div class="text-6xl mb-4 animate-bounce">🎉</div>
                 <h2 class="text-2xl font-black text-white uppercase italic mb-1">Analyse Terminée !</h2>
                 <p class="text-yellow-400 font-bold tracking-widest mb-6 border-b border-yellow-500/20 pb-4 inline-block">
                     {{ rewardData.type }} IDENTIFIÉ
                 </p>
                 
                 <div class="grid grid-cols-2 gap-4 mb-8">
                     <div class="bg-slate-800 p-3 rounded-xl border border-white/10">
                         <div class="text-2xl font-black text-yellow-400">+{{ rewardData.coins }}</div>
                         <div class="text-[10px] uppercase font-bold text-gray-400">EcoCoins</div>
                     </div>
                     <div class="bg-slate-800 p-3 rounded-xl border border-white/10">
                         <div class="text-2xl font-black text-blue-400">+{{ rewardData.xp }}</div>
                         <div class="text-[10px] uppercase font-bold text-gray-400">XP Points</div>
                     </div>
                 </div>

                 <button 
                    @click="closeReward"
                    class="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3 rounded-xl shadow-lg transition active:scale-95"
                 >
                    ENCAISSER & FERMER
                 </button>
             </div>
         </div>
    </div>

  </div>
</template>

<style scoped>
@keyframes scan-line {
    0% { top: 0; }
    100% { top: 100%; }
}
.animate-scan-line {
    animation: scan-line 2s linear infinite;
}
.animate-spin-slow {
    animation: spin 10s linear infinite;
}
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
.animate-fade-in {
    animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
}
</style>
