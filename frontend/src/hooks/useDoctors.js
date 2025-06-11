// hooks/useDoctors.js
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance.ts";
import { transformDoctorData } from "../utils/transformDoctorData";
import { doctors as staticDoctors } from "../assets/data/doctors";

export const useDoctors = () => {
  const { speciality: urlSpeciality } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(urlSpeciality || "");
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 10;

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const staticDoctorsTransformed = staticDoctors.map((doc) =>
        transformDoctorData(doc, "static")
      );

      const { data: mongoDoctorsData } = await axiosInstance.get(
        "/admin/getAllDoctors"
      );
      const mongoDoctors = mongoDoctorsData.map((doc) =>
        transformDoctorData(doc, "mongodb")
      );

      const combinedDoctors = [
        ...staticDoctorsTransformed,
        ...mongoDoctors,
      ].filter(
        (doc, index, self) => index === self.findIndex((d) => d._id === doc._id)
      );

      setDoctors(combinedDoctors);
    } catch (err) {
      console.error("Lỗi khi tải danh sách bác sĩ:", err);
      setError("Không thể tải danh sách bác sĩ");
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

  const filteredDoctors = selectedSpecialty
    ? doctors.filter((doc) => doc.specialty.includes(selectedSpecialty))
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