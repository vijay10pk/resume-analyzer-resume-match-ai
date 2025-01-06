import { NavLink } from "react-router-dom";

const SideBar = () => {
  return (
    <>
      <div className="relative">
        <div className="w-64 bg-white flex flex-1 flex-col p-4">
          <h1>Resume.ai</h1>

          <p>resume analyze</p>
        </div>

        <div className="absolute mb-1 mt-1 backdrop-blur-sm shadow-lg inset-0 bg-teal-300 rounded-tr-3xl rounded-br-3xl bg-opacity-75 flex  flex-col  text-black opacity-0 transition-opacity duration-300 hover:opacity-100">
          <div className="w-64  p-3 pl-4 ">
            <h1> Resume.ai</h1>
          </div>
          <div className="w-64 flex flex-col flex-1  p-4 items-center justify-center">
            <aside>
              <nav className="flex-1 overflow-y-auto">
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <NavLink
                      to="/Profile"
                      className={({ isActive }) =>
                        isActive
                          ? "text-teal-600 font-semibold underline"
                          : "hover:underline hover:text-teal-500"
                      }
                      end
                    >
                      Profile
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/Profile/edit"
                      className={({ isActive }) =>
                        isActive
                          ? "text-teal-600 font-semibold underline"
                          : "hover:underline hover:text-teal-500"
                      }
                    >
                      Profile Edit
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/Profile/Password-change"
                      className={({ isActive }) =>
                        isActive
                          ? "text-teal-600 font-semibold underline"
                          : "hover:underline hover:text-teal-500"
                      }
                    >
                      Change Password
                    </NavLink>
                  </li>
                </ul>
              </nav>
              <div className="mt-4">
                <button className="w-full py-2 bg-teal-600 rounded hover:bg-teal-500">
                  Upgrade Plan
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
