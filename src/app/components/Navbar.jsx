"use client"; // This is a client component 👈🏽
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
export default function Navbar(props) {
  let { navClass, topnavClass } = props;
  let [isOpen, setIsOpen] = useState(true);
  let [topNavbar, setTopNavBar] = useState(false);

  let [menu, setMenu] = useState("");
  let [submenu, setSubmenu] = useState("");

  let current = usePathname();

  useEffect(() => {
    setMenu(current);
    setSubmenu(current);

    function windowScroll() {
      setTopNavBar(window.scrollY >= 50);
    }

    window.addEventListener("scroll", windowScroll);
    window.scrollTo(0, 0);
    return () => {
      window.removeEventListener("scroll", windowScroll);
    };
  }, [current]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (document.getElementById("navigation")) {
      const anchorArray = Array.from(
        document.getElementById("navigation").getElementsByTagName("a")
      );
      anchorArray.forEach((element) => {
        element.addEventListener("click", (elem) => {
          const target = elem.target.getAttribute("href");
          if (target !== "") {
            if (elem.target.nextElementSibling) {
              var submenu = elem.target.nextElementSibling.nextElementSibling;
              submenu.classList.toggle("open");
            }
          }
        });
      });
    }
  };

  return (
    <React.Fragment>
      <nav
        id="topnav"
        className={`${topNavbar ? "nav-sticky" : ""} ${
          topnavClass ? topnavClass : ""
        } defaultscroll is-sticky`}
      >
        <div
          className={`${
            topnavClass !== "" && topnavClass !== undefined
              ? "container-fluid md:px-8 px-3"
              : "container"
          }`}
        >
          {/* <!-- Logo container--> */}
          {navClass === "" || navClass === undefined ? (
            <Link className="logo" href="/">
              <Image
                src="/images/logo.svg"
                className="inline-block dark:hidden"
                alt=""
                width={140}
                height={24}
              />
              <Image
                src="/images/logo.svg"
                className="hidden dark:inline-block"
                alt=""
                width={140}
                height={24}
              />
            </Link>
          ) : (
            <Link className="logo" href="/">
              <span className="inline-block dark:hidden">
                <Image
                  src="/images/logo.svg"
                  className="l-dark"
                  alt=""
                  width={140}
                  height={24}
                />
                <Image
                  src="/images/logo.svg"
                  className="l-light"
                  alt=""
                  width={140}
                  height={24}
                />
              </span>
              <Image
                src="/images/logo.svg"
                className="hidden dark:inline-block"
                alt=""
                width={140}
                height={24}
              />
            </Link>
          )}
          {/* <!-- End Logo container--> */}

          {/* <!-- Start Mobile Toggle --> */}
          <div className="menu-extras">
            <div className="menu-item">
              <Link
                href="#"
                className="navbar-toggle"
                id="isToggle"
                onClick={toggleMenu}
              >
                <div className="lines">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </Link>
            </div>
          </div>
          {/* <!-- End Mobile Toggle --> */}

          {/* <!-- Login button Start --> */}
          <ul className="buy-button list-none mb-0">
            {/* <li className="inline mb-0">
              <Link
                href="/auth-login"
                className="btn btn-icon bg-green-600 hover:bg-green-700 border-green-600 dark:border-green-600 text-white rounded-full"
              >
                <User className="h-4 w-4 stroke-[3]"></User>
              </Link>
            </li> */}
            {/* <li className="sm:inline ps-1 mb-0 hidden">
              <Link
                href="/contact"
                className="btn bg-green-600 hover:bg-green-700 border-green-600 dark:border-green-600 text-white rounded-full"
              >
                Contact
              </Link>
            </li> */}
          </ul>
          {/* <!--Login button End--> */}

          <div
            id="navigation"
            className={`${isOpen === true ? "hidden" : "block"}`}
          >
            {/* <!-- Navigation Menu--> */}
            <ul
              className={`navigation-menu  ${
                navClass === "" || navClass === undefined ? "" : "nav-light"
              }   ${
                topnavClass !== "" && topnavClass !== undefined
                  ? "justify-center"
                  : "justify-end"
              }`}
            >
              <li className={menu === "/" ? "active" : ""}>
                <Link
                  href="/"
                  activeclassname="active"
                  className="sub-menu-item"
                >
                  Home
                </Link>
              </li>

              <li className={menu === "/accommodation" ? "active" : ""}>
                <Link href="/accommodation" className="sub-menu-item">
                  Accommodation
                </Link>
              </li>
              <li className={menu === "/destinations" ? "active" : ""}>
                <Link href="/destinations" className="sub-menu-item">
                  Destinations
                </Link>
              </li>
              <li className={menu === "/contact" ? "active" : ""}>
                <Link href="/contact" className="sub-menu-item">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* End Navbar  */}
    </React.Fragment>
  );
}
