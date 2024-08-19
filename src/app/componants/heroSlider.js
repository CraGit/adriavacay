'use client'
import React from "react";
import Link from "next/link";

import { Carousel } from 'react-responsive-carousel';
import '../../../node_modules/react-responsive-carousel/lib/styles/carousel.min.css'

export default function HeroSlider(){
    return(
        <section className="swiper-slider-hero relative block h-screen" id="home">
             <Carousel style={{height:'100%'}} autoPlay={true} infiniteLoop={true} showArrows={false} showStatus={false} showThumbs={false}>
            <div className="swiper-slide flex items-center overflow-hidden" style={{height:'100%'}}>
                    <div className="slide-inner absolute end-0 top-0 w-full h-full slide-bg-image flex items-center bg-center"  style={{backgroundImage:`url('/images/bg/01.jpg')`, height:'100%'}}>
                        <div className="absolute inset-0 bg-black/70"></div>
                        <div className="container relative">
                            <div className="grid grid-cols-1">
                                <div className="text-center">
                                    <h1 className="font-bold text-white lg:leading-normal leading-normal text-4xl lg:text-5xl mb-6">Easy way to find your <br/> dream property</h1>
                                    <p className="text-white/70 text-xl max-w-xl mx-auto">A great plateform to buy, sell and rent your properties without any agent or commisions.</p>
                                    
                                    <div className="mt-6">
                                        <Link href="" className="btn bg-green-600 hover:bg-green-700 text-white rounded-md">See More</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 

                <div className="swiper-slide flex items-center overflow-hidden">
                    <div className="slide-inner absolute end-0 top-0 w-full h-full slide-bg-image flex items-center bg-center" style={{backgroundImage:`url('/images/bg/02.jpg')`}}>
                        <div className="absolute inset-0 bg-black/70"></div>
                        <div className="container relative">
                            <div className="grid grid-cols-1">
                                <div className="text-center">
                                    <h1 className="font-bold text-white lg:leading-normal leading-normal text-4xl lg:text-5xl mb-6">We will help you find <br/> your Wonderful home</h1>
                                    <p className="text-white/70 text-xl max-w-xl mx-auto">A great plateform to buy, sell and rent your properties without any agent or commisions.</p>
                                    
                                    <div className="mt-6">
                                        <Link href="" className="btn bg-green-600 hover:bg-green-700 text-white rounded-md">See More</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
            </Carousel>
        </section>
    )
}

