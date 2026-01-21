<script setup>
import { ref, onMounted } from 'vue';
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';

const zoom = ref(13);
const center = ref([48.390394, -4.486076]); // Brest

// Mock Data for Pollution Spots
const spots = ref([
  { id: 1, lat: 48.3912, lng: -4.4375, status: 'clean', name: 'Plage du Moulin Blanc', description: 'Zone sécurisée par les Corsaires.' },
  { id: 2, lat: 48.3831, lng: -4.4850, status: 'polluted', name: 'Opération Pneus', description: 'Gros dépôt sauvage signalé !' },
  { id: 3, lat: 48.3885, lng: -4.4900, status: 'polluted', name: 'Mégots Rue de Siam', description: 'Nettoyage urgent requis.' },
]);

const getUserLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        center.value = [position.coords.latitude, position.coords.longitude];
        zoom.value = 15;
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }
};

onMounted(() => {
  getUserLocation();
});

// Custom Icons Logic (Simplified for now using Leaflet default, but logic ready for custom assets)
// Ideally, use L.icon() here for Red/Green markers
</script>

<template>
  <div class="h-screen w-full relative">
    <l-map ref="map" v-model:zoom="zoom" v-model:center="center" :use-global-leaflet="false">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>

      <l-marker 
        v-for="spot in spots" 
        :key="spot.id" 
        :lat-lng="[spot.lat, spot.lng]"
      >
        <l-popup>
          <div class="text-center p-2">
            <div class="text-lg font-black uppercase mb-1" :class="spot.status === 'clean' ? 'text-forest-green' : 'text-alert-red'">
              {{ spot.status === 'clean' ? 'Zone Propre' : 'Zone Menacée' }}
            </div>
            <h3 class="font-bold text-gray-800">{{ spot.name }}</h3>
            <p class="text-sm text-gray-600 my-2">{{ spot.description }}</p>
            <button v-if="spot.status === 'polluted'" class="btn-game text-xs py-2 px-4 w-full mt-2">
              Attaquer (500 XP)
            </button>
          </div>
        </l-popup>
      </l-marker>
      
      <!-- Current User Marker (simulated logic) -->
       <l-marker :lat-lng="center">
          <l-popup>Vous êtes ici 📍</l-popup>
       </l-marker>

    </l-map>

    <!-- Floating Action Button for Recenter -->
    <button @click="getUserLocation" class="absolute bottom-24 right-4 z-[400] bg-white p-3 rounded-full shadow-xl text-2xl border-2 border-ocean-blue active:scale-95 transition">
      🎯
    </button>
  </div>
</template>

<style scoped>
/* Leaflet z-index fix for mobile nav */
.leaflet-pane {
    z-index: 10 !important;
}
</style>
