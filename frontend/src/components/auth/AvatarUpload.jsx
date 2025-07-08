const AvatarUpload = ({ preview, fullName, handleImageChange, removeImage }) => {
  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
        Ảnh đại diện
      </h3>
      <div className="flex items-center gap-8">
        <div className="relative">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-24 h-24 rounded-2xl object-cover shadow-lg border border-slate-200"
            />
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {fullName ? fullName.charAt(0).toUpperCase() : "U"}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap gap-3 mb-3">
            <label className="cursor-pointer px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Tải ảnh lên
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={removeImage}
              className="px-6 py-3 bg-white text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Xóa ảnh
            </button>
          </div>
          <p className="text-sm text-slate-500">
            JPG, PNG hoặc GIF tối đa 5MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;