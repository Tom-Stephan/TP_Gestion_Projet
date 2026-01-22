<script setup>
import { ref, onMounted } from 'vue';
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMissionStore } from '../../stores/useMissionStore';
import { useGameStore } from '../../stores/useGameStore';

const zoom = ref(13);
const center = ref([48.390394, -4.486076]); // Brest
const missionStore = useMissionStore();
const gameStore = useGameStore();

// Mock Data for Pollution Spots
const spots = ref([
  { id: 1, lat: 48.3912, lng: -4.4375, status: 'clean', type: 'clan', name: 'QG Corsaires', description: 'Base du clan principal.' },
  { id: 2, lat: 48.3831, lng: -4.4850, status: 'polluted', type: 'waste', name: 'Opération Pneus', description: 'Gros dépôt sauvage signalé !' },
  { id: 3, lat: 48.3885, lng: -4.4900, status: 'polluted', type: 'waste', name: 'Mégots Rue de Siam', description: 'Nettoyage urgent requis.' },
  { id: 4, lat: 48.3950, lng: -4.4500, status: 'clean', type: 'clan', name: 'Bastion de Garde', description: 'Clan allié sécurisé.' },
  { id: 5, lat: 48.3870, lng: -4.4750, status: 'active', type: 'arcade', name: 'Zone Gaming', description: 'Prouve tes connaissances pour gagner un Boost !' },
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

// Create Custom Div Icons with Emojis
const createDivIcon = (emoji, type) => {
  return L.divIcon({
    html: `
      <div class="custom-marker" data-type="${type}">
        <div class="marker-icon">${emoji}</div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48],
    className: 'custom-div-icon'
  });
};

// Create Hazard Marker with Radioactive Icon and Pulsing Halo
const createHazardMarker = () => {
  return L.divIcon({
    html: `
      <div class="hazard-marker-wrapper">
        <div class="hazard-halo"></div>
        <div class="hazard-marker">
          <div class="marker-icon">☢️</div>
        </div>
      </div>
    `,
    iconSize: [72, 72],
    iconAnchor: [36, 72],
    popupAnchor: [0, -72],
    className: 'hazard-marker-icon'
  });
};

// Create Safe Zone Marker with Force Field Effect
const createSafeZoneMarker = () => {
  return L.divIcon({
    html: `
      <div class="safe-zone-marker-wrapper">
        <div class="force-field-halo"></div>
        <div class="safe-zone-marker">
          <div class="marker-icon">🏰</div>
        </div>
      </div>
    `,
    iconSize: [72, 72],
    iconAnchor: [36, 72],
    popupAnchor: [0, -72],
    className: 'safe-zone-marker-icon'
  });
};

// Create Arcade Marker with Glitch Effect
const createArcadeMarker = () => {
  return L.divIcon({
    html: `
      <div class="arcade-marker-wrapper">
        <div class="arcade-glow"></div>
        <div class="arcade-marker">
          <div class="marker-icon">🎮</div>
        </div>
      </div>
    `,
    iconSize: [72, 72],
    iconAnchor: [36, 72],
    popupAnchor: [0, -72],
    className: 'arcade-marker-icon'
  });
};

const getMarkerIcon = (spot) => {
  if (spot.type === 'clan') {
    if (spot.status === 'clean') {
      return createSafeZoneMarker();
    }
  } else if (spot.type === 'arcade') {
    return createArcadeMarker();
  } else if (spot.type === 'waste') {
    if (spot.status === 'polluted') {
      return createHazardMarker();
    }
    return createDivIcon('🗑️', 'waste-clean');
  }
  return createDivIcon('📍', 'default');
};

const getUserIcon = () => {
  return L.divIcon({
    html: `
      <div class="custom-marker user-marker">
        <div class="marker-icon pulse">🎮</div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24],
    className: 'custom-div-icon'
  });
};

onMounted(() => {
  getUserLocation();
});

// Handle Attack on Hazard Spot
const handleAttack = (spotId) => {
  missionStore.startMission(spotId);
};

// Handle Reinforce Safe Zone
const handleReinforce = (spotId) => {
  const spot = spots.value.find(s => s.id === spotId);
  if (spot) {
    console.log(`Reinforced ${spot.name}! +200 XP`);
  }
};

// Handle Play Arcade Challenge
const handlePlay = (spotId) => {
  gameStore.openQuiz();
};
</script>

<template>
  <div class="absolute inset-0 z-0 overflow-hidden bg-gradient-to-b from-blue-200 to-blue-100">
    <l-map ref="map" v-model:zoom="zoom" v-model:center="center" :use-global-leaflet="false" class="w-full h-full">
      <!-- CartoDB Voyager TileLayer (More aesthetic for gaming) -->
      <l-tile-layer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        layer-type="base"
        name="CartoDB Voyager"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"
      ></l-tile-layer>

      <!-- Pollution Spots with Custom Icons -->
      <l-marker 
        v-for="spot in spots" 
        :key="spot.id" 
        :lat-lng="[spot.lat, spot.lng]"
        :icon="getMarkerIcon(spot)"
      >
        <!-- Hazard Popup for Polluted Waste -->
        <l-popup v-if="spot.status === 'polluted' && spot.type === 'waste'" class="hazard-popup-wrapper">
          <div class="hazard-popup-content">
            <div class="hazard-status-badge">
              <span class="badge-icon">⚠️</span>
              <span class="badge-text">ZONE MENACÉE</span>
            </div>
            <h3 class="hazard-title">{{ spot.name }}</h3>
            <p class="hazard-description">{{ spot.description }}</p>
            <button @click="handleAttack(spot.id)" class="hazard-attack-btn">
              <span class="btn-icon">⚔️</span>
              <span class="btn-text">ATTAQUER</span>
              <span class="btn-xp">(500 XP)</span>
            </button>
          </div>
        </l-popup>

        <!-- Safe Zone Popup for Protected Clan Headquarters -->
        <l-popup v-else-if="spot.status === 'clean' && spot.type === 'clan'" class="safe-zone-popup-wrapper">
          <div class="safe-zone-popup-content">
            <div class="safe-zone-status-badge">
              <span class="badge-icon">✓</span>
              <span class="badge-text">ZONE ALLIÉE</span>
            </div>
            <h3 class="safe-zone-title">{{ spot.name }}</h3>
            <p class="safe-zone-description">{{ spot.description }}</p>
            <button @click="handleReinforce(spot.id)" class="safe-zone-action-btn">
              <span class="btn-icon">🛡️</span>
              <span class="btn-text">RENFORCER</span>
              <span class="btn-xp">(+200 XP)</span>
            </button>
          </div>
        </l-popup>

        <!-- Arcade Popup for Gaming Challenges -->
        <l-popup v-else-if="spot.type === 'arcade'" class="arcade-popup-wrapper">
          <div class="arcade-popup-content">
            <div class="arcade-status-badge">
              <span class="badge-icon">🎮</span>
              <span class="badge-text">DÉFI ARCADE</span>
            </div>
            <h3 class="arcade-title">{{ spot.name }}</h3>
            <p class="arcade-description">{{ spot.description }}</p>
            <div class="coin-container">
              <span class="rotating-coin">🪙</span>
              <span class="coin-text">x2 BONUS</span>
            </div>
            <button @click="handlePlay(spot.id)" class="arcade-play-btn">
              <span class="btn-icon">⚡</span>
              <span class="btn-text">JOUER</span>
              <span class="btn-bonus">(Bonus x2)</span>
            </button>
          </div>
        </l-popup>

        <!-- Standard Gaming Popup for other spots -->
        <l-popup v-else class="gaming-popup">
          <div class="popup-content">
            <div class="popup-status" :class="spot.status === 'clean' ? 'status-clean' : 'status-polluted'">
              {{ spot.status === 'clean' ? '✓ ZONE SÉCURISÉE' : '⚠️ ZONE MENACÉE' }}
            </div>
            <h3 class="popup-title">{{ spot.name }}</h3>
            <p class="popup-description">{{ spot.description }}</p>
            <button v-if="spot.status === 'polluted'" class="popup-action-btn" @click="handleAttack(spot.id)">
              ⚔️ ATTAQUER (500 XP)
            </button>
          </div>
        </l-popup>
      </l-marker>
      
      <!-- User Current Position Marker -->
      <l-marker :lat-lng="center" :icon="getUserIcon()">
        <l-popup class="gaming-popup">
          <div class="popup-content">
            <div class="text-center">
              <p class="font-bold text-white">Vous êtes ici</p>
              <p class="text-sm">🎮 Position: {{ center[0].toFixed(3) }}, {{ center[1].toFixed(3) }}</p>
            </div>
          </div>
        </l-popup>
      </l-marker>

    </l-map>



    <!-- Floating Action Button for Recenter (positioned above nav) -->
    <button 
      @click="getUserLocation" 
      class="absolute right-4 z-[400] bg-gradient-to-br from-forest-green to-green-700 p-4 rounded-full shadow-2xl text-3xl border-4 border-white active:scale-95 transition transform hover:scale-110"
      title="Centrer la carte sur votre position"
      style="bottom: 5.5rem;"
    >
      🎯
    </button>
  </div>
</template>

<style scoped>
/* Hazard Marker Styling - Radioactive with Pulsing Halo */
:deep(.hazard-marker-icon) {
  background: none !important;
  border: none !important;
  box-shadow: none !important;
}

:deep(.hazard-marker-wrapper) {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
}

:deep(.hazard-halo) {
  position: absolute;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 100, 0, 0.6) 0%, rgba(255, 0, 0, 0.3) 70%, transparent 100%);
  animation: hazard-halo-pulse 2s ease-in-out infinite;
  box-shadow: 
    0 0 30px rgba(255, 0, 0, 0.8),
    0 0 60px rgba(255, 100, 0, 0.6),
    inset 0 0 20px rgba(255, 200, 0, 0.2);
}

