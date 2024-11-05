"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { PrismicNextLink } from "@prismicio/next";
import { routing } from "@/i18n/routing";
import { useLocale } from "next-intl";

import LanguageSwitcher from "./LanguageSwitcher";

import logo from "@/assets/images/logo.svg";

export default function Navbar(props) {
  let { navClass, topnavClass } = props;
  let [isOpen, setIsOpen] = useState(true);
  let [topNavbar, setTopNavBar] = useState(false);

  let [menu, setMenu] = useState("");
  let [submenu, setSubmenu] = useState("");

  let current = usePathname();

  const locale = useLocale();
  const t = useTranslations("menu");

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
                //src="/images/logo.svg"
                src={logo}
                className="inline-block dark:hidden"
                alt=""
                width={140}
                height={24}
              />
              <Image
                //src="/images/logo.svg"
                src={logo}
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
                  //src="/images/logo.svg"
                  src={logo}
                  className="l-dark"
                  alt=""
                  width={140}
                  height={24}
                />
                <Image
                  //src="/images/logo.svg"
                  src={logo}
                  className="l-light"
                  alt=""
                  width={140}
                  height={24}
                />
              </span>
              <Image
                //src="/images/logo.svg"
                src={logo}
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
                  onClick={toggleMenu}
                >
                  {t("home")}
                </Link>
              </li>

              <li
                className={menu === "/accommodation" ? "active" : ""}
                onClick={toggleMenu}
              >
                <Link href="/accommodation" className="sub-menu-item">
                  {t("accommodation")}
                </Link>
              </li>
              <li
                className={menu === "/about-us" ? "active" : ""}
                onClick={toggleMenu}
              >
                <Link href="/about-us" className="sub-menu-item">
                  {t("about-us")}
                </Link>
              </li>
              <li
                className={menu === "/destinations" ? "active" : ""}
                onClick={toggleMenu}
              >
                <Link href="/destinations" className="sub-menu-item">
                  {t("destinations")}
                </Link>
              </li>
              <li
                className={menu === "/blog" ? "active" : ""}
                onClick={toggleMenu}
              >
                <Link href="/blog" className="sub-menu-item">
                  {t("blog")}
                </Link>
              </li>
              <li
                className={menu === "/contact" ? "active" : ""}
                onClick={toggleMenu}
              >
                <Link href="/contact" className="sub-menu-item">
                  {t("contact")}
                </Link>
              </li>
              <li className="pb-2 md:pb-0">
                {locale === "de" && (
                  <PrismicNextLink
                    href="/"
                    className="h-full flex items-center"
                  >
                    <svg
                      width="16"
                      height="12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask
                        id="a"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="16"
                        height="12"
                      >
                        <path fill="#fff" d="M0 0h16v12H0z" />
                      </mask>
                      <g mask="url(#a)">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0 0v12h16V0H0z"
                          fill="#2E42A5"
                        />
                        <mask
                          id="b"
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="16"
                          height="12"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0 0v12h16V0H0z"
                            fill="#fff"
                          />
                        </mask>
                        <g mask="url(#b)">
                          <mask
                            id="c"
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="16"
                            height="12"
                          >
                            <path fill="#fff" d="M0 0h16v12H0z" />
                          </mask>
                          <g mask="url(#c)">
                            <path
                              d="M-1.781 11.143l3.52 1.489L16.08 1.619l1.857-2.213-3.765-.497-5.85 4.745-4.707 3.198-5.396 4.29z"
                              fill="#fff"
                            />
                            <path
                              d="M-1.3 12.186l1.794.864L17.27-.8h-2.518L-1.3 12.187z"
                              fill="#F50100"
                            />
                            <path
                              d="M17.782 11.143l-3.521 1.489L-.08 1.619-1.938-.594l3.765-.497 5.85 4.745 4.707 3.198 5.397 4.29z"
                              fill="#fff"
                            />
                            <path
                              d="M17.662 11.891l-1.794.865-7.144-5.93-2.117-.663-8.723-6.75H.403l8.717 6.59 2.316.795 6.226 5.093z"
                              fill="#F50100"
                            />
                            <mask id="d" fill="#fff">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.889-1H6.11v5H-.986v4H6.11v5h3.78V8h7.125V4H9.889v-5z"
                              />
                            </mask>
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M9.889-1H6.11v5H-.986v4H6.11v5h3.78V8h7.125V4H9.889v-5z"
                              fill="#F50100"
                            />
                            <path
                              d="M6.111-1v-1h-1v1h1zM9.89-1h1v-1h-1v1zM6.11 4v1h1V4h-1zM-.986 4V3h-1v1h1zm0 4h-1v1h1V8zM6.11 8h1V7h-1v1zm0 5h-1v1h1v-1zm3.778 0v1h1v-1h-1zm0-5V7h-1v1h1zm7.125 0v1h1V8h-1zm0-4h1V3h-1v1zM9.889 4h-1v1h1V4zM6.11 0h3.78v-2H6.11v2zm1 4v-5h-2v5h2zM-.986 5H6.11V3H-.986v2zm1 3V4h-2v4h2zM6.11 7H-.986v2H6.11V7zm1 6V8h-2v5h2zm2.778-1H6.11v2h3.78v-2zm-1-4v5h2V8h-2zm8.125-1H9.889v2h7.125V7zm-1-3v4h2V4h-2zM9.889 5h7.125V3H9.889v2zm-1-6v5h2v-5h-2z"
                              fill="#fff"
                              mask="url(#d)"
                            />
                          </g>
                        </g>
                      </g>
                    </svg>
                  </PrismicNextLink>
                )}
                {locale === "en-us" && (
                  <PrismicNextLink
                    href={`/de`}
                    className="h-full flex items-center"
                  >
                    <svg
                      width="16"
                      height="12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask
                        id="a"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="16"
                        height="12"
                      >
                        <rect width="16" height="12" rx="-1" fill="#fff" />
                      </mask>
                      <g mask="url(#a)" fillRule="evenodd" clipRule="evenodd">
                        <path d="M0 8h16v4H0V8z" fill="#FFD018" />
                        <path d="M0 4h16v4H0V4z" fill="#E31D1C" />
                        <path d="M0 0h16v4H0V0z" fill="#272727" />
                      </g>
                    </svg>
                  </PrismicNextLink>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* End Navbar  */}
    </React.Fragment>
  );
}
