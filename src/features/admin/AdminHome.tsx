import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";

const AdminHome = () => {
  const navigate = useNavigate();
  return (
    <AdminLayout>
      <div className="h-max rounded bg-white px-4 py-2 shadow-sm">
        <div className="mb-2 flex items-center justify-between"></div>
      </div>
    </AdminLayout>
  );
};

export default AdminHome;
