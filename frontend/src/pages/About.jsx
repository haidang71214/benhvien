import { Mail, Phone, MapPin, Heart, Users, Clock, Shield } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="relative pt-24 overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white">
        <div className="relative text-center py-20 px-4">
          <div className="inline-block">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Về <span className="text-yellow-300">Chúng Tôi</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-pink-400 mx-auto rounded-full"></div>
          </div>
          <p className="text-xl md:text-2xl mt-6 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Nền tảng chăm sóc sức khỏe đáng tin cậy, hiện đại và thân thiện với
            người dùng
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-16 items-center mb-20">
          <div className="lg:w-1/2">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <img
                className="relative w-full rounded-2xl shadow-2xl transform group-hover:scale-105 transition duration-500"
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Về chúng tôi"
              />
            </div>
          </div>

          <div className="lg:w-1/2 space-y-6">
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                Chào mừng bạn đến với nền tảng chăm sóc sức khỏe đáng tin cậy
                của chúng tôi. Chúng tôi cam kết cung cấp các dịch vụ y tế chất
                lượng cao, tiện lợi, đáng tin cậy và thân thiện với người dùng.
              </p>
              <p className="text-lg">
                Với đội ngũ bác sĩ giàu kinh nghiệm và hệ thống đặt lịch hẹn
                trực tuyến thông minh, bạn có thể dễ dàng kết nối với các chuyên
                gia phù hợp chỉ với vài cú nhấp chuột.
              </p>
              <p className="text-lg">
                Phương pháp tiếp cận lấy bệnh nhân làm trung tâm đảm bảo rằng
                mọi bước trong hành trình chăm sóc sức khỏe của bạn đều diễn ra
                suôn sẻ, an toàn và hiệu quả.
              </p>
              <p className="text-lg font-semibold text-blue-600">
                Hãy để chúng tôi trở thành đối tác đáng tin cậy trong việc chăm
                sóc sức khỏe lâu dài của bạn—vì sức khỏe của bạn luôn là ưu tiên
                hàng đầu của chúng tôi.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Tại Sao Chọn{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Chúng Tôi?
            </span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: Clock,
              title: "Hiệu Quả",
              description:
                "Nền tảng của chúng tôi đơn giản hóa quy trình chăm sóc sức khỏe, giúp bạn đặt lịch hẹn, truy cập hồ sơ y tế và tư vấn với bác sĩ một cách nhanh chóng và liền mạch.",
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              icon: Users,
              title: "Tiện Lợi",
              description:
                "Dù bạn đang ở nhà hay đang di chuyển, giao diện thân thiện của chúng tôi cho phép bạn quản lý sức khỏe bất cứ lúc nào, bất cứ nơi đâu.",
              gradient: "from-purple-500 to-pink-500",
            },
            {
              icon: Heart,
              title: "Cá Nhân Hóa",
              description:
                "Chúng tôi điều chỉnh dịch vụ để phù hợp với nhu cầu sức khỏe cá nhân của bạn, cung cấp các gợi ý và lời nhắc nhở tạo nên trải nghiệm thực sự dành riêng cho bạn.",
              gradient: "from-green-500 to-emerald-500",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-50"></div>
              <div className="relative p-8 text-center">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <item.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
              ></div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-16 h-16 bg-green-500 rounded-full opacity-10 animate-pulse delay-2000"></div>
        </div>

        <div className="relative py-20 px-4">
          <div className="container mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Liên Hệ{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Với Chúng Tôi
              </span>
            </h3>
            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn trong hành trình chăm sóc sức
              khỏe
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: MapPin,
                  title: "Địa Chỉ",
                  info: "123 Đường Sức Khỏe, Quận 1, Thành phố Hồ Chí Minh",
                  gradient: "from-blue-400 to-cyan-400",
                },
                {
                  icon: Phone,
                  title: "Điện Thoại",
                  info: "(+84) 123 456 789",
                  gradient: "from-purple-400 to-pink-400",
                },
                {
                  icon: Mail,
                  title: "Email",
                  info: "support@healthplatform.vn",
                  gradient: "from-green-400 to-emerald-400",
                },
              ].map((contact, index) => (
                <div
                  key={index}
                  className="group bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105"
                >
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${contact.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <contact.icon size={28} />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">
                    {contact.title}
                  </h4>
                  <p className="opacity-90 leading-relaxed">{contact.info}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
