<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth.store'
  import { useToast } from '@/composables/useToast'

  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  const toast = useToast()

  // Check if user is authenticated (for public/free mode vs logged-in mode)
  const isPublicMode = computed(() => !authStore.isAuthenticated)

  // Brand color database - will be replaced with API/database call later
  const brandColorDatabase: Record<string, { name: string; colors: string[]; icon?: string }> = {
    spotify: {
      name: 'Spotify',
      colors: ['#1DB954', '#191414', '#FFFFFF', '#535353', '#1A1A1A'],
      icon: 'logos:spotify-icon'
    },
    netflix: {
      name: 'Netflix',
      colors: ['#E50914', '#221F1F', '#F5F5F1', '#000000', '#B81D24'],
      icon: 'logos:netflix-icon'
    },
    playstation: {
      name: 'PlayStation',
      colors: ['#003087', '#00439C', '#0070D1', '#FFFFFF', '#000000'],
      icon: 'simple-icons:playstation'
    },
    discord: {
      name: 'Discord',
      colors: ['#5865F2', '#57F287', '#FEE75C', '#EB459E', '#ED4245'],
      icon: 'logos:discord-icon'
    },
    youtube: {
      name: 'YouTube',
      colors: ['#FF0000', '#282828', '#FFFFFF', '#AAAAAA', '#000000'],
      icon: 'logos:youtube-icon'
    },
    twitch: {
      name: 'Twitch',
      colors: ['#9146FF', '#772CE8', '#FFFFFF', '#1F1F23', '#000000'],
      icon: 'logos:twitch'
    },
    slack: {
      name: 'Slack',
      colors: ['#4A154B', '#36C5F0', '#2EB67D', '#ECB22E', '#E01E5A'],
      icon: 'logos:slack-icon'
    },
    dribbble: {
      name: 'Dribbble',
      colors: ['#EA4C89', '#C32361', '#FFFFFF', '#444444', '#2C2C2C'],
      icon: 'logos:dribbble-icon'
    },
    github: {
      name: 'GitHub',
      colors: ['#181717', '#24292E', '#FFFFFF', '#6A737D', '#0366D6'],
      icon: 'logos:github-icon'
    },
    twitter: {
      name: 'Twitter',
      colors: ['#1DA1F2', '#14171A', '#657786', '#AAB8C2', '#FFFFFF'],
      icon: 'logos:twitter'
    },
    facebook: {
      name: 'Facebook',
      colors: ['#1877F2', '#FFFFFF', '#F0F2F5', '#65676B', '#050505'],
      icon: 'logos:facebook'
    },
    instagram: {
      name: 'Instagram',
      colors: ['#E4405F', '#FCAF45', '#833AB4', '#F77737', '#C13584'],
      icon: 'logos:instagram-icon'
    },
    linkedin: {
      name: 'LinkedIn',
      colors: ['#0A66C2', '#FFFFFF', '#000000', '#86888A', '#EEF3F8'],
      icon: 'logos:linkedin-icon'
    },
    tiktok: {
      name: 'TikTok',
      colors: ['#000000', '#FF0050', '#00F2EA', '#FFFFFF', '#161823'],
      icon: 'logos:tiktok-icon'
    },
    amazon: {
      name: 'Amazon',
      colors: ['#FF9900', '#232F3E', '#FFFFFF', '#37475A', '#146EB4'],
      icon: 'logos:amazon'
    },
    google: {
      name: 'Google',
      colors: ['#4285F4', '#DB4437', '#F4B400', '#0F9D58', '#FFFFFF'],
      icon: 'logos:google-icon'
    },
    apple: {
      name: 'Apple',
      colors: ['#000000', '#FFFFFF', '#A2AAAD', '#555555', '#86868B'],
      icon: 'logos:apple'
    },
    microsoft: {
      name: 'Microsoft',
      colors: ['#F25022', '#7FBA00', '#00A4EF', '#FFB900', '#737373'],
      icon: 'logos:microsoft-icon'
    }
  }

  // Get brand name from query params
  const brandParam = computed(() => (route.query.brand as string)?.toLowerCase() || '')

  // Get brand data if brand param exists
  const selectedBrand = computed(() => {
    if (brandParam.value && brandColorDatabase[brandParam.value]) {
      return brandColorDatabase[brandParam.value]
    }
    return null
  })

  // Get colors from query params or brand lookup
  const colors = computed(() => {
    // First check if brand param exists and is valid
    if (selectedBrand.value) {
      return selectedBrand.value.colors
    }

    // Otherwise, try to get colors from colors param
    const colorsParam = route.query.colors as string
    if (colorsParam) {
      return colorsParam.split(',').filter(c => c.match(/^#[0-9A-Fa-f]{6}$/))
    }
    return []
  })

  // Track the source of colors for display purposes
  const colorSource = computed(() => {
    if (selectedBrand.value) {
      return {
        type: 'brand' as const,
        name: selectedBrand.value.name,
        icon: selectedBrand.value.icon
      }
    }
    return { type: 'custom' as const, name: 'Custom Palette', icon: undefined }
  })

  // Check if brand was requested but not found
  const brandNotFound = computed(() => {
    return brandParam.value && !selectedBrand.value
  })

  // Get list of available brands for suggestions
  const availableBrands = computed(() => {
    return Object.entries(brandColorDatabase).map(([key, value]) => ({
      key,
      name: value.name,
      icon: value.icon,
      primaryColor: value.colors[0]
    }))
  })

  // API base URL from environment
  const backendPort = import.meta.env.VITE_BACKEND_PORT || '8000'
  const apiBaseUrl = `http://localhost:${backendPort}`

  // Analysis state
  const isAnalyzing = ref(true)
  const analysisComplete = ref(false)
  const analysisProgress = ref(0)

  // Color analysis results (mock data for now)
  const colorAnalysis = ref<
    Array<{
      hex: string
      name: string
      harmony: string
      mood: string
      accessibility: { score: number; rating: string }
      contrast: { white: number; black: number }
    }>
  >([])

  // Calculate contrast ratio
  const getContrastRatio = (hex1: string, hex2: string): number => {
    const getLuminance = (hex: string) => {
      const rgb = hex
        .replace('#', '')
        .match(/.{2}/g)!
        .map(x => {
          const c = parseInt(x, 16) / 255
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
        })
      return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
    }
    const l1 = getLuminance(hex1)
    const l2 = getLuminance(hex2)
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100
  }

  // Get color name (simplified)
  const getColorName = (hex: string): string => {
    const colorNames: Record<string, string> = {
      '#FF0000': 'Red',
      '#00FF00': 'Green',
      '#0000FF': 'Blue',
      '#FFFF00': 'Yellow',
      '#FF00FF': 'Magenta',
      '#00FFFF': 'Cyan',
      '#FFFFFF': 'White',
      '#000000': 'Black',
      '#808080': 'Gray',
      '#FFA500': 'Orange',
      '#800080': 'Purple',
      '#FFC0CB': 'Pink'
    }

    // Simple hue-based naming
    const h = hex.replace('#', '')
    const r = parseInt(h.substring(0, 2), 16)
    const g = parseInt(h.substring(2, 4), 16)
    const b = parseInt(h.substring(4, 6), 16)

    if (r > 200 && g < 100 && b < 100) return 'Red'
    if (r < 100 && g > 200 && b < 100) return 'Green'
    if (r < 100 && g < 100 && b > 200) return 'Blue'
    if (r > 200 && g > 200 && b < 100) return 'Yellow'
    if (r > 200 && g < 100 && b > 200) return 'Magenta'
    if (r < 100 && g > 200 && b > 200) return 'Cyan'
    if (r > 200 && g > 100 && b < 100) return 'Orange'
    if (r > 100 && g < 100 && b > 100) return 'Purple'
    if (r > 200 && g > 150 && b > 150) return 'Pink'
    if (r > 200 && g > 200 && b > 200) return 'Light Gray'
    if (r < 50 && g < 50 && b < 50) return 'Near Black'
    if (Math.abs(r - g) < 20 && Math.abs(g - b) < 20) return 'Gray'

    return colorNames[hex.toUpperCase()] || 'Custom Color'
  }

  // Get mood based on color
  const getColorMood = (hex: string): string => {
    const h = hex.replace('#', '')
    const r = parseInt(h.substring(0, 2), 16)
    const g = parseInt(h.substring(2, 4), 16)
    const b = parseInt(h.substring(4, 6), 16)
    const brightness = (r + g + b) / 3

    if (r > 180 && g < 100) return 'Energetic & Bold'
    if (g > 180 && r < 150) return 'Fresh & Natural'
    if (b > 180 && r < 150) return 'Calm & Professional'
    if (r > 200 && g > 150 && b < 100) return 'Warm & Optimistic'
    if (r > 150 && b > 150 && g < 100) return 'Creative & Luxurious'
    if (brightness > 200) return 'Clean & Minimal'
    if (brightness < 60) return 'Sophisticated & Dramatic'
    return 'Balanced & Versatile'
  }

  // Call the color comparison API
  const fetchColorComparison = async (colorsToCompare: string[]) => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer Test Bearer'
      }

      const response = await fetch(`${apiBaseUrl}/api/v1/colors/compare`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ colors: colorsToCompare })
      })

      const data = await response.json()
      console.log('=== Color Comparison API Response ===')
      console.log('Status:', response.status)
      console.log('Colors sent:', colorsToCompare)
      console.log('Response:', data)
      console.log('=====================================')

      return data
    } catch (error) {
      console.error('=== Color Comparison API Error ===')
      console.error('Colors sent:', colorsToCompare)
      console.error('Error:', error)
      console.error('==================================')
      return null
    }
  }

  // Analyze colors
  const analyzeColors = async () => {
    isAnalyzing.value = true
    analysisProgress.value = 0

    // Call the API and log the result
    fetchColorComparison(colors.value)

    const interval = setInterval(() => {
      analysisProgress.value += Math.random() * 15
      if (analysisProgress.value >= 100) {
        analysisProgress.value = 100
        clearInterval(interval)

        // Generate analysis results
        colorAnalysis.value = colors.value.map(hex => {
          const contrastWhite = getContrastRatio(hex, '#FFFFFF')
          const contrastBlack = getContrastRatio(hex, '#000000')
          const accessibilityScore =
            Math.max(contrastWhite, contrastBlack) >= 4.5
              ? 100
              : Math.max(contrastWhite, contrastBlack) >= 3
                ? 70
                : 40

          return {
            hex,
            name: getColorName(hex),
            harmony: 'Complementary',
            mood: getColorMood(hex),
            accessibility: {
              score: accessibilityScore,
              rating:
                accessibilityScore >= 100 ? 'AAA' : accessibilityScore >= 70 ? 'AA' : 'Needs Work'
            },
            contrast: {
              white: contrastWhite,
              black: contrastBlack
            }
          }
        })

        isAnalyzing.value = false
        analysisComplete.value = true
      }
    }, 100)
  }

  // Copy color to clipboard
  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color)
    toast.success(`Copied ${color}`, undefined, 2000)
  }

  // Go back to studio
  const goBackToStudio = () => {
    if (isPublicMode.value) {
      router.push('/color-studio')
    } else {
      router.push('/dashboard')
    }
  }

  // Function to handle route changes and initial load
  const handleRouteChange = () => {
    // Reset state
    isAnalyzing.value = true
    analysisComplete.value = false
    analysisProgress.value = 0
    colorAnalysis.value = []

    // If brand not found, don't redirect - show the not found state instead
    if (brandNotFound.value) {
      isAnalyzing.value = false
      return
    }

    if (colors.value.length === 0) {
      toast.error('No colors to analyze', undefined, 2000)
      goBackToStudio()
      return
    }
    analyzeColors()
  }

  // Watch for route query changes (brand or colors param)
  watch(
    () => route.query,
    () => {
      handleRouteChange()
    }
  )

  onMounted(() => {
    handleRouteChange()
  })
