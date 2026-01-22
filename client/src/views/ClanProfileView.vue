<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const clan = ref(null);
const loading = ref(true);
const error = ref(null);
const isLeaving = ref(false);
const isJoining = ref(false);

// Generate Mock Members for Demo
const mockMembers = [
    { _id: 'm1', pseudo: 'BlackBeard', avatar: '☠️', wallet_points: 15420, level: 16 },
    { _id: 'm2', pseudo: 'Calypso', avatar: '🧜‍♀️', wallet_points: 12100, level: 13 },
    { _id: 'm3', pseudo: 'Sparrow', avatar: '🐦', wallet_points: 9800, level: 10 },
    { _id: 'm4', pseudo: 'Barbossa', avatar: '🍏', wallet_points: 5400, level: 6 },
    { _id: 'm5', pseudo: 'Gibbs', avatar: '🍶', wallet_points: 3200, level: 4 },
];

const fetchClan = async () => {
    try {
        const response = await fetch(`http://localhost:5000/api/clans/${route.params.id}`);
        if (!response.ok) throw new Error('Clan introuvable');
        const data = await response.json();
        
        // Merge real members with mock data if real roster is small (for visual satisfaction)
        // In prod, remove this merge.
        if (data.members && data.members.length < 5) {
             data.members = [...data.members, ...mockMembers.filter(m => !data.members.find(rm => rm._id === m._id))];
        }
        
        clan.value = data;
    } catch (err) {
        error.value = err.message;
        // Fallbck mock for dev if API fails completely
        if (!clan.value) {
           clan.value = {
               _id: route.params.id,
               nom: 'Légion Fantôme',
               slogan: 'Toujours debout, jamais vaincus',
               faction: 'Corsaires',
               total_points: 45920,
               members: mockMembers,
               couleur_hex: '#2563EB'
           };
        }
    } finally {
        loading.value = false;
    }
};

onMounted(fetchClan);

const isMember = computed(() => {
    // Robust check handling object or string id
    const currentClanId = userStore.currentUser?.clan_id;
    const targetClanId = clan.value?._id;
    
    if (!currentClanId || !targetClanId) return false;
    
    // If object (populated), check _id
    const userCIdString = typeof currentClanId === 'object' ? currentClanId._id : currentClanId;
    return userCIdString === targetClanId;
});

const sortedMembers = computed(() => {
    if (!clan.value?.members) return [];
    // Sort by score descending
    return [...clan.value.members].sort((a, b) => b.wallet_points - a.wallet_points);
});

