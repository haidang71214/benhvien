import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-700 px-6 md:px-20 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        
        <div>
          <div className="mb-5 text-2xl font-bold text-blue-600">HealthCare+</div>
          <p className="text-sm leading-6 text-gray-600">
            Chúng tôi cung cấp dịch vụ y tế trực tuyến tốt nhất và đội ngũ bác sĩ chuyên nghiệp 
            để hỗ trợ bạn bất cứ lúc nào. Được tin tưởng bởi hàng nghìn bệnh nhân.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Công Ty</h3>
          <ul className="space-y-2 text-sm">
            {["Trang Chủ", "Về Chúng Tôi", "Liên Hệ", "Chính Sách Bảo Mật", "Điều Khoản Dịch Vụ"].map((item) => (
              <li
                key={item}
                className="hover:text-blue-600 transition-colors cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Liên Hệ</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={16} /> (+84) 123 456 789
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> support@healthcare.vn
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} /> 123 Đường Sức Khỏe, Quận 1, TP.HCM
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t pt-6 text-xs text-gray-500 text-center">
        &copy; {new Date().getFullYear()} HealthCare+. Tất cả quyền được bảo lưu.
      </div>
    </footer>
  );
};

export default Footer;