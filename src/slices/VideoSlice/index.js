import Video from "@/components/Video";

/**
 * @typedef {import("@prismicio/client").Content.VideoSliceSlice} VideoSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<VideoSliceSlice>} VideoSliceProps
 * @param {VideoSliceProps}
 */
const VideoSlice = ({ slice }) => {
  const { youtube_url } = slice.primary;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-12"
    >
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <Video
            videoEmbed={youtube_url}
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default VideoSlice;
