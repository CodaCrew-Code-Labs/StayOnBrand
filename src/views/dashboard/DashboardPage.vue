<template>
  <div class="text-brand-black selection:bg-brand-bright selection:text-brand-black relative">
    <!-- Dashboard Main -->
    <main class="relative z-10 w-full">
      <!-- Intro Text -->
      <div class="mb-8 flex items-end justify-between relative">
        <div>
          <div class="inline-block">
            <h1
              class="text-3xl md:text-4xl font-display font-bold text-brand-black tracking-tight section-header-hybrid"
            >
              Color Studio
            </h1>
          </div>
          <p class="mt-4 text-brand-black/60 font-script text-xl flex items-center gap-2">
            Discover & analyze brand colors
            <span class="inline-block w-2 h-2 rounded-full bg-brand-bright animate-pulse"></span>
          </p>
        </div>
        <div class="hidden md:flex gap-3">
          <button class="btn-hybrid btn-hybrid-primary rotate-slight-right">
            <iconify-icon icon="solar:add-circle-linear" width="16"></iconify-icon>
            New Brand
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        <!-- Left Column -->
        <div class="lg:col-span-8 flex flex-col gap-6 md:gap-8">
          <!-- Famous Color Schemes -->
          <section
            class="card-hybrid paper-bg p-6 md:p-8"
            style="box-shadow: 4px 4px 0px 0px rgba(201, 34, 22, 0.5)"
          >
            <!-- Section Header -->
            <div class="flex items-start gap-4 mb-6">
              <div
                class="w-12 h-12 bg-brand-teal flex items-center justify-center flex-shrink-0 border-2 border-brand-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.12)] rounded"
              >
                <iconify-icon
                  icon="solar:palette-bold"
                  width="24"
                  class="text-white"
                ></iconify-icon>
              </div>
              <div class="flex-1">
                <p class="text-brand-teal font-script text-lg mb-0.5">popular brands</p>
                <h2 class="text-xl md:text-2xl font-display font-bold text-brand-black">
                  Famous Color Schemes
                </h2>
              </div>
              <div class="flex gap-2">
                <button class="icon-btn-hybrid wiggle-hover" @click="shuffleBrands">
                  <iconify-icon icon="solar:refresh-linear" width="18"></iconify-icon>
                </button>
                <button class="icon-btn-hybrid" @click="scrollBrands('left')">
                  <svg
                    class="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                  >
                    <path d="M14 4 L6 10 L14 16" />
                  </svg>
                </button>
                <button class="icon-btn-hybrid" @click="scrollBrands('right')">
                  <svg
                    class="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                  >
                    <path d="M6 4 L14 10 L6 16" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Brand Cards Container -->
            <div
              ref="brandsContainer"
              class="relative w-full overflow-x-auto hide-scrollbar scroll-smooth"
            >
              <div class="flex gap-4 py-2">
                <!-- Brand Cards -->
                <div
                  v-for="(brand, index) in displayBrands"
                  :key="`${brand.name}-${index}`"
                  class="brand-card relative w-[200px] min-h-[300px] flex flex-col border-2 border-brand-black cursor-pointer group/card shrink-0 transition-all duration-200 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.18)] hover:-translate-y-1 overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] rounded"
                  :style="{
                    background: brand.gradient,
                    transform: `rotate(${((index % 3) - 1) * 0.5}deg)`
                  }"
                  :class="brand.textClass"
                >
                  <!-- Accent bar at top -->
                  <div
                    class="h-1 w-full"
                    :style="{ backgroundColor: brand.accentColor || brand.colors[0] }"
                  ></div>

                  <!-- Header: Icon & Brand Name -->
                  <div class="flex items-center gap-3 p-4 pb-3">
                    <div
                      class="w-10 h-10 flex items-center justify-center border-2 border-brand-black/20 shadow-sm rounded"
                      :class="brand.iconBg"
                    >
                      <iconify-icon :icon="brand.icon" width="22"></iconify-icon>
                    </div>
                    <span class="font-display font-bold text-sm tracking-tight truncate flex-1">
                      {{ brand.name }}
                    </span>
                  </div>

                  <!-- Spacer -->
                  <div class="flex-grow min-h-[60px]"></div>

                  <!-- Color preview strip -->
                  <div class="flex h-4 -skew-y-3 scale-x-110 -mx-2">
                    <div
                      v-for="(color, colorIndex) in brand.colors"
                      :key="colorIndex"
                      class="flex-1 transition-all duration-200"
                      :class="(brandColorIndex[index] || 0) === colorIndex ? 'brightness-125' : ''"
                      :style="{ backgroundColor: color }"
                    ></div>
                  </div>

                  <!-- Color Banner with marquee -->
                  <div
                    class="relative h-12 overflow-hidden shrink-0 transition-all duration-300 -skew-y-3 scale-x-110 -mx-2 -mt-0.5 cursor-pointer hover:brightness-110"
                    @click.stop="addToMyColors(brand.colors[brandColorIndex[index] || 0])"
                  >
                    <div
                      class="absolute inset-0"
                      :style="{ backgroundColor: brand.colors[brandColorIndex[index] || 0] }"
                    >
                      <div class="absolute inset-0 flex items-center overflow-hidden">
                        <div class="color-marquee-seamless flex items-center whitespace-nowrap">
                          <span
                            v-for="n in 12"
                            :key="n"
                            class="text-xs font-mono font-bold flex items-center gap-2 mx-3"
                            :style="{
                              color: getContrastColor(brand.colors[brandColorIndex[index] || 0])
                            }"
                          >
                            <iconify-icon icon="mdi:diamond" width="10"></iconify-icon>
                            {{ brand.colors[brandColorIndex[index] || 0] }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Control buttons -->
                  <div class="flex items-center gap-1.5 px-3 py-2.5 bg-brand-black/5 skew-y-0">
                    <button
                      class="w-8 h-8 bg-white hover:bg-brand-black/10 flex items-center justify-center transition-all hover:scale-105 border border-brand-black/20 rounded"
                      @click.stop="prevColor(index, brand.colors.length)"
                    >
                      <iconify-icon icon="solar:arrow-left-linear" width="14"></iconify-icon>
                    </button>
                    <button
                      class="flex-1 h-8 bg-white hover:bg-brand-black/10 flex items-center justify-center gap-1.5 transition-all text-xs font-bold hover:scale-[1.02] border border-brand-black/20 rounded"
                      @click.stop="selectBrand(brand)"
                    >
                      <iconify-icon icon="solar:add-circle-bold" width="14"></iconify-icon>
                      Add All
                    </button>
                    <button
                      class="w-8 h-8 bg-white hover:bg-brand-black/10 flex items-center justify-center transition-all hover:scale-105 border border-brand-black/20 rounded"
                      @click.stop="nextColor(index, brand.colors.length)"
                    >
                      <iconify-icon icon="solar:arrow-right-linear" width="14"></iconify-icon>
                    </button>
                  </div>

                  <!-- Color dots indicator -->
                  <div class="flex items-center justify-center gap-1.5 py-3 bg-brand-black/5">
                    <div
                      v-for="(color, colorIndex) in brand.colors.slice(0, 5)"
                      :key="colorIndex"
                      class="w-2.5 h-2.5 transition-all duration-200 border border-brand-black/30 rounded-sm"
                      :class="
                        (brandColorIndex[index] || 0) === colorIndex
                          ? 'scale-150 ring-2 ring-brand-black/20'
                          : 'opacity-60'
                      "
                      :style="{ backgroundColor: color }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Hint Text -->
            <div
              class="flex items-center gap-2 text-brand-black/50 mt-4 pt-4 border-t-2 border-dashed border-brand-black/15"
            >
              <svg
                class="w-4 h-4"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="8" cy="8" r="6" />
                <path d="M8 5 L8 8.5 M8 11 L8 11.5" />
              </svg>
              <span class="font-script text-lg"
                >Click on a brand card to add its color palette to your collection</span
              >
            </div>
          </section>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <!-- Color Picker Section -->
            <section
              class="card-hybrid paper-bg p-6 relative hand-drawn-border card-lift overflow-hidden"
              style="box-shadow: 4px 4px 0px 0px rgba(121, 220, 175, 0.5)"
            >
              <!-- Tinted header background -->
              <div
                class="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-brand-bright/15 to-transparent rounded-t pointer-events-none"
              ></div>

              <div ref="pickerSection" class="flex flex-col h-[400px] relative z-10">
                <!-- Section Header -->
                <div class="flex items-start gap-3 mb-5">
                  <div
                    class="w-10 h-10 bg-brand-bright flex items-center justify-center flex-shrink-0 border-2 border-brand-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.12)] rounded animate-float"
                  >
                    <iconify-icon
                      icon="solar:pipette-bold"
                      width="20"
                      class="text-brand-black"
                    ></iconify-icon>
                  </div>
                  <div class="flex-1">
                    <h2 class="text-lg font-display font-bold tracking-tight">Color Picker</h2>
                    <p class="font-script text-base text-brand-black/50 mt-0.5">
                      Pick or enter colors
                    </p>
                  </div>
                  <button class="icon-btn-hybrid bg-brand-bright!" @click="addColorFromPicker">
                    <iconify-icon icon="solar:pipette-bold" width="18"></iconify-icon>
                  </button>
                </div>

                <!-- Color Picker Canvas -->
                <div class="relative mb-4">
                  <div
                    ref="colorCanvas"
                    class="w-full h-28 cursor-crosshair relative overflow-hidden border-2 border-brand-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] group rounded"
                    :style="{
                      background: `linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))`
                    }"
                    @click="pickColor"
                  >
                    <div
                      class="absolute inset-0"
                      style="background: linear-gradient(to top, #000, transparent)"
                    ></div>
                    <div
                      class="absolute w-6 h-6 border-3 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100 ring-2 ring-brand-black rounded"
                      :style="{
                        left: `${pickerX}%`,
                        top: `${pickerY}%`,
                        backgroundColor: selectedColor
                      }"
                    ></div>
                  </div>
                  <input
                    v-model="hue"
                    type="range"
                    min="0"
                    max="360"
                    class="hue-slider w-full h-5 mt-3 appearance-none cursor-pointer border-3 border-brand-black rounded"
                    style="
                      background: linear-gradient(
                        to right,
                        #ff0000,
                        #ffff00,
                        #00ff00,
                        #00ffff,
                        #0000ff,
                        #ff00ff,
                        #ff0000
                      );
                    "
                  />
                </div>

                <!-- Selected Color Display -->
                <div class="input-hybrid flex items-center gap-3 mb-4">
                  <div
                    class="w-12 h-12 border border-brand-black/30 shadow-[1px_1px_4px_0px_rgba(0,0,0,0.08)] transition-colors duration-200 rounded"
                    :style="{ backgroundColor: selectedColor }"
                  ></div>
                  <div class="flex-1">
                    <p class="font-script text-base text-brand-black/50">Selected Color</p>
                    <p class="font-mono text-base font-bold">{{ selectedColor.toUpperCase() }}</p>
                  </div>
                  <button class="icon-btn-hybrid" @click="copyColor(selectedColor)">
                    <iconify-icon
                      icon="solar:copy-linear"
                      width="18"
                      class="text-brand-black"
                    ></iconify-icon>
                  </button>
                </div>

                <!-- Palette Input -->
                <div class="relative mt-auto">
                  <input
                    v-model="paletteInput"
                    type="text"
                    placeholder="Enter HEX color (e.g., #FF5733)"
                    class="w-full input-hybrid text-sm font-mono pr-16"
                    @input="onPaletteInputChange"
                    @keyup.enter="addColorsFromInput"
                  />
                  <button
                    class="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-brand-black text-brand-bg text-xs font-bold hover:bg-brand-teal transition-colors border-2 border-brand-black rounded"
                    @click="addColorsFromInput"
                  >
                    Add
                  </button>
                </div>
              </div>
            </section>

            <!-- My Palette Section -->
            <section
              class="card-hybrid paper-bg p-6 relative hand-drawn-border card-lift overflow-hidden"
              style="box-shadow: 4px 4px 0px 0px rgba(201, 34, 22, 0.4)"
            >
              <!-- Tinted header background -->
              <div
                class="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-brand-red/8 to-transparent rounded-t pointer-events-none"
              ></div>

              <div ref="addColorsSection" class="flex flex-col h-[400px] relative z-10">
                <!-- Section Header -->
                <div class="flex items-start gap-3 mb-5">
                  <div
                    class="w-10 h-10 bg-brand-teal flex items-center justify-center shrink-0 border-2 border-brand-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.12)] rounded wiggle-hover"
                  >
                    <iconify-icon
                      icon="solar:pallete-2-bold"
                      width="20"
                      class="text-white"
                    ></iconify-icon>
                  </div>
                  <div class="flex-1">
                    <h2 class="text-lg font-display font-bold tracking-tight">
                      <span class="marker-subtle">My Palette</span>
                    </h2>
                    <p class="font-script text-base text-brand-black/50 mt-0.5">
                      {{ myColors.length }}/{{ maxColorsAllowed }} colors
                    </p>
                  </div>
                  <button
                    v-if="myColors.length > 0"
                    class="btn-hybrid-sm text-brand-red border-brand-red! hover:bg-brand-red hover:text-white"
                    style="box-shadow: 2px 2px 0px 0px #c92216"
                    @click="clearMyColors"
                  >
                    <iconify-icon icon="solar:trash-bin-trash-bold" width="14"></iconify-icon>
                    Clear
                  </button>
                </div>

                <div class="grid grid-cols-3 gap-3 flex-grow overflow-y-auto hide-scrollbar">
                  <!-- Color Items -->
                  <div
                    v-for="(color, index) in myColors"
                    :key="index"
                    class="color-item relative bg-white p-2.5 flex flex-col items-center justify-center border border-brand-black/20 shadow-[1px_1px_4px_0px_rgba(0,0,0,0.06)] hover:shadow-[2px_2px_8px_0px_rgba(47,122,114,0.2)] transition-all group cursor-pointer aspect-square rounded"
                    :style="{
                      '--item-delay': `${index * 50}ms`,
                      transform: `rotate(${((index % 3) - 1) * 1}deg)`
                    }"
                    @click="copyColor(color)"
                  >
                    <div
                      class="w-full aspect-square border border-brand-black/20 mb-2 transform transition-transform group-hover:scale-105 shadow-[1px_1px_3px_0px_rgba(0,0,0,0.06)] rounded"
                      :style="{ backgroundColor: color }"
                    ></div>
                    <p
                      class="text-[10px] font-mono font-bold text-brand-black truncate w-full text-center"
                    >
                      {{ color }}
                    </p>
                    <button
                      class="absolute -top-2 -right-2 w-6 h-6 bg-brand-red text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-sm hover:scale-110 border border-brand-black/30 rounded"
                      @click.stop="removeColor(index)"
                    >
                      <iconify-icon icon="solar:close-circle-bold" width="14"></iconify-icon>
                    </button>
                  </div>

                  <!-- Add Color Card / Upgrade Card -->
                  <div
                    v-if="canAddMoreColors"
                    class="bg-white p-3 flex flex-col items-center justify-center border border-dashed border-brand-black/20 hover:border-brand-teal hover:border-solid hover:border-2 hover:bg-brand-bright/20 cursor-pointer transition-all aspect-square group rounded"
                    @click="triggerAddColor"
                  >
                    <div
                      class="w-10 h-10 border border-brand-black/15 flex items-center justify-center group-hover:border-brand-teal group-hover:bg-brand-teal/10 transition-all rounded"
                    >
                      <iconify-icon
                        icon="solar:add-circle-bold"
                        width="24"
                        class="text-brand-black/40 group-hover:text-brand-teal group-hover:scale-110 transition-all"
                      ></iconify-icon>
                    </div>
                    <span
                      class="font-script text-base text-brand-black/40 mt-2 group-hover:text-brand-teal"
                      >Add Color</span
                    >
                  </div>
                  <!-- Palette Full for max tier -->
                  <div
                    v-else-if="isMaxTier"
                    class="bg-brand-bg p-3 flex flex-col items-center justify-center border border-dashed border-brand-black/10 transition-all aspect-square rounded"
                  >
                    <div
                      class="w-10 h-10 border border-brand-black/10 flex items-center justify-center rounded"
                    >
                      <iconify-icon
                        icon="solar:check-circle-bold"
                        width="24"
                        class="text-brand-teal"
                      ></iconify-icon>
                    </div>
                    <span class="font-script text-base text-brand-black/40 mt-2 text-center"
                      >Palette Full</span
                    >
                  </div>
                  <!-- Upgrade prompt -->
                  <div
                    v-else
                    class="bg-brand-bright/15 p-3 flex flex-col items-center justify-center border border-dashed border-brand-teal/25 cursor-pointer transition-all aspect-square group hover:border-brand-teal hover:border-solid hover:border-2 rounded"
                    @click="
                      showToastMessage('Upgrade your plan for more colors!', 'solar:crown-linear')
                    "
                  >
                    <div
                      class="w-10 h-10 border border-brand-teal/20 flex items-center justify-center group-hover:border-brand-teal group-hover:bg-brand-teal/10 transition-all rounded"
                    >
                      <iconify-icon
                        icon="solar:lock-keyhole-bold"
                        width="24"
                        class="text-brand-teal/60 group-hover:text-brand-teal group-hover:scale-110 transition-all"
                      ></iconify-icon>
                    </div>
                    <span
                      class="font-script text-base text-brand-teal/60 mt-2 group-hover:text-brand-teal text-center"
                      >Upgrade</span
                    >
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- Start Analysis Button -->
          <div class="relative">
            <button
              ref="analysisBtn"
              class="group relative w-full bg-brand-black text-brand-bg py-5 font-display font-bold text-lg flex items-center justify-center gap-3 overflow-hidden border-2 border-brand-black shadow-[3px_3px_0px_0px_rgba(47,122,114,0.5)] hover:shadow-[4px_4px_0px_0px_rgba(47,122,114,0.6)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(47,122,114,0.4)] transition-all rounded"
              @click="startAnalysis"
            >
              <div
                class="absolute inset-0 bg-gradient-to-r from-brand-teal via-brand-bright to-brand-teal bg-[length:200%_100%] animate-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>
              <div class="absolute inset-0 overflow-hidden">
                <div
                  class="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                ></div>
              </div>
              <div
                class="relative z-10 w-12 h-12 bg-brand-bright/20 border-3 border-white/30 flex items-center justify-center group-hover:animate-bounce rounded"
              >
                <iconify-icon
                  icon="solar:magic-stick-3-bold"
                  width="24"
                  class="group-hover:rotate-12 transition-transform"
                ></iconify-icon>
              </div>
              <span class="relative z-10">Start Analysis</span>
              <svg
                class="relative z-10 w-6 h-6 group-hover:translate-x-2 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Right Column -->
        <div class="lg:col-span-4 flex flex-col gap-6 md:gap-8">
          <!-- Most Picked Colors -->
          <section
            class="card-hybrid paper-bg p-6 relative hand-drawn-border card-lift overflow-hidden"
            style="box-shadow: 4px 4px 0px 0px rgba(121, 220, 175, 0.5)"
          >
            <!-- Bright header tint -->
            <div
              class="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-brand-bright/15 to-transparent rounded-t pointer-events-none"
            ></div>

            <!-- Section Header -->
            <div class="flex items-start gap-3 mb-5 relative z-10">
              <div
                class="w-10 h-10 bg-brand-bright flex items-center justify-center shrink-0 border-2 border-brand-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.12)] rounded relative"
              >
                <div class="absolute inset-0 bg-brand-bright/40 rounded animate-sonar-slow"></div>
                <iconify-icon
                  icon="solar:fire-bold"
                  width="20"
                  class="text-brand-black relative z-10"
                ></iconify-icon>
              </div>
              <div class="flex-1">
                <h2 class="text-lg font-display font-bold tracking-tight">Most Picked Colors</h2>
                <p class="font-script text-base text-brand-black/50 mt-0.5">
                  Popular choices this week
                </p>
              </div>
            </div>

            <div class="flex flex-wrap gap-3 mb-5">
              <div
                v-for="(color, index) in mostPickedColors"
                :key="index"
                class="picked-color relative w-12 h-12 cursor-pointer hover:scale-110 hover:-translate-y-1 transition-all border-2 border-brand-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] group rounded"
                :style="{
                  backgroundColor: color.hex,
                  '--delay': `${index * 50}ms`,
                  transform: `rotate(${((index % 5) - 2) * 1.5}deg)`
                }"
                @click="addToMyColors(color.hex)"
              >
                <div
                  class="absolute -bottom-2 -right-2 w-5 h-5 bg-brand-teal text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100 border-2 border-brand-black rounded"
                >
                  +
                </div>
              </div>
            </div>

            <div class="input-hybrid flex items-center gap-2 text-brand-black/60">
              <svg
                class="w-4 h-4 text-brand-teal"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              >
                <path d="M4 8 L4 12 L8 14 L12 12 L12 8" />
                <path d="M8 2 L8 10" />
                <path d="M6 4 L8 2 L10 4" />
              </svg>
              <span class="font-script text-base">Click any color to add to your palette</span>
            </div>
          </section>

          <!-- My Brands Stack -->
          <section
            class="card-hybrid paper-bg p-6 relative hand-drawn-border card-lift"
            style="box-shadow: 4px 4px 0px 0px rgba(121, 220, 175, 0.5)"
          >
            <!-- Tinted header background -->
            <div
              class="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-brand-bright/12 to-transparent rounded-t pointer-events-none"
            ></div>

            <!-- Section Header -->
            <div class="flex items-start gap-3 mb-5 relative z-10">
              <div
                class="w-10 h-10 bg-brand-bright flex items-center justify-center shrink-0 border-2 border-brand-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.12)] rounded relative"
              >
                <div class="absolute inset-0 bg-brand-bright/40 rounded animate-sonar-slow"></div>
                <iconify-icon
                  icon="solar:bookmark-bold"
                  width="20"
                  class="text-brand-black relative z-10"
                ></iconify-icon>
              </div>
              <div class="flex-1">
                <h2 class="text-lg font-display font-bold tracking-tight">
                  <span class="marker-subtle">My Brands</span>
                </h2>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span class="w-2 h-2 rounded-full bg-brand-bright animate-pulse"></span>
                  <p class="font-script text-base text-brand-black/50">
                    {{ savedBrands.length }} saved
                  </p>
                </div>
              </div>
              <button class="icon-btn-hybrid bg-brand-bright!">
                <iconify-icon icon="solar:add-circle-bold" width="18"></iconify-icon>
              </button>
            </div>

            <!-- Brands Vertical Stack - with overflow hidden wrapper -->
            <div
              class="relative flex-grow flex flex-col items-center min-h-[280px] overflow-hidden"
            >
              <div
                v-for="(brand, index) in savedBrands.slice(0, 3)"
                :key="brand.name"
                class="absolute w-full transform transition-all duration-300 cursor-pointer group"
                :style="{
                  top: `${index * 85}px`,
                  transform: `scale(${1 - index * 0.04}) rotate(${(index - 1) * 0.8}deg)`,
                  zIndex: 30 - index * 10
                }"
                @mouseenter="hoveredBrandIndex = index"
                @mouseleave="hoveredBrandIndex = null"
              >
                <div
                  class="w-full aspect-[1.6] p-4 flex flex-col justify-between border-2 border-brand-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] relative overflow-hidden transition-all group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] group-hover:-translate-y-0.5 rounded"
                  :style="{ background: brand.gradient }"
                  :class="brand.textClass"
                >
                  <div
                    class="absolute -top-10 -right-10 w-40 h-40 bg-white/20 blur-3xl rounded-full pointer-events-none"
                  ></div>
                  <div class="flex justify-between items-start relative z-10">
                    <div class="flex flex-col">
                      <div
                        class="w-9 h-9 bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center rounded"
                      >
                        <iconify-icon :icon="brand.icon" width="20"></iconify-icon>
                      </div>
                      <span class="text-xs font-bold mt-1.5">{{ brand.name }}</span>
                    </div>
                    <button
                      class="w-7 h-7 bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all border-2 border-white/20 rounded"
                    >
                      <iconify-icon icon="solar:heart-bold" width="14"></iconify-icon>
                    </button>
                  </div>
                  <button
                    class="px-3 py-1.5 bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:bg-white/30 transition-all text-xs font-bold flex items-center justify-center gap-2 relative z-10 rounded"
                    @click.stop="selectBrand(brand)"
                  >
                    <iconify-icon icon="solar:add-circle-bold" width="14"></iconify-icon>
                    <span>Add to Palette</span>
                  </button>
                </div>
              </div>

              <!-- Gradient Fade -->
              <div
                class="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#faf6ed] to-transparent z-30 pointer-events-none"
              ></div>
            </div>

            <!-- Show All Button -->
            <div class="relative z-40 mt-4">
              <button class="btn-hybrid btn-hybrid-primary w-full">
                <span>View All Brands</span>
                <svg
                  class="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                >
                  <path d="M5 10h10M10 5l5 5-5 5" />
                </svg>
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth.store'
  import { useToast } from '@/composables/useToast'

  const router = useRouter()
  const authStore = useAuthStore()
  const toast = useToast()

  // Check if user is authenticated (for public/free mode vs logged-in mode)
  const isPublicMode = computed(() => !authStore.isAuthenticated)

  // Tier-based color limits
  const maxColorsAllowed = computed(() => {
    // In public mode, always use free tier limits
    if (isPublicMode.value) return 2

    const tier = authStore.currentTier?.toLowerCase()
    if (tier === 'business') return 5
    if (tier === 'professional') return 3
    return 2 // Free tier or no tier
  })

  const canAddMoreColors = computed(() => myColors.value.length < maxColorsAllowed.value)

  // Check if user is on the highest tier (Business) - never true in public mode
  const isMaxTier = computed(
    () => !isPublicMode.value && authStore.currentTier?.toLowerCase() === 'business'
  )

  // Refs for DOM elements
  const brandsContainer = ref<HTMLElement | null>(null)

  // State
  const hoveredBrandIndex = ref<number | null>(null)
  const brandColorIndex = ref<Record<number, number>>({})
  const hue = ref(200)
  const pickerX = ref(80)
  const pickerY = ref(30)
  const selectedColor = ref('#3B82F6')
  const paletteInput = ref('')

  // Famous brand color schemes - light tinted backgrounds
  const famousBrands = ref([
    {
      name: 'Spotify',
      icon: 'logos:spotify-icon',
      gradient: 'linear-gradient(135deg, rgba(29,185,84,0.15) 0%, rgba(29,185,84,0.08) 100%)',
      colors: ['#1DB954', '#191414', '#FFFFFF', '#535353', '#1A1A1A'],
      textClass: 'text-brand-black',
      iconBg: 'bg-[#1DB954]/20',
      accentColor: '#1DB954'
    },
    {
      name: 'Netflix',
      icon: 'logos:netflix-icon',
      gradient: 'linear-gradient(135deg, rgba(229,9,20,0.12) 0%, rgba(229,9,20,0.06) 100%)',
      colors: ['#E50914', '#221F1F', '#F5F5F1', '#000000', '#B81D24'],
      textClass: 'text-brand-black',
      iconBg: 'bg-[#E50914]/15',
      accentColor: '#E50914'
    },
    {
      name: 'PlayStation',
      icon: 'simple-icons:playstation',
      gradient: 'linear-gradient(135deg, rgba(0,48,135,0.12) 0%, rgba(0,112,209,0.08) 100%)',
      colors: ['#003087', '#00439C', '#0070D1', '#FFFFFF', '#000000'],
      textClass: 'text-brand-black',
      iconBg: 'bg-[#003087]/15',
      accentColor: '#003087'
    },
    {
      name: 'Discord',
      icon: 'logos:discord-icon',
      gradient: 'linear-gradient(135deg, rgba(88,101,242,0.15) 0%, rgba(88,101,242,0.08) 100%)',
      colors: ['#5865F2', '#57F287', '#FEE75C', '#EB459E', '#ED4245'],
      textClass: 'text-brand-black',
      iconBg: 'bg-[#5865F2]/15',
      accentColor: '#5865F2'
    },
    {
      name: 'YouTube',
      icon: 'logos:youtube-icon',
      gradient: 'linear-gradient(135deg, rgba(255,0,0,0.1) 0%, rgba(255,0,0,0.05) 100%)',
      colors: ['#FF0000', '#282828', '#FFFFFF', '#AAAAAA', '#000000'],
      textClass: 'text-brand-black',
      iconBg: 'bg-[#FF0000]/12',
      accentColor: '#FF0000'
    },
    {
      name: 'Twitch',
      icon: 'logos:twitch',
      gradient: 'linear-gradient(135deg, rgba(145,70,255,0.12) 0%, rgba(145,70,255,0.06) 100%)',
      colors: ['#9146FF', '#772CE8', '#FFFFFF', '#1F1F23', '#000000'],
      textClass: 'text-brand-black',
      iconBg: 'bg-[#9146FF]/15',
      accentColor: '#9146FF'
    },
    {
      name: 'Slack',
      icon: 'logos:slack-icon',
      gradient: 'linear-gradient(135deg, rgba(74,21,75,0.1) 0%, rgba(74,21,75,0.05) 100%)',
      colors: ['#4A154B', '#36C5F0', '#2EB67D', '#ECB22E', '#E01E5A'],
      textClass: 'text-brand-black',
      iconBg: 'bg-[#4A154B]/12',
      accentColor: '#4A154B'
    },
    {
      name: 'Dribbble',
      icon: 'logos:dribbble-icon',
      gradient: 'linear-gradient(135deg, rgba(234,76,137,0.12) 0%, rgba(234,76,137,0.06) 100%)',
      colors: ['#EA4C89', '#C32361', '#FFFFFF', '#444444', '#2C2C2C'],
      textClass: 'text-brand-black',
      iconBg: 'bg-[#EA4C89]/15',
      accentColor: '#EA4C89'
    }
  ])

  // Double the brands for infinite scroll effect
  const displayBrands = computed(() => [...famousBrands.value, ...famousBrands.value])

  // Most picked colors
  const mostPickedColors = ref([
    { hex: '#FF6B6B', name: 'Coral Red' },
    { hex: '#4ECDC4', name: 'Turquoise' },
    { hex: '#45B7D1', name: 'Sky Blue' },
    { hex: '#96CEB4', name: 'Sage' },
    { hex: '#FFEAA7', name: 'Cream' },
    { hex: '#DDA0DD', name: 'Plum' },
    { hex: '#98D8C8', name: 'Mint' },
    { hex: '#F7DC6F', name: 'Butter' },
    { hex: '#BB8FCE', name: 'Lavender' },
    { hex: '#85C1E9', name: 'Powder Blue' }
  ])

  // My saved colors
  const myColors = ref<string[]>(['#1DB954', '#E50914', '#003087'])

  // Saved brands - light tinted backgrounds
  const savedBrands = ref([
    {
      name: 'Spotify',
      icon: 'logos:spotify-icon',
      gradient: 'linear-gradient(135deg, rgba(29,185,84,0.15) 0%, rgba(29,185,84,0.08) 100%)',
      colors: ['#1DB954', '#191414', '#FFFFFF', '#535353'],
      textClass: 'text-brand-black',
      iconBg: 'bg-[#1DB954]/20',
      accentColor: '#1DB954'
    },
    {
      name: 'Netflix',
      icon: 'logos:netflix-icon',
      gradient: 'linear-gradient(135deg, rgba(229,9,20,0.12) 0%, rgba(229,9,20,0.06) 100%)',
      colors: ['#E50914', '#141414', '#FFFFFF', '#B81D24'],
      textClass: 'text-brand-black',
      iconBg: 'bg-[#E50914]/15',
      accentColor: '#E50914'
    },
    {
      name: 'PlayStation',
      icon: 'simple-icons:playstation',
      gradient: 'linear-gradient(135deg, rgba(0,48,135,0.12) 0%, rgba(0,112,209,0.08) 100%)',
      colors: ['#003087', '#00439C', '#0070D1', '#FFFFFF'],
      textClass: 'text-brand-black',
      iconBg: 'bg-[#003087]/15',
      accentColor: '#003087'
    }
  ])

  // Methods
  const scrollBrands = (direction: 'left' | 'right') => {
    if (!brandsContainer.value) return
    const scrollAmount = 300
    brandsContainer.value.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  const shuffleBrands = () => {
    famousBrands.value = [...famousBrands.value].sort(() => Math.random() - 0.5)
  }

  const prevColor = (cardIndex: number, totalColors: number) => {
    const current = brandColorIndex.value[cardIndex] || 0
    brandColorIndex.value[cardIndex] = current === 0 ? totalColors - 1 : current - 1
  }

  const nextColor = (cardIndex: number, totalColors: number) => {
    const current = brandColorIndex.value[cardIndex] || 0
    brandColorIndex.value[cardIndex] = (current + 1) % totalColors
  }

  const getContrastColor = (hexColor: string): string => {
    const hex = hexColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? '#000000' : '#FFFFFF'
  }

  const selectBrand = (brand: (typeof famousBrands.value)[0]) => {
    myColors.value = []
    const colorsToAdd = brand.colors.slice(0, maxColorsAllowed.value)
    myColors.value.push(...colorsToAdd)
    showToastMessage(
      `Replaced with ${colorsToAdd.length} ${brand.name} color(s)`,
      'solar:palette-linear'
    )
  }

  const pickColor = (event: MouseEvent) => {
    const target = event.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    pickerX.value = ((event.clientX - rect.left) / rect.width) * 100
    pickerY.value = ((event.clientY - rect.top) / rect.height) * 100
    const saturation = pickerX.value
    const lightness = 100 - pickerY.value
    selectedColor.value = hslToHex(hue.value, saturation, lightness / 2 + 25)
  }

  const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100
    l /= 100
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0')
    }
    return `#${f(0)}${f(8)}${f(4)}`
  }

  const addColorFromPicker = () => {
    if (!canAddMoreColors.value) {
      showToastMessage(`Palette full! Upgrade for more slots`, 'solar:lock-keyhole-linear')
      return
    }
    if (!myColors.value.includes(selectedColor.value)) {
      myColors.value.push(selectedColor.value)
      showToastMessage('Color added to palette', 'solar:check-circle-linear')
    }
  }

  const addColorsFromInput = () => {
    const colors = paletteInput.value.match(/#[0-9A-Fa-f]{6}/g)
    if (colors) {
      let addedCount = 0
      for (const color of colors) {
        if (myColors.value.length >= maxColorsAllowed.value) {
          break
        }
        if (!myColors.value.includes(color.toUpperCase())) {
          myColors.value.push(color.toUpperCase())
          addedCount++
        }
      }
      paletteInput.value = ''
      if (addedCount === 0 && myColors.value.length >= maxColorsAllowed.value) {
        showToastMessage(`Palette full! Upgrade for more slots`, 'solar:lock-keyhole-linear')
      } else if (addedCount > 0) {
        showToastMessage(`Added ${addedCount} color(s)`, 'solar:check-circle-linear')
      }
    }
  }

  const onPaletteInputChange = () => {
    const match = paletteInput.value.match(/^#?([0-9A-Fa-f]{6})$/)
    if (match) {
      const hexColor = `#${match[1].toUpperCase()}`
      selectedColor.value = hexColor
      const hex = match[1]
      const r = parseInt(hex.substring(0, 2), 16) / 255
      const g = parseInt(hex.substring(2, 4), 16) / 255
      const b = parseInt(hex.substring(4, 6), 16) / 255

      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      const l = (max + min) / 2
      let h = 0
      let s = 0

      if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
          case r:
            h = ((g - b) / d + (g < b ? 6 : 0)) / 6
            break
          case g:
            h = ((b - r) / d + 2) / 6
            break
          case b:
            h = ((r - g) / d + 4) / 6
            break
        }
      }

      hue.value = Math.round(h * 360)
      pickerX.value = Math.round(s * 100)
      pickerY.value = Math.round((1 - l) * 100)
    }
  }

  const addToMyColors = (color: string) => {
    if (!canAddMoreColors.value) {
      showToastMessage(`Palette full! Upgrade for more slots`, 'solar:lock-keyhole-linear')
      return
    }
    if (!myColors.value.includes(color)) {
      myColors.value.push(color)
      showToastMessage('Color added to palette', 'solar:check-circle-linear')
    }
  }

  const removeColor = (index: number) => {
    myColors.value.splice(index, 1)
  }

  const clearMyColors = () => {
    myColors.value = []
    showToastMessage('Palette cleared', 'solar:trash-bin-trash-linear')
  }

  const triggerAddColor = () => {
    addColorFromPicker()
  }

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color)
    showToastMessage(`Copied ${color}`, 'solar:copy-linear')
  }

  const showToastMessage = (message: string, icon: string = 'solar:check-circle-linear') => {
    const isError = icon.includes('danger') || icon.includes('lock') || icon.includes('trash')
    const isInfo = icon.includes('copy') || icon.includes('crown')

    if (isError) {
      toast.error(message, undefined, 2000)
    } else if (isInfo) {
      toast.info(message, undefined, 2000)
    } else {
      toast.success(message, undefined, 2000)
    }
  }

  const startAnalysis = () => {
    if (myColors.value.length === 0) {
      showToastMessage('Add some colors first!', 'solar:danger-triangle-linear')
      return
    }
    const routeName = isPublicMode.value ? 'ColorReport' : 'ColorReportDashboard'
    router.push({ name: routeName, query: { colors: myColors.value.join(',') } })
  }

  // Scroll animation observer
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!isPublicMode.value) {
      authStore.refreshUserData()
    }

    observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.scroll-animate').forEach(el => {
      observer?.observe(el)
    })
  })

  onUnmounted(() => {
    observer?.disconnect()
  })