@keyframes hazard-halo-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
    box-shadow: 
      0 0 30px rgba(255, 0, 0, 0.8),
      0 0 60px rgba(255, 100, 0, 0.6),
      inset 0 0 20px rgba(255, 200, 0, 0.2);
  }
  50% {
    transform: scale(1.15);
    opacity: 1;
    box-shadow: 
      0 0 50px rgba(255, 0, 0, 1),
      0 0 100px rgba(255, 100, 0, 0.8),
      inset 0 0 30px rgba(255, 200, 0, 0.3);
  }
}

:deep(.hazard-marker) {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #ffff00 0%, #ffcc00 50%, #ff9900 100%);
  border-radius: 8px;
  border: 2px solid #000;
  z-index: 10;
  animation: hazard-marker-shake 1.5s ease-in-out infinite;
  box-shadow: 0 0 20px rgba(255, 200, 0, 0.8);
}

@keyframes hazard-marker-shake {
  0%, 100% { transform: rotate(0deg); }
  15% { transform: rotate(-2deg); }
  30% { transform: rotate(2deg); }
  45% { transform: rotate(-2deg); }
  60% { transform: rotate(0deg); }
}

:deep(.hazard-marker .marker-icon) {
  font-size: 40px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  animation: icon-glow 1.5s ease-in-out infinite;
}

