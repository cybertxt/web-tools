import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Web Tools Platform
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            A modern, multilingual web platform for developer tools
          </p>
        </header>

        <main className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-8">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary-600 mb-4">
                {count}
              </div>
              <button
                onClick={() => setCount((count) => count + 1)}
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Click me
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                React + TypeScript + Vite setup is working!
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App 