</script>

<style scoped>
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .brand-card {
    animation: cardEntrance 0.6s ease-out backwards;
  }

  @keyframes cardEntrance {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .color-marquee-seamless {
    animation: colorMarqueeSeamless 25s linear infinite;
  }

  @keyframes colorMarqueeSeamless {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  .brand-card:hover .color-marquee-seamless {
    animation-play-state: paused;
  }

  .color-item {
    animation: colorPop 0.4s ease-out backwards;
    animation-delay: var(--item-delay, 0ms);
  }

  @keyframes colorPop {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .picked-color {
    animation: pickedPop 0.3s ease-out backwards;
    animation-delay: var(--delay, 0ms);
  }

  @keyframes pickedPop {
    from {
      opacity: 0;
      transform: scale(0) rotate(-10deg);
    }
    to {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }
  }

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .animate-gradient {
    animation: gradientShift 3s ease infinite;
  }

  input[type='range'] {
    -webkit-appearance: none;
    height: 12px;
  }

  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 22px;
    height: 22px;
    background: white;
    border: 3px solid #1a1a1a;
    cursor: pointer;
    box-shadow: 3px 3px 0px 0px rgba(0, 0, 0, 0.3);
    transition:
      transform 0.2s,
      box-shadow 0.2s;
    border-radius: 4px;
  }

  input[type='range']::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 0.4);
  }

  input[type='range']::-webkit-slider-thumb:active {
    transform: scale(0.95);
    box-shadow: 2px 2px 0px 0px rgba(0, 0, 0, 0.3);
  }

  .btn-hybrid-sm {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    font-size: 0.75rem;
    font-weight: 700;
    border: 3px solid var(--color-brand-black);
    border-radius: 4px;
    background: white;
    transition: all 0.15s ease;
    cursor: pointer;
  }
</style>
