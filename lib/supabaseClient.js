import { createClient } from '@supabase/supabase-js'

    // Initialize Supabase client with error handling
    const initializeSupabase = () => {
      try {
        const supabaseUrl = 'https://mxgqigykmmnaloxbobmy.supabase.co'
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14Z3FpZ3lrbW1uYWxveGJvYm15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3OTU4NjcsImV4cCI6MjA1MjM3MTg2N30.CLzuhYFCjk4EYeok-7sizn-2uhZFduwg7_-LW94O7a4'

        if (!supabaseUrl || !supabaseKey) {
          throw new Error('Missing Supabase URL or Anon Key')
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        // Test connection
        const testConnection = async () => {
          const { error } = await supabase
            .from('surveys')
            .select('*')
            .limit(1)
          
          if (error) {
            throw new Error(`Supabase connection error: ${error.message}`)
          }
        }

        // Return client with connection test
        return {
          client: supabase,
          testConnection
        }
      } catch (error) {
        console.error('Supabase initialization error:', error)
        throw new Error('Failed to initialize Supabase client')
      }
    }

    const { client: supabase, testConnection } = initializeSupabase()

    // Export initialized client and connection test
    export { supabase, testConnection }
