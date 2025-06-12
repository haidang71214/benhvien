import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance.ts";
import { transformDoctorData } from "../utils/transformDoctorData";
import { doctors as staticDoctors } from "../assets/data/doctors";

export const useDoctors = () => {
  const { speciality: urlSpeciality } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    urlSpeciality || ""
  );
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 10;

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const staticDoctorsTransformed = staticDoctors
        .map((doc) => {
          try {
            const transformed = transformDoctorData(doc, "static");
            return transformed;
          } catch (transformError) {
            return null;
          }
        })
        .filter(Boolean);
      setDoctors(staticDoctorsTransformed); 
      setLoading(false);

      try {
        const { data: mongoDoctorsData } = await axiosInstance.get(
          "/admin/getAllDoctors"
        );
        const mongoDoctors = mongoDoctorsData
          .map((doc) => {
            try {
              return transformDoctorData(doc, "mongodb");
            } catch (transformError) {
              return null;
            }
          })
          .filter(Boolean);
        const combinedDoctors = [
          ...staticDoctorsTransformed,
          ...mongoDoctors,
        ].filter(
          (doc, index, self) =>
            index === self.findIndex((d) => d._id === doc._id)
        );
        setDoctors(combinedDoctors);
      } catch (mongoError) {
        if (staticDoctorsTransformed.length === 0) {
          setError("Unable to load doctors list");
        }
      }
    } catch (err) {
      setError("Unable to load doctors list");
      try {
        const staticDoctorsTransformed = staticDoctors.map((doc) =>
          transformDoctorData(doc, "static")
        );
        setDoctors(staticDoctorsTransformed);
      } catch (fallbackError) {
        setDoctors([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSpecialty]);

  useEffect(() => {
    setSelectedSpecialty(urlSpeciality || "");
  }, [urlSpeciality]);

  const filteredDoctors = selectedSpecialty
    ? doctors.filter((doc) => {
        const docSpecialty = (
          doc.specialty ||
          doc.speciality ||
          ""
        ).toLowerCase();
        return docSpecialty.includes(selectedSpecialty.toLowerCase());
      })
    : doctors;

  const totalPage = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const startIndex = (currentPage - 1) * doctorsPerPage;
  const paginatedDoctors = filteredDoctors.slice(
    startIndex,
    startIndex + doctorsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return {
    loading,
    error,
    selectedSpecialty,
    setSelectedSpecialty,
    doctors,
    currentPage,
    doctorsPerPage,
    filteredDoctors,
    totalPage,
    startIndex,
    paginatedDoctors,
    fetchDoctors,
    handlePageChange,
  };
};
