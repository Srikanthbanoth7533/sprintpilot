import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProductProvider } from './context/ProductContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { CreateStoryModal } from './components/CreateStoryModal';

// Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { RequirementsPage } from './pages/RequirementsPage';
import { BacklogPage } from './pages/BacklogPage';
import { SprintsPage } from './pages/SprintsPage';
import { BoardPage } from './pages/BoardPage';
import { ReleasesPage } from './pages/ReleasesPage';
import { TeamPage } from './pages/TeamPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [createStoryModalOpen, setCreateStoryModalOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Intercept anchor tag navigation for client-side SPA routing
  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target.closest('a');
      if (
        target &&
        target.origin === window.location.origin &&
        !target.hasAttribute('download') &&
        target.target !== '_blank' &&
        !e.ctrlKey &&
        !e.metaKey
      ) {
        e.preventDefault();
        window.history.pushState({}, '', target.pathname);
        setCurrentPath(target.pathname);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-medium">Initializing SprintPilot workspace...</p>
        </div>
      </div>
    );
  }

  // Public unauthenticated routes
  if (currentPath === '/login') {
    return <LoginPage />;
  }
  if (currentPath === '/register') {
    return <RegisterPage />;
  }

  // Root redirect
  if (currentPath === '/' || !isAuthenticated) {
    if (!isAuthenticated) {
      return <LoginPage />;
    }
  }

  const renderPage = () => {
    switch (currentPath) {
      case '/dashboard':
      case '/':
        return <DashboardPage />;
      case '/products':
        return <ProductsPage />;
      case '/requirements':
        return <RequirementsPage />;
      case '/backlog':
        return <BacklogPage />;
      case '/sprints':
        return <SprintsPage />;
      case '/board':
        return <BoardPage />;
      case '/releases':
        return <ReleasesPage />;
      case '/team':
        return <TeamPage />;
      case '/analytics':
        return <AnalyticsPage />;
      case '/ai-assistant':
        return <AiAssistantPage />;
      case '/settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
        <Sidebar currentPath={currentPath} />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar onOpenCreateStory={() => setCreateStoryModalOpen(true)} />
          <main className="flex-1 overflow-y-auto">
            {renderPage()}
          </main>
        </div>

        <CreateStoryModal
          isOpen={createStoryModalOpen}
          onClose={() => setCreateStoryModalOpen(false)}
        />
      </div>
    </ProtectedRoute>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ProductProvider>
          <AppContent />
        </ProductProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
