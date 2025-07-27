import { useEffect, useState } from 'react';
import { getAllTests, createTest, updateTest, deleteTest } from '../utils/testApi';
import Sidebar from '../components/ui/Sidebar';
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';

const AdminTestManager = () => {
  const [tests, setTests] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: 0 });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    const data = await getAllTests();
    setTests(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    if (editId) {
      await updateTest(editId, form);
    } else {
      await createTest(form);
    }
    setForm({ name: '', description: '', price: 0 });
    setEditId(null);
    fetchTests();
  };

  const handleEdit = (test) => {
    setForm({ name: test.name, description: test.description, price: test.price });
    setEditId(test._id);
  };

  const handleDelete = async (id) => {
    await deleteTest(id);
    fetchTests();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activePath={window.location.pathname} />
      <div className="flex-1 md:p-10 mt-16 md:mt-20 lg:mt-[50px]">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="py-8 text-center border-b border-gray-200">
            <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
              <FaPlus className="text-blue-400" /> Test Type Manager
            </h1>
          </div>
          <div className="p-8">
            <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 items-center bg-blue-50 rounded-lg p-4 shadow w-full max-w-xl">
                <input
                  type="text"
                  placeholder="Test Name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="border border-blue-300 rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="number"
                  min={0}
                  placeholder="Price"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                  className="border border-blue-300 rounded px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="border border-blue-300 rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 font-semibold flex items-center gap-2 shadow">
                  {editId ? <FaCheck /> : <FaPlus />} {editId ? 'Update' : 'Add'}
                </button>
                {editId && (
                  <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded px-4 py-2 flex items-center gap-2" onClick={() => { setEditId(null); setForm({ name: '', description: '', price: 0 }); }}>
                    <FaTimes /> Cancel
                  </button>
                )}
              </form>
            </div>
            <ul className="divide-y">
              {tests.length === 0 ? (
                <li className="py-4 text-center text-gray-400 italic">No test types found.</li>
              ) : (
                tests.map(test => (
                  <li key={test._id} className="py-3 flex justify-between items-center hover:bg-blue-50 rounded-lg px-2 transition">
                    <div>
                      <span className="font-semibold text-blue-700">{test.name}</span>
                      <span className="ml-2 text-yellow-700 font-medium">{test.price.toLocaleString()}₫</span>
                      {test.description && <span className="ml-2 text-gray-500">{test.description}</span>}
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded transition flex items-center gap-1" onClick={() => handleEdit(test)} title="Edit">
                        <FaEdit /> <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button className="text-red-600 hover:text-red-800 px-2 py-1 rounded transition flex items-center gap-1" onClick={() => handleDelete(test._id)} title="Delete">
                        <FaTrash /> <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTestManager;
