const LoadingState = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20">
      <div className="flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="text-gray-600 mt-6 text-lg font-medium">Loading amazing doctors...</p>
        <p className="text-gray-500 text-sm mt-2">Please wait while we find the best specialists for you</p>
      </div>
    </div>
  );
};

export default LoadingState;