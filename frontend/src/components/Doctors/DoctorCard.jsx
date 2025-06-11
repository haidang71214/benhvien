import { Link } from "react-router-dom";
const DoctorCard = ({ doctor }) => {
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
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={doctor.image || "/default-doctor-avatar.png"}
          alt={doctor.name}
          className="w-full h-48 object-cover"
          onError={(e) => (e.target.src = "/default-doctor-avatar.png")}
        />
        <span
          className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full ${
            doctor.source === "mongodb"
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {doctor.source === "mongodb" ? "Live" : "System"}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">{doctor.name}</h3>
          {doctor.isVerified && (
            <img src="/verified-icon.png" alt="Verified" className="w-5 h-5" />
          )}
        </div>
        <p className="text-gray-600 text-sm mt-1">{doctor.speciality}</p>
        <p className="text-gray-500 text-sm">{doctor.experience} experience</p>
        {renderStars(doctor.ratings)}
        <Link className="mt-4 block text-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Book Appointment
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;
