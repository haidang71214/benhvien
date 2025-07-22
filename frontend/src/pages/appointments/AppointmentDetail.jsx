import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext"; // Make sure you have this

const AppointmentDetail = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Medical record form state
  const [medicalRecordId, setMedicalRecordId] = useState(null);
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [prescriptions, setPrescriptions] = useState([
    {
      medicineId: "",
      dosage: "",
      duration: "",
      instructions: [
        { mealTime: "", mealRelation: "", custom: "" },
      ],
    },
  ]);
  const [medicines, setMedicines] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [prescriptionId, setPrescriptionId] = useState(null);

  // Restrict access: Only doctor can edit, patient can view
  useEffect(() => {
    if (!user) return;
    if (user.role !== "doctor" && user.role !== "patient") {
      toast.error("Bạn không có quyền truy cập trang này.");
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch appointment details
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/doctor/getAppointmentById/${appointmentId}`)
      .then((res) => setAppointment(res.data.data))
      .catch(() => toast.error("Không thể tải thông tin lịch hẹn"))
      .finally(() => setLoading(false));
  }, [appointmentId]);

  // Fetch medicines for dropdown (doctor only)
  useEffect(() => {
    axiosInstance
      .get("/api/v1/medicines/getAll")
      .then((res) => setMedicines(res.data.data || []))
      .catch(() => setMedicines([]));
  }, []);

  // Fetch medical record for this appointment (edit mode)
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
          // Fetch prescription for this medical record
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
                    duration: med.duration,
                    instructions: Array.isArray(med.instructions) && med.instructions.length > 0
                      ? med.instructions
                      : [{ mealTime: '', mealRelation: '', custom: '' }],
                  }))
                );
              }
            });
        }
      });
  }, [appointmentId]);

  // Add prescription row
  const addPrescription = () => {
    setPrescriptions([
      ...prescriptions,
      { medicineId: "", dosage: "", duration: "", instructions: [{ mealTime: "", mealRelation: "", custom: "" }] },
    ]);
  };

  // Remove prescription row (allow removing any, but always keep at least one)
  const removePrescription = (idx) => {
    if (prescriptions.length > 1) {
      setPrescriptions(prescriptions.filter((_, i) => i !== idx));
    } else {
      toast.error("At least one prescription is required.");
    }
  };

  // Update prescription row
  const updatePrescription = (idx, field, value) => {
    const updated = prescriptions.map((p, i) =>
      i === idx ? { ...p, [field]: value } : p
    );
    setPrescriptions(updated);
  };

  // Add instruction row for a prescription
  const addInstruction = (presIdx) => {
    setPrescriptions((prev) =>
      prev.map((p, i) =>
        i === presIdx
          ? {
              ...p,
              instructions: [
                ...p.instructions,
                { mealTime: "", mealRelation: "", custom: "" },
              ],
            }
          : p
      )
    );
  };

  // Remove instruction row for a prescription
  const removeInstruction = (presIdx, instrIdx) => {
    setPrescriptions((prev) =>
      prev.map((p, i) =>
        i === presIdx
          ? {
              ...p,
              instructions:
                p.instructions.length > 1
                  ? p.instructions.filter((_, j) => j !== instrIdx)
                  : p.instructions,
            }
          : p
      )
    );
  };

  // Update instruction field for a prescription
  const updateInstruction = (presIdx, instrIdx, field, value) => {
    setPrescriptions((prev) =>
      prev.map((p, i) =>
        i === presIdx
          ? {
              ...p,
              instructions: p.instructions.map((instr, j) =>
                j === instrIdx ? { ...instr, [field]: value } : instr
              ),
            }
          : p
      )
    );
  };

  // Submit medical record and prescriptions (doctor only)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.role !== "doctor") return;
    try {
      let recordId = medicalRecordId;
      // 1. Create or update medical record
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

      // 2. Create prescription (all medicines at once)
      const medicinesArr = prescriptions.map((pres) => ({
        medicineId: pres.medicineId,
        dosage: pres.dosage,
        duration: pres.duration,
        instructions: pres.instructions.filter(
          (instr) => instr.mealTime || instr.mealRelation || instr.custom
        ),
      }));

      // Create or update prescription
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
          "/doctor/createPrescription",
          {
            medicalRecordId: recordId,
            medicines: medicinesArr,
          }
        );
      }

      // 3. Update medical record's prescriptions field with prescription ID
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
      toast.error("Error saving medical record or prescriptions");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!appointment) return <div>Appointment not found</div>;

  return (
    <div className="max-w-2xl mx-auto pt-24 px-4">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>
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
                className="flex flex-col gap-2 bg-gray-50 rounded-lg p-3 shadow-sm"
              >
                <div className="flex flex-wrap gap-2 items-center">
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
                  {/* Frequency removed */}
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
                {/* Instruction sets for this medicine */}
                <div className="ml-2 mt-2">
                  <label className="text-xs font-semibold">Instructions</label>
                  {pres.instructions.map((instr, instrIdx) => (
                    <div key={instrIdx} className="flex flex-wrap gap-2 items-center mt-1">
                      <select
                        value={instr.mealTime}
                        onChange={(e) => updateInstruction(idx, instrIdx, "mealTime", e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 min-w-[100px] focus:outline-none"
                      >
                        <option value="">Meal Time</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                      </select>
                      <select
                        value={instr.mealRelation}
                        onChange={(e) => updateInstruction(idx, instrIdx, "mealRelation", e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 min-w-[100px] focus:outline-none"
                      >
                        <option value="">Meal Relation</option>
                        <option value="Before Meal">Before Meal</option>
                        <option value="After Meal">After Meal</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Custom instruction"
                        value={instr.custom}
                        onChange={(e) => updateInstruction(idx, instrIdx, "custom", e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 min-w-[120px] focus:outline-none"
                      />
                      {pres.instructions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeInstruction(idx, instrIdx)}
                          className="text-red-600 px-2 text-lg hover:bg-red-50 rounded transition"
                          title="Remove instruction"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addInstruction(idx)}
                    className="mt-1 text-blue-600 hover:text-blue-800 text-xs font-medium"
                  >
                    + Add Instruction
                  </button>
                </div>
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
                className="flex flex-col gap-2 bg-gray-50 rounded-lg p-3 shadow-sm"
              >
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1">Medicine</label>
                    <input
                      value={
                        medicines.find((m) => m._id === pres.medicineId)?.name || ""
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
                  {/* Frequency removed */}
                  <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1">Duration</label>
                    <input
                      value={pres.duration}
                      className="border border-gray-300 rounded px-2 py-1 w-24 bg-gray-100"
                      readOnly
                    />
                  </div>
                </div>
                {/* Show all instructions for this medicine */}
                <div className="ml-2 mt-2">
                  <label className="text-xs font-semibold mb-1">Instructions</label>
                  <div className="grid grid-cols-1 gap-2">
                    {(pres.instructions && pres.instructions.length > 0
                      ? pres.instructions
                      : (pres.instructionsString || "").split("; ").map((s) => ({ combined: s }))
                    ).map((instr, instrIdx) => {
                      let hasMeal = instr.mealTime || instr.mealRelation;
                      let hasCustom = instr.custom && instr.custom.trim() !== "";
                      let main = [
                        instr.mealTime && <span key="mealTime" className="font-bold text-blue-700">{instr.mealTime}</span>,
                        instr.mealRelation && <span key="mealRel" className="ml-1 px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold">{instr.mealRelation}</span>
                      ].filter(Boolean);
                      return (
                        <div key={instrIdx} className="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 border border-blue-200 shadow-sm">
                          <span role="img" aria-label="pill" className="text-blue-400 text-lg">💊</span>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 w-full">
                            <div className="flex gap-2 items-center flex-wrap">
                              {main.length > 0 ? main : <span className="text-gray-400 italic">No meal info</span>}
                            </div>
                            {hasCustom && (
                              <span className="ml-2 px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-medium whitespace-pre-line">
                                {instr.custom}
                              </span>
                            )}
                            {!hasMeal && !hasCustom && instr.combined && (
                              <span className="text-gray-500 italic">{instr.combined}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
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