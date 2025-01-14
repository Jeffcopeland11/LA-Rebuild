import { useState, useEffect } from 'react'
    import { supabase } from '../lib/supabaseClient'

    export default function ResourceTracker() {
      const [resources, setResources] = useState([])
      const [loading, setLoading] = useState(true)

      useEffect(() => {
        fetchResources()
        const subscription = supabase
          .channel('resources')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'resources' }, handleResourceChange)
          .subscribe()

        return () => {
          subscription.unsubscribe()
        }
      }, [])

      const fetchResources = async () => {
        try {
          const { data, error } = await supabase
            .from('resources')
            .select('*')
            .order('priority', { ascending: true })
          
          if (error) throw error
          setResources(data)
          setLoading(false)
        } catch (error) {
          console.error('Error fetching resources:', error)
        }
      }

      const handleResourceChange = (payload) => {
        setResources((prev) => {
          const existing = prev.find(r => r.id === payload.new.id)
          if (existing) {
            return prev.map(r => r.id === payload.new.id ? payload.new : r)
          }
          return [payload.new, ...prev]
        })
      }

      return (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Resource Tracking</h2>
          {loading ? (
            <p>Loading resources...</p>
          ) : (
            <div className="space-y-4">
              {resources.map(resource => (
                <div key={resource.id} className="p-4 border rounded-lg">
                  <h3 className="font-medium">{resource.name}</h3>
                  <p className="text-sm text-gray-600">Quantity: {resource.quantity}</p>
                  <p className="text-sm text-gray-600">Location: {resource.location}</p>
                  <p className="text-sm text-gray-600">Priority: {resource.priority}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }
