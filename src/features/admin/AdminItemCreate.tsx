import { Button, Form, Input, InputNumber, message, Select, Space } from "antd";
import AdminLayout from "../../components/AdminLayout";
import SubHeader from "../../components/SubHeader";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import UploadImage, { UploadFile } from "../../components/UploadImage";
import {
  LoadingOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import uploadFile from "../../hooks/uploadFile";
import { useMenuStore } from "../../stores/menusStore";
import Title from "antd/es/typography/Title";
import { FirebaseError } from "firebase/app";

const AdminItemCreate = () => {
  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();

  const categories = useMenuStore((state) => state.categories);
  const createMenuItem = useMenuStore((state) => state.createMenuItem);

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<UploadFile | null>(null);
  const onFinish = async (values: IMenuItem) => {
    try {
      setLoading(true);
      let imageUrl: string | undefined = undefined;
      if (image) imageUrl = await uploadFile(image);
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
        name,
        basePrice,
        description,
        categoryId,
        availableBaseProps,
        availableVariationProps: availableVariationProps || [],
        availableExtraProps: availableExtraProps || [],
        thumbnailUrl: imageUrl,
      } as IMenuItem;

      await createMenuItem(newItem);

      form.resetFields();

      messageApi.open({
        type: "success",
        content: "Tạo món ăn mới thành công",
      });
      navigate(-1);
    } catch (error) {
      const firebaseError = error as FirebaseError;
      messageApi.open({
        type: "error",
        content: firebaseError.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {contextHolder}
      <div className="min-h-full w-full rounded-lg bg-white px-4 py-2 shadow-md">
        <SubHeader title="Thêm món ăn mới" type="create" />
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          name="form in modal"
          title="Thêm món ăn"
          initialValues={{ modifier: "public" }}
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

export default AdminItemCreate;