@keyframes icon-glow {
  0%, 100% { 
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }
  50% { 
    text-shadow: 0 0 8px rgba(255, 200, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.5);
  }
}

:deep(.hazard-marker-wrapper:hover) {
  z-index: 1000;
}

/* Safe Zone Marker Styling - Protective with Force Field Halo */
:deep(.safe-zone-marker-icon) {
  background: none !important;
  border: none !important;
  box-shadow: none !important;
}

:deep(.safe-zone-marker-wrapper) {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

:deep(.force-field-halo) {
  position: absolute;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.5) 0%, rgba(15, 136, 96, 0.2) 70%, transparent 100%);
  animation: force-field-pulse 4s ease-in-out infinite;
  box-shadow: 
    0 0 30px rgba(34, 197, 94, 0.7),
    0 0 60px rgba(15, 136, 96, 0.4),
    inset 0 0 20px rgba(52, 211, 153, 0.15);
}

@keyframes force-field-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
    box-shadow: 
      0 0 30px rgba(34, 197, 94, 0.7),
      0 0 60px rgba(15, 136, 96, 0.4),
      inset 0 0 20px rgba(52, 211, 153, 0.15);
  }
  50% {
    transform: scale(1.15);
    opacity: 0.9;
    box-shadow: 
      0 0 50px rgba(34, 197, 94, 0.9),
      0 0 100px rgba(15, 136, 96, 0.6),
      inset 0 0 30px rgba(52, 211, 153, 0.25);
  }
}

