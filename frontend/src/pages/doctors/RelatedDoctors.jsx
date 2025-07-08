import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();
  const [relDoc, setRelDoc] = useState([]);

  useEffect(() => {
    if (doctors.length && speciality) {
      setRelDoc(
        doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
      );
    }
  }, [doctors, speciality, docId]);

  return (
    <div className="my-20 px-4 sm:px-10 text-center text-gray-900">
      <h2 className="text-3xl md:text-4xl font-extrabold text-pink-600">
        🔍 Top Doctors To Book
      </h2>
      <p className="text-sm text-gray-600 mt-2 md:w-1/2 mx-auto">
        Discover our highly rated doctors based on your needs.
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
        {relDoc.slice(0, 5).map((item) => (
          <div
            key={item._id}
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
            className="bg-white border rounded-2xl shadow hover:shadow-xl transition duration-300 cursor-pointer"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover rounded-t-2xl"
            />
            <div className="p-4 space-y-1">
              <div className="flex items-center gap-2 text-green-500 text-sm font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                Available
              </div>
              <p className="text-lg font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/doctors")}
        className="mt-10 px-10 py-3 rounded-full bg-gradient-to-r from-blue-400 to-pink-500 text-white font-medium shadow hover:scale-105 transition"
      >
        🔗 View More Doctors
      </button>
    </div>
  );
};

export default RelatedDoctors;