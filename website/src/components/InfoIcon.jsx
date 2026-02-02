import { useState } from 'react'

function InfoIcon({ title, content }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="text-blue-400 hover:text-blue-300 transition-colors ml-2 focus:outline-none"
        aria-label="Information"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 z-50 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl p-4 text-sm">
          <div className="mb-2">
            <h4 className="text-white font-semibold text-base">{title}</h4>
          </div>
          <div className="text-gray-300 space-y-2">
            {content}
          </div>
          <div className="absolute -top-2 right-4 w-4 h-4 bg-gray-800 border-t border-l border-gray-600 transform rotate-45"></div>
        </div>
      )}
    </div>
  )
}

export default InfoIcon
