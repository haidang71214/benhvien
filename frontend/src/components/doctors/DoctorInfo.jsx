import { Info } from "lucide-react";
import { assets } from "../../assets/data/doctors";

const DoctorInfo = ({ docInfo, currencySymbol }) => {
  if (!docInfo) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-pink-100 shadow">
        <p className="text-gray-500">Đang tải thông tin bác sĩ...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full lg:w-1/3 border border-pink-100">
      <img
        src={docInfo.image}
        alt={docInfo.name}
        className="rounded-xl w-full h-64 object-cover border-4 border-pink-200 shadow"
      />
      <h2 className="text-2xl font-bold text-pink-600 mt-4 flex items-center gap-2">
        {docInfo.name}
        <img className="w-5" src={assets.verified_icon} alt="Verified" />
      </h2>
      <p className="text-sm text-gray-600 mt-1">
        {docInfo.degree} • {docInfo.speciality}
      </p>
      <div className="mt-2 text-sm font-medium bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full inline-block">
        {docInfo.experience} experience
      </div>
      <div className="mt-4">
        <p className="flex items-center text-purple-700 font-semibold gap-2 mb-1">
          <Info className="w-4 h-4" /> About
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">{docInfo.about}</p>
      </div>
      <p className="text-green-600 font-bold mt-4">
        💰 Fee: {currencySymbol}
        {docInfo.fees}
      </p>
    </div>
  );
};

export default DoctorInfo;