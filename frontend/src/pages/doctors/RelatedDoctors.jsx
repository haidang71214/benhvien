import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";

const RelatedDoctors = ({ speciality, docId }) => {
  const { userId } = useParams();
  const { doctors } = useContext(AppContext);
  console.log("Doctors in context:", doctors);
  console.log("Speciality prop:", speciality);
  const [relDoc, setRelDoc] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (doctors.length > 0 && speciality?.length > 0) {
      const filtered = doctors.filter((doc) => {
        const docSpecialties = Array.isArray(doc.specialty)
          ? doc.specialty
          : Array.isArray(doc.speciality)
          ? doc.speciality
          : [doc.specialty || doc.speciality];

        const isMatch = docSpecialties.some((spec) =>
          speciality.includes(spec)
        );

        return isMatch && doc._id?.toString() !== docId?.toString();
      });

      setRelDoc(filtered);
    }
  }, [doctors, speciality, docId]);

  return (
    <div className="flex flex-col items-center gap-4 my-20 text-gray-900 px-4 sm:px-10">
      <h1 className="text-3xl font-bold text-gray-800">Bác Sĩ Liên Quan</h1>
      <p className="sm:w-2/3 md:w-1/2 text-center text-gray-600 text-sm">
        Khám phá các bác sĩ được đánh giá cao dựa trên chuyên khoa của bạn.
      </p>

      <div className="w-full grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-8">
        {relDoc.slice(0, 5).map((item, index) => {
          const name = item.userName || item.name || "Chưa rõ tên";
          const specialityText = Array.isArray(item.specialty)
            ? item.specialty.join(", ")
            : item.specialty || item.speciality || "Đa khoa";
          const image =
            item.avatarUrl || item.image || "/default-doctor-avatar.png";

          return (
            <div
              onClick={() => {
                navigate(`/appointment/${item._id}/${userId}`);
                scrollTo(0, 0);
              }}
              key={index}
              className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <img
                src={image}
                alt={name}
                className="w-full h-48 object-cover rounded-t-xl bg-blue-50"
              />
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-green-500 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Có sẵn</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">{name}</p>
                <p className="text-sm text-gray-500">{specialityText}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => {
          navigate("/booking/doctors");
          scrollTo(0, 0);
        }}
        className="mt-10 bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-300"
      >
        Xem Thêm Bác Sĩ
      </button>
    </div>
  );
};

export default RelatedDoctors;
