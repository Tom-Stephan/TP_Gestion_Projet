<script setup>
defineProps({
  spot: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['reinforce']);

const handleReinforce = () => {
  emit('reinforce', spot.id);
};
</script>

<template>
  <div class="safe-zone-popup-container">
    <div class="safe-zone-alert">
      <!-- Status Badge -->
      <div class="safe-zone-status-badge">
        <span class="badge-icon">✓</span>
        <span class="badge-text">ZONE ALLIÉE</span>
      </div>

      <!-- Location Name -->
      <h3 class="safe-zone-title">{{ spot.name }}</h3>

      <!-- Description -->
      <p class="safe-zone-description">{{ spot.description }}</p>

      <!-- Reinforce Button - Protective CTA -->
      <button @click="handleReinforce" class="safe-zone-action-btn">
        <span class="btn-icon">🛡️</span>
        <span class="btn-text">RENFORCER</span>
        <span class="btn-xp">(+200 XP)</span>
      </button>

      <!-- Force Field Pulse Effect -->
      <div class="force-field-pulse"></div>
    </div>
  </div>
</template>

<style scoped>
.safe-zone-popup-container {
  width: 100%;
  max-width: none;
}

.safe-zone-alert {
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

/* Status Badge */
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

.badge-icon {
  font-size: 1rem;
  animation: badge-glow 1.5s ease-in-out infinite;
}

@keyframes badge-glow {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); opacity: 1; }
}

.badge-text {
  color: #fbbf24;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
}

/* Title */
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

/* Description */
.safe-zone-description {
  font-size: 0.85rem;
  color: #e0f2fe;
  margin: 0 0 16px 0;
  line-height: 1.4;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  font-weight: 500;
  font-style: italic;
}

/* Reinforce Button */
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

.btn-icon {
  font-size: 1.2rem;
  animation: shield-rotate 2s ease-in-out infinite;
}

@keyframes shield-rotate {
  0%, 100% { transform: rotate(0deg); }
  15% { transform: rotate(-3deg); }
  30% { transform: rotate(3deg); }
  45% { transform: rotate(0deg); }
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

/* Force Field Pulse Background Effect */
.force-field-pulse {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  background: radial-gradient(circle at center, rgba(34, 197, 94, 0.2) 0%, transparent 70%);
  pointer-events: none;
  animation: force-field-wave 4s ease-out infinite;
}

@keyframes force-field-wave {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 0;
    transform: scale(1.05);
  }
}

/* Responsive Design */
@media (max-width: 640px) {
  .safe-zone-alert {
    padding: 12px 16px;
  }

  .safe-zone-title {
    font-size: 1.1rem;
  }

  .safe-zone-description {
    font-size: 0.8rem;
  }

  .safe-zone-action-btn {
    padding: 12px 14px;
    font-size: 0.95rem;
    border-width: 2px;
  }

  .btn-text {
    letter-spacing: 1px;
  }

  .btn-xp {
    font-size: 0.8rem;
  }
}
</style>
