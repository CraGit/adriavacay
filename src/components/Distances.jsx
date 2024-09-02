import SmallHeading from "./SmallHeading";

export default function Distances({ distances }) {
  return (
    <div className="my-8">
      <SmallHeading heading="Distances" />
      {distances.map((distance, index) => (
        <div
          key={index}
          className="flex items-center justify-between border-b border-gray-200 py-4"
        >
          <div className="flex items-center">
            <div className="ml-4">
              <h4 className="text-lg font-semibold">{distance.place}</h4>
            </div>
          </div>
          <div className="text-green-600">{distance.distance}</div>
        </div>
      ))}
    </div>
  );
}
