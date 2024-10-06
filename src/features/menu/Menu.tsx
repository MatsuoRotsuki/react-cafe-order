import HomeLayout from "../../components/HomeLayout";
import { useAuthStore } from "../../stores/authStore";
import Logo from "../../assets/coffee-logo.png";
import { useCustomerMenuStore } from "../../stores/customerMenuStore";

const Menu = () => {
  const logout = useAuthStore((state) => state.logout);
  const currentUser = useAuthStore((state) => state.currentUser);
  const categories = useCustomerMenuStore((state) => state.categories);
  return (
    <HomeLayout>
      <main>
        <div className="flex h-screen w-screen shadow-md items-center justify-center">
          <div className="h-full lg:w-1/4 md:w-1/3 lg:block lg:sticky lg:top-24">
            <div className="shadow-md p-3 bg-white overflow-hidden rounded-lg">
              <div className="px-4">
                <h4 className="text-gray-600">Danh mục</h4>
              </div>
              <div className="flex flex-col cursor-pointer justify-start border-b-[1px] p-2 border-gray-100">
                {categories.map((category) => (
                  <span
                    className="text-base px-2 py-3 border-b-2 flex flex-grow justify-between items-center w-full"
                    key={category.id}
                  >
                    {category.name.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:w-3/4 w-full ">
            <div className="bg-white rounded-lg lg:shadow lg:p-3">
              <div className="mb-10">
                <div className="my-2 flex gap-2"></div>
                <div className="mb-6">
                  <h4 className="font-semibold text-lg mb-2"></h4>
                  <div className="grid grid-cols-2 lg:grid-cols-3 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-x-3 md:gap-x-4 lg:gap-y-5 xl:gap-x-5 gap-y-4 xl:lg:gap-y-6 2xl:gap-y-8">
                    <div className="group relative rounded-lg h-full flex flex-col justify-between bg-white ">
                      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75 flex-none">
                        <img
                          className="h-full w-full object-cover object-center group-hover:opacity-75"
                          alt="thumbnail"
                          src={Logo}
                        />
                      </div>
                      <div className="mt-4 flex-auto flex flex-col gap-1 justify-end p-2 pb-2">
                        <h3 className="text-sm text-gray-700">Ten mon an</h3>
                        <p className="text-base">130,000d</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </HomeLayout>
  );
};

export default Menu;
