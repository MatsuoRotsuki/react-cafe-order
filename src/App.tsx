import {
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Login from "./features/auth/Login";
import Prefetch from "./features/auth/Prefetch";
import RequireAuth from "./features/auth/RequireAuth";
import Register from "./features/auth/Register";
import Menu from "./features/menu/Menu";
import RedirectAuth from "./features/auth/RedirectAuth";
import CheckAdmin from "./features/auth/CheckAdmin";
import AdminHome from "./features/admin/AdminHome";
import AdminUserManage from "./features/admin/AdminUserManage";
import AdminItemList from "./features/admin/AdminItemList";
import AdminItemCreate from "./features/admin/AdminItemCreate";
import AdminItemEdit from "./features/admin/AdminItemEdit";
import Detail from "./features/menu/Detail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route element={<RedirectAuth />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route element={<Prefetch />}>
            <Route element={<RequireAuth />}>
              <Route path="menu">
                <Route index element={<Menu />} />
                <Route path=":id" element={<Detail />} />
              </Route>
              <Route element={<CheckAdmin />}>
                <Route path="admin/orders" element={<AdminHome />} />
                <Route path="admin/user" element={<AdminUserManage />} />
                <Route path="admin/menu" element={<AdminItemList />} />
                <Route path="admin/menu/create" element={<AdminItemCreate />} />
                <Route path="admin/menu/:id" element={<AdminItemEdit />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
