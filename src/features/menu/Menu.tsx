import HomeLayout from "../../components/HomeLayout";
import { useAuthStore } from "../../stores/authStore";
import Logo from "../../assets/coffee-logo.png";
import { useCustomerMenuStore } from "../../stores/customerMenuStore";
import { Input } from "antd";
import { getMenuItems, searchMenuItems } from "../../lib/customerMenu";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();
  const categories = useCustomerMenuStore((state) => state.categories);
  const menuItems = useCustomerMenuStore(
    (state) => state.categoryToMenuItemsMap
  );
  const searchMenuItems = useCustomerMenuStore(
    (state) => state.searchMenuItems
  );
  const onSearch = async (value: string) => {
    searchMenuItems(value);
  };
  return (
    <HomeLayout>
      <main>
        <div className="flex h-screen min-w-[769px] shadow-md items-start justify-center gap-4">
          <div className="h-full lg:w-1/4 md:w-1/3 lg:block lg:sticky lg:top-24">
            <div className="shadow-md p-3 bg-white overflow-hidden rounded-lg">
              <div className="px-4">
                <h4 className="text-gray-600 font-bold text-lg">Danh mục</h4>
              </div>
              <div className="flex flex-col cursor-pointer justify-start border-b-[1px] p-2 border-gray-100">
                {Array.from(categories.values()).map((category) => (
                  <span
                    className="text-base px-2 py-3 border-t-[1px] flex flex-grow justify-between items-center w-full"
                    key={category.id}
                  >
                    {category.name.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:w-3/4 w-full h-full">
            <div className="bg-white rounded-lg shadow-md lg:p-3 p-2">
              <div className="mb-10">
                <div className="my-2 flex gap-2">
                  <Input.Search
                    placeholder="Tìm kiếm gì đó..."
                    enterButton
                    onSearch={onSearch}
                  />
                </div>
                {Array.from(menuItems.entries()).map(
                  ([categoryId, menuItems]) => (
                    <div className="mb-6" key={categoryId}>
                      <h4 className="font-semibold text-xl mb-2">
                        {categories.get(categoryId)?.name}
                      </h4>
                      <div className="grid grid-cols-4 gap-x-3 md:gap-x-4 lg:gap-y-5 xl:gap-x-5 gap-y-4 xl:lg:gap-y-6 2xl:gap-y-8">
                        {menuItems.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => navigate(`/menu/${item.id}`)}
                            className="group relative rounded-lg h-full flex flex-col justify-between bg-white hover:opacity-70 cursor-pointer"
                          >
                            <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75 flex-none">
                              <img
                                className="h-full w-full object-cover object-center group-hover:opacity-75"
                                alt="thumbnail"
                                src={item.thumbnailUrl}
                              />
                            </div>
                            <div className="mt-4 flex-auto flex flex-col gap-1 justify-end p-2 pb-2">
                              <h3 className="text-sm text-gray-700 font-semibold">
                                {item.name}
                              </h3>
                              <p className="text-base">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(item.basePrice ?? 0)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </HomeLayout>
  );
};

export default Menu;
