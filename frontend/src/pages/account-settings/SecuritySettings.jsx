import { useState } from "react";

const SecuritySettings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const securityOptions = [
    {
      title: "Xác thực hai yếu tố (2FA)",
      description: "Thêm lớp bảo mật bổ sung cho tài khoản của bạn",
      enabled: twoFactorEnabled,
      onToggle: () => setTwoFactorEnabled(!twoFactorEnabled),
      type: "toggle",
    }
  ];

  const handleSaveSettings = () => {};

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">
        Cài đặt bảo mật
      </h1>
      <p className="text-slate-600 mb-8">
        Quản lý các tùy chọn bảo mật và xác thực của bạn.
      </p>

      <div className="space-y-6">
        {securityOptions.map((option, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-800 mb-1">
                  {option.title}
                </h3>
                <p className="text-slate-600 text-sm">{option.description}</p>
              </div>

              <div className="ml-6">
                {option.type === "toggle" ? (
                  <button
                    onClick={option.onToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      option.enabled ? "bg-blue-500" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        option.enabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                ) : (
                  <select
                    value={option.value}
                    onChange={(e) => option.onChange(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {option.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="flex gap-4">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
          >
            Lưu cài đặt
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;