import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Pill,
  Search,
  Filter,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { axiosInstance } from "../utils/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import Sidebar from "../components/ui/Sidebar";

const AdminMedicine = () => {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "tablet",
    description: "",
    warning: "",
  });
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [currentWarning, setCurrentWarning] = useState("");

  const medicineTypes = [
    { value: "tablet", label: "Tablet", icon: "💊" },
    { value: "syrup", label: "Syrup", icon: "🍯" },
    { value: "capsule", label: "Capsule", icon: "💊" },
    { value: "ointment", label: "Ointment", icon: "🧴" },
  ];

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
      return;
    }

    if (!user.role || user.role !== "admin") {
      toast.error("Bạn không có quyền truy cập trang admin.");
      navigate("/");
      return;
    }

    fetchMedicines();
  }, [user, navigate]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/medicine/getAll", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const medicinesData = response.data?.data || response.data || [];
      setMedicines(Array.isArray(medicinesData) ? medicinesData : []);
    } catch (err) {
      console.error("Error fetching medicines:", err);
      toast.error("Failed to fetch medicines. Please try again.");
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateMedicine = async (e) => {
    e?.preventDefault();

    try {
      if (!formData.name || !formData.type || !formData.description) {
        toast.error("Please fill in all required fields");
        return;
      }

      const response = await axiosInstance.post(
        "/medicine/create",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data) {
        toast.success("Medicine created successfully!");
        setFormData({
          name: "",
          type: "tablet",
          description: "",
          warning: "",
        });
        setShowCreateForm(false);
        await fetchMedicines();
      }
    } catch (err) {
      console.error("Create medicine error:", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to create medicine. Please try again."
      );
    }
  };

  const handleUpdateMedicine = async (e) => {
    e?.preventDefault();

    try {
      if (!formData.name || !formData.type || !formData.description) {
        toast.error("Please fill in all required fields");
        return;
      }

      const response = await axiosInstance.put(
        `/medicine/update/${editingMedicine._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data) {
        toast.success("Medicine updated successfully!");
        setEditingMedicine(null);
        setFormData({
          name: "",
          type: "tablet",
          description: "",
          warning: "",
        });
        setShowCreateForm(false);
        await fetchMedicines();
      }
    } catch (err) {
      console.error("Update medicine error:", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to update medicine. Please try again."
      );
    }
  };

  const handleDeleteMedicine = async (medicineId) => {
    if (
      window.confirm("Are you sure you want to delete this medicine?")
    ) {
      try {
        const response = await axiosInstance.put(
          `/medicine/shutDownMedicine/${medicineId}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data) {
          toast.success("Medicine deleted successfully!");
          await fetchMedicines();
        }
      } catch (err) {
        console.error("Delete medicine error:", err);
        toast.error(
          err.response?.data?.message ||
            "Failed to delete medicine. Please try again."
        );
      }
    }
  };

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || medicine.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type) => {
    const typeObj = medicineTypes.find((t) => t.value === type);
    return typeObj ? typeObj.icon : "💊";
  };

  const showWarning = (warning) => {
    setCurrentWarning(warning);
    setShowWarningModal(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 pt-24">
        <Sidebar activePath={location.pathname} />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-gray-700 text-lg">Loading medicines...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 pt-24">
      <Sidebar activePath={location.pathname} />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Pill className="h-8 w-8 text-blue-600" />
            Quản lý thuốc
          </h1>
          <p className="text-gray-600">Quản lý danh sách thuốc trong hệ thống</p>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm thuốc..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg bg-white"
                >
                  <option value="all">Tất cả loại</option>
                  {medicineTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg"
            >
              <Plus className="h-5 w-5" />
              {showCreateForm ? "Hủy" : "Thêm thuốc"}
            </button>
          </div>
        </div>

        {/* Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {editingMedicine ? "Chỉnh sửa thuốc" : "Thêm thuốc mới"}
              </h2>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên thuốc *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                    placeholder="Nhập tên thuốc"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Loại *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white"
                  >
                    {medicineTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                  rows="3"
                  placeholder="Nhập mô tả thuốc"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cảnh báo
                </label>
                <textarea
                  name="warning"
                  value={formData.warning}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                  rows="2"
                  placeholder="Nhập cảnh báo (nếu có)"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={
                    editingMedicine
                      ? handleUpdateMedicine
                      : handleCreateMedicine
                  }
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg"
                >
                  {editingMedicine ? "Cập nhật thuốc" : "Thêm thuốc"}
                </button>
                {editingMedicine && (
                  <button
                    onClick={() => {
                      setEditingMedicine(null);
                      setFormData({
                        name: "",
                        type: "tablet",
                        description: "",
                        warning: "",
                      });
                    }}
                    className="px-8 py-3 border border-gray-300 rounded-lg"
                  >
                    Hủy
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Medicines List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredMedicines.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500">Không tìm thấy thuốc nào.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Tên thuốc
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Loại
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Mô tả
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Cảnh báo
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMedicines.map((medicine) => (
                    <tr key={medicine._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getTypeIcon(medicine.type)}</div>
                          <div>
                            <div className="font-semibold text-gray-900">{medicine.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {medicine.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-600 truncate" title={medicine.description}>
                            {medicine.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {medicine.warning ? (
                          <button
                            onClick={() => showWarning(medicine.warning)}
                            className="text-amber-700 text-sm hover:underline flex items-center gap-1"
                          >
                            <span>⚠</span>
                            <span>Xem cảnh báo</span>
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">Không có</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingMedicine(medicine);
                              setFormData({
                                name: medicine.name,
                                type: medicine.type,
                                description: medicine.description,
                                warning: medicine.warning || "",
                              });
                              setShowCreateForm(true);
                            }}
                            className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded text-sm hover:bg-blue-200 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                            Chỉnh sửa
                          </button>
                          <button
                            onClick={() => handleDeleteMedicine(medicine._id)}
                            className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1.5 rounded text-sm hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900">Cảnh báo</h3>
            </div>
            <div className="mb-6">
              <p className="text-gray-700 whitespace-pre-wrap">{currentWarning}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowWarningModal(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMedicine;