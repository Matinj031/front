<script setup lang="ts">
/**
 * Sources List Component
 * Displays clickable source links from AI responses
 */

interface Source {
  type: 'blog' | 'school' | 'multimedia'
  title: string
  url: string
  score?: number
}

interface Props {
  sources: Source[]
  class?: string
}

const props = defineProps<Props>()

function getSourceEmoji(type: string): string {
  switch (type) {
    case 'blog': return '📝'
    case 'school': return '🏫'
    case 'multimedia': return '🎬'
    default: return '🔗'
  }
}
</script>

<template>
  <div
    v-if="props.sources && props.sources.length > 0"
    :class="props.class"
    class="sources-section"
  >
    <div class="sources-header">
      <v-icon
        size="18"
        class="mr-1"
      >
        md:library_books
      </v-icon>
      <span class="gama-text-caption font-weight-bold">منابع مرتبط / Related Sources</span>
    </div>

    <v-list
      density="compact"
      class="sources-list"
    >
      <v-list-item
        v-for="(source, index) in props.sources"
        :key="index"
        :href="source.url"
        target="_blank"
        rel="noopener noreferrer"
        class="source-item"
      >
        <template #prepend>
          <span class="source-emoji">{{ getSourceEmoji(source.type) }}</span>
        </template>

        <v-list-item-title class="source-title">
          {{ source.title }}
        </v-list-item-title>

        <template #append>
          <v-icon
            size="16"
            color="grey-lighten-1"
          >
            md:open_in_new
          </v-icon>
        </template>
      </v-list-item>
    </v-list>

    <div class="sources-footer">
      <v-icon
        size="14"
        class="mr-1"
      >
        md:info
      </v-icon>
      <span class="gama-text-caption text-grey-lighten-1">
        کلیک روی لینک‌ها برای مطالعه بیشتر
      </span>
    </div>
  </div>
</template>

<style scoped>
.sources-section {
  margin-top: 12px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border-left: 3px solid #0066cc;
}

.sources-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: #333;
}

.sources-list {
  background: transparent;
  padding: 0;
}

.source-item {
  border-radius: 6px;
  margin-bottom: 4px;
  transition: background-color 0.2s;
  cursor: pointer;
}

.source-item:hover {
  background-color: rgba(0, 102, 204, 0.05);
}

.source-emoji {
  font-size: 18px;
  margin-right: 8px;
}

.source-title {
  font-size: 13px;
  color: #0066cc;
  text-decoration: none;
}

.source-item:hover .source-title {
  text-decoration: underline;
}

.sources-footer {
  display: flex;
  align-items: center;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}
</style>
