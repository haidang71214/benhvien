import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Pill, AlertCircle, Search, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminMedicine = () => {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    type: 'tablet',
    description: '',
    warning: ''
  });
  const [editingMedicine, setEditingMedicine] = useState(null);

  const medicineTypes = [
    { value: 'tablet', label: 'Tablet', icon: '💊' },
    { value: 'syrup', label: 'Syrup', icon: '🍯' },
    { value: 'capsule', label: 'Capsule', icon: '💊' },
    { value: 'ointment', label: 'Ointment', icon: '🧴' }
  ];

  // Auth check and fetch medicines on component mount
  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    if (!user.role || user.role !== 'admin') {
      alert('Bạn không có quyền truy cập trang admin. Chuyển hướng về trang chủ.');
      navigate('/');
      return;
    }

    fetchMedicines();
  }, [user, navigate]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/medicine/getAll', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log('Raw API response:', response);
      console.log('Response data:', response.data);
      
      // Ensure we're getting an array of medicines
      const medicinesData = response.data?.data || response.data || [];
      console.log('Processed medicines data:', medicinesData);
      
      setMedicines(Array.isArray(medicinesData) ? medicinesData : []);
    } catch (err) {
      console.error('Error fetching medicines:', err);
      setError('Failed to fetch medicines. Please try again.');
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateMedicine = async (e) => {
    e?.preventDefault();
    setError('');
    
    try {
      // Validate required fields
      if (!formData.name || !formData.type || !formData.description) {
        setError('Please fill in all required fields');
        return;
      }

      console.log('Sending medicine data:', formData);
      const response = await axios.post('http://localhost:8080/medicine/create', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log('Create medicine response:', response.data);
      
      if (response.data) {
        setFormData({
          name: '',
          type: 'tablet',
          description: '',
          warning: ''
        });
        setShowCreateForm(false);
        await fetchMedicines(); // Refresh the list
      }
    } catch (err) {
      console.error('Create medicine error:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        setError(err.response.data.message || 'Failed to create medicine. Please check the input and try again.');
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('No response from server. Please check your connection.');
      } else {
        console.error('Error setting up request:', err.message);
        setError('An error occurred while setting up the request.');
      }
    }
  };

  const handleUpdateMedicine = async (e) => {
    e?.preventDefault();
    setError('');
    
    try {
      // Validate required fields
      if (!formData.name || !formData.type || !formData.description) {
        setError('Please fill in all required fields');
        return;
      }

      const response = await axios.put(`http://localhost:8080/medicine/update/${editingMedicine._id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      if (response.data) {
        setEditingMedicine(null);
        setFormData({
          name: '',
          type: 'tablet',
          description: '',
          warning: ''
        });
        setShowCreateForm(false);
        await fetchMedicines(); // Refresh the list
      }
    } catch (err) {
      console.error('Update medicine error:', err);
      if (err.response) {
        setError(err.response.data.message || 'Failed to update medicine. Please try again.');
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('An error occurred while setting up the request.');
      }
    }
  };

  const handleDeleteMedicine = async (medicineId) => {
    if (window.confirm('Are you sure you want to delete this medicine? This action cannot be undone.')) {
      try {
        const response = await axios.put(`http://localhost:8080/medicine/shutDownMedicine/${medicineId}`, {}, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        });
        
        if (response.data) {
          await fetchMedicines(); // Refresh the list
        }
      } catch (err) {
        console.error('Delete medicine error:', err);
        if (err.response) {
          setError(err.response.data.message || 'Failed to delete medicine. Please try again.');
        } else if (err.request) {
          setError('No response from server. Please check your connection.');
        } else {
          setError('An error occurred while setting up the request.');
        }
      }
    }
  };

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || medicine.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type) => {
    const typeObj = medicineTypes.find(t => t.value === type);
    return typeObj ? typeObj.icon : '💊';
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
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
            <div className="text-sm text-gray-500">
              Admin Dashboard
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              {/* Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer transition-all duration-200"
                >
                  <option value="all">All Types</option>
                  {medicineTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Add Button */}
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5" />
              {showCreateForm ? 'Cancel' : 'Add Medicine'}
            </button>
          </div>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8 transform animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
              </h2>
            </div>

            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

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
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
                  >
                    {medicineTypes.map(type => (
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  rows="2"
                  placeholder="Enter any warnings or precautions"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={editingMedicine ? handleUpdateMedicine : handleCreateMedicine}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  {editingMedicine ? 'Update Medicine' : 'Add Medicine'}
                </button>
                {editingMedicine && (
                  <button
                    onClick={() => {
                      setEditingMedicine(null);
                      setFormData({
                        name: '',
                        type: 'tablet',
                        description: '',
                        warning: ''
                      });
                      setError('');
                    }}
                    className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Medicines Grid */}
        <div className="grid gap-6">
          {filteredMedicines.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Pill className="h-12 w-12 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No medicines found</h3>
                  <p className="text-gray-500">
                    {searchTerm || filterType !== 'all' 
                      ? 'Try adjusting your search or filter criteria' 
                      : 'Get started by adding your first medicine'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedicines.map((medicine) => (
                <div
                  key={medicine._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getTypeIcon(medicine.type)}</div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{medicine.name}</h3>
                        <span className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full capitalize">
                          {medicine.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {medicine.description}
                  </p>

                  {medicine.warning && (
                    <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                      <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-amber-800 text-sm">{medicine.warning}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setEditingMedicine(medicine);
                        setFormData({
                          name: medicine.name,
                          type: medicine.type,
                          description: medicine.description,
                          warning: medicine.warning || ''
                        });
                        setShowCreateForm(true);
                      }}
                      className="flex items-center gap-2 flex-1 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all duration-200"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMedicine(medicine._id)}
                      className="flex items-center gap-2 flex-1 bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{medicines.length}</div>
              <div className="text-blue-100 text-sm">Total Medicines</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {medicines.filter(m => m.type === 'tablet').length}
              </div>
              <div className="text-blue-100 text-sm">Tablets</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {medicines.filter(m => m.type === 'syrup').length}
              </div>
              <div className="text-blue-100 text-sm">Syrups</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {medicines.filter(m => m.warning).length}
              </div>
              <div className="text-blue-100 text-sm">With Warnings</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMedicine;