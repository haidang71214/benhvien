const DoctorsHero = () => {
  return (
    <div className="pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-6">
          <span className="text-2xl mr-2">👩‍⚕️</span>
          <span className="text-sm font-medium text-gray-600">Tìm bác sĩ phù hợp với bạn</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Đội ngũ chuyên gia y tế của chúng tôi
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Khám phá các chuyên gia chăm sóc sức khỏe hàng đầu trong nhiều lĩnh vực y tế khác nhau
        </p>
      </div>
    </div>
  );
};

export default DoctorsHero;