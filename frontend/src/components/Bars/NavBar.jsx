import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
const NavBar = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex  space-x-6 justify-end pr-10 ">
        <button>
          <FontAwesomeIcon
            icon={faCircleUser}
            className="text-3xl text-black"
            onClick={() => navigate("/Profile")}
          />
        </button>
        <button>
          <FontAwesomeIcon
            icon={faArrowRightFromBracket}
            className="text-3xl text-black"
          />
        </button>
      </div>
    </>
  );
};
export default NavBar;
