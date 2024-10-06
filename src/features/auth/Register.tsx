import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "../../components/DefaultLayout";
import { LoadingOutlined } from "@ant-design/icons";
import { useAuthStore } from "../../stores/authStore";

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>();
  const registerNewUser = useAuthStore((state) => state.register);
  const onSubmit: SubmitHandler<FormValues> = (formValues) => {
    try {
      setIsLoading(true);
      const { email, password, username } = formValues;
      registerNewUser({ email, password, username });
      navigate("/menu");
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <DefaultLayout>
      <div className="bg-white px-4 py-3 rounded-md border border-slate-400 shadow-sm">
        <h6 className="text-center text-3xl font-semibold">Đăng ký</h6>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center space-y-3 max-w-[240px]">
            <div className="flex flex-col mt-4">
              <input
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

            <div className="flex flex-col mt-4">
              <input
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                type="password"
                placeholder="Nhập lại mật khẩu"
                {...register("confirmPassword", {
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
              {errors.confirmPassword && (
                <p className="pt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex flex-col mt-4">
              <input
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                type="text"
                placeholder="Username"
                {...register("username", {
                  required: "Username không được để trống",
                  minLength: {
                    value: 6,
                    message: "Username phải có ít nhất 6 ký tự",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9]+$/,
                    message: "Username chỉ được bao gồm ký tự chữ và số",
                  },
                })}
              />
              {errors.username && (
                <p className="pt-1 text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            <button
              className="w-full mt-4 bg-blue-500 rounded-lg px-4 py-3 text-white font-semibold shadow-lg"
              type="submit"
            >
              {isLoading ? <LoadingOutlined /> : "Đăng ký"}
            </button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default Register;
