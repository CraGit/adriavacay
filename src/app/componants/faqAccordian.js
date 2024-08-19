"use client"; // This is a client component 👈🏽
import React,{useState} from "react";

import { Link as Link2 } from 'react-scroll';

import { accordion } from "../data/data";

export default function FaqAccordian(){
    let [activeIndex, setActiveIndex] = useState(0);
    let [activeGeneral, setGeneralIndex] = useState(0);
    let [activePayment, setPaymentIndex] = useState(0);
    let [activeSupport, setSupportIndex] = useState(0);

    let toggleAccordion = (index) => {
        if (activeIndex === index) {
            setActiveIndex(null);
        } else {
            setActiveIndex(index);
        }
    };

    let toggleGeneral = (index) => {
        if (activeGeneral === index) {
            setGeneralIndex(null);
        } else {
            setGeneralIndex(index);
        }
    };

    let togglePayment = (index) => {
        if (activePayment === index) {
            setPaymentIndex(null);
        } else {
            setPaymentIndex(index);
        }
    };

    let toggleSupport = (index) => {
        if (activeSupport === index) {
            setSupportIndex(null);
        } else {
            setSupportIndex(index);
        }
    };
    return(
        <div className="container">
        <div className="grid md:grid-cols-12 grid-cols-1 gap-[30px]">
            <div className="lg:col-span-4 md:col-span-5">
                <div className="rounded-md shadow dark:shadow-gray-700 p-6 sticky top-20">
                    <ul className="list-unstyled sidebar-nav mb-0 py-0" id="navmenu-nav">
                        <li className="navbar-item p-0"><Link2 to="tech" spy={true} activeclassname="active"
                            smooth={true}
                            duration={500} className="text-base font-medium navbar-link">Buying Questions</Link2></li>
                        <li className="navbar-item mt-3 p-0"><Link2 spy={true} activeclassname="active" smooth={true} duration={500} to="general" className="text-base font-medium navbar-link">General Questions</Link2></li>
                        <li className="navbar-item mt-3 p-0"><Link2 spy={true} activeclassname="active" smooth={true} duration={500} to="payment" className="text-base font-medium navbar-link">Payments Questions</Link2></li>
                        <li className="navbar-item mt-3 p-0"><Link2 spy={true} activeclassname="active" smooth={true} duration={500} to="support" className="text-base font-medium navbar-link">Support Questions</Link2></li>
                    </ul>
                </div>
            </div>

            <div className="lg:col-span-8 md:col-span-7">
                <div id="tech">
                    <h5 className="text-2xl font-semibold">Buying Product</h5>

                    <div id="accordion-collapse" data-accordion="collapse" className="mt-6">
                        {accordion.map((section, index) => (
                            <div key={index}

                                className="relative shadow dark:shadow-gray-700 rounded-md overflow-hidden mt-4">
                                <h2 className="text-base font-medium" id="accordion-collapse-heading-1">
                                    <button type="button" onClick={() => toggleAccordion(index)}
                                        className={`flex justify-between items-center p-5 w-full font-medium text-left ${activeIndex === index ? 'bg-gray-50 dark:bg-slate-800 text-green-600' : ''}`}>
                                        <span>{section.title}</span>
                                        <svg className="w-4 h-4 rotate-180 shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                        </svg>
                                    </button>
                                </h2>
                                {activeIndex === index && (
                                    <div id="accordion-collapse-body-1">
                                        <div className="p-5">
                                            <p className="text-slate-400 dark:text-gray-400"> {section.content}</p>
                                        </div>
                                    </div>
                                )}
                            </div>


                        ))}
                    </div>
                </div>

                <div id="general" className="mt-8">
                    <h5 className="text-2xl font-semibold">General Questions</h5>

                    <div id="accordion-collapse" data-accordion="collapse" className="mt-6">
                        {accordion.map((section, index) => (
                            <div key={index}

                                className="relative shadow dark:shadow-gray-700 rounded-md overflow-hidden mt-4">
                                <h2 className="text-base font-medium" id="accordion-collapse-heading-1">
                                    <button type="button" onClick={() => toggleGeneral(index)}
                                        className={`flex justify-between items-center p-5 w-full font-medium text-left ${activeGeneral === index ? 'bg-gray-50 dark:bg-slate-800 text-green-600' : ''}`}>
                                        <span>{section.title}</span>
                                        <svg className="w-4 h-4 rotate-180 shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                        </svg>
                                    </button>
                                </h2>
                                {activeGeneral === index && (
                                    <div id="accordion-collapse-body-1">
                                        <div className="p-5">
                                            <p className="text-slate-400 dark:text-gray-400"> {section.content}</p>
                                        </div>
                                    </div>
                                )}
                            </div>


                        ))}
                    </div>
                </div>

                <div id="payment" className="mt-8">
                    <h5 className="text-2xl font-semibold">Payments Questions</h5>

                    <div id="accordion-collapse" data-accordion="collapse" className="mt-6">
                        {accordion.map((section, index) => (
                            <div key={index}

                                className="relative shadow dark:shadow-gray-700 rounded-md overflow-hidden mt-4">
                                <h2 className="text-base font-medium" id="accordion-collapse-heading-1">
                                    <button type="button" onClick={() => togglePayment(index)}
                                        className={`flex justify-between items-center p-5 w-full font-medium text-left ${activePayment === index ? 'bg-gray-50 dark:bg-slate-800 text-green-600' : ''}`}>
                                        <span>{section.title}</span>
                                        <svg className="w-4 h-4 rotate-180 shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                        </svg>
                                    </button>
                                </h2>
                                {activePayment === index && (
                                    <div id="accordion-collapse-body-1">
                                        <div className="p-5">
                                            <p className="text-slate-400 dark:text-gray-400"> {section.content}</p>
                                        </div>
                                    </div>
                                )}
                            </div>


                        ))}
                    </div>
                </div>

                <div id="support" className="mt-8">
                    <h5 className="text-2xl font-semibold">Support Questions</h5>

                    <div id="accordion-collapse" data-accordion="collapse" className="mt-6">
                        {accordion.map((section, index) => (
                            <div key={index}

                                className="relative shadow dark:shadow-gray-700 rounded-md overflow-hidden mt-4">
                                <h2 className="text-base font-medium" id="accordion-collapse-heading-1">
                                    <button type="button" onClick={() => toggleSupport(index)}
                                        className={`flex justify-between items-center p-5 w-full font-medium text-left ${activeSupport === index ? 'bg-gray-50 dark:bg-slate-800 text-green-600' : ''}`}>
                                        <span>{section.title}</span>
                                        <svg className="w-4 h-4 rotate-180 shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                        </svg>
                                    </button>
                                </h2>
                                {activeSupport === index && (
                                    <div>
                                        <div className="p-5">
                                            <p className="text-slate-400 dark:text-gray-400"> {section.content}</p>
                                        </div>
                                    </div>
                                )}
                            </div>


                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}