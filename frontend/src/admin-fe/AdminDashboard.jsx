import React, { useEffect, useState } from "react";
import {
  FaUserMd,
  FaUserInjured,
  FaPills,
  FaFileInvoiceDollar,
  FaChartBar,
} from "react-icons/fa";
import Sidebar from "../components/ui/Sidebar";
import { useLocation } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LabelList,
  LineChart,
  Line,
} from "recharts";
import { axiosInstance } from "../utils/axiosInstance";

export default function AdminDashboard() {
  const location = useLocation();
  const [stats, setStats] = useState([
    {
      label: "Bác sĩ",
      value: "-",
      icon: <FaUserMd className="text-blue-500" />,
    },
    {
      label: "Bệnh nhân",
      value: "-",
      icon: <FaUserInjured className="text-green-500" />,
    },
    {
      label: "Thuốc",
      value: "-",
      icon: <FaPills className="text-purple-500" />,
    },
    {
      label: "Hóa đơn",
      value: "-",
      icon: <FaFileInvoiceDollar className="text-yellow-500" />,
    },
  ]);

  const [recentReports, setRecentReports] = useState([
    { title: "Doanh thu (Tháng này)", value: "-", trend: "" },
    { title: "Bệnh nhân mới", value: "-", trend: "" },
    { title: "Cuộc hẹn (Tháng này)", value: "-", trend: "" },
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dữ liệu cho biểu đồ cột
  const chartData = [
    { name: "Bác sĩ", value: Number(stats[0]?.value) || 0, fill: "#2563eb" },
    { name: "Bệnh nhân", value: Number(stats[1]?.value) || 0, fill: "#22c55e" },
    { name: "Thuốc", value: Number(stats[2]?.value) || 0, fill: "#a21caf" },
    { name: "Hóa đơn", value: Number(stats[3]?.value) || 0, fill: "#eab308" },
  ];

  // Dữ liệu cho biểu đồ đường
  const doanhThu = Number(
    recentReports[0]?.value.replace(/[^\d.]/g, "")
  ) || 0;
  const cuocHen = Number(recentReports[2]?.value) || 0;
  const lineChartData = [
    { name: "Doanh thu", value: doanhThu },
    { name: "Cuộc hẹn", value: cuocHen },
  ];

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/dashboard/stats")
      .then((res) => {
        const d = res.data;
        setStats([
          {
            label: "Bác sĩ",
            value: d.doctorCount,
            icon: <FaUserMd className="text-blue-500" />,
          },
          {
            label: "Bệnh nhân",
            value: d.patientCount,
            icon: <FaUserInjured className="text-green-500" />,
          },
          {
            label: "Thuốc",
            value: d.medicineCount,
            icon: <FaPills className="text-purple-500" />,
          },
          {
            label: "Hóa đơn",
            value: d.invoiceCount,
            icon: <FaFileInvoiceDollar className="text-yellow-500" />,
          },
        ]);
        setRecentReports([
          {
            title: "Doanh thu (Tháng này)",
            value: `${d.revenue?.toLocaleString?.() ?? d.revenue ?? 0}₫`,
            trend: "",
          },
          { title: "Bệnh nhân mới", value: d.patientCount, trend: "" },
          {
            title: "Cuộc hẹn (Tháng này)",
            value: d.appointmentCount,
            trend: "",
          },
        ]);
        setError("");
      })
      .catch(() => setError("Không tải được dữ liệu bảng điều khiển."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 pt-24">
      <Sidebar activePath={location.pathname} />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <FaChartBar className="text-blue-600" /> Thông tin tổng quan 
        </h1>

        {loading ? (
          <div className="text-center text-gray-400 py-12">
            Đang tải bảng điều khiển...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : (
          <>
            {/* Thống kê nhanh */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-lg shadow p-6 flex items-center gap-4"
                >
                  <div className="text-3xl">{stat.icon}</div>
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-gray-500 text-sm">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Báo cáo gần đây */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Báo cáo gần đây</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentReports.map((report) => (
                  <div
                    key={report.title}
                    className="p-4 border rounded-lg flex flex-col gap-2"
                  >
                    <div className="text-gray-700 font-medium">
                      {report.title}
                    </div>
                    <div className="text-2xl font-bold">{report.value}</div>
                    <div className="text-green-600 text-sm">{report.trend}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phân tích tổng quan */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Tổng quan phân tích
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Biểu đồ cột */}
                <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                      barCategoryGap={30}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontWeight: 600, fontSize: 14 }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontWeight: 600, fontSize: 14 }}
                      />
                      <Tooltip
                        cursor={{ fill: "#f1f5f9" }}
                        contentStyle={{ borderRadius: 8, fontWeight: 500 }}
                      />
                      <Legend verticalAlign="top" height={36} iconType="circle" />
                      {chartData.map((entry) => (
                        <Bar
                          key={entry.name}
                          dataKey="value"
                          name={entry.name}
                          fill={entry.fill}
                          radius={[8, 8, 0, 0]}
                          isAnimationActive
                        >
                          <LabelList
                            dataKey="value"
                            position="top"
                            style={{ fontWeight: 700, fill: entry.fill }}
                          />
                        </Bar>
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Biểu đồ đường */}
                <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={lineChartData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontWeight: 600, fontSize: 14 }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontWeight: 600, fontSize: 14 }}
                      />
                      <Tooltip
                        cursor={{ fill: "#f1f5f9" }}
                        contentStyle={{ borderRadius: 8, fontWeight: 500 }}
                      />
                      <Legend verticalAlign="top" height={36} iconType="circle" />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{ r: 6, fill: "#2563eb" }}
                        activeDot={{ r: 8 }}
                        isAnimationActive
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
