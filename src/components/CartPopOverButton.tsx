import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";
import React from "react";
import QuantitySelector from "./QuantitySelector";
import { useCustomerCartStore } from "../stores/customerCartStore";

interface PropsType {
  children: React.ReactNode;
  userCart: IUserCart;
}

const CartPopOverButton = ({ children, userCart }: PropsType) => {
  const title = "Giỏ hàng";

  const removeFromCart = useCustomerCartStore((state) => state.removeFromCart);
  const increment = useCustomerCartStore((state) => state.increment);
  const decrement = useCustomerCartStore((state) => state.decrement);
  const totalAmount = useCustomerCartStore((state) => state.totalAmount);
  const content = (
    <div className="flex flex-col h-full max-w-[600px]">
      <div className="flex-auto overflow-y-auto pt-2 flex flex-col gap-4 divide-y justify-between">
        <div className="grid grid-cols-1 divide-y divide-gray-50">
          {userCart?.cart?.map((cartItem, index) => (
            <div key={index} className="px-2 py-4 hover:bg-gray-100">
              <div className="flex items-start justify-between mb-1 gap-2">
                <span className="font-semibold text-sm block">
                  {cartItem.menuItem.name}&nbsp;
                  <span className="font-normal text-gray-600">
                    ({cartItem.baseProps.name})
                  </span>
                </span>
                <span className="font-medium text-right text-sm block flex-none">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(cartItem.calculatedPrice ?? 0)}
                </span>
              </div>
              <ul className="list-disc list-inside font-normal text-sm text-gray-500 mb-1">
                {Object.values(cartItem.variationProps).map((prop) => (
                  <li key={prop.name}>{prop.name}</li>
                ))}
                {Object.values(cartItem.extraProps).map((options) =>
                  options.map((option) => (
                    <li key={option.name}>{option.name}</li>
                  ))
                )}
              </ul>
              {cartItem.note && (
                <p className="text-gray-500 font-normal *:text-sx text-ellipsis overflow-hidden mb-1">
                  {`Ghi chú: ${cartItem.note}`}
                </p>
              )}
              <div className="flex items-end justify-between">
                <Button
                  type="text"
                  icon={<DeleteOutlined className="text-red-500" />}
                  onClick={() => removeFromCart(String(index))}
                />
                <QuantitySelector
                  quantity={cartItem.quantity}
                  onDecrement={() => decrement(String(index))}
                  onIncrement={() => increment(String(index))}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-end justify-between">
            <span className="font-semibold">Tạm tính</span>
            <span className="text-gray-500 mb-px font-semibold">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalAmount)}
            </span>
          </div>
          <div className="flex items-end justify-between">
            <span className="font-semibold">Giảm giá</span>
            <span className="text-gray-500 mb-px font-semibold">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(0)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex-none border-t border-gray-200">
        <div className="pt-4 flex flex-col gap-4">
          <div className="flex items-end justify-between text-base">
            <span className="font-semibold block">Tổng cộng</span>
            <span className="font-semibold text-gray-900 block">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalAmount)}
            </span>
          </div>
          <div className="mt-3 p-4 text-base bg-blue-50 text-gray-700 rounded block">
            Khuyến mãi cho các ngày cuối tuần
          </div>
          <div className="flex flex-col pb-5">
            <Button type="primary">Tiến hành đặt hàng</Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Popover title={title} content={content} trigger="click">
      {children}
    </Popover>
  );
};

export default CartPopOverButton;
