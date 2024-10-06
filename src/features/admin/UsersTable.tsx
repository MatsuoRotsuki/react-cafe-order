import type { ColumnType } from "antd/es/table";
import { useUsersStore } from "../../stores/usersStore";
import { EditOutlined } from "@ant-design/icons";
import Table from "antd/es/table";

const UsersTable = () => {
  const users = useUsersStore((state) => state.users);

  const columns: ColumnType<IUser> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        <button
          className="transition-colors hover:text-blue-500"
          onClick={() => console.log(record.id)}
        >
          {text}
        </button>
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text, record) => (
        <button
          className="transition-colors hover:text-blue-500"
          onClick={() => console.log(record.id)}
        >
          {text}
        </button>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text, record) => <p>{text}</p>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text, record) => <p>{String(text).toUpperCase()}</p>,
    },
    {
      title: " ",
      key: "action",
      render: (_, record) => (
        <button onClick={() => console.log(record.id)}>
          <EditOutlined className="cursor-pointer text-blue-500" />
        </button>
      ),
    },
  ];

  if (!users) return <></>;

  return <Table columns={columns} dataSource={Array.from(users.values())} />;
};

export default UsersTable;
