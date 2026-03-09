// frontend/src/App.tsx

import { AuthProvider } from './contexts/AuthContext'
import './index.css'
import LoginPage from './pages/LoginPage'

function App() {

  return (
    <>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </>
  )
}

export default App
