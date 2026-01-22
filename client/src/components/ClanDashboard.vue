<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '../stores/userStore';
import CreateClanModal from './CreateClanModal.vue';

const userStore = useUserStore();
const showCreateModal = ref(false);

// Check if user has a clan (assuming populated object or ID)
const userClan = computed(() => {
    if (!userStore.currentUser?.clan_id) return null;
    // Handle case where it might be just an ID string if not populated, or object
    return typeof userStore.currentUser.clan_id === 'object' 
        ? userStore.currentUser.clan_id 
        : { _id: userStore.currentUser.clan_id, nom: 'Mon Clan' };
});

const handleClanCreated = (newClan) => {
    // Update local user state immediately
    if (userStore.currentUser) {
        userStore.currentUser.clan_id = newClan;
        localStorage.setItem('user', JSON.stringify(userStore.currentUser));
    }
};

// Mock Data (Static for now, could fetch from API)
const factions = ref({
  corsaires: { name: 'Corsaires', score: 12500, color: 'bg-blue-600', textColor: 'text-blue-600', borderColor: 'border-blue-600' },
  krakens: { name: 'Krakens', score: 10800, color: 'bg-red-600', textColor: 'text-red-600', borderColor: 'border-red-600' }
});

const topContributors = ref([
  { id: 1, pseudo: 'CapitaineJack', points: 1540, avatar: '🏴‍☠️', faction: 'corsaires' },
  { id: 2, pseudo: 'DavyJones', points: 1320, faction: 'krakens', avatar: '🐙' },
  { id: 3, pseudo: 'Elizabeth', points: 980, faction: 'corsaires', avatar: '⚔️' },
]);

// Computed for Progress Bar
const totalScore = computed(() => factions.value.corsaires.score + factions.value.krakens.score);
const corsairesPercent = computed(() => (factions.value.corsaires.score / totalScore.value) * 100);
const krakensPercent = computed(() => (factions.value.krakens.score / totalScore.value) * 100);

</script>

<template>
  <div class="p-6 max-w-md mx-auto font-sans pb-24">
    <!-- Header Clash -->
    <div class="mb-8 text-center relative">
      <h2 class="text-3xl font-black uppercase tracking-wider text-gray-800 drop-shadow-md">
        Guerre des Clans
      </h2>
      <div class="absolute -top-4 -left-4 text-4xl animate-bounce">💣</div>
      <div class="absolute -top-4 -right-4 text-4xl animate-bounce delay-100">💥</div>
    </div>

    <!-- My Clan Section -->
    <div class="mb-8">
        <div v-if="userClan" class="bg-slate-800 rounded-2xl p-6 text-white shadow-xl border-t-4 border-yellow-400 relative overflow-hidden">
            <div class="absolute top-0 right-0 p-4 opacity-10 text-6xl">🛡️</div>
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Mon Allégeance</h3>
            <div class="text-2xl font-black mb-1">{{ userClan.nom }}</div>
            <div class="text-sm italic text-yellow-400" v-if="userClan.slogan">"{{ userClan.slogan }}"</div>
            <div v-if="userClan.chef_id === userStore.currentUser?._id" class="mt-4 inline-block bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">👑 Chef de Clan</div>
        </div>

        <div v-else class="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-center text-white shadow-xl transform transition hover:scale-102">
            <div class="text-4xl mb-4">⚔️</div>
            <h3 class="text-xl font-bold mb-2">Sans Bannière ?</h3>
            <p class="text-purple-100 text-sm mb-6">Rejoignez la légende ou écrivez la vôtre.</p>
            <button 
                @click="showCreateModal = true"
                class="w-full bg-white text-indigo-700 font-black py-3 rounded-xl shadow-lg hover:bg-gray-50 transition-colors uppercase tracking-wider"
            >
                Fonder un Clan
            </button>
        </div>
    </div>

    <!-- Progress Bar Battle -->
    <div class="mb-10 bg-gray-200 p-2 rounded-2xl shadow-inner relative overflow-hidden">
      <!-- Scores Display -->
      <div class="flex justify-between mb-2 font-bold px-2">
        <span :class="factions.corsaires.textColor">{{ factions.corsaires.score }} pts</span>
        <span :class="factions.krakens.textColor">{{ factions.krakens.score }} pts</span>
      </div>
      
      <!-- The Bar -->
      <div class="h-8 flex rounded-xl overflow-hidden shadow-lg border-2 border-white ring-4 ring-gray-100">
        <div 
          :class="['h-full flex items-center justify-center transition-all duration-1000 ease-out relative', factions.corsaires.color]"
          :style="{ width: `${corsairesPercent}%` }"
        >
          <span class="absolute left-2 text-white font-black text-xs uppercase tracking-widest opacity-80">Corsaires</span>
          <!-- Shine effect -->
          <div class="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent"></div>
        </div>
        
        <!-- VS Badge in middle -->
        <div class="bg-yellow-400 z-10 -ml-3 -mr-3 w-8 h-full flex items-center justify-center transform -skew-x-12 border-2 border-white shadow-sm">
          <span class="text-xs font-black text-white transform skew-x-12">VS</span>
        </div>

        <div 
          :class="['h-full flex items-center justify-center transition-all duration-1000 ease-out relative', factions.krakens.color]"
          :style="{ width: `${krakensPercent}%` }"
        >
           <span class="absolute right-2 text-white font-black text-xs uppercase tracking-widest opacity-80">Krakens</span>
           <div class="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent"></div>
        </div>
      </div>
    </div>

    <!-- Top Contributors -->
    <div class="bg-white rounded-3xl p-6 shadow-xl border-4 border-gray-100">
      <h3 class="text-xl font-extrabold text-gray-700 mb-6 flex items-center gap-2">
        <span class="bg-yellow-400 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm">🏆</span>
        Top Contributeurs
      </h3>

      <div class="space-y-4">
        <div 
          v-for="(user, index) in topContributors" 
          :key="user.id"
          class="flex items-center gap-4 p-3 rounded-2xl transition-transform hover:scale-105 cursor-pointer bg-gradient-to-r from-gray-50 to-white shadow-sm hover:shadow-md border border-gray-100"
        >
          <!-- Rank Badge -->
          <div class="font-black text-2xl text-gray-300 w-6 text-center italic">
            #{{ index + 1 }}
          </div>

          <!-- Avatar -->
          <div class="relative">
            <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl border-2 border-white shadow-md">
              {{ user.avatar }}
            </div>
            <!-- Faction Indicator -->
            <div 
              :class="['absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-sm', user.faction === 'corsaires' ? 'bg-blue-500' : 'bg-red-500']"
            ></div>
          </div>

          <!-- Info -->
          <div class="flex-1">
            <div class="font-bold text-gray-800">{{ user.pseudo }}</div>
            <div class="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              {{ user.points }} pts
            </div>
          </div>
        </div>
      </div>
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
/* Scoped styles if needed, mostly handling via Tailwind */
</style>