:deep(.safe-zone-marker) {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #34d399 0%, #22c55e 50%, #15803d 100%);
  border-radius: 8px;
  border: 2px solid #22c55e;
  z-index: 10;
  animation: safe-zone-marker-glow 2s ease-in-out infinite;
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.8);
}

@keyframes safe-zone-marker-glow {
  0%, 100% { 
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.8);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 30px rgba(34, 197, 94, 1);
    transform: scale(1.05);
  }
}

:deep(.safe-zone-marker .marker-icon) {
  font-size: 40px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

:deep(.safe-zone-marker-wrapper:hover) {
  z-index: 1000;
}

/* Arcade Marker Styling - Gaming with Glitch Effect */
:deep(.arcade-marker-icon) {
  background: none !important;
  border: none !important;
  box-shadow: none !important;
}

:deep(.arcade-marker-wrapper) {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
}

:deep(.arcade-glow) {
  position: absolute;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, rgba(139, 92, 246, 0.2) 70%, transparent 100%);
  animation: arcade-glitch-pulse 0.3s ease-in-out infinite;
  box-shadow: 
    0 0 30px rgba(236, 72, 153, 0.8),
    0 0 60px rgba(139, 92, 246, 0.6),
    inset 0 0 20px rgba(0, 255, 255, 0.1);
}

@keyframes arcade-glitch-pulse {
  0%, 100% {
    transform: scale(1) translateX(0) translateY(0);
    opacity: 0.8;
    box-shadow: 
      0 0 30px rgba(236, 72, 153, 0.8),
      0 0 60px rgba(139, 92, 246, 0.6),
      inset 0 0 20px rgba(0, 255, 255, 0.1);
  }
  33% {
    transform: scale(1.1) translateX(-2px) translateY(2px);
    opacity: 1;
  }
  66% {
    transform: scale(1.05) translateX(2px) translateY(-2px);
    opacity: 0.9;
  }
}

:deep(.arcade-marker) {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #ff006e 0%, #8b5cf6 50%, #d946ef 100%);
  border-radius: 8px;
  border: 2px solid #00ffff;
  z-index: 10;
  animation: arcade-marker-bounce 0.5s ease-in-out infinite;
  box-shadow: 0 0 25px rgba(236, 72, 153, 0.9);
}

@keyframes arcade-marker-bounce {
  0%, 100% { 
    transform: scale(1) translateY(0);
    box-shadow: 0 0 25px rgba(236, 72, 153, 0.9);
  }
  50% { 
    transform: scale(1.08) translateY(-3px);
    box-shadow: 0 0 35px rgba(236, 72, 153, 1), 0 0 50px rgba(139, 92, 246, 0.7);
  }
}

:deep(.arcade-marker .marker-icon) {
  font-size: 40px;
  text-shadow: 0 0 10px #ffff00;
  animation: arcade-icon-flash 0.4s ease-in-out infinite;
}

@keyframes arcade-icon-flash {
  0%, 100% { 
    text-shadow: 0 0 10px #ffff00;
  }
  50% { 
    text-shadow: 0 0 20px #ffff00, 0 0 30px #ff00ff;
  }
}

:deep(.arcade-marker-wrapper:hover) {
  z-index: 1000;
}

/* Custom Marker Styling */
:deep(.custom-div-icon) {
  background: none !important;
  border: none !important;
  box-shadow: none !important;
}

:deep(.custom-marker) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  transition: transform 0.2s ease;
}

:deep(.custom-marker:hover) {
  transform: scale(1.2);
}

:deep(.custom-marker.user-marker .marker-icon) {
  font-size: 32px;
  animation: pulse-animation 2s infinite;
}

