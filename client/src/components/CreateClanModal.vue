<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  userId: String
});

const emit = defineEmits(['close', 'clan-created']);

const form = ref({
  name: '',
  slogan: '',
  color: 'bg-blue-600' // Default
});

const colors = [
  { name: 'Bleu Corsair', class: 'bg-blue-600', hex: '#2563EB' },
  { name: 'Rouge Kraken', class: 'bg-red-600', hex: '#DC2626' },
  { name: 'Vert Algue', class: 'bg-green-600', hex: '#16A34A' },
  { name: 'Violet Toxique', class: 'bg-purple-600', hex: '#9333EA' },
  { name: 'Or Légendaire', class: 'bg-yellow-500', hex: '#EAB308' },
];

const isSubmitting = ref(false);

const createClan = async () => {
    if (!form.value.name || !form.value.slogan) return;
    
    isSubmitting.value = true;
    try {
        const response = await fetch('http://localhost:5000/api/clans', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: form.value.name,
                slogan: form.value.slogan,
                color: form.value.color,
                userId: props.userId
            })
        });

        const data = await response.json();

        if (response.ok) {
            emit('clan-created', data);
            emit('close');
        } else {
            alert(data.message || 'Erreur lors de la création du clan');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Erreur réseau');
    } finally {
        isSubmitting.value = false;
    }
};

</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="$emit('close')"></div>

    <!-- Modal Content -->
    <div class="relative w-full max-w-2xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col md:flex-row animate-scale-in">
      
      <!-- Left Side: Form -->
      <div class="p-8 md:w-1/2 flex flex-col justify-center">
        <h2 class="text-3xl font-black text-white mb-2 tracking-tighter uppercase">Fonder un Clan</h2>
        <p class="text-slate-400 text-sm mb-6">Assemblez votre équipage et dominez la Rade !</p>

        <form @submit.prevent="createClan" class="space-y-4">
          <!-- Name Input -->
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Nom du Clan</label>
            <input 
              v-model="form.name"
              type="text" 
              placeholder="ex: Les Pirates du Ponant" 
              class="w-full bg-slate-800 text-white font-bold rounded-xl px-4 py-3 border border-slate-700 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-lg placeholder-slate-600 transition-all outline-none"
              maxlength="20"
              required
            />
          </div>

          <!-- Slogan Input -->
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Slogan de Guerre</label>
            <input 
              v-model="form.slogan"
              type="text" 
              placeholder="ex: Pas de quartier !" 
              class="w-full bg-slate-800 text-white font-medium rounded-xl px-4 py-3 border border-slate-700 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 placeholder-slate-600 transition-all outline-none"
              maxlength="40"
              required
            />
          </div>

          <!-- Color Picker -->
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Couleur de Faction</label>
            <div class="flex gap-3">
              <button 
                v-for="color in colors" 
                :key="color.name"
                type="button"
                @click="form.color = color.class"
                :class="[
                  'w-10 h-10 rounded-full border-4 transition-transform hover:scale-110 shadow-lg',
                  color.class,
                  form.color === color.class ? 'border-white scale-110 ring-2 ring-yellow-400' : 'border-transparent opacity-70 hover:opacity-100'
                ]"
                :title="color.name"
              ></button>
            </div>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="w-full mt-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-900 font-black py-4 rounded-xl shadow-lg transform transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xl flex items-center justify-center gap-2"
          >
            <span v-if="isSubmitting" class="animate-spin text-2xl">⏳</span>
            <span v-else>Fonder (Gratuit)</span>
          </button>
        </form>
      </div>

      <!-- Right Side: Preview -->
      <div :class="['md:w-1/2 p-8 flex items-center justify-center relative overflow-hidden transition-colors duration-500 ease-in-out', form.color]">
        <!-- Pattern Overlay -->
        <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

        <!-- Banner Preview -->
        <div class="relative z-10 flex flex-col items-center justify-center text-center transform rotate-1 hover:rotate-0 transition-transform duration-500">
           <!-- Shield Shape -->
           <div class="w-64 h-80 bg-slate-900 border-8 border-current rounded-b-full rounded-t-lg shadow-2xl flex flex-col items-center p-6 relative overflow-visible" :class="form.color.replace('bg-', 'text-').replace('-600', '-400').replace('-500', '-300')">
              
              <!-- Icon/Logo Placeholder -->
              <div class="text-6xl mb-4 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-pulse-slow">
                🛡️
              </div>

              <!-- Clan Name -->
              <h1 class="text-2xl font-black text-white uppercase leading-none mb-2 break-all drop-shadow-md">
                {{ form.name || 'Votre Clan' }}
              </h1>

              <!-- Divider -->
              <div class="w-12 h-1 bg-white/50 rounded-full mb-2"></div>

              <!-- Slogan -->
              <p class="text-xs font-bold text-white/80 italic">
                "{{ form.slogan || 'Votre devise ici...' }}"
              </p>

              <!-- Reflection Effect -->
              <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none rounded-b-full rounded-t-lg"></div>
           </div>

           <!-- Label -->
           <div class="mt-8 bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
             <span class="text-white font-mono text-xs uppercase tracking-widest">Aperçu en temps réel</span>
           </div>
        </div>
      </div>
      
      <!-- Close Button -->
      <button @click="$emit('close')" class="absolute top-4 right-4 text-slate-500 hover:text-white transition z-20">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-8 h-8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

    </div>
  </div>
</template>

<style scoped>
@keyframes scale-in {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
.animate-scale-in {
  animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
