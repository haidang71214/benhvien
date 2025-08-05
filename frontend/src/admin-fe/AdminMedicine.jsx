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
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const AdminMedicine = () => {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-700 text-lg">Loading medicines...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Pill className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Medicine Management
              </h1>
            </div>
            <div className="text-sm text-gray-500">Admin Dashboard</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search medicines..."
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
                  <option value="all">All Types</option>
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
              {showCreateForm ? "Cancel" : "Add Medicine"}
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
                {editingMedicine ? "Edit Medicine" : "Add New Medicine"}
              </h2>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Medicine Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                    placeholder="Enter medicine name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type *
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
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                  rows="3"
                  placeholder="Enter medicine description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Warning
                </label>
                <textarea
                  name="warning"
                  value={formData.warning}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                  rows="2"
                  placeholder="Enter any warnings"
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
                  {editingMedicine ? "Update Medicine" : "Add Medicine"}
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
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Medicines List */}
        <div className="grid gap-6">
          {filteredMedicines.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <p className="text-gray-500">No medicines found.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedicines.map((medicine) => (
                <div
                  key={medicine._id}
                  className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getTypeIcon(medicine.type)}</div>
                      <div>
                        <h3 className="text-lg font-bold">{medicine.name}</h3>
                        <span className="text-sm text-gray-500 capitalize">
                          {medicine.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-2">
                    {medicine.description}
                  </p>

                  {medicine.warning && (
                    <button
                      onClick={() => toast.warning(medicine.warning)}
                      className="text-amber-700 text-sm hover:underline"
                    >
                      ⚠ View Warning
                    </button>
                  )}

                  <div className="flex gap-2 pt-4">
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
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded"
                    >
                      <Edit className="h-4 w-4 inline" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMedicine(medicine._id)}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded"
                    >
                      <Trash2 className="h-4 w-4 inline" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMedicine;