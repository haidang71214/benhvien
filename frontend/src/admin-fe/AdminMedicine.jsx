import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/ui/Sidebar";

const AdminMedicine = () => {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'tablet',
    description: '',
    quantities: 0,
    warning: ''
  });
  const [editingMedicine, setEditingMedicine] = useState(null);

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
      const response = await axios.get('http://localhost:8080/medicine/getAllAndFilter', {
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
      setLoading(false);
    } catch (err) {
      console.error('Error fetching medicines:', err);
      setError('Failed to fetch medicines. Please try again.');
      setLoading(false);
      setMedicines([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantities' ? parseInt(value) || 0 : value
    }));
  };

  const handleCreateMedicine = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Validate required fields
      if (!formData.name || !formData.type || !formData.description || formData.quantities === undefined) {
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
          quantities: 0,
          warning: ''
        });
        setShowCreateForm(false);
        fetchMedicines();
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
    e.preventDefault();
    setError('');
    try {
      // Validate required fields
      if (!formData.name || !formData.type || !formData.description || formData.quantities === undefined) {
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
          quantities: 0,
          warning: ''
        });
        setShowCreateForm(false);
        fetchMedicines();
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
          fetchMedicines();
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-gray-700 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activePath={window.location.pathname} />
      <div className="flex-1 p-6 md:p-10">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="py-8 text-center border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800">Medicine Management</h1>
          </div>

          <div className="p-8">
            <div className="mb-8 flex justify-end">
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                {showCreateForm ? 'Cancel' : 'Add New Medicine'}
              </button>
            </div>

            {showCreateForm && (
              <div className="mb-8 p-6 border border-gray-200 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">
                  {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
                </h2>
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}
                <form onSubmit={editingMedicine ? handleUpdateMedicine : handleCreateMedicine} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="tablet">Tablet</option>
                      <option value="syrup">Syrup</option>
                      <option value="capsule">Capsule</option>
                      <option value="ointment">Ointment</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                      rows="3"
                    />
                  </div>
                  <div>
                    <label htmlFor="quantities" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      id="quantities"
                      name="quantities"
                      value={formData.quantities}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label htmlFor="warning" className="block text-sm font-medium text-gray-700 mb-1">Warning</label>
                    <textarea
                      id="warning"
                      name="warning"
                      value={formData.warning}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      rows="2"
                    />
                  </div>
                  <div className="flex justify-start gap-4">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                    >
                      {editingMedicine ? 'Update Medicine' : 'Add Medicine'}
                    </button>
                    {editingMedicine && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMedicine(null);
                          setFormData({
                            name: '',
                            type: 'tablet',
                            description: '',
                            quantities: 0,
                            warning: ''
                          });
                          setError('');
                        }}
                        className="bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {medicines.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No medicines found.</td>
                    </tr>
                  ) : (
                    medicines.map((medicine) => (
                      <tr key={medicine._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{medicine.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{medicine.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{medicine.quantities}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingMedicine(medicine);
                                setFormData({
                                  name: medicine.name,
                                  type: medicine.type,
                                  description: medicine.description,
                                  quantities: medicine.quantities,
                                  warning: medicine.warning || ''
                                });
                                setShowCreateForm(true);
                              }}
                              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMedicine(medicine._id)}
                              className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMedicine;
