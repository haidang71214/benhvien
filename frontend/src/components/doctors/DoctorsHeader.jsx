const DoctorsHeader = ({
  selectedSpecialty,
  loading,
  error,
  filteredDoctors,
  startIndex,
  doctorsPerPage,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {selectedSpecialty
              ? `${selectedSpecialty} Specialists`
              : "All Medical Professionals"}
          </h2>
          {!loading && !error && (
            <p className="text-gray-600 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              {filteredDoctors.length > 0
                ? `${startIndex + 1}-${Math.min(
                    startIndex + doctorsPerPage,
                    filteredDoctors.length
                  )} of ${filteredDoctors.length} doctors available`
                : "No doctors found"}
            </p>
          )}
        </div>

        {!loading && !error && filteredDoctors.length > 0 && (
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Available Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Verified</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsHeader;
