/**
 * Gamatrain AI Composable (v2.0)
 *
 * Features:
 * - RAG-powered responses
 * - Streaming support
 * - Conversation memory (session-based)
 * - Confidence scores
 *
 * Configure via .env:
 * - NUXT_PUBLIC_AI_API_URL: Base URL (e.g., http://localhost:8000)
 *
 * Usage:
 * ```vue
 * <script setup>
 * const { query, queryStream, loading, error, sessionId } = useGamatrainAI()
 *
 * // Normal response
 * const response = await query('What is Gamatrain?')
 *
 * // Streaming response
 * await queryStream('What is Gamatrain?', (token) => {
 *   console.log(token) // Each token as it arrives
 * })
 * </script>
 * ```
 */

interface QueryResponse {
  query: string
  response: string
  confidence: 'high' | 'medium' | 'low' | 'direct'
  similarity_score: number
  session_id: string
  source: 'rag' | 'llm'
  sources?: Source[]
}

interface Source {
  type: 'blog' | 'school' | 'multimedia'
  title: string
  url: string
  score?: number
}

interface StreamToken {
  token: string
  done: boolean
  error?: string
  sources?: Source[]
  has_sources?: boolean
}

export type { Source }

export const useGamatrainAI = () => {
  const config = useRuntimeConfig()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const sessionId = ref(`session_${Date.now()}_${Math.random().toString(36).slice(2)}`)
  const lastConfidence = ref<string | null>(null)
  const lastScore = ref<number | null>(null)

  const baseUrl = computed(() =>
    config.public.aiApiUrl || 'http://localhost:8000',
  )

  /**
   * Query the AI with RAG (non-streaming)
   */
  const query = async (
    prompt: string,
    options?: {
      useRag?: boolean
    },
  ): Promise<string> => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<QueryResponse>(`${baseUrl.value}/v1/query`, {
        method: 'POST',
        body: {
          query: prompt,
          session_id: sessionId.value,
          use_rag: options?.useRag ?? true,
          stream: false,
        },
      })

      lastConfidence.value = response.confidence
      lastScore.value = response.similarity_score

      return response.response
    }
    catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      error.value = errorMessage || 'An error occurred'
      throw err
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Query the AI with streaming response
   */
  const queryStream = async (
    prompt: string,
    onToken: (token: string, done: boolean, sources?: Source[]) => void,
    options?: {
      useRag?: boolean
    },
  ): Promise<string> => {
    loading.value = true
    error.value = null
    let fullResponse = ''

    try {
      const response = await fetch(`${baseUrl.value}/v1/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: prompt,
          session_id: sessionId.value,
          use_rag: options?.useRag ?? true,
          stream: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No reader available')
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data: StreamToken = JSON.parse(line.slice(6))

              if (data.error) {
                throw new Error(data.error)
              }

              fullResponse += data.token
              onToken(data.token, data.done, data.sources)

              if (data.done) {
                loading.value = false
              }
            }
            catch (e) {
              console.error('Error parsing stream data:', e)
              // Skip invalid JSON lines
            }
          }
        }
      }

      return fullResponse
    }
    catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      error.value = errorMessage || 'An error occurred'
      throw err
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Clear conversation memory and start new session
   */
  const clearSession = async (): Promise<void> => {
    try {
      await $fetch(`${baseUrl.value}/v1/session/${sessionId.value}`, {
        method: 'DELETE',
      })
    }
    catch {
      // Ignore errors
    }

    // Generate new session ID
    sessionId.value = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`
    lastConfidence.value = null
    lastScore.value = null
  }

  /**
   * Check if API is healthy
   */
  const healthCheck = async (): Promise<boolean> => {
    try {
      const response = await $fetch<{ status: string }>(`${baseUrl.value}/health`)
      return response.status === 'healthy'
    }
    catch {
      return false
    }
  }

  /**
   * Legacy generate function (for backward compatibility)
   * @deprecated Use query() instead
   */
  const generate = async (
    prompt: string,
    options?: {
      systemPrompt?: string
    },
  ): Promise<string> => {
    const fullPrompt = options?.systemPrompt
      ? `${options.systemPrompt}\n\nUser: ${prompt}`
      : prompt

    return query(fullPrompt, { useRag: true })
  }

  /**
   * Legacy chat function (for backward compatibility)
   * @deprecated Use query() with session instead
   */
  const chat = async (messages: Array<{ role: string, content: string }>): Promise<string> => {
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()
    return query(lastUserMessage?.content || '')
  }

  return {
    // New API
    query,
    queryStream,
    clearSession,
    healthCheck,

    // Legacy API (backward compatible)
    generate,
    chat,

    // State
    loading: readonly(loading),
    error: readonly(error),
    sessionId: readonly(sessionId),
    lastConfidence: readonly(lastConfidence),
    lastScore: readonly(lastScore),
  }
}
