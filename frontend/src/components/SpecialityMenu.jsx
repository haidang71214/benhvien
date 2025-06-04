import { Link } from "react-router-dom";
import { specialityData } from "../assets/data/doctors";

const SpecialityMenu = () => {
  return (
    <div
      id="speciality"
      className="flex flex-col items-center justify-center gap-4 py-16 text-gray-600"
    >
      <h1 className="text-3xl font-medium">Find by Speciality</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simple browser through our extensive list of trusted doctors, schedule
        your appointment with ease and convenience.
      </p>
      <div className="flex sm:justify-center gap-4 pt-5 w-full flex-wrap justify-center">
        {specialityData.map((item, index) => (
          <Link
            key={index}
            to={`doctors/${item.speciality}`}
            onClick={() => scrollTo(0, 0)}
            className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500"
          >
            <img className="w-16 sm:w-24 mb-2" src={item.image} alt="" />
            <p>{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
