import React from "react";
import { Info, Award, Clock, MessageCircle } from "lucide-react";
import { assets } from "../../assets/data/doctors";

const DoctorInfoCard = ({ docInfo, conversationId, onChatAction }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-0 w-full lg:w-1/3 border border-gray-100 overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300">
      {/* Header Image Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 z-10"></div>
        <img
          src={docInfo.avatarUrl}
          alt={docInfo.userName}
          className="w-full h-72 object-cover transition-transform duration-300 hover:scale-105"
        />

        {/* Verified Badge */}
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-white/95 backdrop-blur-sm text-emerald-600 px-3 py-2 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2 border border-emerald-100">
            <img
              className="w-4 h-4"
              src={assets.verified_icon}
              alt="Verified"
            />
            <span>Đã xác thực</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col space-y-4">
        {/* Doctor Name & Title */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800 leading-tight">
            {docInfo.userName}
          </h2>
          <p className="text-gray-600 font-medium flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-500" />
            {docInfo.degree}
          </p>
        </div>

        {/* Speciality & Experience */}
        <div className="space-y-3">
          <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-100">
            {Array.isArray(docInfo.speciality)
              ? docInfo.speciality.join(", ")
              : docInfo.speciality}
          </div>

          <div className="inline-flex items-center bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-medium border border-amber-100 ml-2">
            <Clock className="w-4 h-4 mr-2" />
            {docInfo.experience} kinh nghiệm
          </div>
        </div>

        {/* About Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-700 font-semibold">
            <Info className="w-4 h-4 text-indigo-500" />
            <span className="text-sm">Thông tin bác sĩ</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border-l-4 border-indigo-200">
            {docInfo.about}
          </p>
        </div>

        {/* Chat Button */}
        <button
          onClick={onChatAction}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <MessageCircle className="w-4 h-4" />
          {conversationId ? "Tiếp tục chat" : "Bắt đầu chat"}
        </button>

        {/* Fee Section */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-4 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-xl">💰</span>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Phí khám</p>
                <p className="text-lg font-bold text-emerald-700">
                  {docInfo.fees
                    ? `${docInfo.fees.toLocaleString()}đ`
                    : "Miễn phí"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorInfoCard;