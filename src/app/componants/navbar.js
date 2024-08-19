"use client"; // This is a client component 👈🏽
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { User } from 'react-feather';
import { usePathname } from "next/navigation";

export default function Navbar(props) {
    let { navClass, topnavClass } = props;
    let [isOpen, setIsOpen] = useState(true);
    let [topNavbar, setTopNavBar] = useState(false);

    let [manu , setManu] = useState('');
    let [subManu , setSubManu] = useState('');

    let current = usePathname();

    useEffect(() => {

        setManu(current)
        setSubManu(current)

        function windowScroll() {
            setTopNavBar(window.scrollY >= 50)
        }

        window.addEventListener('scroll', windowScroll )
        window.scrollTo(0, 0)
        return()=>{
            window.removeEventListener('scroll', windowScroll )
        }
      }, []);


    const toggleMenu = () => {
        setIsOpen(!isOpen)
        if (document.getElementById("navigation")) {
            const anchorArray = Array.from(document.getElementById("navigation").getElementsByTagName("a"));
            anchorArray.forEach(element => {
                element.addEventListener('click', (elem) => {
                    const target = elem.target.getAttribute("href")
                    if (target !== "") {
                        if (elem.target.nextElementSibling) {
                            var submenu = elem.target.nextElementSibling.nextElementSibling;
                            submenu.classList.toggle('open');
                        }
                    }
                })
            });
        }
    }

    return (
        <React.Fragment>
            <nav id="topnav" className={`${topNavbar ? 'nav-sticky': ''} ${topnavClass ? topnavClass : ''} defaultscroll is-sticky`} >
               
                <div className={`${topnavClass !== '' && topnavClass !== undefined ? 'container-fluid md:px-8 px-3' : 'container'}`}>
                    {/* <!-- Logo container--> */}
                    {navClass === '' || navClass === undefined ?
                        <Link className="logo" href="/">
                            <Image src="/images/logo-dark.png" className="inline-block dark:hidden" alt="" width={98} height={24}/>
                            <Image src="/images/logo-light.png" className="hidden dark:inline-block" alt="" width={98} height={24} />
                        </Link> :
                        <Link className="logo" href="#">
                            <span className="inline-block dark:hidden">
                                <Image src="/images/logo-dark.png" className="l-dark"  alt="" width={98} height={24}/>
                                <Image src="/images/logo-light.png" className="l-light"  alt="" width={98} height={24}/>
                            </span>
                            <Image src="/images/logo-light.png"  className="hidden dark:inline-block" alt="" width={98} height={24}/>
                        </Link>
                    }
                    {/* <!-- End Logo container--> */}

                    {/* <!-- Start Mobile Toggle --> */}
                    <div className="menu-extras">
                        <div className="menu-item">
                            <Link href="#" className="navbar-toggle" id="isToggle" onClick={toggleMenu}>
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
                        <li className="inline mb-0">
                            <Link href="/auth-login" className="btn btn-icon bg-green-600 hover:bg-green-700 border-green-600 dark:border-green-600 text-white rounded-full"><User className="h-4 w-4 stroke-[3]"></User></Link>
                        </li>
                        <li className="sm:inline ps-1 mb-0 hidden">
                            <Link href="/auth-signup" className="btn bg-green-600 hover:bg-green-700 border-green-600 dark:border-green-600 text-white rounded-full">Signup</Link>
                        </li>
                    </ul>
                    {/* <!--Login button End--> */}

                    <div id="navigation" className={`${isOpen === true ? 'hidden' : 'block'}`} >
                        {/* <!-- Navigation Menu--> */}
                        <ul className={`navigation-menu  ${navClass === '' || navClass === undefined ? '' : 'nav-light'}   ${topnavClass !== '' && topnavClass !== undefined ? 'justify-center' : 'justify-end'}`}>
                            <li className={`has-submenu parent-menu-item ${["/", "/index-two", "/index-three", "/index-four","/index-five", "/index-six", "/index-seven"].includes(manu) ? 'active' : ''}`}>
                                <Link href="#" onClick={(e)=>{setSubManu(subManu === "/index-item" ? "" : "/index-item")}}>Home</Link><span className="menu-arrow"></span>
                                <ul className={`submenu ${["/", "/index-two", "/index-three", "/index-four", "/index-five", "/index-six","/index-seven","/index-item"].includes(subManu) ? 'open' : ''}`}>
                                    <li className={manu ===  "/" ? 'active' : '' }><Link href="/" className="sub-menu-item">Hero One</Link></li>
                                    <li className={manu ===  "/index-two" ? 'active' : '' }><Link href="/index-two" className="sub-menu-item">Hero Two</Link></li>
                                    <li className={manu ===  "/index-three" ? 'active' : '' }><Link href="/index-three" className="sub-menu-item">Hero Three</Link></li>
                                    <li className={manu ===  "/index-four" ? 'active' : '' }><Link href="/index-four" className="sub-menu-item">Hero Four</Link></li>
                                    <li className={manu ===  "/index-five" ? 'active' : '' }><Link href="/index-five" className="sub-menu-item">Hero Five </Link></li>
                                    <li className={manu ===  "/index-six" ? 'active' : '' }><Link href="/index-six" className="sub-menu-item">Hero Six <span className="bg-yellow-500 inline-block text-white text-[10px] font-bold px-2.5 py-0.5 rounded h-5 ms-1">New</span></Link></li>
                                    <li className={manu ===  "/index-seven" ? 'active' : '' }><Link href="/index-seven" className="sub-menu-item">Hero Seven <span className="bg-yellow-500 inline-block text-white text-[10px] font-bold px-2.5 py-0.5 rounded h-5 ms-1">New</span></Link></li>
                                </ul>
                            </li>

                            <li className={manu ===  "/buy" ? 'active' : '' }><Link href="/buy" activeclassname="active" className="sub-menu-item">Buy</Link></li>

                            <li className={manu ===  "/sell" ? 'active' : '' }><Link href="/sell" className="sub-menu-item">Sell</Link></li>

                            <li className={`has-submenu parent-parent-menu-item ${["/grid", "/grid-sidebar", "/grid-map", "/list", "/list-sidebar", "/list-map", "/property-detail/1"].includes(manu) ? 'active' : ''}`}>
                                <Link href="#" onClick={()=>{setSubManu(subManu === "/list-item" ? "" : "/list-item")}}>Listing</Link><span className="menu-arrow"></span>
                                <ul className={`submenu ${["/grid", "/grid-sidebar", "/grid-map", "/list", "/list-sidebar", "/list-map", "/property-detail/1", "/list-item", "/grid-item", "/list-view-item", "/property-item"].includes(subManu) ? 'open' : ''}`}>
                                    <li className="has-submenu parent-menu-item"><Link href="#"> Grid View </Link><span className="submenu-arrow"></span>
                                        <ul className={`submenu ${["/grid", "/grid-sidebar", "/grid-map"].includes(manu) ? 'active' : ''}`}>
                                            <li className={manu ===  "/grid" ? 'active' : '' }><Link href="/grid" className="sub-menu-item">Grid Listing</Link></li>
                                            <li className={manu ===  "/grid-sidebar" ? 'active' : '' }><Link href="/grid-sidebar" className="sub-menu-item">Grid Sidebar </Link></li>
                                            <li className={manu ===  "/grid-map" ? 'active' : '' }><Link href="/grid-map" className="sub-menu-item">Grid With Map</Link></li>
                                        </ul>
                                    </li>
                                    <li className={`has-submenu parent-menu-item ${["/list", "/list-sidebar", "/list-map"].includes(manu) ? 'active' : ''}`}><Link href="#" onClick={() =>{setSubManu(subManu === "/list-view-item" ? "" : "/list-view-item")}}> List View </Link><span className="submenu-arrow"></span>
                                        <ul className={`submenu ${["/list", "/list-sidebar", "/list-map", "/list-view-item"].includes(subManu) ? 'open' : ''}`}>
                                            <li className={manu ===  "/list" ? 'active' : '' }><Link href="/list" className="sub-menu-item">List Listing</Link></li>
                                            <li className={manu ===  "/list-sidebar" ? 'active' : '' }><Link href="/list-sidebar" className="sub-menu-item">List Sidebar </Link></li>
                                            <li className={manu ===  "/list-map" ? 'active' : '' }><Link href="/list-map" className="sub-menu-item">List With Map</Link></li>
                                        </ul>
                                    </li>
                                    <li className={`has-submenu parent-menu-item ${["/property-detail/1"].includes(manu) ? 'active' : ''}`}><Link href="#" onClick={() =>{setSubManu(subManu === "/property-item" ? "" : "/property-item")}}> Property Detail </Link><span className="submenu-arrow"></span>
                                        <ul className={`submenu ${["/property-detail/1", "/property-item"].includes(subManu) ? 'open' : ''}`}>
                                            <li className={manu ===  "/property-detail/1" ? 'active' : '' }><Link href="/property-detail/1" className="sub-menu-item">Property Detail</Link></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>

                            <li className={`has-submenu parent-parent-menu-item ${["/aboutus", "/features", "/pricing", "/faqs", "/auth-login", "/auth-signup", "/auth-reset-password", "/terms", "/privacy", "/blogs", "/blog-sidebar", "/blog-detail", "/comingsoon", "/maintenance", "/404"].includes(manu) ? 'active' : ''}`}>
                                <Link href="#" onClick={()=>{setSubManu(subManu === "/page-item" ? '' : "/page-item")}}>Pages</Link><span className="menu-arrow"></span>
                                <ul className={`submenu ${["/aboutus", "/features", "/pricing", "/faqs", "/auth-login", "/auth-signup", "/auth-reset-password", "/terms", "/privacy", "/blogs", "/blog-sidebar", "/blog-detail", "/comingsoon", "/maintenance", "/404","/page-item","/auth-item","/term-item","/blog-item", "/special-item"].includes(subManu) ? 'open' : ''}`}>
                                    <li className={manu === "/aboutus" ? "active" : ''}><Link href="/aboutus" className="sub-menu-item">About Us</Link></li>
                                    <li className={manu === "/features" ? "active" : ''}><Link href="/features" className="sub-menu-item">Featues</Link></li>
                                    <li className={manu === "/pricing" ? "active" : ''}><Link href="/pricing" className="sub-menu-item">Pricing</Link></li>
                                    <li className={manu === "/faqs" ? "active" : ''}><Link href="/faqs" className="sub-menu-item">Faqs</Link></li>
                                    <li className={`has-submenu parent-menu-item ${["/auth-login", "/auth-signup", "/auth-reset-password"].includes(manu) ? 'active' : ''}`}><Link href="#" onClick={()=>{setSubManu(subManu === "/auth-item" ? '' : "/auth-item")}}> Auth Pages </Link><span className="submenu-arrow"></span>
                                        <ul className={`submenu ${["/auth-login", "/auth-signup", "/auth-reset-password","/auth-item"].includes(subManu) ? 'open' : ''}`}>
                                            <li className={manu === "/auth-login" ? "active" : ''}><Link href="/auth-login" className="sub-menu-item">Login</Link></li>
                                            <li className={manu === "/auth-signup" ? "active" : ''}><Link href="/auth-signup" className="sub-menu-item">Signup</Link></li>
                                            <li className={manu === "/auth-reset-password" ? "active" : ''}><Link href="/auth-reset-password" className="sub-menu-item">Reset Password</Link></li>
                                        </ul>
                                    </li>
                                    <li className={`has-submenu parent-menu-item ${["/terms", "/privacy"].includes(manu) ? 'active' : ''}`}><Link href="#" onClick={()=>{setSubManu(subManu === "/term-item" ? '' : "/term-item")}}> Utility </Link><span className="submenu-arrow"></span>
                                        <ul className={`submenu ${["/terms", "/privacy","/term-item"].includes(subManu) ? 'open' : ''}`}>
                                            <li className={manu === "/terms" ? "active" : ''}><Link href="/terms" className="sub-menu-item">Terms of Services</Link></li>
                                            <li className={manu === "/privacy" ? "active" : ''}><Link href="/privacy" className="sub-menu-item">Privacy Policy</Link></li>
                                        </ul>
                                    </li>
                                    <li className={`has-submenu parent-menu-item ${["/blogs", "/blog-sidebar", "/blog-detail"].includes(manu) ? 'active' : ''}`}><Link href="#" onClick={()=>{setSubManu(subManu === "/blog-item" ? '' : "/blog-item")}}> Blog </Link><span className="submenu-arrow"></span>
                                        <ul className={`submenu ${["/blogs", "/blog-sidebar", "/blog-detail", "/blog-item"].includes(subManu) ? 'open' : ''}`}>
                                            <li className={manu === "/blogs" ? "active" : ''}><Link href="/blogs" className="sub-menu-item"> Blogs</Link></li>
                                            <li className={manu === "/blog-sidebar" ? "active" : ''}><Link href="/blog-sidebar" className="sub-menu-item"> Blog Sidebar</Link></li>
                                            <li className={manu === "/blog-detail" ? "active" : ''}><Link href="/blog-detail/1" className="sub-menu-item"> Blog Detail</Link></li>
                                        </ul>
                                    </li>
                                    <li className={`has-submenu parent-menu-item ${["/comingsoon", "/maintenance", "/404"].includes(manu) ? 'active' : ''}`}><Link href="#" onClick={()=>{setSubManu(subManu === "/special-item" ? '' : "/special-item")}}> Special </Link><span className="submenu-arrow"></span>
                                        <ul className={`submenu ${["/comingsoon", "/maintenance", "/404", "/special-item"].includes(subManu) ? 'open' : ''}`}>
                                            <li className={manu === "/comingsoon" ? "active" : ''}><Link href="/comingsoon" className="sub-menu-item">Comingsoon</Link></li>
                                            <li className={manu === "/maintenance" ? "active" : ''}><Link href="/maintenance" className="sub-menu-item">Maintenance</Link></li>
                                            <li className={manu === "/404" ? "active" : ''}><Link href="/404" className="sub-menu-item">404! Error</Link></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>

                            <li className={manu === "/contact" ? "active" : ''}><Link href="/contact" className="sub-menu-item">Contact</Link></li>
                        </ul>
                    </div>
                </div>
            </nav>
            {/* End Navbar  */}
        </React.Fragment>
    );

}
