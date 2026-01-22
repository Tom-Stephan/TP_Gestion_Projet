<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '../stores/userStore';
import CreateClanModal from './CreateClanModal.vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const showCreateModal = ref(false);
const activeTab = ref('WAR'); // 'WAR' | 'DIRECTORY'
const allClans = ref([]);
const searchQuery = ref('');

// Timer Logic
const seasonEndTime = new Date('2026-03-31T23:59:59').getTime();
const timeLeft = ref('');

const updateTimer = () => {
    const now = new Date().getTime();
    const distance = seasonEndTime - now;
    
    if (distance < 0) {
        timeLeft.value = "SAISON TERMINÉE";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    
    timeLeft.value = `${days}j ${hours}h ${minutes}m`;
};

let timerInterval;

// Fetch Data
const fetchClans = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/clans');
        if (response.ok) {
            allClans.value = await response.json();
        }
    } catch (e) {
        console.error("Failed to fetch clans", e);
        // Mock fallback if API fails
        allClans.value = [
            { _id: '1', nom: "Les Corsaires d'Armorique", faction: 'Corsaires', total_points: 15400, members: [1,2,3,4,5,6,7,8], couleur_hex: '#2563EB' },
            { _id: '2', nom: "Krakens de la Rade", faction: 'Krakens', total_points: 13200, members: [1,2,3,4,5], couleur_hex: '#DC2626' },
            { _id: '3', nom: "Gardiens du Phare", faction: 'Corsaires', total_points: 8500, members: [1,2,3], couleur_hex: '#16A34A' }
        ];
    }
};

onMounted(() => {
    updateTimer();
    timerInterval = setInterval(updateTimer, 60000);
    fetchClans();
});

onUnmounted(() => {
    clearInterval(timerInterval);
});

// Computed
const userClan = computed(() => {
    if (!userStore.currentUser?.clan_id) return null;
    return typeof userStore.currentUser.clan_id === 'object' 
        ? userStore.currentUser.clan_id 
        : { _id: userStore.currentUser.clan_id, nom: 'Mon Clan' };
});

const handleClanCreated = (newClan) => {
    if (userStore.currentUser) {
        userStore.currentUser.clan_id = newClan;
        localStorage.setItem('user', JSON.stringify(userStore.currentUser));
    }
};

const topClans = computed(() => {
    return [...allClans.value].sort((a, b) => b.total_points - a.total_points).slice(0, 3);
});

