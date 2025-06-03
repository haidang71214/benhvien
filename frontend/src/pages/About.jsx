import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          About <span className="text-gray-700 font-medium">US</span>
        </p>
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.about_image}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p className="text-gray-600">
            Welcome to our trusted healthcare platform. We are dedicated to
            providing high-quality medical services that are convenient,
            reliable, and user-friendly.
          </p>
          <p className="text-gray-600">
            With a team of experienced doctors and a smart online appointment
            system, you can easily connect with the right specialists in just a
            few clicks.
          </p>
          <p className="text-gray-600">
            Our patient-centered approach ensures that every step of your
            healthcare journey is smooth, safe, and effective.
          </p>
          <p className="text-gray-600">
            Let us be your trusted partner in long-term health and
            wellness—because your well-being is always our top priority.
          </p>
        </div>
      </div>
      <div className="text-xl my-4">
        <p>
          <span className="text-gray-700 font-semibold">Why Choose Us?</span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Efficiency:</b>
          <p className="mt-1">
            Our platform simplifies the healthcare process, helping you book
            appointments, access medical records, and consult with doctors
            quickly and seamlessly.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Convenience:</b>
          <p className="mt-1">
            Whether you're at home or on the go, our user-friendly interface
            allows you to manage your health anytime, anywhere.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Personalization:</b>
          <p className="mt-1">
            We tailor our services to match your individual health needs,
            offering recommendations and reminders that make your experience
            truly yours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
