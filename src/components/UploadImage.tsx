import {
  DeleteOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { message } from "antd";
import Upload, { RcFile } from "antd/es/upload";
import React, { useRef, useState } from "react";
import { useHover } from "usehooks-ts";
import { motion } from "framer-motion";

type PropsType = {
  image: UploadFile | null;
  setImage: React.Dispatch<React.SetStateAction<UploadFile | null>>;
};

export type UploadFile = RcFile & { preview: string };

const backDropVariants = {
  hidden: { opacity: 0 },
  enter: { opacity: 0.5 },
  exit: { opacity: 0 },
};

const UploadImage = ({ image, setImage }: PropsType) => {
  const [loading, setLoading] = useState(false);
  const imageRef = useRef(null);
  const isHover = useHover(imageRef);

  const beforeUpload = (file: RcFile) => {
    setLoading(true);
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Chỉ có thể upload định dạng JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Ảnh phải nhỏ hơn 2MB!");
    }

    if (isJpgOrPng && isLt2M) {
      const uploadFile = file as UploadFile;
      const previewUrl = URL.createObjectURL(uploadFile);
      uploadFile.preview = previewUrl;
      setImage(uploadFile);
    }

    setLoading(false);

    return isJpgOrPng && isLt2M;
  };

  return (
    <>
      <Upload
        showUploadList={false}
        name="thumbnail"
        beforeUpload={beforeUpload}
      >
        <div
          ref={imageRef}
          className="relative flex h-[9rem] w-[9rem] flex-col items-center justify-center gap-2 border-2 border-dotted border-gray-200 bg-white transition-all hover:border-blue-500"
        >
          <>
            {image && image.preview ? (
              <img
                src={image.preview}
                alt="thumbnail"
                className="h-full w-full object-cover"
              />
            ) : (
              <>{loading ? <LoadingOutlined /> : <PlusOutlined />} Thêm ảnh</>
            )}
            {isHover && image && (
              <>
                <motion.div
                  className="absolute top-0 flex h-full w-full items-center
                  justify-center bg-gray-800"
                  variants={backDropVariants}
                  initial="hidden"
                  animate="enter"
                  exit="exit"
                  transition={{ duration: 0.2, type: "easeOut" }}
                ></motion.div>
                <DeleteOutlined
                  className="absolute z-20 text-xl text-red-500 transition-all hover:scale-125"
                  onClick={() => setImage(null)}
                />
              </>
            )}
          </>
        </div>
      </Upload>
    </>
  );
};

export default UploadImage;
