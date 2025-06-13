import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";

const RelatedDoctors = ({ speciality, docId }) => {
  const { userId } = useParams();
  const { doctors } = useContext(AppContext);
  const [relDoc, setRelDoc] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      );
      setRelDoc(doctorsData);
    }
  }, [doctors, speciality, docId]);

  return (
    <div className="flex flex-col items-center gap-4 my-20 text-gray-900 px-4 sm:px-10">
      <h1 className="text-3xl md:text-4xl font-extrabold text-pink-600 tracking-tight">
        🔍 Top Doctors To Book
      </h1>
      <p className="sm:w-2/3 md:w-1/2 text-center text-gray-600 text-sm">
        Discover our highly rated doctors based on your needs.
      </p>

      <div className="w-full grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-8">
        {relDoc.slice(0, 5).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}/${userId}`);
              scrollTo(0, 0);
            }}
            key={index}
            className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover rounded-t-2xl bg-blue-50"
            />
            <div className="p-4 space-y-1">
              <div className="flex items-center gap-2 text-green-500 text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Available</span>
              </div>
              <p className="text-lg font-semibold text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-500">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="mt-10 bg-gradient-to-r from-blue-400 to-pink-500 text-white font-medium px-10 py-3 rounded-full shadow hover:scale-105 transition-all duration-300"
      >
        🔗 View More Doctors
      </button>
    </div>
  );
};

export default RelatedDoctors;
