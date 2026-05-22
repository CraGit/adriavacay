"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { usePathname as useNextPathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";

import LanguageSwitcher from "./LanguageSwitcher";

import logo from "@/assets/images/logo.svg";

export default function Navbar({ navClass, topnavClass, destinations = [], services = [] }) {
  let [isOpen, setIsOpen] = useState(false);
  let [topNavbar, setTopNavBar] = useState(false);

  let [menu, setMenu] = useState("");
  let [submenu, setSubmenu] = useState("");

  let current = useNextPathname();

  const locale = useLocale();
  const t = useTranslations("menu");

  // Pathname without locale prefix for locale-aware links
  const localeFreePathname = locale === "de" ? (current.replace(/^\/de/, "") || "/") : current;

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
        // avoid attaching multiple listeners
        if (element.dataset._navListenerAttached) return;
        element.dataset._navListenerAttached = "1";
        element.addEventListener("click", (evt) => {
          const anchor = evt.currentTarget;
          const href = anchor.getAttribute("href") || "";
          // if this anchor navigates to a real path (not '#'), don't toggle submenu here
          if (href && href !== "#") return;

          // try to locate the submenu reliably
          let submenu = null;
          const next = anchor.nextElementSibling;
          if (next && next.classList && next.classList.contains("menu-arrow")) {
            submenu = next.nextElementSibling;
          } else if (next && next.classList && next.classList.contains("submenu")) {
            submenu = next;
          } else {
            const li = anchor.closest("li");
            if (li) submenu = li.querySelector(".submenu");
          }

          if (submenu && submenu.classList) {
            submenu.classList.toggle("open");
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
                <div className={`lines ${isOpen ? "open" : ""}`} aria-hidden>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </Link>
            </div>
          </div>
          {/* <!-- End Mobile Toggle --> */}

          <div id="navigation" className={`${isOpen ? "open" : ""}`}>
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
              {/* Villas dropdown */}
              <li
                className={`has-submenu parent-menu-item${
                  menu.startsWith("/villas") ? " active" : ""
                }`}
              >
                <Link href="#" className="sub-menu-item">
                  {t("villas")}
                </Link>
                <span className="menu-arrow" />
                <ul className="submenu villas-submenu">
                  {/* Locations section */}
                  <li>
                    <span className="block px-5 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "rgb(172 139 21)" }}>
                      {t("locations")}
                    </span>
                  </li>
                  <li className="grid grid-cols-2 pb-2">
                    {[
                      ["villas-in-split", "loc-split"],
                      ["villas-in-omis", "loc-omis"],
                      ["villas-in-makarska", "loc-makarska"],
                      ["villas-in-dubrovnik", "loc-dubrovnik"],
                      ["villas-in-sibenik", "loc-sibenik"],
                    ].map(([slug, labelKey]) => (
                      <Link
                        key={slug}
                        href={`/villas/${slug}`}
                        className={`sub-menu-item !py-1.5 !px-5${
                          submenu === `/villas/${slug}` ? " active" : ""
                        }`}
                        onClick={toggleMenu}
                      >
                        {t(labelKey)}
                      </Link>
                    ))}
                  </li>
                  {/* Features section */}
                  <li className="border-t border-slate-100 dark:border-gray-700">
                    <span className="block px-5 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "rgb(172 139 21)" }}>
                      {t("features")}
                    </span>
                  </li>
                  <li className="grid grid-cols-2 pb-2">
                    {[
                      ["villas-with-heated-pool", "feat-heated-pool"],
                      ["villas-with-jacuzzi", "feat-jacuzzi"],
                      ["villas-with-sauna", "feat-sauna"],
                      ["villas-with-sea-view", "feat-sea-view"],
                      ["villas-on-the-beach", "feat-beach"],
                      ["villas-with-playground", "feat-playground"],
                      ["villas-with-garden", "feat-garden"],
                      ["villas-with-pet-friendly", "feat-pet-friendly"],
                    ].map(([slug, labelKey]) => (
                      <Link
                        key={slug}
                        href={`/villas/${slug}`}
                        className={`sub-menu-item !py-1.5 !px-5${
                          submenu === `/villas/${slug}` ? " active" : ""
                        }`}
                        onClick={toggleMenu}
                      >
                        {t(labelKey)}
                      </Link>
                    ))}
                  </li>
                </ul>
              </li>

              <li
                className={menu === "/apartments" ? "active" : ""}
                onClick={toggleMenu}
              >
                <Link href="/apartments" className="sub-menu-item">
                  {t("apartments")}
                </Link>
              </li>

              <li
                className={menu === "/holiday-homes" ? "active" : ""}
                onClick={toggleMenu}
              >
                <Link href="/holiday-homes" className="sub-menu-item">
                  {t("holiday-homes")}
                </Link>
              </li>

              <li
                className={menu === "/for-sale" ? "active" : ""}
                onClick={toggleMenu}
              >
                <Link href="/for-sale" className="sub-menu-item">
                  {t("for-sale")}
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
                className={`has-submenu parent-menu-item${
                  menu.startsWith("/destinations") ? " active" : ""
                }`}
              >
                <Link href="#" className="sub-menu-item" onClick={(e) => e.preventDefault()}>
                  {t("destinations")}
                </Link>
                <span className="menu-arrow" />
                <ul className="submenu">
                  {destinations.map((dest) => (
                    <li key={dest.uid}>
                      <Link
                        href={`/destinations/${dest.uid}`}
                        className={`sub-menu-item${
                          submenu === `/destinations/${dest.uid}` ? " active" : ""
                        }`}
                        onClick={toggleMenu}
                      >
                        {dest.data.heading}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li
                className={`has-submenu parent-menu-item${
                  menu.startsWith("/services") ? " active" : ""
                }`}
              >
                <Link href="#" className="sub-menu-item" onClick={(e) => e.preventDefault()}>
                  {t("services")}
                </Link>
                <span className="menu-arrow" />
                <ul className="submenu">
                  {services.map((service) => (
                    <li key={service.uid}>
                      <Link
                        href={`/services/${service.uid}`}
                        className={`sub-menu-item${
                          submenu === `/services/${service.uid}` ? " active" : ""
                        }`}
                        onClick={toggleMenu}
                      >
                        {service.data.heading}
                      </Link>
                    </li>
                  ))}
                </ul>
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
                  <Link
                    href={localeFreePathname}
                    locale="en-us"
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
                  </Link>
                )}
                {locale === "en-us" && (
                  <Link
                    href={localeFreePathname}
                    locale="de"
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
                  </Link>
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
