import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "../../components/DefaultLayout";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoadingOutlined } from "@ant-design/icons";
import { useAuthStore } from "../../stores/authStore";

interface FormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>();
  const login = useAuthStore((state) => state.login);
  const currentUser = useAuthStore((state) => state.currentUser);
  const onSubmit: SubmitHandler<FormValues> = async (formValues) => {
    try {
      setIsLoading(true);
      const { email, password } = formValues;
      login({ email, password });
      if (currentUser.role == "admin") {
        navigate("/admin");
      } else {
        navigate("/menu");
      }
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <DefaultLayout>
      <div className="bg-white px-4 py-3 rounded-md border border-slate-400 shadow-sm">
        <h6 className="text-center text-3xl font-semibold">Đăng nhập</h6>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center space-y-3 max-w-[240px]">
            <div className="flex flex-col mt-4">
              <input
                type="email"
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                placeholder="Email"
                {...register("email", {
                  required: "Email không được để trống",
                  pattern: {
                    value: /^[A-Z0-9.%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid Email Address",
                  },
                })}
              />
              {errors.email && (
                <p className="pt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col mt-4">
              <input
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                type="password"
                placeholder="Mật khẩu"
                {...register("password", {
                  required: "Mật khẩu không được để trống",
                  minLength: {
                    value: 8,
                    message: "Mật khẩu phải có ít nhất 8 ký tự",
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
                    message: "Mật khẩu phải bao gồm ký tự chữ và số",
                  },
                })}
              />
              {errors.password && (
                <p className="pt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              className="w-full mt-4 bg-blue-500 rounded-lg px-4 py-3 text-white font-semibold shadow-lg"
              type="submit"
            >
              {isLoading ? <LoadingOutlined /> : "Đăng nhập"}
            </button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default Login;
