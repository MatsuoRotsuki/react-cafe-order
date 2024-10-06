import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { Button, Input, message, Space, Statistic } from "antd";
import { useMenuStore } from "../../stores/menusStore";
import { DeleteOutlined, EditOutlined, WarningFilled } from "@ant-design/icons";
import { showDeleteConfirm } from "../../components/ConfirmModal";
import { FirebaseError } from "firebase/app";

const AdminItemList = () => {
  const navigate = useNavigate();
  const menuItems = useMenuStore((state) => state.menuItems);
  const total = useMenuStore((state) => state.total);
  const deleteMenuItemById = useMenuStore((state) => state.deleteMenuItemById);
  const [messageApi, contextHolder] = message.useMessage();
  const onDelete = (itemId: string) => {
    showDeleteConfirm({
      title: "Bạn có chắc chắn muốn xóa món ăn này không?",
      icon: <WarningFilled />,
      onOk: async () => {
        try {
          await deleteMenuItemById(itemId);
          messageApi.open({
            type: "success",
            content: "Xóa món ăn thành công",
          });
        } catch (e) {
          const error = e as FirebaseError;
          console.error(error);
          messageApi.open({
            type: "error",
            content: error.message,
          });
        }
      },
    });
  };
  return (
    <AdminLayout>
      {contextHolder}
      <div className="h-max rounded bg-white px-4 py-2 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <Input.Search
            className="w-[25vw]"
            placeholder="Nhập tên món ăn"
            onChange={(event) => {
              console.log(event.target.value);
            }}
          />
          <Button
            type="primary"
            ghost
            htmlType="button"
            onClick={() => navigate("/admin/menu/create")}
          >
            Thêm món ăn mới
          </Button>
        </div>
        <div className="flex w-full items-center justify-between">
          <p className="text-2xl font-medium">Danh sách món ăn</p>
          <Statistic value={total} />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-5">
        {Array.from(menuItems.values()).map((item) => (
          <div
            key={item.id}
            className="relative rounded-md bg-white shadow-sm transition-shadow hover:shadow-md p-2"
          >
            <Space className="flex items-center justify-end gap-3 pr-4 pt-2">
              <EditOutlined
                className="text-xl text-blue-500"
                onClick={() => navigate(`/admin/menu/${item.id}`)}
              />
              <DeleteOutlined
                className="text-xl text-red-500"
                onClick={() => onDelete(item.id)}
              />
            </Space>
            <button className="w-full">
              <img
                className="aspect-square w-full rounded-t-md object-contain"
                alt="menu-item"
                src={
                  item.thumbnailUrl ??
                  "https://halocoffee.posapp.vn/assets/icons/picture.svg"
                }
              />
              <div className="flex flex-col items-center justify-start gap-1 py-4">
                <p className="w-full truncate text-xl font-medium">
                  {item.name}
                </p>
                <p className="w-full truncate text-lg text-gray-800">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.basePrice ?? 0)}
                </p>
              </div>
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminItemList;
