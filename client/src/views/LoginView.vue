<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';

const isLoginMode = ref(true);
const pseudo = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);

const userStore = useUserStore();
const router = useRouter();

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  error.value = '';
  // Reset fields if needed, or keep them for convenience
};

const handleSubmit = async () => {
  error.value = '';
  isLoading.value = true;
  
  if (!email.value || !password.value || (!isLoginMode.value && !pseudo.value)) {
    error.value = 'Veuillez remplir tous les champs';
    isLoading.value = false;
    return;
  }

  let success = false;

  if (isLoginMode.value) {
    success = await userStore.login(email.value, password.value);
  } else {
    success = await userStore.register(pseudo.value, email.value, password.value);
  }
  
  if (success) {
    router.push('/profile');
  } else {
    error.value = isLoginMode.value 
      ? 'Email ou mot de passe incorrect' 
      : 'Erreur lors de l\'inscription (Email déjà pris ?)';
  }
  isLoading.value = false;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border-t-8 border-ocean-blue">
      <div class="text-center mb-8">
        <div class="text-6xl mb-2">⚓</div>
        <h1 class="text-3xl font-black text-gray-800">{{ isLoginMode ? 'Bienvenue à Bord' : 'Nouveau Matelot' }}</h1>
        <p class="text-gray-500 mt-2">
          {{ isLoginMode ? 'Connectez-vous pour accéder à votre inventaire' : 'Rejoignez l\'aventure et nettoyez les océans' }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div v-if="!isLoginMode" class="animate-fade-in">
          <label class="block text-sm font-bold text-gray-700 mb-1">Pseudo</label>
          <input 
            v-model="pseudo"
            type="text" 
            placeholder="Capitaine Crochet"
            class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-ocean-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          >
        </div>

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
          <span v-else>{{ isLoginMode ? 'Hisser les voiles !' : 'Rejoindre l\'équipage' }}</span>
        </button>
      </form>

      <div class="mt-8 text-center text-sm text-gray-400">
        {{ isLoginMode ? 'Pas encore membre ?' : 'Déjà un compte ?' }} 
        <a href="#" @click.prevent="toggleMode" class="text-forest-green font-bold hover:underline">
          {{ isLoginMode ? 'Rejoindre l\'équipage' : 'Se connecter' }}
        </a>
      </div>
    </div>
  </div>
</template>
