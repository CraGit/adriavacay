"use client";

import { useEffect, useState } from "react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import SmallHeading from "./SmallHeading";

import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/styles.css";
import PartialDiv from "./PartialDiv";

export default function PhotoGallery({ photos, overtitle, heading }) {
  const [index, setIndex] = useState(-1);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  return (
    <PartialDiv>
      <div className="">
        <div className="text-center lg:pb-[60px] pb-[40px]">
          <SmallHeading heading={heading} />
        </div>
        <PhotoAlbum
          key={width} // Add key prop to force re-render on width change
          photos={photos}
          layout="masonry"
          columns={3}
          targetRowHeight={150}
          onClick={({ index }) => setIndex(index)}
        />
        <Lightbox
          slides={photos}
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
          plugins={[Fullscreen, Slideshow, Thumbnails, Zoom, Captions]}
        />
      </div>
    </PartialDiv>
  );
}
