export const handleSupabaseError = (error) => {
      if (!error) return null
      
      console.error('Supabase Error:', error)
      
      return {
        message: error.message || 'An unknown error occurred',
        code: error.code || 'UNKNOWN_ERROR',
        details: error.details || null,
        hint: error.hint || null
      }
    }
