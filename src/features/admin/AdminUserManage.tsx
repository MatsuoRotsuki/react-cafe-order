import { Button, Input, Statistic } from "antd";
import AdminLayout from "../../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import UsersTable from "./UsersTable";
import { useUsersStore } from "../../stores/usersStore";

const AdminUserManage = () => {
  const navigate = useNavigate();
  const total = useUsersStore((state) => state.total);
  return (
    <AdminLayout>
      <div className="h-max rounded bg-white px-4 py-2 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <Input.Search
            className="w-[25vw]"
            placeholder="Nhập username người dùng"
            onChange={(event) => {
              console.log(event.target.value);
            }}
          />
        </div>

        <div className="flex w-full items-center justify-between">
          <p className="text-2xl font-medium">Danh sách người dùng</p>
          <Statistic value={total ?? 0} />
        </div>
        <UsersTable />
      </div>
    </AdminLayout>
  );
};

export default AdminUserManage;
