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

  // Nurse/test assignment state
  const [assignedTests, setAssignedTests] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState("");
  const [selectedNurse, setSelectedNurse] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [availableTests, setAvailableTests] = useState([]);

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
      .get("/medicines/getAll")
      .then((res) => setMedicines(res.data.data || []))
      .catch(() => setMedicines([]));
  }, []);

  // Fetch nurses for assignment (doctor only)
  useEffect(() => {
    if (user?.role === "doctor") {
      axiosInstance
        .get("/user/getAllUsers")
        .then((res) => {
          setNurses((res.data.data || []).filter(u => u.role === "nurse"));
        })
        .catch(() => setNurses([]));
      // Fetch available tests
      axiosInstance
        .get("/test/getAll")
        .then((res) => setAvailableTests(res.data.data || []))
        .catch(() => setAvailableTests([]));
    }
  }, [user]);

  // Fetch medical record for this appointment (edit mode)
  useEffect(() => {
    if (!appointmentId) return;
    axiosInstance
      .get(`/doctor/getMedicalRecordByAppointment/${appointmentId}`)
      .then((res) => {
        if (res.data && res.data.data) {
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
                presRes.data &&
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
        } else {
          // No medical record found, set editMode to false and clear fields
          setEditMode(false);
          setMedicalRecordId(null);
          setSymptoms("");
          setDiagnosis("");
          setConclusion("");
          setPrescriptions([
            {
              medicineId: "",
              dosage: "",
              duration: "",
              instructions: [
                { mealTime: "", mealRelation: "", custom: "" },
              ],
            },
          ]);
        }
      })
      .catch(() => {
        // If 404 or error, treat as no medical record
        setEditMode(false);
        setMedicalRecordId(null);
        setSymptoms("");
        setDiagnosis("");
        setConclusion("");
        setPrescriptions([
          {
            medicineId: "",
            dosage: "",
            duration: "",
            instructions: [
              { mealTime: "", mealRelation: "", custom: "" },
            ],
          },
        ]);
      });
  }, [appointmentId]);

  // Fetch assigned tests for this appointment
  useEffect(() => {
    if (!appointmentId) return;
    axiosInstance
      .get(`/test-assignment/results/${appointmentId}`)
      .then((res) => setAssignedTests(res.data.data || []))
      .catch(() => setAssignedTests([]));
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

  // Helper: get medicine type by id
  const getMedicineType = (medicineId) => {
    const med = medicines.find((m) => m._id === medicineId);
    return med?.type || "";
  } 

  // Get dosage placeholder by type
  const getDosagePlaceholder = (medicineType) => {
    switch (medicineType) {
      case "tablet":
        return "e.g. 1 tablet";
      case "capsule":
        return "e.g. 1 capsule";
      case "syrup":
        return "e.g. 5ml";
      case "ointment":
        return "e.g. apply thin layer";
      default:
        return "Dosage";
    }
  } 

  // Update prescription row
  const updatePrescription = (idx, field, value) => {
    const updated = prescriptions.map((p, i) =>
      i === idx ? { ...p, [field]: value } : p
    );
    setPrescriptions(updated);
  } 

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
      toast.error(`Error saving medical record or prescriptions ${err}`);
    }
  };

  // Handle test assignment
  const handleAssignTest = async (e) => {
    e.preventDefault();
    if (!selectedTestId || !selectedNurse) {
      toast.error("Test type and nurse are required");
      return;
    }
    setAssignLoading(true);
    try {
      await axiosInstance.post("/test-assignment/assign", {
        appointmentId,
        patientId: appointment.patientId._id,
        doctorId: appointment.doctorId._id,
        nurseId: selectedNurse,
        testId: selectedTestId,
      });
      toast.success("Test assigned!");
      setSelectedTestId("");
      setSelectedNurse("");
      // Refresh assigned tests
      axiosInstance
        .get(`/test-assignment/results/${appointmentId}`)
        .then((res) => setAssignedTests(res.data.data || []));
    } catch {
      toast.error("Failed to assign test");
    } finally {
      setAssignLoading(false);
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
        <ArrowLeft className="w-5 h-5" /> Quay lại
      </button>
      <h2 className="text-2xl font-bold mb-6 text-blue-700">
        Chi tiết lịch hẹn
      </h2>
      <div className="mb-8 bg-white rounded-xl shadow p-6">
        <div className="mb-2">
          <b>Bác sĩ:</b>{" "}
          <span className="text-gray-700">
            {appointment.doctorId?.userName}
          </span>
        </div>
        <div className="mb-2">
          <b>Bệnh nhân:</b>{" "}
          <span className="text-gray-700">
            {appointment.patientId?.userName}
          </span>
        </div>
        <div className="mb-2">
          <b>Thời gian:</b>{" "}
          <span className="text-gray-700">
            {new Date(appointment.appointmentTime).toLocaleString()}
          </span>
        </div>
        <div>
          <b>Triệu chứng ban đầu:</b>{" "}
          <span className="text-gray-700">{appointment.initialSymptom}</span>
        </div>
      </div>

      {/* Doctor: Assign tests to nurse and show assigned/completed tests */}
      {user.role === "doctor" && (
        <div className="mb-8 bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold text-blue-700 mb-4">Phân công xét nghiệm cho y tá</h3>
          <form className="flex flex-col md:flex-row gap-4 items-center" onSubmit={handleAssignTest}>
            <select
              value={selectedTestId}
              onChange={e => setSelectedTestId(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 min-w-[120px]"
              required
            >
              <option value="">Chọn loại xét nghiệm</option>
              {availableTests.map(test => (
                <option key={test._id} value={test._id}>
                  {test.name}
                </option>
              ))}
            </select>
            <select
              value={selectedNurse}
              onChange={e => setSelectedNurse(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 min-w-[120px]"
              required
            >
              <option value="">Chọn y tá</option>
              {nurses.map(n => (
                <option key={n._id} value={n._id}>{n.userName}</option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
              disabled={assignLoading}
            >
              {assignLoading ? "Đang phân công..." : "Phân công xét nghiệm"}
            </button>
          </form>
          {/* Show assigned/completed tests */}
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Xét nghiệm đã phân công/hoàn thành</h4>
            {assignedTests.length === 0 ? (
              <div className="text-gray-500 italic">Chưa có xét nghiệm nào được phân công.</div>
            ) : (
              <ul className="space-y-2">
                {assignedTests.map(test => (
                  <li key={test._id} className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex flex-col gap-2">
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <span className="font-medium text-blue-700">{test.testId?.name}</span>
                      <span className="text-gray-700">Nurse: {typeof test.nurseId === 'object' ? test.nurseId.userName : test.nurseId}</span>
                      <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">{test.status}</span>
                    </div>
                    {test.result && (
                      <div className="mt-2">
                        <span className="font-semibold text-green-700">Result:</span>
                        {(test.testId?.name === 'CT Scan' || test.testId?.name === 'Chụp CT' || test.testId?.name === 'X-ray' || test.testId?.name === 'X-quang' || test.testId?.name === 'Siêu âm bụng') ? (
                          <div className="mt-1 flex flex-wrap gap-2">
                            {Array.isArray(test.result.imageUrls) && test.result.imageUrls.length > 0 ? (
                              test.result.imageUrls.map((url, idx) => (
                                <img key={idx} src={url} alt={`Scan/X-ray ${idx + 1}`} className="max-w-xs rounded shadow" />
                              ))
                            ) : test.result.imageUrl ? (
                              <img src={test.result.imageUrl} alt="Scan/X-ray" className="max-w-xs rounded shadow" />
                            ) : null}
                            {test.result.notes && (
                              <div className="w-full text-gray-700 mt-1">Notes: {test.result.notes}</div>
                            )}
                          </div>
                        ) : (
                          <div className="mt-1 grid grid-cols-2 gap-2">
                            {typeof test.result === 'object' ? (
                              Object.entries(test.result).map(([key, value]) => (
                                key !== 'imageUrl' && key !== 'notes' ? (
                                  <div key={key} className="text-gray-700">
                                    <b>{key}:</b> {value}
                                  </div>
                                ) : null
                              ))
                            ) : (
                              <div className="text-gray-700">{test.result}</div>
                            )}
                            {test.result.notes && (
                              <div className="col-span-2 text-gray-700 mt-1">Notes: {test.result.notes}</div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      {/* Patient view: show assigned/completed tests with payment info and pay for all tests, and display results like doctor view */}
      {user.role === "patient" && (
        <div className="mb-8 bg-white rounded-xl shadow p-6">
          <h4 className="font-semibold mb-2">Xét nghiệm đã phân công/hoàn thành</h4>
          {assignedTests.length === 0 ? (
            <div className="text-gray-500 italic">Chưa có xét nghiệm nào được phân công.</div>
          ) : (
            <>
              {/* Calculate total unpaid price */}
              {(() => {
                const unpaidTests = assignedTests.filter(test => test.paymentStatus === 'unpaid');
                const totalUnpaid = unpaidTests.reduce((sum, test) => sum + (test.testId?.price || 0), 0);
                return unpaidTests.length > 0 ? (
                  <div className="mb-4 flex flex-col md:flex-row md:items-center gap-2">
                    <span className="font-semibold text-yellow-700">Số lượng xét nghiệm chưa thanh toán: {unpaidTests.length}</span>
                    <span className="font-semibold text-yellow-700">Tổng: {totalUnpaid.toLocaleString()}₫</span>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded shadow"
                      onClick={async () => {
                        try {
                          // Send all unpaid test IDs to backend for payment link
                          const res = await axiosInstance.post(`/test-assignment/pay-multi`, {
                            testIds: unpaidTests.map(test => test._id),
                          });
                          if (res.data && res.data.url) {
                            window.location.href = res.data.url;
                          } else {
                            toast.error('Không thể tạo link thanh toán');
                          }
                        } catch {
                          toast.error('Không thể tạo link thanh toán');
                        }
                      }}
                    >
                      Thanh toán tất cả xét nghiệm
                    </button>
                  </div>
                ) : null;
              })()}
              <ul className="space-y-2">
                {assignedTests.map(test => (
                  <li key={test._id} className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex flex-col gap-2">
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <span className="font-medium text-blue-700">{test.testId?.name}</span>
                      <span className="text-gray-700">Y tá: {typeof test.nurseId === 'object' ? test.nurseId.userName : test.nurseId}</span>
                      <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">{test.status}</span>
                      <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">Giá: {test.testId?.price?.toLocaleString()}₫</span>
                      <span className={`text-xs px-2 py-1 rounded ${test.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{test.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
                    </div>
                    {test.result && (
                      <div className="mt-2">
                        <span className="font-semibold text-green-700">Kết quả:</span>
                        {(test.testId?.name === 'CT Scan' || test.testId?.name === 'Chụp CT' || test.testId?.name === 'X-ray' || test.testId?.name === 'X-quang' || test.testId?.name === 'Siêu âm bụng') ? (
                          <div className="mt-1 flex flex-wrap gap-2">
                            {Array.isArray(test.result.imageUrls) && test.result.imageUrls.length > 0 ? (
                              test.result.imageUrls.map((url, idx) => (
                                <img key={idx} src={url} alt={`Ảnh xét nghiệm ${idx + 1}`} className="max-w-xs rounded shadow" />
                              ))
                            ) : test.result.imageUrl ? (
                              <img src={test.result.imageUrl} alt="Ảnh xét nghiệm" className="max-w-xs rounded shadow" />
                            ) : null}
                            {test.result.notes && (
                              <div className="w-full text-gray-700 mt-1">Ghi chú: {test.result.notes}</div>
                            )}
                          </div>
                        ) : (
                          <div className="mt-1 grid grid-cols-2 gap-2">
                            {typeof test.result === 'object' ? (
                              Object.entries(test.result).map(([key, value]) => (
                                key !== 'imageUrl' && key !== 'imageUrls' && key !== 'notes' ? (
                                  <div key={key} className="text-gray-700">
                                    <b>{key}:</b> {value}
                                  </div>
                                ) : null
                              ))
                            ) : (
                              <div className="text-gray-700">{test.result}</div>
                            )}
                            {test.result.notes && (
                              <div className="col-span-2 text-gray-700 mt-1">Ghi chú: {test.result.notes}</div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
      {user.role === "doctor" ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white rounded-xl shadow p-8"
        >
          <div>
            <label className="block font-semibold mb-1">Triệu chứng</label>
            <textarea
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 resize-vertical min-h-[300px]"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Chẩn đoán</label>
            <textarea
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 resize-vertical min-h-[300px]"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Kết luận</label>
            <textarea
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 resize-vertical min-h-[300px]"
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Đơn thuốc</label>
          <div className="space-y-3">
            {prescriptions.map((pres, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2 bg-gray-50 rounded-lg p-3 shadow-sm"
              >
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1">Thuốc</label>
                    <select
                      value={pres.medicineId}
                      onChange={(e) =>
                        updatePrescription(idx, "medicineId", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-1 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    >
                      <option value="">Chọn thuốc</option>
                      {medicines.map((med) => (
                        <option key={med._id} value={med._id}>
                          {med.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1">Liều lượng</label>
                    {getMedicineType(pres.medicineId) === "ointment" ? (
                      <select
                        value={pres.dosage}
                        onChange={(e) => updatePrescription(idx, "dosage", e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 min-w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      >
                        <option value="">Chọn lượng</option>
                        <option value="apply thin layer">Bôi một lớp mỏng</option>
                        <option value="pea-sized amount">Lượng bằng hạt đậu</option>
                        <option value="cover affected area">Phủ vùng bị ảnh hưởng</option>
                        <option value="as directed">Theo chỉ dẫn</option>
                      </select>
                    ) : (
                      <input
                        placeholder={getDosagePlaceholder(getMedicineType(pres.medicineId))}
                        value={pres.dosage}
                        onChange={(e) =>
                          updatePrescription(idx, "dosage", e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1 min-w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      />
                    )}
                  </div>
                  {/* Frequency removed */}
                  <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1">Thời gian dùng</label>
                    <input
                      placeholder="Thời gian dùng"
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
                      title="Xóa"
                    >
                      &times;
                    </button>
                  )}
                </div>
                {/* Instruction sets for this medicine */}
                <div className="ml-2 mt-2">
                  <label className="text-xs font-semibold">Hướng dẫn sử dụng</label>
                  {pres.instructions.map((instr, instrIdx) => (
                    <div key={instrIdx} className="flex flex-wrap gap-2 items-center mt-1">
                      {getMedicineType(pres.medicineId) !== "ointment" && (
                        <>
                          <select
                            value={instr.mealTime}
                            onChange={(e) => updateInstruction(idx, instrIdx, "mealTime", e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 min-w-[100px] focus:outline-none"
                          >
                            <option value="">Thời điểm ăn</option>
                            <option value="Breakfast">Sáng</option>
                            <option value="Lunch">Trưa</option>
                            <option value="Dinner">Tối</option>
                          </select>
                          <select
                            value={instr.mealRelation}
                            onChange={(e) => updateInstruction(idx, instrIdx, "mealRelation", e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 min-w-[100px] focus:outline-none"
                          >
                            <option value="">Liên quan bữa ăn</option>
                            <option value="Before Meal">Trước ăn</option>
                            <option value="After Meal">Sau ăn</option>
                          </select>
                        </>
                      )}
                      <input
                        type="text"
                        placeholder="Hướng dẫn thêm"
                        value={instr.custom}
                        onChange={(e) => updateInstruction(idx, instrIdx, "custom", e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 min-w-[120px] focus:outline-none"
                      />
                      {pres.instructions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeInstruction(idx, instrIdx)}
                          className="text-red-600 px-2 text-lg hover:bg-red-50 rounded transition"
                          title="Xóa hướng dẫn"
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
                    + Thêm hướng dẫn
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
            + Thêm thuốc
          </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow transition"
          >
            {editMode ? "Cập nhật hồ sơ bệnh án" : "Lưu hồ sơ bệnh án"}
          </button>
        </form>
      ) : (
        // Patient view: read-only
        <div className="space-y-6 bg-white rounded-xl shadow p-8">
          <div>
            <label className="block font-semibold mb-1">Triệu chứng</label>
            <textarea
              className="border border-gray-300 rounded px-3 py-2 w-full bg-gray-100 resize-vertical min-h-[120px]"
              value={symptoms}
              readOnly
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Chẩn đoán</label>
            <textarea
              className="border border-gray-300 rounded px-3 py-2 w-full bg-gray-100 resize-vertical min-h-[120px]"
              value={diagnosis}
              readOnly
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Kết luận</label>
            <textarea
              className="border border-gray-300 rounded px-3 py-2 w-full bg-gray-100 resize-vertical min-h-[120px]"
              value={conclusion}
              readOnly
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Đơn thuốc</label>
          <div className="space-y-3">
            {prescriptions.map((pres, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2 bg-gray-50 rounded-lg p-3 shadow-sm"
              >
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1">Thuốc</label>
                    <input
                      value={
                        medicines.find((m) => m._id === pres.medicineId)?.name || ""
                      }
                      className="border border-gray-300 rounded px-2 py-1 min-w-[120px] bg-gray-100"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1">Liều lượng</label>
                    <input
                      value={pres.dosage}
                      className="border border-gray-300 rounded px-2 py-1 w-24 bg-gray-100"
                      readOnly
                    />
                  </div>
                  {/* Frequency removed */}
                  <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1">Thời gian dùng</label>
                    <input
                      value={pres.duration}
                      className="border border-gray-300 rounded px-2 py-1 w-24 bg-gray-100"
                      readOnly
                    />
                  </div>
                </div>
                {/* Show all instructions for this medicine */}
                <div className="ml-2 mt-2">
                  <label className="text-xs font-semibold mb-1">Hướng dẫn sử dụng</label>
                  <div className="grid grid-cols-1 gap-2">
                    {(!pres.instructions || pres.instructions.length === 0 ||
                      pres.instructions.every(instr => !instr.mealTime && !instr.mealRelation && !instr.custom)) ? (
                      <div className="text-gray-400 italic">Không có hướng dẫn</div>
                    ) : (
                      (pres.instructions && pres.instructions.length > 0
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
                                {main.length > 0 ? main : <span className="text-gray-400 italic">Không có thông tin bữa ăn</span>}
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
                      })
                    )}
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