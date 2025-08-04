<template>
  <form>
    <div class="bg-white pb-[20px] rounded-b-[2px]">
      <div
        class="bg-[#06038D] flex items-center p-[15px] gap-[15px] rounded-t-[2px]"
      >
        <img
          src="/mito-airline-logo.svg"
          alt=""
          aria-hidden="true"
          class="w-[28px] h-[28px]"
        />
        <h2 class="text-white uppercase text-[17px] mb-[-3px]">Mito airline</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 p-[25px]">
        <!-- Origin -->
        <div class="flex flex-col">
          <label for="origin">Origin</label>
          <input type="text" id="origin" />
        </div>
        <!-- Destination -->
        <div class="flex flex-col">
          <label for="destination">Destination</label>
          <input type="text" id="destination" />
        </div>
        <!-- Departure -->
        <div class="flex flex-col">
          <label for="departure">Departure</label>
          <input type="date" id="departure" />
        </div>
        <!-- Return -->
        <div class="flex flex-col">
          <label for="Return">Return</label>
          <input type="date" id="return" />
        </div>
      </div>
      <div class="flex justify-center">
        <button
          type="submit"
          class="bg-[#3434E0] text-white py-[15px] px-[80px] rounded-[3px] text-[18px]"
        >
          Search
        </button>
      </div>
    </div>
  </form>
</template>
