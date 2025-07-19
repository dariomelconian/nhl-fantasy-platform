import React from 'react';

const Layout = ({ children, title = "NHL Fantasy Platform" }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                🏒 NHL Fantasy
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Dashboard
              </a>
              <a href="#players" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Players
              </a>
              <a href="#lineup" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Lineup
              </a>
              <a href="#league" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                League
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {title && title !== "NHL Fantasy Platform" && (
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          </div>
        )}
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            NHL Fantasy Platform - Built with React & NHL API
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;