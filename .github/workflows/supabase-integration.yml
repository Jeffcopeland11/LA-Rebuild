import { supabase } from './supabaseClient'
    import { handleSupabaseError } from './supabaseErrorHandler'

    export const submitSurvey = async (surveyData) => {
      try {
        const { data, error } = await supabase
          .from('surveys')
          .insert([surveyData])
          .select()

        if (error) throw error

        // Track survey submission in GitHub
        await trackGitHubActivity('survey_submission', {
          survey_id: data[0].id,
          timestamp: new Date().toISOString()
        })

        return {
          success: true,
          data
        }
      } catch (error) {
        return {
          success: false,
          error: handleSupabaseError(error)
        }
      }
    }

    const trackGitHubActivity = async (eventType, payload) => {
      try {
        const response = await fetch('/api/github/activity', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event_type: eventType,
            payload
          })
        })

        if (!response.ok) {
          throw new Error('Failed to track GitHub activity')
        }
      } catch (error) {
        console.error('GitHub activity tracking error:', error)
      }
    }
