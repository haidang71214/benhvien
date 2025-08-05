import { assets } from "../../assets/data/doctors";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-700 px-6 md:px-20 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="Logo" />
          <p className="text-sm leading-6 text-gray-600">
            We provide the best online medical services and professional doctors to assist you anytime. Trusted by thousands of patients around the world.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Company</h3>
          <ul className="space-y-2 text-sm">
            {["Home", "About Us", "Contact Us", "Privacy Policy", "Terms & Conditions"].map((item) => (
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
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Get in Touch</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={16} /> +1 234 56 789
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> example@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} /> 123 Main St, City, Country
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t pt-6 text-xs text-gray-500 text-center">
        &copy; {new Date().getFullYear()} YourCompany. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;