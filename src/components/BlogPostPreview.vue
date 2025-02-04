<template>
  <div class="bg-white shadow rounded-lg p-6">
    <h2 class="text-2xl font-semibold mb-2">
      <router-link :to="`/blog/${post.id}`" class="text-blue-600 hover:underline">
        {{ post.title }}
      </router-link>
    </h2>
    <p class="text-gray-600 mb-4">{{ formatDate(post.date) }}</p>
    <p class="mb-4">{{ post.excerpt }}</p>
    <div class="flex flex-wrap gap-2 mb-4">
      <span
        v-for="category in post.categories"
        :key="category"
        class="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm"
      >
        {{ category }}
      </span>
    </div>
    <router-link :to="`/blog/${post.id}`" class="text-blue-500 hover:underline">
      Read more
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }

    return {
      formatDate,
    }
  },
}
</script>
