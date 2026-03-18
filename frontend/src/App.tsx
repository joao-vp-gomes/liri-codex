// frontend/src/App.tsx


import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import SignInPage from './pages/SignInPage/SignInPage';
import AuthTestPage from './pages/AuthTestPage';
import './index.css';
import { LanguageProvider } from './contexts/LanguageContext';


const AppRoutes: React.FC = () => {

    const { user, loading } = useAuth();
    if (loading) return null;

    return (
        <Routes>

            <Route
                path="/signin"
                element={
                    user ? 
                    <Navigate to="/home" replace /> : 
                    <SignInPage />
                }
            />

            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <AuthTestPage />
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <LanguageProvider>
                    <AppRoutes />
                </LanguageProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}


export default App;