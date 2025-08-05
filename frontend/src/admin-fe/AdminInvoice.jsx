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
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activePath={window.location.pathname} />
      <div className="flex-1 p-6 md:p-10 pt-24">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="py-8 text-center border-b border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">All Payments (Invoices)</h2>
          </div>
          <div className="p-8">
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : payments.length === 0 ? (
              <div>No payments found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b">#</th>
                      <th className="py-2 px-4 border-b">Payment ID</th>
                      <th className="py-2 px-4 border-b">Patient</th>
                      <th className="py-2 px-4 border-b">Amount</th>
                      <th className="py-2 px-4 border-b">Status</th>
                      <th className="py-2 px-4 border-b">Date</th>
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
                        <tr key={payment._id} className="text-center hover:bg-gray-50">
                          <td className="py-2 px-4 border-b">{idx + 1}</td>
                          <td className="py-2 px-4 border-b">{payment._id}</td>
                          <td className="py-2 px-4 border-b">{patientName}</td>
                          <td className="py-2 px-4 border-b">{(payment.amount * 1000).toLocaleString()}</td>
                          <td className="py-2 px-4 border-b">{payment.status || payment.payMethod || '-'}</td>
                          <td className="py-2 px-4 border-b">{new Date(payment.payment_date || payment.createdAt).toLocaleString()}</td>
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
