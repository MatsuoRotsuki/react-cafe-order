import { Link } from "react-router-dom";
import Logo from "../assets/coffee-logo.png";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useAuthStore } from "../stores/authStore";

const NavigationBar = () => {
  const logout = useAuthStore((state) => state.logout);
  return (
    <header className="sticky z-30 top-0 shadow-md shadow-gray-400">
      <nav className="py-3 px-4 bg-white border-gray-200 mx-auto container">
        <div className="flex items-center max-h-[60px] justify-between">
          <div className="flex flex-row items-center gap-4">
            <Link to="/menu">
              <img
                src={Logo}
                className="object-cover"
                loading="lazy"
                width={40}
                height={40}
              />
            </Link>
            <h4 className="text-2xl text-gray-700">Kafemely</h4>
          </div>
          <div className="flex space-x-2 items-center justify-center">
            <button className="border border-gray-400 py-2 px-3 ">
              <ShoppingCartOutlined />
            </button>
            <button
              className="border border-gray-400 py-2 px-3 "
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavigationBar;
