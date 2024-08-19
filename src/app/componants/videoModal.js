"use client";
import React,{useState} from "react";
import Link from "next/link";

import ModalVideo from "react-modal-video";
import "../../../node_modules/react-modal-video/scss/modal-video.scss";

export default function VideoModal(){
    let [isOpen, setOpen] = useState(false)
    return(
        <>
        <div className="absolute bottom-2/4 translate-y-2/4 start-0 end-0 text-center">
            <Link href="#" onClick={() => setOpen(true)} data-type="youtube" data-id="S_CGed6E610" className="lightbox h-20 w-20 rounded-full shadow-md dark:shadow-gray-800 inline-flex items-center justify-center bg-white dark:bg-slate-900 text-green-600">
                <i className="mdi mdi-play inline-flex items-center justify-center text-2xl"></i>
            </Link>
        </div>
         <ModalVideo
         channel="youtube"
         isOpen={isOpen}
         videoId="S_CGed6E610"
         onClose={() => setOpen(false)}
            />
        </>
    )
}