<template>
  <div class="bg-white p-4 flex flex-col gap-2 rounded shadow-lg">
    <h2 class="text-xl text-[#3434E0] font-semibold">
      Unable to load flights... :(
    </h2>
    <p>
      If the problem persists, please
      <a class="underline" href="mailto:venyigebalazs96@gmail.com">contact</a>
      our support team.
    </p>
    <div>
      <NuxtLink class="inline-block bg-[#C5007D] text-white py-4 px-8" to="/">
        Restart booking
      </NuxtLink>
    </div>
  </div>
</template>
