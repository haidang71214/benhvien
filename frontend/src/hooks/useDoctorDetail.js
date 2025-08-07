import { useEffect, useState } from "react";
import {axiosInstance} from "../utils/axiosInstance";

export default function useDoctorDetail(docId) {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!docId) return;

    const fetchDoctorDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/admin/getDetailUser/${docId}`);
        setDoctor(res.data.data);
      } catch (err) {
        console.error("Failed to fetch doctor detail:", err);
        setError(err);
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetail();
  }, [docId]);

  return { doctor, loading, error };
}
