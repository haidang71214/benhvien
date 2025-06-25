const ErrorState = ({ error, onRetry }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-3xl">⚠️</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-red-500 mb-6 text-lg">{error}</p>
        <button
          onClick={onRetry}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
