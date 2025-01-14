import { useState, useEffect } from 'react'
    import { supabase } from '../lib/supabaseClient'
    import SurveyForm from '../components/SurveyForm'
    import ResourceTracker from '../components/ResourceTracker'

    export default function Home() {
      const [user, setUser] = useState(null)
      const [loading, setLoading] = useState(true)

      useEffect(() => {
        checkUser()
        window.addEventListener('online', handleConnectionChange)
        window.addEventListener('offline', handleConnectionChange)
        return () => {
          window.removeEventListener('online', handleConnectionChange)
          window.removeEventListener('offline', handleConnectionChange)
        }
      }, [])

      const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        setLoading(false)
      }

      const handleConnectionChange = () => {
        console.log(navigator.onLine ? 'Online' : 'Offline')
      }

      return (
        <div className="min-h-screen bg-gray-100">
          <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Emergency Response System</h1>
            {!loading && (
              <>
                <SurveyForm user={user} />
                <ResourceTracker />
              </>
            )}
          </main>
        </div>
      )
    }
