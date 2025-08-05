import React from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaFileInvoiceDollar,
  FaPills,
} from "react-icons/fa";

const menuItems = [
  { icon: <FaTachometerAlt />, label: "Dashboard", path: "/admin/dashboard" },
  { icon: <FaUsers />, label: "User", path: "/admin/users" },
  { icon: <FaPills />, label: "Medicine", path: "/admin/medicines" },
  { icon: <FaFileInvoiceDollar />, label: "Test", path: "/admin/tests" },
  { icon: <FaFileInvoiceDollar />, label: "Invoice", path: "/admin/invoices" },
];

const Sidebar = ({ activePath }) => (
  <div className="w-64 min-h-screen bg-white border-r flex flex-col py-8 px-4">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-blue-600">Admin Panel</h2>
    </div>
    <nav className="flex flex-col gap-2">
      {menuItems.map((item) => {
        // Highlight active for /admin/tests like AdminUser does for /admin/users
        const isActive = activePath === item.path || (item.path === "/admin/tests" && activePath.startsWith("/admin/tests"));
        return (
          <a
            key={item.label}
            href={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-blue-50 transition ${isActive ? "bg-blue-50 text-blue-600" : ""}`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </a>
        );
      })}
    </nav>
  </div>
);

export default Sidebar;