const filteredClans = computed(() => {
    if (!searchQuery.value) return allClans.value;
    return allClans.value.filter(c => c.nom.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

// Faction Scores (Mock derived from clans logic or separate API? Using sum of clans for now)
const factionScores = computed(() => {
    // Simple mock accumulation
    const corsScore = allClans.value.filter(c => c.faction === 'Corsaires').reduce((sum, c) => sum + c.total_points, 0) || 12400;
    const krakScore = allClans.value.filter(c => c.faction === 'Krakens').reduce((sum, c) => sum + c.total_points, 0) || 10800;
    
    const total = corsScore + krakScore;
    return {
        corsaires: { score: corsScore, percent: (corsScore/total)*100 },
        krakens: { score: krakScore, percent: (krakScore/total)*100 }
    };
});

</script>

<template>
  <div class="min-h-screen bg-slate-900 text-white font-sans pb-24 overflow-x-hidden">
    
    <!-- Hero / Timer Section -->
    <div class="relative pt-8 pb-12 px-4 shadow-2xl bg-gradient-to-b from-slate-800 to-slate-900 border-b border-white/5">
        <div class="text-center mb-6">
            <h2 class="text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-500 drop-shadow-sm">
                Guerre des Clans
            </h2>
            <div class="inline-flex items-center gap-2 bg-black/40 border border-white/10 rounded-full px-4 py-1 mt-2 backdrop-blur-sm">
                <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span class="text-xs font-mono text-gray-300">FIN SAISON 1 : <span class="text-white font-bold">{{ timeLeft }}</span></span>
            </div>
        </div>

        <!-- The Duel Visualizer -->
        <div class="flex items-center justify-between gap-2 max-w-lg mx-auto relative mb-8">
            <!-- Corsaires Card -->
            <div class="relative flex-1 bg-gradient-to-br from-blue-900/80 to-blue-600/20 border border-blue-500/30 rounded-xl p-3 flex flex-col items-center shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                <div class="text-4xl mb-1 filter drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">🏴‍☠️</div>
                <div class="font-black text-blue-400 text-sm uppercase tracking-wider">Corsaires</div>
                <div class="font-bold text-xl">{{ (factionScores.corsaires.score / 1000).toFixed(1) }}k</div>
            </div>

            <!-- VS Icon -->
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-slate-900 rounded-full border-2 border-white/10 flex items-center justify-center shadow-lg">
                <span class="font-black text-yellow-500 italic text-sm">VS</span>
            </div>

            <!-- Krakens Card -->
            <div class="relative flex-1 bg-gradient-to-bl from-red-900/80 to-red-600/20 border border-red-500/30 rounded-xl p-3 flex flex-col items-center shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                <div class="text-4xl mb-1 filter drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">🐙</div>
                <div class="font-black text-red-400 text-sm uppercase tracking-wider">Krakens</div>
                <div class="font-bold text-xl">{{ (factionScores.krakens.score / 1000).toFixed(1) }}k</div>
            </div>
        </div>

        <!-- Neon Progress Bar -->
        <div class="relative h-6 bg-slate-800 rounded-full overflow-hidden shadow-inner max-w-lg mx-auto border border-white/5">
            <div 
                class="absolute left-0 top-0 bottom-0 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.6)] transition-all duration-1000" 
                :style="{ width: `${factionScores.corsaires.percent}%` }"
            ></div>
            <div 
                class="absolute right-0 top-0 bottom-0 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)] transition-all duration-1000" 
                :style="{ width: `${factionScores.krakens.percent}%` }"
            ></div>
            <!-- Center Line -->
            <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/20 -translate-x-1/2"></div>
        </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex border-b border-white/10 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-30">
        <button 
            @click="activeTab = 'WAR'"
            class="flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors relative"
            :class="activeTab === 'WAR' ? 'text-yellow-400' : 'text-gray-500 hover:text-gray-300'"
        >
            La Guerre
            <div v-if="activeTab === 'WAR'" class="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400 shadow-[0_-2px_10px_rgba(250,204,21,0.5)]"></div>
        </button>
        <button 
            @click="activeTab = 'DIRECTORY'"
            class="flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors relative"
            :class="activeTab === 'DIRECTORY' ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'"
        >
            Annuaire
            <div v-if="activeTab === 'DIRECTORY'" class="absolute bottom-0 left-0 right-0 h-1 bg-blue-400 shadow-[0_-2px_10px_rgba(96,165,250,0.5)]"></div>
        </button>
    </div>

    <!-- Content Area -->
    <div class="p-4 max-w-md mx-auto min-h-[400px]">
        
        <!-- === WAR TAB === -->
        <div v-if="activeTab === 'WAR'" class="space-y-8 animate-fade-in">
            
            <!-- Podium Section -->
            <div class="text-center">
                <h3 class="text-lg font-bold text-gray-400 mb-6 uppercase tracking-wider flex items-center justify-center gap-2">
                    <span class="text-2xl">🏆</span> Meilleurs Clans
                </h3>
                
                <div class="flex justify-center items-end gap-2 h-48">
                    <!-- 2nd Place -->
                    <div v-if="topClans[1]" class="w-24 flex flex-col items-center group cursor-pointer" @click="$router.push(`/clan/${topClans[1]._id}`)">
                        <div class="mb-2 text-3xl filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition duration-300">🛡️</div>
                        <div class="w-full bg-gradient-to-t from-slate-700 to-slate-600 rounded-t-lg border-t-4 border-gray-400 relative shadow-lg h-32 flex flex-col justify-end pb-2">
                            <span class="text-4xl font-black text-white/10 absolute top-2 left-1/2 -translate-x-1/2">2</span>
                            <div class="px-1">
                                <span class="block text-xs font-bold truncate">{{ topClans[1].nom }}</span>
                                <span class="block text-[10px] text-gray-400 font-mono">{{ (topClans[1].total_points/1000).toFixed(0) }}k</span>
                            </div>
                        </div>
                    </div>

                    <!-- 1st Place -->
                    <div v-if="topClans[0]" class="w-28 flex flex-col items-center z-10 -mx-1 group cursor-pointer" @click="$router.push(`/clan/${topClans[0]._id}`)">
                        <div class="mb-2 text-5xl relative">
                            🛡️
                            <div class="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl animate-bounce">👑</div>
                        </div>
                        <div class="w-full bg-gradient-to-t from-yellow-700 to-yellow-600 rounded-t-lg border-t-4 border-yellow-400 relative shadow-xl shadow-yellow-900/20 h-40 flex flex-col justify-end pb-4">
                            <span class="text-5xl font-black text-white/10 absolute top-2 left-1/2 -translate-x-1/2">1</span>
                            <div class="px-1">
                                <span class="block text-sm font-black text-white truncate">{{ topClans[0].nom }}</span>
                                <span class="block text-xs text-yellow-200 font-mono font-bold">{{ (topClans[0].total_points/1000).toFixed(0) }}k pts</span>
                            </div>
                        </div>
                    </div>

                    <!-- 3rd Place -->
                    <div v-if="topClans[2]" class="w-24 flex flex-col items-center group cursor-pointer" @click="$router.push(`/clan/${topClans[2]._id}`)">
                        <div class="mb-2 text-3xl filter sepia opacity-80 group-hover:sepia-0 group-hover:opacity-100 transition duration-300">🛡️</div>
                        <div class="w-full bg-gradient-to-t from-orange-800 to-amber-900 rounded-t-lg border-t-4 border-orange-600 relative shadow-lg h-24 flex flex-col justify-end pb-2">
                            <span class="text-4xl font-black text-white/10 absolute top-2 left-1/2 -translate-x-1/2">3</span>
                            <div class="px-1">
                                <span class="block text-xs font-bold truncate">{{ topClans[2].nom }}</span>
                                <span class="block text-[10px] text-orange-200 font-mono">{{ (topClans[2].total_points/1000).toFixed(0) }}k</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- User's Clan Card (Reminder) -->
            <div v-if="userClan" 
                 @click="$router.push(`/clan/${userClan._id}`)"
                 class="mt-8 bg-black/40 border border-white/10 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-black/60 transition group"
            >
                <div>
                   <div class="text-xs text-gray-500 uppercase font-bold mb-1">Votre QG</div>
                   <div class="font-bold text-lg group-hover:text-yellow-400 transition">{{ userClan.nom }}</div>
                </div>
                <div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 group-hover:border-yellow-400 transition">
                    ➤
                </div>
            </div>

        </div>

        <!-- === DIRECTORY TAB === -->
        <div v-else class="space-y-4 animate-fade-in">
            <!-- Search -->
            <div class="relative">
                <input 
                    v-model="searchQuery"
                    type="text" 
                    placeholder="Rechercher un clan..." 
                    class="w-full bg-slate-800 text-white pl-10 pr-4 py-3 rounded-xl border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                />
                <span class="absolute left-3 top-3.5 text-gray-500">🔍</span>
            </div>

            <!-- List -->
            <div class="space-y-3">
                <div 
                    v-for="c in filteredClans" 
                    :key="c._id"
                    @click="$router.push(`/clan/${c._id}`)"
                    class="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex items-center gap-4 hover:border-blue-500/50 cursor-pointer transition active:scale-98"
                >
                    <!-- Icon -->
                    <div class="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-inner" :style="{ backgroundColor: c.couleur_hex || '#334155' }">
                        🛡️
                    </div>
                    
                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                        <div class="font-bold text-white truncate">{{ c.nom }}</div>
                        <div class="text-xs text-gray-400 truncate italic">"{{ c.slogan || 'Sans devise' }}"</div>
                        <div class="flex items-center gap-2 mt-1">
                             <span class="text-[10px] bg-slate-900 text-gray-300 px-1.5 rounded border border-slate-700">{{ c.members ? c.members.length : '?' }} membres</span>
                             <span class="text-[10px] font-bold" :class="c.faction === 'Corsaires' ? 'text-blue-400' : 'text-red-400'">{{ c.faction }}</span>
                        </div>
                    </div>

                    <!-- Points -->
                    <div class="text-right">
                        <div class="font-mono font-bold text-yellow-500">{{ (c.total_points/1000).toFixed(1) }}k</div>
                    </div>
                </div>
                
                <div v-if="filteredClans.length === 0" class="text-center py-8 text-gray-500">
                    Aucun clan trouvé 🏴‍☠️
                </div>
            </div>
        </div>

    </div>

    <!-- CTA Create Clan (if no clan) -->
    <div v-if="!userClan" class="fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
        <button 
            @click="showCreateModal = true"
            class="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black py-3 px-8 rounded-full shadow-lg shadow-yellow-500/30 flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wider"
        >
            <span class="text-xl">⚔️</span> Créer mon Clan
        </button>
    </div>

    <!-- Modal -->
    <CreateClanModal 
        :is-open="showCreateModal" 
        :user-id="userStore.currentUser?._id"
        @close="showCreateModal = false"
        @clan-created="handleClanCreated"
    />
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
