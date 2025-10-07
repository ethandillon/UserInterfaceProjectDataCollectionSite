import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import UserInputForm from './components/UserInputForm'
import MovieSelection from './components/MovieSelection'
import Survey from './components/Survey'
import Debrief from './components/Debrief'

function App() {
  const [userData, setUserData] = useState(null)

  const handleUserSubmit = (data) => {
    setUserData(data)
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          userData ? 
            <Navigate to="/movies" replace /> : 
            <UserInputForm onUserSubmit={handleUserSubmit} />
        } 
      />
      <Route 
        path="/movies" 
        element={
          userData ? 
            <MovieSelection userData={userData} /> : 
            <Navigate to="/" replace />
        } 
      />
      <Route 
        path="/survey" 
        element={
          userData ? 
            <Survey userData={userData} /> : 
            <Navigate to="/" replace />
        } 
      />
      <Route 
        path="/debrief" 
        element={
          userData ? 
            <Debrief userData={userData} /> : 
            <Navigate to="/" replace />
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
