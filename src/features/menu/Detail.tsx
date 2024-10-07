import { Link, useNavigate, useParams } from "react-router-dom";
import HomeLayout from "../../components/HomeLayout";
import { useCallback, useEffect, useState } from "react";
import { useCustomerMenuStore } from "../../stores/customerMenuStore";
import {
  Breadcrumb,
  Checkbox,
  Form,
  Radio,
  Input,
  Button,
  message,
} from "antd";
import { LoadingOutlined, RightOutlined } from "@ant-design/icons";
import QuantitySelector from "../../components/QuantitySelector";
import { useCustomerCartStore } from "../../stores/customerCartStore";
import { FirebaseError } from "firebase/app";

const { TextArea } = Input;

interface FormValues {
  baseProps: IItemPropOption;
  variationProps: {
    [key: string]: IItemPropOption;
  };
  extraProps: {
    [key: string]: IItemPropOption[];
  };
  note: string | undefined;
}

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const getCurrentMenuItem = useCustomerMenuStore(
    (state) => state.getCurrentMenuItem
  );
  const menuItem = useCustomerMenuStore((state) => state.menuItem);
  const categories = useCustomerMenuStore((state) => state.categories);
  const addToCart = useCustomerCartStore((state) => state.addToCart);
  useEffect(() => {
    getCurrentMenuItem(id!);
  }, [id, getCurrentMenuItem]);

  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const onAddToCart = async (values: FormValues) => {
    try {
      setLoading(true);
      const { baseProps, variationProps, extraProps, note } = values;

      const newCartItem: ICartItem = {
        menuItem: menuItem,
        quantity: quantity,
        baseProps: baseProps,
        variationProps: variationProps,
        extraProps: extraProps,
        note: note || "",
        calculatedPrice: total,
      };

      await addToCart(newCartItem);
      form.resetFields();
      messageApi.open({
        type: "success",
        content: "Thêm vào giỏ hàng thành công",
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

  const [total, setTotal] = useState<number>(0);

  const calculateTotalPrice = useCallback(
    (values: FormValues) => {
      const { baseProps, variationProps, extraProps } = values;
      const basePropsOk = baseProps != undefined;
      const variationPropsOk = Object.values(variationProps).every(
        (item) => item != undefined
      );
      const normalizedExtraProps = Object.values(extraProps).filter(
        (item) => item != undefined
      );

      let newTotal = 0;
      if (basePropsOk && variationPropsOk) {
        newTotal += baseProps.price;
        newTotal += Object.values(variationProps).reduce(
          (sum: number, prop: IItemPropOption) => sum + (prop.price || 0),
          0
        );
        newTotal += normalizedExtraProps.reduce(
          (sum: number, props: IItemPropOption[]) =>
            sum +
            (props.reduce(
              (subtotal, prop) => subtotal + (prop.price || 0),
              0
            ) || 0),
          0
        );

        setTotal(newTotal * quantity);
      }
    },
    [quantity]
  );

  //Calculate price
  const onValuesChanged = (_: any, allValues: FormValues) => {
    calculateTotalPrice(allValues);
  };

  useEffect(() => {
    const currentFormValues = form.getFieldsValue();
    if ((currentFormValues as FormValues).variationProps)
      calculateTotalPrice(currentFormValues);
  }, [form, calculateTotalPrice]);

  return (
    <HomeLayout>
      {contextHolder}
      <main>
        <div className="h-screen max-w-5xl mx-auto">
          <div className="flex flex-col justify-start mt-6">
            <Breadcrumb
              className="py-4"
              items={[
                {
                  title: (
                    <Link to="/menu" className="text-base">
                      Trang chủ
                    </Link>
                  ),
                },
                {
                  title: (
                    <p className="text-base">
                      {categories.get(menuItem.categoryId)?.name}
                    </p>
                  ),
                },
                {
                  title: (
                    <Link to={`/menu/${id}`} className="text-base">
                      {menuItem.name}
                    </Link>
                  ),
                },
              ]}
              separator={<RightOutlined />}
            />
            <div className="grid grid-cols-3 gap-4">
              <div className="aspect-square bg-gray-200 hover:opacity-75 overflow-hidden ">
                <img
                  className="h-full w-full object-cover rounded-md"
                  alt="thumbnail"
                  src={menuItem.thumbnailUrl}
                />
              </div>
              <div className="col-span-2">
                <Form
                  form={form}
                  onFinish={onAddToCart}
                  onValuesChange={onValuesChanged}
                  name="form in screen"
                >
                  <div className="flex justify-between items-center gap-2 text-black font-semibold text-2xl tracking-tight mb-3">
                    <h2 className="flex-auto">{menuItem.name}</h2>
                    <p className="flex-none">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(menuItem.basePrice ?? 0)}
                    </p>
                  </div>

                  {/* BasePropOptions */}
                  <div className="mb-2 border-b-[1px] pb-2">
                    <div className="text-xl">Đơn vị tính</div>
                    <Form.Item
                      name="baseProps"
                      rules={[
                        {
                          required: true,
                          message: "Hãy chọn đơn vị tính",
                        },
                      ]}
                    >
                      <Radio.Group>
                        {menuItem?.availableBaseProps?.map((option) => (
                          <Radio value={option} key={option.name}>
                            {option.name}
                            {" + " +
                              new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(option.price ?? "")}
                          </Radio>
                        ))}
                      </Radio.Group>
                    </Form.Item>
                  </div>

                  {/* VariationPropOptions */}
                  {menuItem?.availableVariationProps?.map((prop) => (
                    <div key={prop.alias} className="mb-2 border-b-[1px] pb-2">
                      <div className="text-xl">{prop.name}</div>
                      <Form.Item
                        name={["variationProps", prop.name]}
                        rules={[
                          {
                            required: true,
                            message: `Vui lòng chọn ${prop.name}`,
                          },
                        ]}
                      >
                        <Radio.Group>
                          {prop.options.map((option) => (
                            <Radio value={option} key={option.name}>
                              {option.name}
                              {option.price > 0
                                ? " + " +
                                  new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(option.price)
                                : ""}
                            </Radio>
                          ))}
                        </Radio.Group>
                      </Form.Item>
                    </div>
                  ))}

                  {/* ExtraPropOptions */}
                  {menuItem?.availableExtraProps?.map((prop) => (
                    <div key={prop.alias} className="mb-2 border-b-[1px] pb-2">
                      <div className="text-xl">{prop.name}</div>
                      <Form.Item name={["extraProps", prop.name]}>
                        <Checkbox.Group>
                          {prop.options.map((option) => (
                            <Checkbox key={option.name} value={option}>
                              {option.name}
                              {option.price > 0
                                ? " + " +
                                  new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(option.price)
                                : ""}
                            </Checkbox>
                          ))}
                        </Checkbox.Group>
                      </Form.Item>
                    </div>
                  ))}
                  <div className="mb-2 pb-2">
                    <div className="text-xl">Số lượng</div>

                    <div className="flex w-full justify-center">
                      <QuantitySelector
                        quantity={quantity}
                        onDecrement={() => setQuantity((prev) => prev - 1)}
                        onIncrement={() => setQuantity((prev) => prev + 1)}
                      />
                    </div>
                  </div>
                  <div className="mb-2 pb-2">
                    <Form.Item name="note">
                      <TextArea
                        rows={4}
                        placeholder="Thêm lời nhắn đến cửa hàng"
                      />
                    </Form.Item>
                  </div>
                  <Form.Item className="w-full">
                    <Button
                      type="primary"
                      htmlType="submit"
                      ghost
                      className="w-full"
                      disabled={loading || total == 0}
                    >
                      {loading ? (
                        <LoadingOutlined />
                      ) : (
                        "Thêm vào giỏ hàng - " +
                        new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(total)
                      )}
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </HomeLayout>
  );
};

export default Detail;
