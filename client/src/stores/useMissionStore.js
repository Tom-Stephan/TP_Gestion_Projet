import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useMissionStore = defineStore("mission", () => {
  // State
  const isActive = ref(false);
  const startTime = ref(null);
  const photos = ref([]);
  const targetZoneId = ref(null);
  const duration = 3 * 60 * 60 * 1000; // 3 hours in ms

  // Actions
  function startMission(zoneId) {
    isActive.value = true;
    targetZoneId.value = zoneId;
    startTime.value = Date.now();
    photos.value = [];
  }

  function stopMission() {
    isActive.value = false;
    targetZoneId.value = null;
    startTime.value = null;
    photos.value = [];
  }

  function addPhoto(file) {
    // Mocking a photo URL for demo purposes
    const mockUrl = URL.createObjectURL(file);
    photos.value.push(mockUrl);
  }

  // Getters
  const timeRemaining = computed(() => {
    if (!isActive.value || !startTime.value) return 0;
    const now = Date.now();
    const end = startTime.value + duration;
    return Math.max(0, end - now);
  });

  return {
    isActive,
    startTime,
    photos,
    targetZoneId,
    startMission,
    stopMission,
    addPhoto,
    timeRemaining,
  };
});
