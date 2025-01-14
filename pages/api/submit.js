import { supabase } from '../../lib/supabaseClient'

    export default async function handler(req, res) {
      if (req.method === 'POST') {
        try {
          const { data, error } = await supabase
            .from('surveys')
            .insert([req.body])
          
          if (error) throw error

          res.status(200).json({ success: true })
        } catch (err) {
          res.status(500).json({ error: err.message })
        }
      } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
      }
    }
