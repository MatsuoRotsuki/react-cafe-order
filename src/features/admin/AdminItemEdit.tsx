import { Button, Form, Input, InputNumber, message, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UploadImage, { UploadFile } from "../../components/UploadImage";
import { useMenuStore } from "../../stores/menusStore";
import AdminLayout from "../../components/AdminLayout";
import SubHeader from "../../components/SubHeader";
import {
  LoadingOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import { getDishById, updateDish } from "../../lib/menu";
import uploadFile from "../../hooks/uploadFile";

const AdminItemEdit = () => {
  const { id } = useParams();

  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();

  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<UploadFile | null>(null);

  const categories = useMenuStore((state) => state.categories);
  const getMenuItemById = useMenuStore((state) => state.getMenuItemById);
  const menuItem = useMenuStore((state) => state.menuItem);

  useEffect(() => {
    async function fetchImage(imageUrl: string | undefined) {
      if (imageUrl) {
        const response = await fetch(imageUrl, { mode: "no-cors" });
        const blob = await response.blob();
        const file = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });
        const previewUrl = imageUrl;
        const uploadFile = file as UploadFile;
        uploadFile.preview = previewUrl;
        setImage(uploadFile);
      }
    }
    async function setForm() {
      const menuItemData = await getDishById(id);
      if (!menuItemData) return;
      form.setFieldsValue(menuItemData);
      await fetchImage(menuItemData.thumbnailUrl);
    }
    setForm();
    getMenuItemById(id);
  }, [id, form, getMenuItemById]);

  const onFinish = async (values: IMenuItem) => {
    try {
      setLoading(true);
      let imageUrl: string | undefined = undefined;
      if (image && image.preview !== menuItem.thumbnailUrl) {
        imageUrl = await uploadFile(image);
      } else if (image && image.preview === menuItem.thumbnailUrl) {
        imageUrl = menuItem.thumbnailUrl;
      }
      const {
        name,
        basePrice,
        description,
        categoryId,
        availableBaseProps,
        availableVariationProps,
        availableExtraProps,
      } = values;

      const newItem = {
        id: id,
        name,
        basePrice,
        description,
        categoryId,
        availableBaseProps,
        availableVariationProps,
        availableExtraProps,
        thumbnailUrl: imageUrl,
      } as IMenuItem;
      console.log(newItem);
      await updateDish(newItem);

      messageApi.open({
        type: "success",
        content: "Chỉnh sửa món ăn thành công",
      });

      form.resetFields();
      navigate("/admin/menu");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <AdminLayout>
      {contextHolder}
      <div className="min-h-full w-full rounded-lg bg-white px-4 py-2 shadow-md">
        <SubHeader title="Chỉnh sửa món ăn" type="create" />
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          name="form in modal"
          title="Chỉnh sửa món ăn"
          className="grid auto-rows-max grid-cols-8"
        >
          <div className="col-span-6 col-start-1">
            <Form.Item
              name="name"
              label="Tên món ăn"
              labelCol={{ span: 8 }}
              rules={[{ required: true, message: "Hãy ghi tên của món ăn" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="basePrice"
              label="Giá gốc"
              labelCol={{ span: 8 }}
              rules={[
                { required: true, message: "Hãy nhập giá gốc của món ăn" },
              ]}
            >
              <InputNumber defaultValue={0} addonAfter="VND" min={0} />
            </Form.Item>
            <Form.Item name="description" label="Mô tả" labelCol={{ span: 8 }}>
              <Input />
            </Form.Item>
            <Form.Item
              name="categoryId"
              label="Danh mục"
              labelCol={{ span: 8 }}
              rules={[
                {
                  required: true,
                  message: "Hãy chọn một danh mục",
                },
              ]}
            >
              <Select placeholder="Chọn một danh mục" allowClear>
                {categories.map((category) => (
                  <Select.Option value={category.id} key={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Title level={4}>Các tùy chọn đơn vị tính</Title>
            <Form.List
              name="availableBaseProps"
              rules={[
                {
                  validator: (_, value) => {
                    if (!value || value.length === 0) {
                      return Promise.reject(
                        new Error("Bạn phải thêm ít nhất một tùy chọn")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <>
                      <Form.Item key={key}>
                        <Form.Item
                          {...restField}
                          label="Tên tùy chọn"
                          name={[name, "name"]}
                          rules={[
                            {
                              required: true,
                              message: "Hãy nhập tên một tùy chọn",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label="Đơn giá tùy chọn"
                          name={[name, "price"]}
                          rules={[
                            {
                              required: true,
                              message: "Hãy nhập đơn giá tùy chọn",
                            },
                          ]}
                        >
                          <InputNumber
                            defaultValue={0}
                            addonAfter="VND"
                            min={0}
                          />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Form.Item>
                    </>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm tùy chọn
                    </Button>

                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Title level={4}>Các thuộc tính variation cho món ăn</Title>
            <Form.List name="availableVariationProps">
              {(fields, { add, remove }) => {
                return (
                  <>
                    {fields.map(({ key, name, ...restFields }) => (
                      <Form.Item key={key}>
                        <Form.Item
                          {...restFields}
                          name={[name, "alias"]}
                          label="Tên gợi nhớ"
                          rules={[
                            {
                              required: true,
                              message: "Hãy nhập vào tên gợi nhớ",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item
                          {...restFields}
                          name={[name, "name"]}
                          label="Tên thuộc tính (hiển thị với khách hàng)"
                          rules={[
                            {
                              required: true,
                              message:
                                "Hãy nhập tên thuộc tính hiển thị với khách hàng",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item label="Các tùy chọn">
                          <Form.List
                            name={[name, "options"]}
                            rules={[
                              {
                                validator: (_, values) => {
                                  if (!values || values.length === 0) {
                                    return Promise.reject(
                                      new Error("Hãy thêm một tùy chọn")
                                    );
                                  }
                                  return Promise.resolve();
                                },
                              },
                            ]}
                          >
                            {(subFields, { add, remove }, { errors }) => (
                              <div className="flex flex-col gap-3">
                                {subFields.map(
                                  ({ key, name, ...restFields }) => (
                                    <Space key={key} align="start">
                                      <Form.Item
                                        {...restFields}
                                        label="Tên tùy chọn"
                                        name={[name, "name"]}
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              "Hãy nhập tên một tùy chọn",
                                          },
                                        ]}
                                      >
                                        <Input />
                                      </Form.Item>
                                      <Form.Item
                                        {...restFields}
                                        label="Đơn giá tùy chọn"
                                        name={[name, "price"]}
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              "Hãy nhập đơn giá tùy chọn",
                                          },
                                        ]}
                                      >
                                        <InputNumber
                                          defaultValue={0}
                                          addonAfter="VND"
                                          min={0}
                                        />
                                      </Form.Item>
                                      <MinusCircleOutlined
                                        onClick={() => remove(name)}
                                      />
                                    </Space>
                                  )
                                )}
                                <Form.Item>
                                  <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                  >
                                    Thêm tùy chọn
                                  </Button>
                                  <Form.ErrorList errors={errors} />
                                </Form.Item>
                              </div>
                            )}
                          </Form.List>
                        </Form.Item>

                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Form.Item>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Thêm thuộc tính
                      </Button>
                    </Form.Item>
                  </>
                );
              }}
            </Form.List>

            <Title level={4}>Các thuộc tính extra cho món ăn</Title>
            <Form.List name="availableExtraProps">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restFields }) => (
                    <Form.Item key={key}>
                      <Form.Item
                        {...restFields}
                        name={[name, "alias"]}
                        label="Tên gợi nhớ"
                        rules={[
                          {
                            required: true,
                            message: "Hãy nhập vào tên gợi nhớ",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        {...restFields}
                        name={[name, "name"]}
                        label="Tên thuộc tính (hiển thị với khách hàng)"
                        rules={[
                          {
                            required: true,
                            message:
                              "Hãy nhập tên thuộc tính hiển thị với khách hàng",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item label="Các tùy chọn">
                        <Form.List
                          name={[name, "options"]}
                          rules={[
                            {
                              validator: (_, values) => {
                                if (!values || values.length === 0) {
                                  return Promise.reject(
                                    new Error("Hãy thêm một tùy chọn")
                                  );
                                }
                                return Promise.resolve();
                              },
                            },
                          ]}
                        >
                          {(subFields, { add, remove }, { errors }) => (
                            <div className="flex flex-col gap-3">
                              {subFields.map(({ key, name, ...restFields }) => (
                                <Space key={key} align="start">
                                  <Form.Item
                                    {...restFields}
                                    label="Tên tùy chọn"
                                    name={[name, "name"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Hãy nhập tên một tùy chọn",
                                      },
                                    ]}
                                  >
                                    <Input />
                                  </Form.Item>
                                  <Form.Item
                                    {...restFields}
                                    label="Đơn giá tùy chọn"
                                    name={[name, "price"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Hãy nhập đơn giá tùy chọn",
                                      },
                                    ]}
                                  >
                                    <InputNumber
                                      defaultValue={0}
                                      addonAfter="VND"
                                      min={0}
                                    />
                                  </Form.Item>
                                  <MinusCircleOutlined
                                    onClick={() => remove(name)}
                                  />
                                </Space>
                              ))}
                              <Form.Item>
                                <Button
                                  type="dashed"
                                  onClick={() => add()}
                                  block
                                  icon={<PlusOutlined />}
                                >
                                  Thêm tùy chọn
                                </Button>
                                <Form.ErrorList errors={errors} />
                              </Form.Item>
                            </div>
                          )}
                        </Form.List>
                      </Form.Item>

                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm thuộc tính
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Form.Item name="thumbnailUrl" label="Ảnh món ăn">
              <UploadImage image={image} setImage={setImage} />
            </Form.Item>
            <Form.Item className="col-span-8 col-start-6 ms-32">
              <Space>
                <Button
                  type="primary"
                  htmlType="button"
                  className="bg-red-500"
                  onClick={() => console.log("Cancel")}
                >
                  Hủy
                </Button>
                <Button
                  disabled={loading}
                  type="primary"
                  htmlType="submit"
                  ghost
                >
                  {loading ? <LoadingOutlined /> : "Tạo"}
                </Button>
              </Space>
            </Form.Item>
          </div>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default AdminItemEdit;
