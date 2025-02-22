<template>
  <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-1/2">
      <h2 class="text-xl font-semibold mb-4">Confirm Post Details</h2>
      <div class="mb-4">
        <h3 class="text-lg font-semibold">Title</h3>
        <p>{{ post.title }}</p>
      </div>
      <div class="mb-4">
        <h3 class="text-lg font-semibold">Content</h3>
        <p v-html="post.content"></p>
      </div>
      <div class="mb-4">
        <h3 class="text-lg font-semibold">Tags</h3>
        <div class="flex flex-wrap gap-2 mb-2">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="bg-indigo-100 text-indigo-600 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
          >
            {{ tag }}
          </span>
        </div>
        <input
          v-model="newTag"
          @keyup.enter="addTag"
          type="text"
          placeholder="Add a tag"
          class="border border-gray-300 rounded-md px-2 py-1 w-full"
        />
        <button
          @click="addTag"
          class="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add Tag
        </button>
      </div>
      <div class="flex justify-end space-x-4">
        <button
          @click="onCancel"
          class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          @click="onConfirm"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  visible: Boolean,
  post: Object,
})

const emit = defineEmits(['cancel', 'confirm'])

const newTag = ref('')

const onCancel = () => {
  emit('cancel')
}

const onConfirm = () => {
  emit('confirm')
}

const addTag = () => {
  if (newTag.value.trim() !== '') {
    props.post.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}
</script>
