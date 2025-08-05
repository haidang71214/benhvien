import { Outlet, NavLink } from "react-router-dom";
import { User, Lock, Settings } from "lucide-react";

const AccountLayout = () => {
  const navItems = [
    {
      to: "/cai-dat-tai-khoan",
      icon: User,
      label: "Hồ sơ bệnh nhân",
      end: true
    },
    {
      to: "/cai-dat-tai-khoan/doi-mat-khau", 
      icon: Lock,
      label: "Đổi mật khẩu"
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24">
      <aside className="w-72 bg-white/80 backdrop-blur-sm shadow-xl border-r border-slate-200/50">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Cài đặt tài khoản</h2>
              <p className="text-sm text-slate-500">Quản lý tùy chọn của bạn</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]" 
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-800 hover:shadow-md hover:scale-[1.01]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`p-2 rounded-lg transition-colors ${
                        isActive 
                          ? "bg-white/20" 
                          : "bg-slate-100 group-hover:bg-slate-200"
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none" />
      </aside>

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 min-h-[600px]">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountLayout;