const DoctorsHero = () => {
  return (
    <div className="pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-6">
          <span className="text-2xl mr-2">👩‍⚕️</span>
          <span className="text-sm font-medium text-gray-600">Find Your Perfect Doctor</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Our Medical Experts
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Discover top-rated healthcare professionals specialized in various medical fields
        </p>
      </div>
    </div>
  );
};

export default DoctorsHero;