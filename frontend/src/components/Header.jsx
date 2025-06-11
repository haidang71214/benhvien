import { assets } from "../assets/data/doctors";

const Header = () => {
  return (
    <div className="flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20 relative">
      {/* Left side */}
      <div className="md:w-1/2 flex flex-col items-start justify-center py-10 gap-4 m-auto md:py-[10vw] md:mb-[-30px]">
        <p className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight md:leading-tight lg:leading-tight">
          Booking Appointment <br /> With trusted Doctors
        </p>
        <div className="flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light">
          <img
            src={assets.group_profiles}
            alt="Doctor profiles"
            className="w-28"
          />
          <div className="w-full max-w-md">
            <p className="text-white text-sm">
              Simple browser application to book appointments with doctors. Schedule your appointment with ease and convenience.
            </p>
          </div>
        </div>
        <a
          href="#speciality"
          className="flex items-center gap-2 bg-white text-gray-600 px-8 py-3 rounded-full hover:scale-105 font-medium hover:bg-gray-100 transition-all mt-4"
        >
          Book Appointment
          <img src={assets.arrow_icon} alt="arrow" className="w-4 h-4" />
        </a>
      </div>

      {/* Right side */}
      <div className="md:w-1/2 relative">
        <img
          className="w-full md:absolute bottom-0 h-auto rounded-lg"
          src={assets.header_img}
          alt="Header illustration"
        />
      </div>
    </div>
  );
};

export default Header;