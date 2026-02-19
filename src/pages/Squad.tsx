import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSquad } from '../context/SquadContext'

const Squad = () => {
  const { currentSquad } = useSquad()
  const navigate = useNavigate()

  // إذا كان المستخدم في سكواد، نوجهه إلى اللوبي
  React.useEffect(() => {
    if (currentSquad) {
      navigate('/lobby')
    }
  }, [currentSquad, navigate])

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4">
      <h1 className="text-2xl font-bold text-kilegram-blue">Squad</h1>
      <p className="text-gray-400 mt-4">You are not in a squad. Go to Home to create or join one.</p>
    </div>
  )
}

export default Squad