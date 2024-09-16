import Image from "next/image";
import Link from "next/link";

import {
  BsPencil,
  FiFacebook,
  FiInstagram,
  FiMail,
  FiMapPin,
  FiPhone,
} from "@/assets/icons/vander";

export default function Footer() {
  return (
    <>
      <footer className="relative bg-primary dark:bg-slate-800 mt-24">
        <div className="container">
          <div className="grid grid-cols-1">
            <div className="relative py-16">
              {/* <!-- Subscribe --> */}
              <div className="relative w-full">
                <div className="relative -top-40 bg-white dark:bg-slate-900 lg:px-8 px-6 py-10 rounded-xl shadow-lg dark:shadow-gray-700 overflow-hidden">
                  <div className="flex flex-row justify-between items-center">
                    <div className="md:text-start text-center z-1">
                      <h3 className="md:text-3xl text-2xl md:leading-normal leading-normal font-medium text-black dark:text-white">
                        Say Hi!
                      </h3>
                      <p className="text-slate-400 max-w-xl mx-auto">
                        Send us a message, we will get back to you as soon as we
                        can.
                      </p>
                    </div>

                    <div className="subcribe-form z-1">
                      <Link
                        href="/contact"
                        className="btn bg-green-600 hover:bg-green-700 text-white rounded-full"
                      >
                        Contact
                      </Link>
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
                    <Link
                      href="#"
                      className="text-[22px] focus:outline-none text-white font-semibold"
                    >
                      <Image
                        src="/images/logoslogan.svg"
                        alt=""
                        width={240}
                        height={28}
                      />
                    </Link>
                    {/* <p className="mt-6 text-gray-300">
                      adriaVacay is a platform that connects travelers with
                      hosts. We provide a platform for hosts to accommodate
                      travelers with short-term lodging and tourism-related
                      activities.
                    </p> */}
                  </div>

                  {/* <div className="lg:col-span-2 md:col-span-4">
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
                  </div> */}

                  <div className="lg:col-span-8 md:col-span-8 md:ml-auto">
                    <h5 className="tracking-[1px] text-gray-100 font-semibold">
                      Contact Details
                    </h5>
                    <div className="flex mt-6">
                      <FiMapPin className="w-5 h-5 text-green-600 me-3"></FiMapPin>
                      <div className="">
                        <h6 className="text-gray-300 mb-2">
                          AdriaVacay, vl. Josip Čorić
                        </h6>
                        <p className="text-green-600 duration-500 ease-in-out lightbox">
                          Naklice 29, 21252 Tugare
                        </p>
                      </div>
                    </div>

                    <div className="flex mt-6">
                      <FiMail className="w-5 h-5 text-green-600 me-3"></FiMail>
                      <div className="">
                        <Link
                          href="mailto:adriavacay@gmail.com"
                          className="text-slate-300 hover:text-slate-400 duration-500 ease-in-out"
                        >
                          adriavacay@gmail.com
                        </Link>
                      </div>
                    </div>

                    <div className="flex mt-6">
                      <FiPhone className="w-5 h-5 text-green-600 me-3"></FiPhone>
                      <div className="">
                        <Link
                          href="tel:+385976663532"
                          className="text-slate-300 hover:text-slate-400 duration-500 ease-in-out"
                        >
                          +385 97 666 35 32
                        </Link>
                      </div>
                    </div>
                    <div className="flex mt-12">
                      <Link
                        href="/terms-and-conditions"
                        className="text-slate-100 font-semibold hover:text-slate-400 duration-500 ease-in-out"
                      >
                        Terms and Conditions
                      </Link>
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
                <p className="mb-0 text-gray-500">
                  Web by{" "}
                  <Link
                    href="https://killerclick.com/"
                    target="_blank"
                    className="text-reset"
                  >
                    Killer Click
                  </Link>
                  .{"  "}{" "}
                  <span className="mb-0 text-gray-300">
                    AdriaVacay &copy; {new Date().getFullYear()}
                  </span>
                </p>

                {/* <Link href="/privacy-policy" className="text-gray-300">
                    
                  Privacy Policy
                </Link> */}
              </div>

              <ul className="list-none md:text-end text-center">
                <li className="inline ms-1">
                  <a
                    href="https://www.facebook.com"
                    target="_blank"
                    className="btn btn-icon btn-sm text-gray-400 hover:text-white border border-gray-800 dark:border-gray-700 rounded-md hover:border-green-600 dark:hover:border-green-600 hover:bg-green-600 dark:hover:bg-green-600"
                  >
                    <FiFacebook className="h-4 w-4"></FiFacebook>
                  </a>
                </li>
                <li className="inline ms-1">
                  <a
                    href="https://www.instagram.com/adriavacay"
                    target="_blank"
                    className="btn btn-icon btn-sm text-gray-400 hover:text-white border border-gray-800 dark:border-gray-700 rounded-md hover:border-green-600 dark:hover:border-green-600 hover:bg-green-600 dark:hover:bg-green-600"
                  >
                    <FiInstagram className="h-4 w-4"></FiInstagram>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
