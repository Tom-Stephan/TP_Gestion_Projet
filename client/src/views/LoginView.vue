<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);

const userStore = useUserStore();
const router = useRouter();

const handleLogin = async () => {
  error.value = '';
  isLoading.value = true;
  
  if (!email.value || !password.value) {
    error.value = 'Veuillez remplir tous les champs';
    isLoading.value = false;
    return;
  }

  const success = await userStore.login(email.value, password.value);
  
  if (success) {
    router.push('/profile');
  } else {
    error.value = 'Email ou mot de passe incorrect';
  }
  isLoading.value = false;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border-t-8 border-ocean-blue">
      <div class="text-center mb-8">
        <div class="text-6xl mb-2">⚓</div>
        <h1 class="text-3xl font-black text-gray-800">Bienvenue à Bord</h1>
        <p class="text-gray-500 mt-2">Connectez-vous pour accéder à votre inventaire</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-1">Email</label>
          <input 
            v-model="email"
            type="email" 
            placeholder="lucas@example.com"
            class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-ocean-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          >
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-1">Mot de passe</label>
          <input 
            v-model="password"
            type="password" 
            placeholder="••••••••"
            class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-ocean-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          >
        </div>

        <div v-if="error" class="bg-red-50 text-alert-red text-sm font-bold p-3 rounded-lg flex items-center gap-2">
          <span>⚠️</span> {{ error }}
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-ocean-blue hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transform active:scale-95 transition-all flex justify-center items-center gap-2"
        >
          <span v-if="isLoading" class="animate-spin">⏳</span>
          <span v-else>Hisser les voiles !</span>
        </button>
      </form>

      <div class="mt-8 text-center text-sm text-gray-400">
        Pas encore membre ? <a href="#" class="text-forest-green font-bold hover:underline">Rejoindre l'équipage</a>
      </div>
    </div>
  </div>
</template>
