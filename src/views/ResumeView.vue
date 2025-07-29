<template>
  <div class="w-full h-screen bg-black overflow-x-hidden">
    <div class="w-full mx-auto relative bg-[url('')] bg-cover bg-no-repeat sm:aspect-video py-20">
      <div
        class="absolute md:-top-24 md:-right-32 sm:-right-[7rem] -right-[1rem] top-0 opacity-30 w-[15%] h-[20%] gradiant rounded-full blur-3xl"
      ></div>
      <div
        class="absolute md:-left-[45%] sm:-left-[42%] -left-[40%] opacity-10 w-[50%] h-full my-auto bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-3xl"
      ></div>

      <div class="w-[80%] mx-auto h-full flex justify-between items-center">
        <div
          class="h-full xl:w-[50%] md:w-[60%] sm:w-[70%] w-full text-white flex flex-col gap-2 justify-center"
        >
          <h1 class="xl:text-7xl lg:text-6xl md:text-5xl text-4xl font-semibold">
            Oh, Hello! Ik ben
          </h1>
          <h1 class="xl:text-7xl lg:text-6xl md:text-5xl text-4xl font-semibold bg-text">
            Reinier Burgering
          </h1>
          <!--  -->
          <p class="lg:text-3xl sm:text-xl text-lg lg:my-6 my-2">
            I am Experienced full-stack developer with 4+ years of expertise in Laravel, NestJS,
            Nuxt.js, Next.js, Android, and some Flutter experience.
          </p>

          <!-- Buttons -->
          <div class="flex sm:flex-row flex-col gap-4 lg:mt-4 mt-2">
            <button
              class="md:px-8 px-4 md:py-4 py-2 md:text-xl text-lg font-semibold outline outline-2 rounded-md cursor"
            >
              About Me
            </button>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
