import React from "react";
import { useAuth } from "../../context/AuthContext"; // Check your path matches
import Link from "@docusaurus/Link";
import { useHistory } from "@docusaurus/router";
import { FaUserCircle } from "react-icons/fa";

export default function NavbarItem({ mobile }) {
  const { user, logout, loading } = useAuth();
  console.log("user:", user);
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push("/login"); // Redirect to login after logout
  };

  // 1. Loading State: Render nothing to prevent flickering
  if (loading) return null;

  // 2. Guest State: Show Login & Register buttons
  if (!user) {
    return (
      <div
        className={mobile ? "menu__list-item" : "navbar__item"}
        style={mobile ? {} : { display: "flex", gap: "10px", alignItems: "center" }}
      >
        <Link to="/login" className={mobile ? "menu__link" : "navbar__link"}>
          Login
        </Link>
        {mobile ? (
          <Link to="/register" className="menu__link">
            Register
          </Link>
        ) : (
          <Link to="/register" className="navbar__link">
            Register
          </Link>
        )}
      </div>
    );
  }

  // 3. Authenticated State: Dropdown Menu
  return (
    <div
      className={
        mobile ? "menu__list-item" : "navbar__item dropdown dropdown--hoverable"
      }
    >
      {/* The Trigger: User's Name */}
      <a
        href="#"
        className={mobile ? "menu__link" : "navbar__link"}
        onClick={(e) => e.preventDefault()}
      >
        <FaUserCircle style={{marginRight:"10px", transform:"translateY(3px)"}} size={20}/>

        {user.name || "Profile"}
      </a>

      {/* The Menu */}
      <ul
        className={mobile ? "menu__list" : "dropdown__menu"}
        style={{ transform: "translateX(-50px)" }}
      >
        <li>
          <Link to="/" className="dropdown__link">
            Home
          </Link>
        </li>
        <li>
          <Link to="/docs/chapter-1-physical-ai" className="dropdown__link">
            Book
          </Link>
        </li>
        <li>
          {/* Logout Button */}
          <div
            className="dropdown__link"
            onClick={handleLogout}
            style={{
              cursor: "pointer",
              color: "var(--ifm-color-danger)", // Uses Docusaurus red color
              fontWeight: "bold",
            }}
          >
            Logout
          </div>
        </li>
      </ul>
    </div>
  );
}
