import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import axios from "../helpers/axios";

export default function NavBar() {
  let { user, dispatch } = useContext(AuthContext);
  let navigate = useNavigate();
  console.log(user);

  let logout = async () => {
    let res = await axios.post("/api/users/logout");
    if (res.status == 200) {
      dispatch({ type: "LOGOUT" });
      navigate("/sing-in");
    }
  };

  return (
    <div>
      <nav className="flex justify-between items-center p-5 bg-white">
        <div>
          <h1 className="font-bold text-2xl text-orange-400">Recipicity</h1>
        </div>
        <ul className="flex space-x-10">
          <li>
            <NavLink to="/" className="hover:text-orange-400">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className="hover:text-orange-400">
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className="hover:text-orange-400">
              Contact
            </NavLink>
          </li>
          <li>
            <NavLink to="/recipes/create" className="hover:text-orange-400">
              Create
            </NavLink>
          </li>
          {!user && (
            <>
              <li>
                <NavLink to="/sing-in" className="hover:text-orange-400">
                  Login
                </NavLink>
              </li>

              <li>
                <NavLink to="/sing-up" className="hover:text-orange-400">
                  Register
                </NavLink>
              </li>
            </>
          )}
          {!!user && (
            <li>
              <button onClick={logout} className="hover:text-orange-400">
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
