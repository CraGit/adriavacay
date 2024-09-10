import { DayPicker as OriDayPicker } from "react-day-picker";

export const DayPicker = (props) => (
  <OriDayPicker
    classNames={{
      button_next:
        "inline-flex justify-center items-center absolute top-0 w-10 h-10 rounded-full text-gray-600 hover:bg-gray-100 right-0",
      button_previous:
        "inline-flex justify-center items-center absolute top-0 w-10 h-10 rounded-full text-gray-600 hover:bg-gray-100 left-0",
      caption_label: "text-xl px-1",
      day: "w-10 h-10 align-middle text-center border-0 px-0",
      day_button:
        "rounded-full w-10 h-10 transition-colors hover:bg-green-700 hover:text-white focus:outline-none focus-visible:ring focus-visible:ring-sky-300 focus-visible:ring-opacity-50 active:bg-sky-600 active:text-white",
      disabled:
        "opacity-25 hover:bg-white active:bg-white active:text-gray-800",
      hidden: "opacity-25",
      month_caption: "flex justify-center items-center h-10",
      month_grid: "border-collapse border-spacing-0",
      months: "flex gap-4 relative px-4",
      outside: "enabled:opacity-50",
      range_end: "rounded-l-none rounded-r-full !font-bold",
      range_middle: "rounded-none !font-bold",
      range_start: "rounded-r-none rounded-l-full !font-bold",
      root: "text-gray-800",
      selected: "text-white bg-green-600 hover:bg-green-700",
      today: "font-bold",
      weekday: "w-10 h-10 uppercase align-middle text-center",
    }}
    {...props}
  />
);
