import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface PropsType {
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
}

const QuantitySelector = ({
  quantity,
  onDecrement,
  onIncrement,
}: PropsType) => {
  return (
    <div className="flex gap-2 max-w-[160px] items-center">
      <Button
        disabled={quantity == 1}
        type="default"
        shape="circle"
        icon={<MinusOutlined />}
        onClick={onDecrement}
      />
      <span className="text-xl font-medium">{quantity}</span>
      <Button
        type="default"
        shape="circle"
        icon={<PlusOutlined />}
        onClick={onIncrement}
      />
    </div>
  );
};

export default QuantitySelector;