const handleJoin = async () => {
    if (userStore.currentUser?.clan_id) {
        alert("Vous appartenez déjà à un clan !");
        return;
    }
    isJoining.value = true;
    try {
        const response = await fetch(`http://localhost:5000/api/clans/${clan.value._id}/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userStore.currentUser._id })
        });
        if (response.ok) {
            const updatedClan = await response.json();
            // Preserve mocks for demo even after reload if needed (but API returns real state)
            // Just update local user
            userStore.currentUser.clan_id = updatedClan._id;
            localStorage.setItem('user', JSON.stringify(userStore.currentUser));
            clan.value = updatedClan; // Refresh view
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (err) {
        alert('Erreur réseau');
    } finally {
        isJoining.value = false;
    }
};

const handleLeave = async () => {
    if (!confirm("Voulez-vous vraiment abandonner vos frères d'armes ? Vos points personnels seront conservés mais le clan perdra votre contribution.")) return;

    isLeaving.value = true;
    try {
        const response = await fetch(`http://localhost:5000/api/clans/leave`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userStore.currentUser._id })
        });

        if (response.ok) {
            userStore.currentUser.clan_id = null;
            localStorage.setItem('user', JSON.stringify(userStore.currentUser));
            router.push('/clan'); 
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (err) {
        alert('Erreur réseau');
    } finally {
        isLeaving.value = false;
    }
};

// Gradient Helper
const getBgGradient = (hex) => {
    // Simple mapping or inline style generation. For demo, simplified mapping.
    // Real implementation: hex to rgba to properly mix.
    // Using style binding for arbitrary hex.
    return {
        background: `radial-gradient(circle at top, ${hex || '#2563EB'}, #0f172a)`
    };
};
</script>

<template>
  <div class="min-h-screen bg-slate-900 pb-24 font-sans text-white relative">
    
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center h-screen">
       <span class="animate-spin text-4xl">⚓</span>
    </div>

    <div v-else>
       <!-- Back Nav -->
       <router-link to="/clan" class="absolute top-4 left-4 z-20 bg-black/30 hover:bg-black/50 p-3 rounded-full backdrop-blur-md transition group">
           <span class="block transform group-hover:-translate-x-1 transition text-white">⬅️</span>
       </router-link>

       <!-- Hero Header -->
       <div class="relative pt-24 pb-16 px-6 overflow-hidden shadow-2xl" :style="getBgGradient(clan.couleur_hex)">
           <!-- Texture -->
           <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
           
           <div class="relative z-10 text-center">
               <div class="text-7xl mb-4 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] animate-pulse-slow">
                   🛡️
               </div>
               <h1 class="text-4xl md:text-5xl font-black uppercase tracking-tight drop-shadow-lg mb-2">
                   {{ clan.nom }}
               </h1>
               <p class="text-lg md:text-xl font-bold italic text-white/80 border-t-2 border-white/20 inline-block px-10 pt-4">
                   "{{ clan.slogan }}"
               </p>
           </div>
       </div>

       <!-- Stats Cards Grid (Glassmorphism) -->
       <div class="max-w-md mx-auto px-4 -mt-8 relative z-20 grid grid-cols-3 gap-3 text-center">
           <!-- Rank -->
           <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex flex-col items-center shadow-lg">
               <div class="text-2xl mb-1">🏆</div>
               <div class="text-sm font-bold text-gray-400 uppercase tracking-wider">Rang</div>
               <div class="font-black text-xl">3ème</div>
           </div>
           <!-- Points -->
           <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex flex-col items-center shadow-lg">
               <div class="text-2xl mb-1">⚔️</div>
               <div class="text-sm font-bold text-gray-400 uppercase tracking-wider">Points</div>
               <div class="font-black text-xl">{{ (clan.total_points / 1000).toFixed(1) }}k</div>
           </div>
           <!-- Members -->
           <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex flex-col items-center shadow-lg">
               <div class="text-2xl mb-1">👥</div>
               <div class="text-sm font-bold text-gray-400 uppercase tracking-wider">Membres</div>
               <div class="font-black text-xl">{{ clan.members.length }}/50</div>
           </div>
       </div>

       <!-- Roster Leaderboard -->
       <div class="max-w-md mx-auto px-4 mt-8">
           <h2 class="text-xl font-black uppercase text-gray-400 mb-4 flex items-center gap-2">
               LEADERBOARD <span class="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">Saison 1</span>
           </h2>
           
           <div class="space-y-3">
               <div 
                   v-for="(member, index) in sortedMembers" 
                   :key="member._id"
                   class="relative bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center gap-4 transition-all hover:bg-slate-700 hover:scale-[1.02] shadow-md group"
                   :class="{
                       'border-yellow-500/50 bg-yellow-900/10': index === 0,
                       'border-gray-400/50 bg-gray-900/10': index === 1,
                       'border-orange-700/50 bg-orange-900/10': index === 2
                   }"
               >
                   <!-- Position Badge -->
                   <div :class="[
                       'w-8 h-8 flex items-center justify-center font-black rounded-full text-sm',
                       index === 0 ? 'bg-yellow-500 text-black' :
                       index === 1 ? 'bg-gray-300 text-black' :
                       index === 2 ? 'bg-amber-700 text-white' :
                       'bg-slate-700 text-slate-400'
                   ]">
                       {{ index + 1 }}
                   </div>

                   <!-- Avatar (with glow for Top 3) -->
                   <div class="relative">
                       <div class="text-3xl filter" :class="index < 3 ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : ''">
                           {{ member.avatar || '👤' }}
                       </div>
                   </div>

                   <!-- Name & Level -->
                   <div class="flex-1">
                       <div class="flex items-center gap-2">
                           <span class="font-black text-lg text-white group-hover:text-yellow-400 transition-colors">{{ member.pseudo }}</span>
                           <span v-if="member._id === clan.chef_id" class="text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded font-bold uppercase">Chef</span>
                       </div>
                       <div class="text-xs text-slate-400 font-bold uppercase mt-0.5">
                           Niveau {{ member.level || Math.floor((member.wallet_points || 0) / 1000) + 1 }}
                       </div>
                   </div>

                   <!-- Score -->
                   <div class="text-right">
                       <div class="font-black text-xl text-white">{{ member.wallet_points || 0 }}</div>
                       <div class="text-[10px] font-bold text-slate-500 uppercase">pts</div>
                   </div>
               </div>
           </div>
           
           <!-- Spacer for FAB -->
           <div class="h-24"></div>
       </div>

       <!-- Sticky Action Footer -->
       <div class="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-40 flex justify-center pb-8 safe-area-pb">
            <div class="w-full max-w-md">
                <!-- Join Button -->
                <button 
                   v-if="!isMember"
                   @click="handleJoin" 
                   :disabled="isJoining"
                   class="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-black text-lg py-4 rounded-2xl shadow-lg shadow-green-900/50 transform transition active:scale-95 flex items-center justify-center gap-3 uppercase tracking-wide border-2 border-green-400/30"
                >
                   <span class="text-2xl">⚔️</span>
                   <span>Rejoindre l'Équipage</span>
                </button>

                <!-- Leave Button -->
                <button 
                   v-else
                   @click="handleLeave"
                   :disabled="isLeaving"
                   class="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 border-2 border-red-500/20 font-bold py-3 rounded-xl backdrop-blur-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                   <span>🚪</span>
                   <span>Déserter le clan</span>
                </button>
            </div>
       </div>

    </div>
  </div>
</template>

<style scoped>
.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
.safe-area-pb {
    padding-bottom: env(safe-area-inset-bottom, 20px);
}
</style>
