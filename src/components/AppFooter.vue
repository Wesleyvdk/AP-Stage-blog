<template>
  <footer class="bg-gray-800 text-white mt-auto">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-lg font-semibold mb-4">About Us</h3>
          <p class="text-gray-400">
            Deze website is om de stage portfolio van Wesley van der Kraan bij te houden.
          </p>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/" class="text-gray-400 hover:text-white">Home</router-link>
            </li>
            <li>
              <router-link to="/blog" class="text-gray-400 hover:text-white">Blog</router-link>
            </li>
            <li>
              <router-link to="/about" class="text-gray-400 hover:text-white">About</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
