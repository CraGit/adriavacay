import SmallHeading from "./SmallHeading";
import { TiTick } from "react-icons/ti";

export default function Amenities({ amenities }) {
  return (
    <div className="lg:w-2/3 lg:mt-0 mt-4">
      <SmallHeading heading="Amenities" />
      <ul className="grid grid-cols-2 lg:gap-y-5 gap-y-3 gap-x-3">
        {amenities.map((amenity) => (
          <li key={amenity} className="col-span-1 flex items-center">
            <div className="mr-2"></div>
            <TiTick className="text-green-600" />
            {amenity}
          </li>
        ))}
      </ul>
    </div>
  );
}
