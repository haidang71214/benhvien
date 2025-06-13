const DoctorInfoCard = ({ doctor }) => {
  const renderStars = (rating) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4 text-yellow-400"
          fill={i < Math.floor(rating) ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ))}
      <span className="text-sm text-gray-600">
        ({doctor.totalReviews || 0} reviews)
      </span>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10">
      <div className="bg-gradient-to-r h-32"></div>
      <div className="relative px-6 md:px-10 pb-10 -mt-20">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="relative">
            <img
              src={doctor.image || "/default-doctor-avatar.png"}
              alt={doctor.name}
              className="w-40 h-40 rounded-2xl border-4 border-white shadow-lg"
              onError={(e) => (e.target.src = "/default-doctor-avatar.png")}
            />
            <span
              className={`absolute -top-2 -right-2 px-2 py-1 text-xs font-medium rounded-full ${
                doctor.source === "mongodb"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {doctor.source === "mongodb" ? "Live" : "System"}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              {doctor.name}
              {doctor.isVerified && (
                <img
                  src="/verified-icon.png"
                  alt="Verified"
                  className="w-6 h-6"
                />
              )}
            </h2>
            <p className="text-gray-600 mt-1 mb-2 text-lg">
              {doctor.degree} - {doctor.speciality}
            </p>
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {doctor.experience} experience
              </span>
              {doctor.ratings && renderStars(doctor.ratings)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2 text-gray-700">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {doctor.languages.map((lang, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-gray-700">
                  Available Days
                </h4>
                <div className="flex flex-wrap gap-2">
                  {doctor.availableDays.map((day, i) => (
                    <span
                      key={i}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">About</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {doctor.about}
              </p>
            </div>
            <div className="mt-4 text-right">
              <span className="text-3xl font-bold text-blue-600">
                ${doctor.fees}
              </span>
              <span className="text-gray-500 ml-2">per visit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorInfoCard