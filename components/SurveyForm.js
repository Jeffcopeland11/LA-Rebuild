import { useState, useEffect } from 'react'
    import { supabase } from '../lib/supabaseClient'
    import { v4 as uuidv4 } from 'uuid'

    export default function SurveyForm({ user }) {
      const [formData, setFormData] = useState({
        location: '',
        needs: '',
        resources: ''
      })
      const [isOnline, setIsOnline] = useState(navigator.onLine)
      const [pendingSubmissions, setPendingSubmissions] = useState([])
      const [loading, setLoading] = useState(false)
      const [error, setError] = useState(null)

      const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const submission = {
          id: uuidv4(),
          ...formData,
          timestamp: new Date().toISOString(),
          user_id: user?.id || 'anonymous',
          status: isOnline ? 'submitted' : 'pending'
        }

        try {
          if (isOnline) {
            const { error } = await supabase
              .from('surveys')
              .insert([submission])
            
            if (error) throw error
          } else {
            const submissions = JSON.parse(localStorage.getItem('pendingSubmissions') || '[]')
            submissions.push(submission)
            localStorage.setItem('pendingSubmissions', JSON.stringify(submissions))
            setPendingSubmissions(submissions)
          }
        } catch (err) {
          console.error('Submission error:', err)
          setError(err.message)
          if (isOnline) {
            // Store locally if online submission fails
            const submissions = JSON.parse(localStorage.getItem('pendingSubmissions') || '[]')
            submissions.push(submission)
            localStorage.setItem('pendingSubmissions', JSON.stringify(submissions))
            setPendingSubmissions(submissions)
          }
        } finally {
          setLoading(false)
          if (!error) {
            setFormData({
              location: '',
              needs: '',
              resources: ''
            })
          }
        }
      }

      const syncPendingSubmissions = async () => {
        const submissions = JSON.parse(localStorage.getItem('pendingSubmissions') || '[]')
        if (submissions.length > 0) {
          try {
            const { error } = await supabase
              .from('surveys')
              .insert(submissions)
            
            if (error) throw error
            
            localStorage.removeItem('pendingSubmissions')
            setPendingSubmissions([])
          } catch (err) {
            console.error('Sync error:', err)
          }
        }
      }

      useEffect(() => {
        const handleConnectionChange = () => {
          const online = navigator.onLine
          setIsOnline(online)
          if (online && pendingSubmissions.length > 0) {
            syncPendingSubmissions()
          }
        }

        window.addEventListener('online', handleConnectionChange)
        window.addEventListener('offline', handleConnectionChange)
        
        return () => {
          window.removeEventListener('online', handleConnectionChange)
          window.removeEventListener('offline', handleConnectionChange)
        }
      }, [pendingSubmissions])

      return (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Emergency Survey</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Form fields remain the same */}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
              {!isOnline && (
                <p className="text-sm text-yellow-600 mt-2">
                  You are offline. Data will be stored locally and synced when online.
                </p>
              )}
            </div>
          </form>
        </div>
      )
    }
