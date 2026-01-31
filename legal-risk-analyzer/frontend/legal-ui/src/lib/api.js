import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const analyzeText = async (text) => {
  try {
    const response = await api.post('/analyze', { text })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to analyze text')
  }
}

export const analyzeFile = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/analyze-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to analyze file')
  }
}

export default api

