import { useEffect, useState } from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import Sidebar from "../components/ui/Sidebar";

const AdminInvoice = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/payment/getAll")
      .then((res) => setPayments(res.data.data || []))
      .catch((err) => setError(err.response?.data?.message || "Error fetching payments"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 pt-24">
      <Sidebar activePath={window.location.pathname} />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2 text-blue-700">
            Hóa đơn thanh toán
          </h1>
          <p className="text-gray-600">Quản lý tất cả các hóa đơn thanh toán của bệnh nhân</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            {loading ? (
              <div className="flex items-center justify-center h-32 text-gray-500">Đang tải dữ liệu...</div>
            ) : error ? (
              <div className="flex items-center justify-center h-32 text-red-600">{error}</div>
            ) : payments.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-500">Không có hóa đơn nào.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">#</th>
                      <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Mã hóa đơn</th>
                      <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Bệnh nhân</th>
                      <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Số tiền</th>
                      <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                      <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Ngày thanh toán</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment, idx) => {
                      const patient = payment.patientId;
                      let patientName = '-';
                      if (patient && typeof patient === 'object' && !Array.isArray(patient)) {
                        patientName = patient.userName || patient._id || '-';
                      } else if (typeof patient === 'string' || typeof patient === 'number') {
                        patientName = patient;
                      }
                      return (
                        <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 border-b text-gray-700">{idx + 1}</td>
                          <td className="py-3 px-4 border-b text-gray-700">{payment._id}</td>
                          <td className="py-3 px-4 border-b text-gray-700">{patientName}</td>
                          <td className="py-3 px-4 border-b text-gray-700 font-semibold">{(payment.amount * 1000).toLocaleString()}₫</td>
                          <td className="py-3 px-4 border-b">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${payment.status === 'success' ? 'bg-green-100 text-green-700' : payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{payment.status || payment.payMethod || '-'}</span>
                          </td>
                          <td className="py-3 px-4 border-b text-gray-700">{new Date(payment.payment_date || payment.createdAt).toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInvoice;
