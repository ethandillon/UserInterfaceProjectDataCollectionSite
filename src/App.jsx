import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import UserInputForm from './components/UserInputForm'
import MovieSelection from './components/MovieSelection'
import './App.css'

function App() {
  const [userData, setUserData] = useState(null)

  const handleUserSubmit = (data) => {
    setUserData(data)
  }

  return (
    <div className="App">
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
