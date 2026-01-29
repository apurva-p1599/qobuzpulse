function ErrorMessage({ error, onRetry }) {
  return (
    <div className="card bg-red-900/20 border-red-800">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">⚠️</span>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-400 mb-1">Error Loading Data</h3>
          <p className="text-red-300">{error}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-secondary text-sm"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage

