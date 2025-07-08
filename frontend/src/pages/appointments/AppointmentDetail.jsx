import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const AppointmentDetail = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  const [medicalRecordId, setMedicalRecordId] = useState(null);
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [prescriptions, setPrescriptions] = useState([
    { medicineId: "", dosage: "", frequency: "", duration: "" },
  ]);
  const [medicines, setMedicines] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [prescriptionId, setPrescriptionId] = useState(null);

  useEffect(() => {
    if (!user) return;
    if (user.role !== "doctor" && user.role !== "patient") {
      toast.error("Bạn không có quyền truy cập trang này.");
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/doctor/getAppointmentById/${appointmentId}`)
      .then((res) => setAppointment(res.data.data))
      .catch(() => toast.error("Không thể tải thông tin lịch hẹn"))
      .finally(() => setLoading(false));
  }, [appointmentId]);

  useEffect(() => {
    axiosInstance
      .get("/api/v1/medicines/getAll")
      .then((res) => setMedicines(res.data.data || []))
      .catch(() => setMedicines([]));
  }, []);

  useEffect(() => {
    if (!appointmentId) return;
    axiosInstance
      .get(`/doctor/getMedicalRecordByAppointment/${appointmentId}`)
      .then((res) => {
        if (res.data.data) {
          setEditMode(true);
          setMedicalRecordId(res.data.data._id);
          setSymptoms(res.data.data.symptoms || "");
          setDiagnosis(res.data.data.diagnosis || "");
          setConclusion(res.data.data.conclusion || "");
          axiosInstance
            .get(`/doctor/getPrescriptionByMedicalRecord/${res.data.data._id}`)
            .then((presRes) => {
              if (
                presRes.data.data &&
                presRes.data.data.medicines &&
                presRes.data.data.medicines.length > 0
              ) {
                setPrescriptionId(presRes.data.data._id);
                setPrescriptions(
                  presRes.data.data.medicines.map((med) => ({
                    medicineId: med.medicineId,
                    dosage: med.dosage,
                    frequency: med.frequency,
                    duration: med.duration,
                  }))
                );
              }
            });
        }
      });
  }, [appointmentId]);

  const addPrescription = () => {
    setPrescriptions([
      ...prescriptions,
      { medicineId: "", dosage: "", frequency: "", duration: "" },
    ]);
  };

  const removePrescription = (idx) => {
    if (prescriptions.length > 1) {
      setPrescriptions(prescriptions.filter((_, i) => i !== idx));
    } else {
      toast.error("At least one prescription is required.");
    }
  };

  const updatePrescription = (idx, field, value) => {
    const updated = prescriptions.map((p, i) =>
      i === idx ? { ...p, [field]: value } : p
    );
    setPrescriptions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.role !== "doctor") return; 
    try {
      let recordId = medicalRecordId;
      if (!editMode) {
        const medRes = await axiosInstance.post("/doctor/createmedicalrecord", {
          appointmentId: appointment._id,
          patientId: appointment.patientId._id,
          doctorId: appointment.doctorId._id,
          symptoms,
          diagnosis,
          conclusion,
          prescriptions: [],
        });
        recordId = medRes.data?.newMedicalRecord?._id || medRes.data?.data?._id;
        setMedicalRecordId(recordId);
      } else {
        await axiosInstance.put(
          `/doctor/updateMedicalRecord/${medicalRecordId}`,
          {
            symptoms,
            diagnosis,
            conclusion,
          }
        );
      }

      const medicinesArr = prescriptions.map((pres) => ({
        medicineId: pres.medicineId,
        dosage: pres.dosage,
        frequency: pres.frequency,
        duration: pres.duration,
      }));

      let prescriptionRes;
      if (editMode && prescriptionId) {
        prescriptionRes = await axiosInstance.put(
          `/doctor/updatePrescription/${prescriptionId}`,
          {
            medicalRecordId: recordId,
            medicines: medicinesArr,
          }
        );
      } else {
        prescriptionRes = await axiosInstance.post(
          "/doctor/createPresCription",
          {
            medicalRecordId: recordId,
            medicines: medicinesArr,
          }
        );
      }

      const newPrescriptionId =
        prescriptionRes.data?.createPrescription?._id ||
        prescriptionRes.data?.data?._id;
      if (newPrescriptionId) {
        await axiosInstance.put(`/doctor/updateMedicalRecord/${recordId}`, {
          prescriptions: [newPrescriptionId],
        });
      }

      toast.success(
        editMode
          ? "Medical record and prescriptions updated!"
          : "Medical record and prescriptions created!"
      );
      setTimeout(() => {
        navigate("/my-appointments");
      }, 2000);
    } catch (err) {
      toast.error("Error saving medical record or prescriptions", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!appointment) return <div>Appointment not found</div>;

  return (
    <div className="max-w-2xl mx-auto pt-24 px-4">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">
        Appointment Detail
      </h2>
      <div className="mb-8 bg-white rounded-xl shadow p-6">
        <div className="mb-2">
          <b>Doctor:</b>{" "}
          <span className="text-gray-700">
            {appointment.doctorId?.userName}
          </span>
        </div>
        <div className="mb-2">
          <b>Patient:</b>{" "}
          <span className="text-gray-700">
            {appointment.patientId?.userName}
          </span>
        </div>
        <div className="mb-2">
          <b>Time:</b>{" "}
          <span className="text-gray-700">
            {new Date(appointment.appointmentTime).toLocaleString()}
          </span>
        </div>
        <div>
          <b>Initial Symptom:</b>{" "}
          <span className="text-gray-700">{appointment.initialSymptom}</span>
        </div>
      </div>
      {user.role === "doctor" ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white rounded-xl shadow p-8"
        >
          <div>
            <label className="block font-semibold mb-1">Symptoms</label>
            <input
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Diagnosis</label>
            <input
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Conclusion</label>
            <input
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Prescriptions</label>
            <div className="space-y-3">
              {prescriptions.map((pres, idx) => (
                <div
                  key={idx}
                  className="flex flex-wrap gap-2 items-center bg-gray-50 rounded-lg p-3 shadow-sm"
                >
                  <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1">Medicine</label>
                    <select
                      value={pres.medicineId}
                      onChange={(e) =>
                        updatePrescription(idx, "medicineId", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-1 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    >
                      <option value="">Select medicine</option>
                      {medicines.map((med) => (
                        <option key={med._id} value={med._id}>
                          {med.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1">Dosage</label>
                    <input
                      placeholder="Dosage"
                      value={pres.dosage}
                      onChange={(e) =>
                        updatePrescription(idx, "dosage", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1">
                      Frequency
                    </label>
                    <input
                      placeholder="Frequency"
                      value={pres.frequency}
                      onChange={(e) =>
                        updatePrescription(idx, "frequency", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1">Duration</label>
                    <input
                      placeholder="Duration"
                      value={pres.duration}
                      onChange={(e) =>
                        updatePrescription(idx, "duration", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  {prescriptions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePrescription(idx)}
                      className="text-red-600 px-2 text-lg hover:bg-red-50 rounded transition mt-5"
                      title="Remove"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addPrescription}
              className="mt-3 text-blue-600 hover:text-blue-800 font-medium transition"
            >
              + Add Prescription
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow transition"
          >
            {editMode ? "Update Medical Record" : "Save Medical Record"}
          </button>
        </form>
      ) : (
        // Patient view: read-only
        <div className="space-y-6 bg-white rounded-xl shadow p-8">
          <div>
            <label className="block font-semibold mb-1">Symptoms</label>
            <input
              className="border border-gray-300 rounded px-3 py-2 w-full bg-gray-100"
              value={symptoms}
              readOnly
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Diagnosis</label>
            <input
              className="border border-gray-300 rounded px-3 py-2 w-full bg-gray-100"
              value={diagnosis}
              readOnly
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Conclusion</label>
            <input
              className="border border-gray-300 rounded px-3 py-2 w-full bg-gray-100"
              value={conclusion}
              readOnly
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Prescriptions</label>
            <div className="space-y-3">
              {prescriptions.map((pres, idx) => (
                <div
                  key={idx}
                  className="flex flex-wrap gap-2 items-center bg-gray-50 rounded-lg p-3 shadow-sm"
                >
                  <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1">Medicine</label>
                    <input
                      value={
                        medicines.find((m) => m._id === pres.medicineId)
                          ?.name || ""
                      }
                      className="border border-gray-300 rounded px-2 py-1 min-w-[120px] bg-gray-100"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1">Dosage</label>
                    <input
                      value={pres.dosage}
                      className="border border-gray-300 rounded px-2 py-1 w-24 bg-gray-100"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1">
                      Frequency
                    </label>
                    <input
                      value={pres.frequency}
                      className="border border-gray-300 rounded px-2 py-1 w-24 bg-gray-100"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1">Duration</label>
                    <input
                      value={pres.duration}
                      className="border border-gray-300 rounded px-2 py-1 w-24 bg-gray-100"
                      readOnly
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentDetail;