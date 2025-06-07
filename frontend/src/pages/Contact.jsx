import { assets } from "@/assets/data/doctors";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          Contact <span className="text-gray-700 font-semibold">US</span>
        </p>
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.contact_image}
          alt="Contact illustration"
        />

        <div className="flex flex-col justify-center items-start gap-6">
          <p>📍 123 HealthCare Avenue, Da Nang City, Vietnam</p>
          <p>📞 Phone: +84 123 456 789</p>
          <p>✉️ Email: support@healthclinic.vn</p>
          <p>🕐 Opening Hours: Mon - Sat, 8:00 AM - 6:00 PM</p>
          <p>
            💬 For appointments, queries or support, feel free to reach out to
            us. We’re always here to help!
          </p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-300">
            Send Us a Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
