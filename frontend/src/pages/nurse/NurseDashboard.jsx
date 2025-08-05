import { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const NurseDashboard = () => {
  const { user } = useAuth();
  const [assignedTests, setAssignedTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resultInputs, setResultInputs] = useState({});

useEffect(() => {
  if (!user || user.role !== "nurse" || !user.id) {
    console.log("NurseDashboard: user or user.id missing", user);
    return;
  }
  console.log("NurseDashboard: Fetching assigned tests for nurse", user.id);
  setLoading(true);
  axiosInstance
    .get(`/test-assignment/assigned/${user.id}`)
    .then((res) => {
      console.log("NurseDashboard: API response", res.data);
      setAssignedTests(res.data.data || []);
    })
    .catch((err) => {
      console.error("NurseDashboard: API error", err);
      toast.error("Không thể tải danh sách xét nghiệm");
    })
    .finally(() => setLoading(false));
}, [user]);

  const handleResultChange = (testId, value) => {
    setResultInputs((prev) => ({ ...prev, [testId]: value }));
  };

  const handleSubmitResult = async (testId) => {
    const result = resultInputs[testId];
    if (!result) {
      toast.error("Vui lòng nhập kết quả xét nghiệm");
      return;
    }
    try {
      await axiosInstance.put(`/test-assignment/result/${testId}`, { result });
      toast.success("Đã cập nhật kết quả!");
      setAssignedTests((prev) => prev.filter((t) => t._id !== testId));
      setResultInputs((prev) => ({ ...prev, [testId]: "" }));
    } catch {
      toast.error("Lỗi khi cập nhật kết quả");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto pt-24 px-4">
      <h2 className="text-3xl font-bold mb-8 text-blue-700 flex items-center gap-3">
        <span role="img" aria-label="nurse" className="text-blue-400 text-4xl">🩺</span>
        Nurse Dashboard
      </h2>
      <div className="mb-10 bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
        <h3 className="text-xl font-bold text-blue-700 mb-6 flex items-center gap-2">
          <span role="img" aria-label="test" className="text-blue-400 text-2xl">🧪</span>
          Assigned Tests
        </h3>
        {assignedTests.length === 0 ? (
          <div className="text-gray-500 italic text-center py-12">
            <span className="text-4xl block mb-4">🧑‍⚕️</span>
            No tests assigned.<br />
            <span className="text-xs text-gray-400">Nurse ID: {user?.id || 'unknown'}</span>
            <br />
            <span className="text-xs text-gray-400">If you expect tests, check backend for TestAssignment documents with nurseId matching above and status 'assigned'.</span>
          </div>
        ) : (
          <ul className="space-y-6">
            {assignedTests.map((test) => (
              <li key={test._id} className="bg-blue-50 border border-blue-200 rounded-2xl px-6 py-5 flex flex-col gap-3 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-700 text-lg">{test.testId?.name}</span>
                    <span className="ml-2 px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold">{test.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                    <span>Patient: <b>{test.patientId?.userName}</b></span>
                    <span>Doctor: <b>{test.doctorId?.userName}</b></span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 mt-2">
                  {/* CT scan and X-ray: file upload and notes */}
                  {(test.testId?.name === 'CT Scan' || test.testId?.name === 'X-ray') && (
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-xs text-blue-700">Upload Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files[0];
                          setResultInputs(prev => ({
                            ...prev,
                            [test._id]: {
                              ...(prev[test._id] || {}),
                              image: file
                            }
                          }));
                        }}
                        className="border border-gray-300 rounded px-2 py-1 min-w-[200px] bg-white"
                      />
                      <label className="font-semibold text-xs text-blue-700">Notes</label>
                      <input
                        type="text"
                        placeholder="Notes"
                        value={resultInputs[test._id]?.notes || ""}
                        onChange={e => setResultInputs(prev => ({
                          ...prev,
                          [test._id]: {
                            ...(prev[test._id] || {}),
                            notes: e.target.value
                          }
                        }))}
                        className="border border-gray-300 rounded px-2 py-1 min-w-[200px] bg-white"
                      />
                      <button
                        onClick={async () => {
                          const input = resultInputs[test._id];
                          if (!input?.image && !input?.notes) {
                            toast.error("Vui lòng nhập ảnh hoặc ghi chú");
                            return;
                          }
                          const formData = new FormData();
                          if (input.image) formData.append('image', input.image);
                          if (input.notes) formData.append('notes', input.notes);
                          try {
                            await axiosInstance.put(`/test-assignment/result/${test._id}`, formData, {
                              headers: { 'Content-Type': 'multipart/form-data' }
                            });
                            toast.success("Đã cập nhật kết quả!");
                            setAssignedTests(prev => prev.filter(t => t._id !== test._id));
                            setResultInputs(prev => ({ ...prev, [test._id]: {} }));
                          } catch {
                            toast.error("Lỗi khi cập nhật kết quả");
                          }
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow mt-2"
                      >
                        <span role="img" aria-label="submit">📤</span> Submit Result
                      </button>
                    </div>
                  )}
                  {/* Blood test: multiple fields */}
                  {test.testId?.name === 'Blood Test' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="font-semibold text-xs text-blue-700">Hemoglobin</label>
                        <input
                          type="number"
                          placeholder="Hemoglobin"
                          value={resultInputs[test._id]?.hemoglobin || ""}
                          onChange={e => setResultInputs(prev => ({
                            ...prev,
                            [test._id]: {
                              ...(prev[test._id] || {}),
                              hemoglobin: e.target.value
                            }
                          }))}
                          className="border border-gray-300 rounded px-2 py-1 w-full bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-xs text-blue-700">WBC</label>
                        <input
                          type="number"
                          placeholder="WBC"
                          value={resultInputs[test._id]?.wbc || ""}
                          onChange={e => setResultInputs(prev => ({
                            ...prev,
                            [test._id]: {
                              ...(prev[test._id] || {}),
                              wbc: e.target.value
                            }
                          }))}
                          className="border border-gray-300 rounded px-2 py-1 w-full bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-xs text-blue-700">Platelets</label>
                        <input
                          type="number"
                          placeholder="Platelets"
                          value={resultInputs[test._id]?.platelets || ""}
                          onChange={e => setResultInputs(prev => ({
                            ...prev,
                            [test._id]: {
                              ...(prev[test._id] || {}),
                              platelets: e.target.value
                            }
                          }))}
                          className="border border-gray-300 rounded px-2 py-1 w-full bg-white"
                        />
                      </div>
                      <div className="col-span-1 sm:col-span-3 mt-2">
                        <button
                          onClick={async () => {
                            const input = resultInputs[test._id];
                            if (!input?.hemoglobin && !input?.wbc && !input?.platelets) {
                              toast.error("Vui lòng nhập kết quả xét nghiệm máu");
                              return;
                            }
                            await handleSubmitResult(test._id, input);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow w-full"
                        >
                          <span role="img" aria-label="submit">📤</span> Submit Result
                        </button>
                      </div>
                    </div>
                  )}
                  {/* Urine test: multiple fields */}
                  {test.testId?.name === 'Urine Test' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="font-semibold text-xs text-blue-700">pH</label>
                        <input
                          type="number"
                          placeholder="pH"
                          value={resultInputs[test._id]?.ph || ""}
                          onChange={e => setResultInputs(prev => ({
                            ...prev,
                            [test._id]: {
                              ...(prev[test._id] || {}),
                              ph: e.target.value
                            }
                          }))}
                          className="border border-gray-300 rounded px-2 py-1 w-full bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-xs text-blue-700">Protein</label>
                        <input
                          type="number"
                          placeholder="Protein"
                          value={resultInputs[test._id]?.protein || ""}
                          onChange={e => setResultInputs(prev => ({
                            ...prev,
                            [test._id]: {
                              ...(prev[test._id] || {}),
                              protein: e.target.value
                            }
                          }))}
                          className="border border-gray-300 rounded px-2 py-1 w-full bg-white"
                        />
                      </div>
                      <div className="col-span-1 sm:col-span-2 mt-2">
                        <button
                          onClick={async () => {
                            const input = resultInputs[test._id];
                            if (!input?.ph && !input?.protein) {
                              toast.error("Vui lòng nhập kết quả xét nghiệm nước tiểu");
                              return;
                            }
                            await handleSubmitResult(test._id, input);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow w-full"
                        >
                          <span role="img" aria-label="submit">📤</span> Submit Result
                        </button>
                      </div>
                    </div>
                  )}
                  {/* Other: generic text input */}
                  {test.testId?.name !== 'CT Scan' && test.testId?.name !== 'X-ray' && test.testId?.name !== 'Blood Test' && test.testId?.name !== 'Urine Test' && (
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-xs text-blue-700">Result</label>
                      <input
                        type="text"
                        placeholder="Enter test result"
                        value={resultInputs[test._id] || ""}
                        onChange={e => handleResultChange(test._id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 min-w-[200px] bg-white"
                      />
                      <button
                        onClick={() => handleSubmitResult(test._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow mt-2"
                      >
                        <span role="img" aria-label="submit">📤</span> Submit Result
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NurseDashboard;
