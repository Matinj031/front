<template>
  <div
    ref="contentRef"
    class="math-content"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  content: string
}>()

const contentRef = ref<HTMLElement | null>(null)
const { $renderMathInElement, $ensureMathJaxReady } = useNuxtApp()
const isRendering = ref(false)
const lastRenderedContent = ref('')

// Parse markdown links to clickable HTML
function parseLinks(text: string): string {
  if (!text) return ''

  // Replace [text](url) with clickable links
  return text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #0066cc; text-decoration: underline;">$1</a>',
  )
}

// Render math when content changes
async function renderContent() {
  if (!contentRef.value || !import.meta.client || isRendering.value) return

  // Skip if content hasn't changed
  if (lastRenderedContent.value === props.content) return

  isRendering.value = true

  try {
    // Set the HTML content
    contentRef.value.innerHTML = parseLinks(props.content)
    lastRenderedContent.value = props.content

    // Wait for DOM update
    await nextTick()

    // Wait for MathJax to be ready
    await $ensureMathJaxReady()

    // Small delay to ensure DOM is fully ready
    await new Promise(resolve => setTimeout(resolve, 100))

    // Render MathJax
    if (contentRef.value && window.MathJax?.Hub) {
      await $renderMathInElement(contentRef.value)
    }
  }
  catch (error) {
    console.error('Error rendering math content:', error)
  }
  finally {
    isRendering.value = false
  }
}

// Watch for content changes
watch(() => props.content, async () => {
  await renderContent()
})

// Initial render
onMounted(async () => {
  // Wait a bit to ensure MathJax is loaded
  await new Promise(resolve => setTimeout(resolve, 200))
  await renderContent()
})
</script>

<style scoped>
.math-content {
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.7 !important;
}

.math-content :deep(a) {
  color: #0066cc;
  text-decoration: underline;
  transition: color 0.2s;
}

.math-content :deep(a:hover) {
  color: #0052a3;
}

.math-content :deep(a:visited) {
  color: #551a8b;
}

.math-content :deep(.MathJax) {
  font-size: 1.1em !important;
}

.math-content :deep(.MathJax_Display) {
  margin: 0.5em 0 !important;
}
</style>
