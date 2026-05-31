type Props = {
  active: string;
  setActive: (value: string) => void;
};

export default function Sidebar({ active, setActive }: Props) {
  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    window.location.href = "/login";
  };

  const menus = [
    {
      key: "home",
      icon: "🏠",
      title: "Trang chủ",
    },
    {
      key: "profile",
      icon: "👤",
      title: "Hồ sơ cá nhân",
    },
    {
      key: "status",
      icon: "📌",
      title: "Trạng thái hồ sơ",
    },
    {
      key: "history",
      icon: "📄",
      title: "Lịch sử nộp",
    },
  ];

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">🎓 THÍ SINH</h2>

      <div className="menu-list">
        {menus.map((item) => (
          <div
            key={item.key}
            className={`menu-item ${
              active === item.key ? "active-menu" : ""
            }`}
            onClick={() => setActive(item.key)}
          >
            <span>{item.icon}</span>
            <span>{item.title}</span>
          </div>
        ))}
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Đăng xuất
      </button>
    </div>
  );
}