:deep(.marker-icon) {
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

@keyframes pulse-animation {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

/* Hazard Popup Wrapper - Remove Leaflet defaults */
:deep(.hazard-popup-wrapper .leaflet-popup-content-wrapper) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}

:deep(.hazard-popup-wrapper .leaflet-popup-content) {
  margin: 0 !important;
  width: 100% !important;
  padding: 0 !important;
}

:deep(.hazard-popup-wrapper .leaflet-popup-tip-container) {
  display: none !important;
}

:deep(.hazard-popup-wrapper .leaflet-popup-tip) {
  display: none !important;
}

/* Hazard Popup Content Styling */
.hazard-popup-content {
  position: relative;
  background: linear-gradient(135deg, #cc0000 0%, #ff0000 50%, #cc0000 100%);
  border-radius: 20px;
  padding: 16px 20px;
  overflow: hidden;
  box-shadow: 
    0 0 30px rgba(255, 0, 0, 0.8),
    0 0 60px rgba(255, 100, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 200, 0, 0.6);
  animation: hazard-pulse 2s ease-in-out infinite;
  max-width: 300px;
}

@keyframes hazard-pulse {
  0%, 100% {
    box-shadow: 
      0 0 30px rgba(255, 0, 0, 0.8),
      0 0 60px rgba(255, 100, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  50% {
    box-shadow: 
      0 0 50px rgba(255, 0, 0, 1),
      0 0 100px rgba(255, 100, 0, 0.7),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
}

/* Hazard Status Badge */
.hazard-status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: bold;
  font-size: 0.85rem;
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 12px;
  border-radius: 8px;
  border-left: 3px solid #ffff00;
}

.badge-icon {
  font-size: 1.1rem;
  animation: badge-bounce 1s ease-in-out infinite;
}

@keyframes badge-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.badge-text {
  color: #ffff00;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* Hazard Title */
.hazard-title {
  font-size: 1.3rem;
  font-weight: 900;
  color: #ffffff;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  text-shadow: 0 3px 8px rgba(0, 0, 0, 0.6);
  letter-spacing: 0.5px;
  line-height: 1.2;
}

/* Hazard Description */
.hazard-description {
  font-size: 0.9rem;
  color: #ffffff;
  margin: 0 0 16px 0;
  line-height: 1.4;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  font-weight: 500;
}

/* Attack Button - The Hero Element */
.hazard-attack-btn {
  width: 100%;
  padding: 14px 16px;
  background: linear-gradient(135deg, #ff3333 0%, #cc0000 50%, #990000 100%);
  color: #ffffff;
  border: 3px dashed #ffcc00;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 900;
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  
  /* Intense Glow Effect */
  box-shadow: 
    0 0 20px rgba(255, 204, 0, 0.8),
    0 0 40px rgba(255, 100, 0, 0.6),
    inset 0 2px 0 rgba(255, 255, 255, 0.2),
    inset 0 -2px 0 rgba(0, 0, 0, 0.3);
  
  animation: button-glow 2s ease-in-out infinite;
}

@keyframes button-glow {
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(255, 204, 0, 0.8),
      0 0 40px rgba(255, 100, 0, 0.6),
      inset 0 2px 0 rgba(255, 255, 255, 0.2),
      inset 0 -2px 0 rgba(0, 0, 0, 0.3);
    border-color: #ffcc00;
  }
  50% {
    box-shadow: 
      0 0 30px rgba(255, 204, 0, 1),
      0 0 60px rgba(255, 150, 0, 0.8),
      inset 0 2px 0 rgba(255, 255, 255, 0.3),
      inset 0 -2px 0 rgba(0, 0, 0, 0.4);
    border-color: #ffff00;
  }
}

.hazard-attack-btn:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 0 40px rgba(255, 204, 0, 1),
    0 0 80px rgba(255, 100, 0, 0.8),
    0 4px 12px rgba(0, 0, 0, 0.4),
    inset 0 2px 0 rgba(255, 255, 255, 0.3),
    inset 0 -2px 0 rgba(0, 0, 0, 0.4);
  background: linear-gradient(135deg, #ff5555 0%, #ff3333 50%, #cc0000 100%);
}

.hazard-attack-btn:active {
  transform: translateY(0);
  box-shadow: 
    0 0 20px rgba(255, 204, 0, 0.8),
    0 0 40px rgba(255, 100, 0, 0.6),
    inset 0 4px 8px rgba(0, 0, 0, 0.4);
}

.btn-icon {
  font-size: 1.2rem;
  animation: icon-shake 0.3s ease-in-out infinite;
}

@keyframes icon-shake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-3deg); }
  75% { transform: rotate(3deg); }
}

.btn-text {
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 2px;
}

.btn-xp {
  font-size: 0.85rem;
  font-weight: 700;
  opacity: 0.95;
  margin-left: 2px;
}

/* Safe Zone Popup Wrapper - Remove Leaflet defaults */
:deep(.safe-zone-popup-wrapper .leaflet-popup-content-wrapper) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}

:deep(.safe-zone-popup-wrapper .leaflet-popup-content) {
  margin: 0 !important;
  width: 100% !important;
  padding: 0 !important;
}

:deep(.safe-zone-popup-wrapper .leaflet-popup-tip-container) {
  display: none !important;
}

:deep(.safe-zone-popup-wrapper .leaflet-popup-tip) {
  display: none !important;
}

/* Safe Zone Popup Content Styling */
.safe-zone-popup-content {
  position: relative;
  background: linear-gradient(135deg, #0d5c3c 0%, #0f8860 50%, #0d5c3c 100%);
  border-radius: 20px;
  padding: 16px 20px;
  overflow: hidden;
  box-shadow: 
    0 0 30px rgba(15, 136, 96, 0.8),
    0 0 60px rgba(34, 197, 94, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(52, 211, 153, 0.7);
  animation: safe-zone-pulse 3s ease-in-out infinite;
  max-width: 300px;
}

@keyframes safe-zone-pulse {
  0%, 100% {
    box-shadow: 
      0 0 30px rgba(15, 136, 96, 0.8),
      0 0 60px rgba(34, 197, 94, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }
  50% {
    box-shadow: 
      0 0 50px rgba(15, 136, 96, 1),
      0 0 100px rgba(34, 197, 94, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
}

/* Safe Zone Status Badge */
.safe-zone-status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: bold;
  font-size: 0.85rem;
  background: rgba(0, 0, 0, 0.25);
  padding: 8px 12px;
  border-radius: 8px;
  border-left: 3px solid #fbbf24;
}

.safe-zone-status-badge .badge-icon {
  font-size: 1rem;
  animation: badge-glow 1.5s ease-in-out infinite;
}

@keyframes badge-glow {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); opacity: 1; }
}

.safe-zone-status-badge .badge-text {
  color: #fbbf24;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
}

/* Safe Zone Title */
.safe-zone-title {
  font-size: 1.3rem;
  font-weight: 900;
  color: #ffffff;
  margin: 0 0 4px 0;
  text-transform: uppercase;
  text-shadow: 0 3px 8px rgba(0, 0, 0, 0.6);
  letter-spacing: 0.5px;
  line-height: 1.2;
}

/* Safe Zone Description */
.safe-zone-description {
  font-size: 0.85rem;
  color: #e0f2fe;
  margin: 0 0 16px 0;
  line-height: 1.4;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  font-weight: 500;
  font-style: italic;
}

/* Safe Zone Reinforce Button */
.safe-zone-action-btn {
  width: 100%;
  padding: 14px 16px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%);
  color: #ffffff;
  border: 2px solid #86efac;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 900;
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  
  /* 3D Shadow Effect */
  box-shadow: 
    0 6px 12px rgba(22, 163, 74, 0.4),
    0 4px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  
  animation: button-hover-glow 2s ease-in-out infinite;
}

@keyframes button-hover-glow {
  0%, 100% {
    box-shadow: 
      0 6px 12px rgba(22, 163, 74, 0.4),
      0 4px 8px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    border-color: #86efac;
  }
  50% {
    box-shadow: 
      0 8px 16px rgba(34, 197, 94, 0.6),
      0 6px 12px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    border-color: #bbf7d0;
  }
}

.safe-zone-action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 10px 20px rgba(22, 163, 74, 0.6),
    0 6px 12px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  background: linear-gradient(135deg, #34d399 0%, #22c55e 50%, #16a34a 100%);
}

.safe-zone-action-btn:active {
  transform: translateY(0);
  box-shadow: 
    0 4px 8px rgba(22, 163, 74, 0.4),
    0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 3px 6px rgba(0, 0, 0, 0.2);
}

.safe-zone-action-btn .btn-icon {
  font-size: 1.2rem;
  animation: shield-rotate 2s ease-in-out infinite;
}

@keyframes shield-rotate {
  0%, 100% { transform: rotate(0deg); }
  15% { transform: rotate(-3deg); }
  30% { transform: rotate(3deg); }
  45% { transform: rotate(0deg); }
}

.safe-zone-action-btn .btn-text {
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 2px;
}

.safe-zone-action-btn .btn-xp {
  font-size: 0.85rem;
  font-weight: 700;
  opacity: 0.95;
  margin-left: 2px;
}

:deep(.gaming-popup .leaflet-popup-tip) {
  background: #1a1a2e !important;
  border-left: 3px solid transparent !important;
  border-right: 3px solid transparent !important;
}

:deep(.gaming-popup .leaflet-popup-content) {
  margin: 0 !important;
  width: 100% !important;
}

.popup-content {
  padding: 12px 16px;
  color: white;
  font-family: 'Arial Black', sans-serif;
}

.popup-status {
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 6px 8px;
  border-radius: 4px;
  margin-bottom: 8px;
  text-align: center;
}

.status-clean {
  background: rgba(34, 197, 94, 0.3);
  color: #4ade80;
  border: 1px solid #22c55e;
}

.status-polluted {
  background: rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  border: 1px solid #ef4444;
}

.popup-title {
  font-size: 0.9rem;
  font-weight: bold;
  color: #00d4ff;
  margin-bottom: 6px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.popup-description {
  font-size: 0.75rem;
  color: #e0e0e0;
  margin-bottom: 8px;
  line-height: 1.3;
}

.popup-action-btn {
  width: 100%;
  padding: 8px 12px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
  border: 2px solid #ff8787;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.popup-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
  background: linear-gradient(135deg, #ff8787 0%, #ff6b6b 100%);
}

.popup-action-btn:active {
  transform: translateY(0);
}

/* Arcade Popup Wrapper - Remove Leaflet defaults */
:deep(.arcade-popup-wrapper .leaflet-popup-content-wrapper) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}

:deep(.arcade-popup-wrapper .leaflet-popup-content) {
  margin: 0 !important;
  width: 100% !important;
  padding: 0 !important;
}

:deep(.arcade-popup-wrapper .leaflet-popup-tip-container) {
  display: none !important;
}

:deep(.arcade-popup-wrapper .leaflet-popup-tip) {
  display: none !important;
}

/* Arcade Popup Content Styling */
.arcade-popup-content {
  position: relative;
  background: linear-gradient(135deg, #1a0033 0%, #2d0052 50%, #0f001a 100%);
  border-radius: 20px;
  padding: 16px 20px;
  overflow: hidden;
  box-shadow: 
    0 0 40px rgba(236, 72, 153, 0.7),
    0 0 80px rgba(139, 92, 246, 0.5),
    0 0 120px rgba(236, 72, 153, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(236, 72, 153, 0.8);
  animation: arcade-neon-pulse 2.5s ease-in-out infinite;
  max-width: 300px;
}

@keyframes arcade-neon-pulse {
  0%, 100% {
    box-shadow: 
      0 0 40px rgba(236, 72, 153, 0.7),
      0 0 80px rgba(139, 92, 246, 0.5),
      0 0 120px rgba(236, 72, 153, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border-color: rgba(236, 72, 153, 0.8);
  }
  50% {
    box-shadow: 
      0 0 60px rgba(236, 72, 153, 0.9),
      0 0 100px rgba(139, 92, 246, 0.7),
      0 0 150px rgba(236, 72, 153, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    border-color: rgba(236, 72, 153, 1);
  }
}

/* Arcade Status Badge */
.arcade-status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: bold;
  font-size: 0.85rem;
  background: rgba(236, 72, 153, 0.15);
  padding: 8px 12px;
  border-radius: 8px;
  border-left: 3px solid #00ffff;
  border-right: 3px solid #ff00ff;
}

.arcade-status-badge .badge-icon {
  font-size: 1.1rem;
  animation: arcade-bounce 0.6s ease-in-out infinite;
}

@keyframes arcade-bounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-4px) scale(1.1); }
}

.arcade-status-badge .badge-text {
  color: #ff00ff;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px #ff00ff, 0 2px 4px rgba(0, 0, 0, 0.8);
  font-family: 'Courier New', monospace;
  font-weight: bold;
}

/* Arcade Title */
.arcade-title {
  font-size: 1.4rem;
  font-weight: 900;
  color: #00ffff;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  text-shadow: 
    0 0 10px #00ffff,
    0 0 20px #00ffff,
    0 3px 10px rgba(0, 0, 0, 0.8);
  letter-spacing: 1px;
  line-height: 1.2;
  font-family: 'Courier New', monospace;
}

/* Arcade Description */
.arcade-description {
  font-size: 0.9rem;
  color: #ffffff;
  margin: 0 0 12px 0;
  line-height: 1.4;
  text-shadow: 0 2px 8px rgba(236, 72, 153, 0.6);
  font-weight: 500;
  text-align: center;
}

/* Coin Animation Container */
.coin-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 8px 12px;
  background: rgba(236, 72, 153, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(139, 92, 246, 0.4);
}

.rotating-coin {
  font-size: 1.5rem;
  display: inline-block;
  animation: coin-spin 1.5s linear infinite;
}

@keyframes coin-spin {
  0% { transform: rotateY(0deg) scale(1); }
  50% { transform: rotateY(90deg) scale(0.6); }
  100% { transform: rotateY(360deg) scale(1); }
}

.coin-text {
  font-size: 0.85rem;
  color: #00ffff;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 0 8px #00ffff;
  font-weight: bold;
  font-family: 'Courier New', monospace;
}

/* Play Button - Pill Shape */
.arcade-play-btn {
  width: 100%;
  padding: 14px 20px;
  background: linear-gradient(135deg, #ff006e 0%, #8b5cf6 50%, #d946ef 100%);
  color: #ffffff;
  border: 2px solid #00ffff;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 900;
  text-transform: uppercase;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: 1.5px;
  position: relative;
  overflow: hidden;
  
  /* Intense Neon Glow */
  box-shadow: 
    0 0 20px rgba(236, 72, 153, 0.8),
    0 0 40px rgba(139, 92, 246, 0.6),
    0 0 60px rgba(0, 255, 255, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  
  animation: button-arcade-glow 1.5s ease-in-out infinite;
}

@keyframes button-arcade-glow {
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(236, 72, 153, 0.8),
      0 0 40px rgba(139, 92, 246, 0.6),
      0 0 60px rgba(0, 255, 255, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    border-color: #00ffff;
  }
  50% {
    box-shadow: 
      0 0 30px rgba(236, 72, 153, 1),
      0 0 60px rgba(139, 92, 246, 0.8),
      0 0 100px rgba(0, 255, 255, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    border-color: #ff00ff;
  }
}

.arcade-play-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 
    0 0 40px rgba(236, 72, 153, 1),
    0 0 80px rgba(139, 92, 246, 0.8),
    0 0 120px rgba(0, 255, 255, 0.6),
    0 6px 20px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  background: linear-gradient(135deg, #ff3385 0%, #a78bfa 50%, #e879f9 100%);
}

.arcade-play-btn:active {
  transform: translateY(0) scale(1);
  box-shadow: 
    0 0 20px rgba(236, 72, 153, 0.8),
    0 0 40px rgba(139, 92, 246, 0.6),
    inset 0 3px 8px rgba(0, 0, 0, 0.3);
}

.arcade-play-btn .btn-icon {
  font-size: 1.3rem;
  animation: lightning-flash 0.4s ease-in-out infinite;
}

@keyframes lightning-flash {
  0%, 100% { 
    text-shadow: 0 0 5px #ffff00;
    transform: scale(1);
  }
  50% { 
    text-shadow: 0 0 15px #ffff00, 0 0 25px #ff00ff;
    transform: scale(1.1);
  }
}

.arcade-play-btn .btn-text {
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 2px;
  font-family: 'Courier New', monospace;
}

.arcade-play-btn .btn-bonus {
  font-size: 0.8rem;
  font-weight: 700;
  opacity: 0.9;
  margin-left: 2px;
  color: #ffff00;
}

/* Leaflet Container Fixes */
:deep(.leaflet-container) {
  font-family: 'Arial', sans-serif;
}

:deep(.leaflet-pane) {
  z-index: 10 !important;
}

:deep(.leaflet-control-zoom) {
  display: none !important;
}

/* Remove default Leaflet styling for mobile-first approach */
:deep(.leaflet-bottom.leaflet-right) {
  display: none !important;
}
</style>