</script>

<template>
  <div class="text-brand-black selection:bg-brand-bright selection:text-brand-black relative">
    <!-- Dashboard Main -->
    <main class="relative z-10 w-full">
      <!-- Header -->
      <div class="mb-8 flex items-end justify-between scroll-animate fade-up">
        <div class="relative">
          <button class="btn-hybrid-sm mb-4" @click="goBackToStudio">
            <iconify-icon icon="solar:arrow-left-linear" width="16"></iconify-icon>
            Back to Studio
          </button>
          <div class="inline-block">
            <h1
              class="text-3xl md:text-4xl font-display font-bold text-brand-black tracking-tight section-header-hybrid flex items-center gap-3"
            >
              <template v-if="brandNotFound">
                <iconify-icon
                  icon="solar:question-circle-bold"
                  width="36"
                  class="text-brand-red"
                ></iconify-icon>
                Brand Not Found
              </template>
              <template v-else-if="colorSource.icon">
                <iconify-icon :icon="colorSource.icon" width="36"></iconify-icon>
                {{ colorSource.name }}
              </template>
              <template v-else> Color Report </template>
            </h1>
          </div>
          <p class="mt-4 text-brand-black/60 font-script text-xl flex items-center gap-2">
            <template v-if="brandNotFound">
              "{{ brandParam }}" is not available in our database
            </template>
            <template v-else-if="colorSource.type === 'brand'">
              Brand color analysis ({{ colors.length }} colors)
              <span class="w-2 h-2 rounded-full bg-brand-teal animate-pulse"></span>
            </template>
            <template v-else>
              Analysis of {{ colors.length }} color{{ colors.length !== 1 ? 's' : '' }}
              <span class="w-2 h-2 rounded-full bg-brand-teal animate-pulse"></span>
            </template>
          </p>
        </div>
        <div v-if="!brandNotFound" class="hidden md:flex gap-3">
          <button class="btn-hybrid btn-hybrid-primary" @click="goBackToStudio">
            <iconify-icon icon="solar:palette-linear" width="18"></iconify-icon>
            New Analysis
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isAnalyzing" class="flex flex-col items-center justify-center py-20">
        <div class="relative w-24 h-24 mb-6">
          <div class="absolute inset-0 rounded-full border-4 border-brand-black/10"></div>
          <div
            class="absolute inset-0 rounded-full border-4 border-brand-teal border-t-transparent animate-spin"
          ></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <iconify-icon
              icon="solar:magic-stick-3-bold"
              width="32"
              class="text-brand-teal"
            ></iconify-icon>
          </div>
        </div>
        <h2 class="text-xl font-display font-bold mb-2">Analyzing Colors</h2>
        <p class="text-brand-black/60 mb-4">Please wait while we analyze your palette...</p>
        <div class="w-64 h-2 bg-brand-black/10 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-brand-teal to-brand-bright rounded-full transition-all duration-300"
            :style="{ width: `${analysisProgress}%` }"
          ></div>
        </div>
        <p class="text-sm text-brand-black/40 mt-2">{{ Math.round(analysisProgress) }}%</p>
      </div>

      <!-- Brand Not Found State -->
      <div v-else-if="brandNotFound" class="space-y-8">
        <!-- Error Message Card -->
        <section
          class="card-hybrid card-hybrid-red paper-bg p-8 md:p-10 scroll-animate fade-up rotate-slight-left"
        >
          <div class="flex flex-col items-center text-center max-w-xl mx-auto">
            <div
              class="w-20 h-20 rounded border-3 border-brand-black bg-brand-red/10 flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_#C92216]"
            >
              <iconify-icon
                icon="solar:sad-circle-bold"
                width="48"
                class="text-brand-red"
              ></iconify-icon>
            </div>
            <h2
              class="text-2xl md:text-3xl font-display font-bold text-brand-black mb-3 section-header-hybrid inline-block"
            >
              Brand "{{ brandParam }}" Not Found
            </h2>
            <p class="text-brand-black/60 font-script text-lg mb-6">
              We couldn't find this brand in our database. The brand may not be available yet, or
              there might be a typo in the URL.
            </p>
            <div class="flex flex-wrap items-center justify-center gap-3">
              <button class="btn-hybrid btn-hybrid-primary" @click="goBackToStudio">
                <iconify-icon icon="solar:palette-linear" width="18"></iconify-icon>
                Create Custom Palette
              </button>
              <RouterLink to="/color-studio" class="btn-hybrid"> Go to Color Studio </RouterLink>
            </div>
          </div>
        </section>

        <!-- Available Brands -->
        <section
          class="card-hybrid paper-bg p-6 md:p-8 scroll-animate fade-up rotate-slight-right tape-decoration tape-mint"
        >
          <div class="flex items-start gap-4 mb-6">
            <div
              class="w-12 h-12 rounded border-3 border-brand-black bg-brand-teal flex items-center justify-center shrink-0 shadow-[3px_3px_0px_0px_#1A1A1A]"
            >
              <iconify-icon
                icon="solar:buildings-bold"
                width="24"
                class="text-white"
              ></iconify-icon>
            </div>
            <div class="flex-1">
              <p class="text-brand-black/50 font-script text-lg mb-1">Available Brands</p>
              <h2
                class="text-xl md:text-2xl font-display font-bold text-brand-black section-header-hybrid"
              >
                Try One of These Instead
              </h2>
            </div>
          </div>

          <!-- Brands Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <RouterLink
              v-for="brand in availableBrands"
              :key="brand.key"
              :to="`/color-report?brand=${brand.key}`"
              class="group stat-hybrid flex flex-col items-center gap-3 hover:shadow-[4px_4px_0px_0px_#2F7A72] hover:-translate-y-1"
            >
              <div
                class="w-12 h-12 rounded border-2 border-brand-black/20 flex items-center justify-center group-hover:scale-110 transition-transform"
                :style="{ backgroundColor: brand.primaryColor + '20' }"
              >
                <iconify-icon v-if="brand.icon" :icon="brand.icon" width="28"></iconify-icon>
                <div
                  v-else
                  class="w-6 h-6 rounded-full"
                  :style="{ backgroundColor: brand.primaryColor }"
                ></div>
              </div>
              <span class="text-sm font-bold text-brand-black text-center">{{ brand.name }}</span>
              <div class="flex gap-1">
                <div
                  v-for="(_, idx) in 3"
                  :key="idx"
                  class="w-3 h-3 rounded-full border border-brand-black/10"
                  :style="{ backgroundColor: brand.primaryColor }"
                  :class="{ 'opacity-60': idx === 1, 'opacity-30': idx === 2 }"
                ></div>
              </div>
            </RouterLink>
          </div>

          <hr class="divider-dashed" />
          <div class="flex items-center gap-2 text-brand-black/50 font-script">
            <iconify-icon icon="solar:info-circle-linear" width="14"></iconify-icon>
            <span>Click on any brand to view its color analysis</span>
          </div>
        </section>
      </div>

      <!-- Analysis Results -->
      <div v-else class="space-y-8">
        <!-- Color Palette Overview -->
        <section
          class="color-overview-section relative card-hybrid paper-bg p-6 md:p-10 rotate-slight-left tape-decoration overflow-hidden"
        >
          <!-- Decorative corner accents -->
          <div
            class="absolute top-0 left-0 w-20 h-20 border-r-2 border-b-2 border-brand-teal/30 rounded-br-3xl"
          ></div>
          <div
            class="absolute bottom-0 right-0 w-20 h-20 border-l-2 border-t-2 border-brand-red/30 rounded-tl-3xl"
          ></div>

          <!-- Floating decorative dots -->
          <div
            class="absolute top-6 right-6 w-3 h-3 rounded-full bg-brand-teal animate-float-slow"
          ></div>
          <div
            class="absolute top-10 right-14 w-2 h-2 rounded-full bg-brand-bright animate-float-delayed"
          ></div>
          <div
            class="absolute bottom-8 left-8 w-2 h-2 rounded-full bg-brand-red animate-float-slow"
          ></div>

          <!-- Section Header -->
          <div class="relative flex items-start gap-4 mb-10 section-header-animate">
            <div
              class="w-14 h-14 rounded border-3 border-brand-black bg-brand-black flex items-center justify-center shrink-0 shadow-[3px_3px_0px_0px_#2F7A72] icon-pop"
            >
              <iconify-icon
                icon="solar:palette-bold"
                width="28"
                class="text-brand-bright"
              ></iconify-icon>
            </div>
            <div class="flex-1">
              <p class="text-brand-black/50 font-script text-lg mb-1 label-slide-in">
                {{ colorSource.type === 'brand' ? 'Brand Palette' : 'Your Palette' }}
              </p>
              <h2
                class="text-2xl md:text-3xl font-display font-bold text-brand-black title-slide-in section-header-hybrid"
              >
                {{ colorSource.type === 'brand' ? `${colorSource.name} Colors` : 'Color Overview' }}
              </h2>
            </div>
          </div>

          <!-- Color Swatches - Creative Layout -->
          <div class="relative">
            <!-- Connection line between swatches -->
            <div
              class="absolute top-1/2 left-0 right-0 h-0.5 bg-brand-black/10 -translate-y-1/2 hidden md:block connection-line"
            ></div>

            <div class="flex flex-wrap justify-center gap-6 md:gap-8 mb-8">
              <div
                v-for="(analysis, index) in colorAnalysis"
                :key="index"
                class="group relative swatch-container"
                :style="{ '--delay': `${index * 0.1}s` }"
              >
                <!-- Outer ring animation on hover -->
                <div
                  class="absolute -inset-3 rounded-3xl border-2 border-dashed border-transparent group-hover:border-brand-black/20 transition-all duration-500 group-hover:rotate-3"
                ></div>

                <!-- Main swatch card -->
                <div
                  class="relative w-28 h-36 md:w-32 md:h-40 rounded border-3 border-brand-black cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[5px_5px_0px_0px_#2F7A72] shadow-[4px_4px_0px_0px_#1A1A1A] overflow-hidden swatch-card"
                  @click="copyColor(analysis.hex)"
                >
                  <!-- Color fill area -->
                  <div
                    class="absolute inset-0 color-fill"
                    :style="{ backgroundColor: analysis.hex }"
                  >
                    <!-- Subtle pattern overlay -->
                    <div
                      class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,white_1px,transparent_1px)] bg-[length:8px_8px]"
                    ></div>
                  </div>

                  <!-- Copy icon overlay -->
                  <div
                    class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <div
                      class="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg copy-icon-bounce"
                    >
                      <iconify-icon
                        icon="solar:copy-bold"
                        width="20"
                        class="text-brand-black"
                      ></iconify-icon>
                    </div>
                  </div>

                  <!-- Bottom info panel -->
                  <div
                    class="absolute bottom-0 left-0 right-0 bg-white border-t-3 border-brand-black p-3"
                  >
                    <p
                      class="text-xs font-mono font-bold text-brand-black text-center tracking-wide"
                    >
                      {{ analysis.hex }}
                    </p>
                  </div>
                </div>

                <!-- Color name tag -->
                <div class="mt-4 text-center">
                  <span class="badge-hybrid name-tag">
                    {{ analysis.name }}
                  </span>
                </div>

                <!-- Index number -->
                <div
                  class="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-brand-teal text-white font-script text-sm flex items-center justify-center border-2 border-white shadow-md index-badge"
                >
                  {{ index + 1 }}
                </div>
              </div>
            </div>
          </div>

          <!-- Info footer -->
          <div
            class="relative flex items-center justify-center gap-3 pt-6 border-t-2 border-dashed border-brand-black/10 footer-animate"
          >
            <div
              class="flex items-center gap-2 px-4 py-2 bg-brand-bg rounded-full border border-brand-black/10"
            >
              <iconify-icon
                icon="solar:cursor-bold"
                width="16"
                class="text-brand-teal"
              ></iconify-icon>
              <span class="text-xs font-medium text-brand-black/60">Click to copy hex code</span>
            </div>
            <div
              class="flex items-center gap-2 px-4 py-2 bg-brand-bg rounded-full border border-brand-black/10"
            >
              <iconify-icon
                icon="solar:pallete-2-bold"
                width="16"
                class="text-brand-teal"
              ></iconify-icon>
              <span class="text-xs font-medium text-brand-black/60"
                >{{ colorAnalysis.length }} colors analyzed</span
              >
            </div>
          </div>
        </section>

        <!-- Detailed Analysis -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <section
            v-for="(analysis, index) in colorAnalysis"
            :key="index"
            class="card-hybrid paper-bg p-6 hover:shadow-[5px_5px_0px_0px_#2F7A72] transition-all scroll-animate fade-up"
            :class="index % 2 === 0 ? 'rotate-slight-left' : 'rotate-slight-right'"
          >
            <div class="flex items-start gap-4 mb-5">
              <div
                class="w-14 h-14 rounded border-3 border-brand-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] shrink-0"
                :style="{ backgroundColor: analysis.hex }"
              ></div>
              <div class="flex-1">
                <h3 class="text-lg font-display font-bold text-brand-black">{{ analysis.name }}</h3>
                <p class="text-sm font-mono text-brand-black/60">{{ analysis.hex }}</p>
              </div>
              <button class="icon-btn-hybrid" @click="copyColor(analysis.hex)">
                <iconify-icon icon="solar:copy-linear" width="18"></iconify-icon>
              </button>
            </div>

            <!-- Mood -->
            <div class="mb-4 p-4 bg-white rounded border-2 border-brand-black/10">
              <div class="flex items-center gap-2 mb-2">
                <iconify-icon
                  icon="solar:emoji-funny-circle-bold"
                  width="18"
                  class="text-brand-teal"
                ></iconify-icon>
                <span class="font-script text-brand-black/50">Mood</span>
              </div>
              <p class="font-display font-bold text-brand-black">{{ analysis.mood }}</p>
            </div>

            <!-- Accessibility -->
            <div class="mb-4 p-4 bg-white rounded border-2 border-brand-black/10">
              <div class="flex items-center gap-2 mb-2">
                <iconify-icon
                  icon="solar:accessibility-bold"
                  width="18"
                  class="text-brand-teal"
                ></iconify-icon>
                <span class="font-script text-brand-black/50">Accessibility</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span
                    class="badge-hybrid text-xs"
                    :class="{
                      'bg-brand-bright!': analysis.accessibility.rating === 'AAA',
                      'bg-brand-yellow!': analysis.accessibility.rating === 'AA',
                      'bg-brand-red! text-white!': analysis.accessibility.rating === 'Needs Work'
                    }"
                  >
                    {{ analysis.accessibility.rating }}
                  </span>
                  <span class="text-sm text-brand-black/60">WCAG Rating</span>
                </div>
              </div>
            </div>

            <!-- Contrast Ratios -->
            <div class="grid grid-cols-2 gap-3">
              <div class="stat-hybrid">
                <div
                  class="w-8 h-8 mx-auto mb-2 rounded bg-white border-2 border-brand-black/20 flex items-center justify-center"
                >
                  <span class="text-xs font-bold" :style="{ color: analysis.hex }">Aa</span>
                </div>
                <p class="font-script text-brand-black/50">vs White</p>
                <p class="font-bold text-brand-black">{{ analysis.contrast.white }}:1</p>
              </div>
              <div class="stat-hybrid bg-brand-black! border-brand-black!">
                <div
                  class="w-8 h-8 mx-auto mb-2 rounded bg-brand-black border-2 border-white/20 flex items-center justify-center"
                >
                  <span class="text-xs font-bold" :style="{ color: analysis.hex }">Aa</span>
                </div>
                <p class="font-script text-white/50">vs Black</p>
                <p class="font-bold text-white">{{ analysis.contrast.black }}:1</p>
              </div>
            </div>
          </section>
        </div>

        <!-- Upgrade CTA for public mode -->
        <section
          v-if="isPublicMode"
          class="card-hybrid card-hybrid-red paper-bg p-8 text-center scroll-animate fade-up rotate-slight-right"
        >
          <div
            class="w-16 h-16 mx-auto mb-4 rounded border-3 border-brand-black bg-brand-teal flex items-center justify-center shadow-[3px_3px_0px_0px_#1A1A1A]"
          >
            <iconify-icon icon="solar:crown-bold" width="32" class="text-white"></iconify-icon>
          </div>
          <h3
            class="text-2xl font-display font-bold text-brand-black mb-2 section-header-hybrid inline-block"
          >
            Want More Insights?
          </h3>
          <p class="text-brand-black/60 font-script text-lg mb-6 max-w-md mx-auto">
            Upgrade to unlock advanced color harmony analysis, brand consistency scoring, and export
            options.
          </p>
          <div class="flex items-center justify-center gap-4">
            <RouterLink to="/pricing" class="btn-hybrid btn-hybrid-primary">
              View Pricing
            </RouterLink>
            <RouterLink to="/signup" class="btn-hybrid"> Create Account </RouterLink>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
  /* Scroll animations */
  .scroll-animate {
    opacity: 0;
    animation: fadeInUp 0.8s ease-out forwards;
  }

  .scroll-animate.fade-up {
    animation: fadeInUp 0.8s ease-out forwards;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ===== Color Overview Section Animations ===== */

  /* Section entrance */
  .color-overview-section {
    animation: sectionSlideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes sectionSlideIn {
    from {
      opacity: 0;
      transform: translateY(60px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* Floating dots animation */
  .animate-float-slow {
    animation: floatSlow 4s ease-in-out infinite;
  }

  .animate-float-delayed {
    animation: floatSlow 4s ease-in-out infinite;
    animation-delay: 1s;
  }

  @keyframes floatSlow {
    0%,
    100% {
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-8px) scale(1.1);
    }
  }

  /* Header icon pop animation */
  .icon-pop {
    animation: iconPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.2s both;
  }

  @keyframes iconPop {
    from {
      opacity: 0;
      transform: scale(0) rotate(-20deg);
    }
    to {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }
  }

  /* Label slide in */
  .label-slide-in {
    animation: labelSlide 0.5s ease-out 0.3s both;
  }

  @keyframes labelSlide {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Title slide in */
  .title-slide-in {
    animation: titleSlide 0.6s ease-out 0.4s both;
  }

  @keyframes titleSlide {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Title underline grow */
  .title-underline {
    animation: underlineGrow 0.5s ease-out 0.7s both;
  }

  @keyframes underlineGrow {
    from {
      width: 0;
      opacity: 0;
    }
    to {
      width: 4rem;
      opacity: 1;
    }
  }

  /* Connection line animation */
  .connection-line {
    animation: lineExpand 0.8s ease-out 0.5s both;
  }

  @keyframes lineExpand {
    from {
      transform: scaleX(0) translateY(-50%);
    }
    to {
      transform: scaleX(1) translateY(-50%);
    }
  }

  /* Swatch container staggered entrance */
  .swatch-container {
    animation: swatchEntrance 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    animation-delay: calc(0.6s + var(--delay));
  }

  @keyframes swatchEntrance {
    from {
      opacity: 0;
      transform: translateY(50px) scale(0.8) rotate(-5deg);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1) rotate(0deg);
    }
  }

  /* Swatch card hover effects */
  .swatch-card {
    transform-origin: center bottom;
  }

  .swatch-card:hover .color-fill {
    animation: colorPulse 0.4s ease-out;
  }

  @keyframes colorPulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
  }

  /* Copy icon bounce on hover */
  .group:hover .copy-icon-bounce {
    animation: iconBounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  @keyframes iconBounce {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

  /* Name tag animation */
  .name-tag {
    animation: tagSlideUp 0.5s ease-out both;
    animation-delay: calc(0.9s + var(--delay));
  }

  @keyframes tagSlideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Index badge pop */
  .index-badge {
    animation: badgePop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
    animation-delay: calc(0.8s + var(--delay));
  }

  @keyframes badgePop {
    from {
      opacity: 0;
      transform: scale(0);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Footer fade in */
  .footer-animate {
    animation: footerFade 0.6s ease-out 1.2s both;
  }

  @keyframes footerFade {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Swatch hover lift effect */
  .swatch-container:hover .swatch-card {
    box-shadow: 6px 6px 0px 0px #1a1a1a;
  }

  /* Continuous subtle animation for section */
  .color-overview-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #2f7a72, #f9e94e, #c92216, transparent);
    background-size: 200% 100%;
    animation: shimmer 3s linear infinite;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
</style>
