import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiMapPin,
  FiMail,
  FiPhone,
  FiDribbble,
  FiLinkedin,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  BsPencil,
  FiChevronRight,
  RiBehanceFill,
  FiShoppingCart,
} from "../../assets/icons/vander";

export default function Footer() {
  return (
    <>
      <footer className="relative bg-slate-900 dark:bg-slate-800 mt-24">
        <div className="container">
          <div className="grid grid-cols-1">
            <div className="relative py-16">
              {/* <!-- Subscribe --> */}
              <div className="relative w-full">
                <div className="relative -top-40 bg-white dark:bg-slate-900 lg:px-8 px-6 py-10 rounded-xl shadow-lg dark:shadow-gray-700 overflow-hidden">
                  <div className="grid md:grid-cols-2 grid-cols-1 items-center gap-[30px]">
                    <div className="md:text-start text-center z-1">
                      <h3 className="md:text-3xl text-2xl md:leading-normal leading-normal font-medium text-black dark:text-white">
                        Subscribe to Newsletter!
                      </h3>
                      <p className="text-slate-400 max-w-xl mx-auto">
                        Subscribe to get latest updates and information.
                      </p>
                    </div>

                    <div className="subcribe-form z-1">
                      <form className="relative max-w-lg md:ms-auto">
                        <input
                          type="email"
                          id="subcribe"
                          name="email"
                          className="rounded-full bg-white dark:bg-slate-900 shadow dark:shadow-gray-700"
                          placeholder="Enter your email :"
                        />
                        <button
                          type="submit"
                          className="btn bg-green-600 hover:bg-green-700 text-white rounded-full"
                        >
                          Subscribe
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="absolute -top-5 -start-5">
                    <FiMail
                      className=" text-black/5 dark:text-white/5 ltr:-rotate-45 rtl:rotate-45"
                      style={{ width: "150px", height: "150px" }}
                    />
                  </div>

                  <div className="absolute -bottom-5 -end-5">
                    <BsPencil
                      className=" text-black/5 dark:text-white/5 rtl:-rotate-90"
                      style={{ width: "150px", height: "150px" }}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-12 grid-cols-1 gap-[30px] -mt-24">
                  <div className="lg:col-span-4 md:col-span-12">
                    <Link href="#" className="text-[22px] focus:outline-none">
                      <Image
                        src="/images/logo-light.png"
                        alt=""
                        width={98}
                        height={28}
                      />
                    </Link>
                    <p className="mt-6 text-gray-300">
                      A great plateform to buy, sell and rent your properties
                      without any agent or commisions.
                    </p>
                  </div>

                  <div className="lg:col-span-2 md:col-span-4">
                    <h5 className="tracking-[1px] text-gray-100 font-semibold">
                      Company
                    </h5>
                    <ul className="list-none footer-list mt-6">
                      <li>
                        <Link
                          href="/aboutus"
                          className="text-slate-300 hover:text-slate-400 duration-500 ease-in-out flex items-center"
                        >
                          <FiChevronRight width={18} className="me-1" />{" "}
                          <span>About us</span>{" "}
                        </Link>
                      </li>
                      <li className="mt-[10px]">
                        <Link
                          href="/features"
                          className="text-slate-300 hover:text-slate-400 duration-500 ease-in-out flex items-center"
                        >
                          <FiChevronRight width={18} className="me-1" />{" "}
                          <span>Services</span>{" "}
                        </Link>
                      </li>
                      <li className="mt-[10px]">
                        <Link
                          href="/pricing"
                          className="text-slate-300 hover:text-slate-400 duration-500 ease-in-out flex items-center"
                        >
                          <FiChevronRight width={18} className="me-1" />{" "}
                          <span>Pricing</span>{" "}
                        </Link>
                      </li>
                      <li className="mt-[10px]">
                        <Link
                          href="/blogs"
                          className="text-slate-300 hover:text-slate-400 duration-500 ease-in-out flex items-center"
                        >
                          <FiChevronRight width={18} className="me-1" />{" "}
                          <span>Blog</span>{" "}
                        </Link>
                      </li>
                      <li className="mt-[10px]">
                        <Link
                          href="/auth-login"
                          className="text-slate-300 hover:text-slate-400 duration-500 ease-in-out flex items-center"
                        >
                          <FiChevronRight width={18} className="me-1" />{" "}
                          <span>Login</span>{" "}
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="lg:col-span-3 md:col-span-4">
                    <h5 className="tracking-[1px] text-gray-100 font-semibold">
                      Usefull Links
                    </h5>
                    <ul className="list-none footer-list mt-6">
                      <li>
                        <Link
                          href="/terms"
                          className="text-slate-300 hover:text-slate-400 duration-500 ease-in-out flex items-center"
                        >
                          <FiChevronRight width={18} className="me-1" />{" "}
                          <span>Terms of Services</span>{" "}
                        </Link>
                      </li>
                      <li className="mt-[10px]">
                        <Link
                          href="/privacy"
                          className="text-slate-300 hover:text-slate-400 duration-500 ease-in-out flex items-center"
                        >
                          <FiChevronRight width={18} className="me-1" />{" "}
                          <span>Privacy Policy</span>{" "}
                        </Link>
                      </li>
                      <li className="mt-[10px]">
                        <Link
                          href="/grid"
                          className="text-slate-300 hover:text-slate-400 duration-500 ease-in-out flex items-center"
                        >
                          <FiChevronRight width={18} className="me-1" />{" "}
                          <span>Listing</span>{" "}
                        </Link>
                      </li>
                      <li className="mt-[10px]">
                        <Link
                          href="/contact"
                          className="text-slate-300 hover:text-slate-400 duration-500 ease-in-out flex items-center"
                        >
                          <FiChevronRight width={18} className="me-1" />{" "}
                          <span> Contact</span>{" "}
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="lg:col-span-3 md:col-span-4">
                    <h5 className="tracking-[1px] text-gray-100 font-semibold">
                      Contact Details
                    </h5>
                    <div className="flex mt-6">
                      <FiMapPin className="w-5 h-5 text-green-600 me-3"></FiMapPin>
                      <div className="">
                        <h6 className="text-gray-300 mb-2">
                          C/54 Northwest Freeway, <br /> Suite 558, <br />{" "}
                          Houston, USA 485
                        </h6>
                        <Link
                          href="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d39206.002432144705!2d-95.4973981212445!3d29.709510002925988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c16de81f3ca5%3A0xf43e0b60ae539ac9!2sGerald+D.+Hines+Waterwall+Park!5e0!3m2!1sen!2sin!4v1566305861440!5m2!1sen!2sin"
                          data-type="iframe"
                          className="text-green-600 hover:text-green-700 duration-500 ease-in-out lightbox"
                        >
                          View on Google map
                        </Link>
                      </div>
                    </div>

                    <div className="flex mt-6">
                      <FiMail className="w-5 h-5 text-green-600 me-3"></FiMail>
                      <div className="">
                        <Link
                          href="mailto:contact@example.com"
                          className="text-slate-300 hover:text-slate-400 duration-500 ease-in-out"
                        >
                          contact@example.com
                        </Link>
                      </div>
                    </div>

                    <div className="flex mt-6">
                      <FiPhone className="w-5 h-5 text-green-600 me-3"></FiPhone>
                      <div className="">
                        <Link
                          href="tel:+152534-468-854"
                          className="text-slate-300 hover:text-slate-400 duration-500 ease-in-out"
                        >
                          +152 534-468-854
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- Subscribe --> */}
            </div>
          </div>
        </div>
        <div className="py-[30px] px-0 border-t border-gray-800 dark:border-gray-700">
          <div className="container text-center">
            <div className="grid md:grid-cols-2 items-center gap-6">
              <div className="md:text-start text-center">
                <p className="mb-0 text-gray-300">
                  ©{new Date().getFullYear()} adriaVacay. Design & Develop with{" "}
                  <i className="mdi mdi-heart text-red-600"></i> by{" "}
                  <Link
                    href="https://killerclick.com/"
                    target="_blank"
                    className="text-reset"
                  >
                    killerclick
                  </Link>
                  .
                </p>
              </div>

              <ul className="list-none md:text-end text-center">
                <li className="inline ms-1">
                  <Link
                    href="https://1.envato.market/adriaVacay-next"
                    target="_blank"
                    className="btn btn-icon btn-sm text-gray-400 hover:text-white border border-gray-800 dark:border-gray-700 rounded-md hover:border-green-600 dark:hover:border-green-600 hover:bg-green-600 dark:hover:bg-green-600"
                  >
                    <FiShoppingCart className="h-4 w-4"></FiShoppingCart>
                  </Link>
                </li>
                <li className="inline ms-1">
                  <Link
                    href="https://dribbble.com/killerclick"
                    target="_blank"
                    className="btn btn-icon btn-sm text-gray-400 hover:text-white border border-gray-800 dark:border-gray-700 rounded-md hover:border-green-600 dark:hover:border-green-600 hover:bg-green-600 dark:hover:bg-green-600"
                  >
                    <FiDribbble className="h-4 w-4"></FiDribbble>
                  </Link>
                </li>
                <li className="inline ms-1">
                  <Link
                    href="https://www.behance.net/killerclick"
                    target="_blank"
                    className="btn btn-icon btn-sm text-gray-400 hover:text-white border border-gray-800 dark:border-gray-700 rounded-md hover:border-green-600 dark:hover:border-green-600 hover:bg-green-600 dark:hover:bg-green-600"
                  >
                    <RiBehanceFill width={18} className="align-baseline" />
                  </Link>
                </li>
                <li className="inline ms-1">
                  <Link
                    href="http://linkedin.com/company/killerclick"
                    target="_blank"
                    className="btn btn-icon btn-sm text-gray-400 hover:text-white border border-gray-800 dark:border-gray-700 rounded-md hover:border-green-600 dark:hover:border-green-600 hover:bg-green-600 dark:hover:bg-green-600"
                  >
                    <FiLinkedin className="h-4 w-4"></FiLinkedin>
                  </Link>
                </li>
                <li className="inline ms-1">
                  <Link
                    href="https://www.facebook.com/killerclick"
                    target="_blank"
                    className="btn btn-icon btn-sm text-gray-400 hover:text-white border border-gray-800 dark:border-gray-700 rounded-md hover:border-green-600 dark:hover:border-green-600 hover:bg-green-600 dark:hover:bg-green-600"
                  >
                    <FiFacebook className="h-4 w-4"></FiFacebook>
                  </Link>
                </li>
                <li className="inline ms-1">
                  <Link
                    href="https://www.instagram.com/killerclick/"
                    target="_blank"
                    className="btn btn-icon btn-sm text-gray-400 hover:text-white border border-gray-800 dark:border-gray-700 rounded-md hover:border-green-600 dark:hover:border-green-600 hover:bg-green-600 dark:hover:bg-green-600"
                  >
                    <FiInstagram className="h-4 w-4"></FiInstagram>
                  </Link>
                </li>
                <li className="inline ms-1">
                  <Link
                    href="https://twitter.com/killerclick"
                    target="_blank"
                    className="btn btn-icon btn-sm text-gray-400 hover:text-white border border-gray-800 dark:border-gray-700 rounded-md hover:border-green-600 dark:hover:border-green-600 hover:bg-green-600 dark:hover:bg-green-600"
                  >
                    <FiTwitter className="h-4 w-4"></FiTwitter>
                  </Link>
                </li>
                <li className="inline ms-1">
                  <Link
                    href="mailto:support@killerclick.com"
                    className="btn btn-icon btn-sm text-gray-400 hover:text-white border border-gray-800 dark:border-gray-700 rounded-md hover:border-green-600 dark:hover:border-green-600 hover:bg-green-600 dark:hover:bg-green-600"
                  >
                    <FiMail className="h-4 w-4"></FiMail>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
