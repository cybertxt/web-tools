import React from 'react';

export const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About Developer Tools
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Simple, fast, and secure online tools for developers. Built with modern web technologies.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              What We Offer
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white flex items-center">
                  <span className="text-2xl mr-3">🔧</span>
                  Essential Tools
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Base64, JSON, URL, HTML, and Unicode encoding/decoding tools for daily development tasks.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white flex items-center">
                  <span className="text-2xl mr-3">⚡</span>
                  Fast Processing
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Instant results with client-side processing - no waiting, no server delays.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white flex items-center">
                  <span className="text-2xl mr-3">🔒</span>
                  Privacy Focused
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your data never leaves your browser. Everything is processed locally and securely.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              Technology Stack
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                  Frontend
                </h3>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• React 18 with TypeScript</li>
                  <li>• Vite for fast development</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Zustand for state management</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                  Backend
                </h3>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Go with Gin framework</li>
                  <li>• RESTful API design</li>
                  <li>• SQLite database</li>
                  <li>• Structured logging</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Open Source & Free
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              This project is open source and completely free to use. 
              No registration required, no data collection, no limits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 