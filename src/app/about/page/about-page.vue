<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl font-bold text-gray-900 mb-8">About Blog AP</h1>

    <div class="bg-white rounded-lg shadow-md p-8 space-y-6">
      <p class="text-lg text-gray-700">
        Blog AP is a modern blogging platform dedicated to sharing knowledge and insights about web
        development, technology, and programming. Our mission is to provide high-quality content
        that educates and inspires developers of all skill levels.
      </p>

      <h2 class="text-2xl font-semibold text-gray-800">Our Story</h2>
      <p class="text-gray-700">
        Founded in 2023, Blog AP started as a small project by a group of passionate developers who
        wanted to create a space for sharing their experiences and learning from others. Since then,
        we've grown into a vibrant community of writers and readers, all united by our love for
        technology and continuous learning.
      </p>

      <h2 class="text-2xl font-semibold text-gray-800">What We Offer</h2>
      <ul class="list-disc list-inside text-gray-700 space-y-2">
        <li>In-depth tutorials on the latest web technologies</li>
        <li>Insights into industry trends and best practices</li>
        <li>Tips and tricks for improving your coding skills</li>
        <li>Guest posts from industry experts</li>
        <li>A platform for developers to share their own experiences</li>
      </ul>

      <h2 class="text-2xl font-semibold text-gray-800">Join Our Community</h2>
      <p class="text-gray-700">
        We believe in the power of community and continuous learning. Whether you're a seasoned
        developer or just starting your journey, we invite you to join our community. Share your
        knowledge, ask questions, and grow with us.
      </p>

      <div class="mt-8">
        <router-link
          to="/auth/login"
          class="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Join Blog AP
        </router-link>
      </div>
    </div>
  </div>
</template>
