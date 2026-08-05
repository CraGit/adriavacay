"use client";

import { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";

export default function TextAnimation({ start, animated, end }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <h1 className="font-semibold text-white lg:leading-normal leading-normal text-4xl lg:text-6xl mb-6">
      {start} <br />
      {mounted ? (
        <TypeAnimation
          sequence={[
            animated[0],
            1000,
            animated[1],
            1000,
            animated[2],
            1000,
          ]}
          wrapper="span"
          speed={40}
          style={{ fontSize: "1ren", display: "inline-block" }}
          repeat={Infinity}
          cursor={false}
        />
      ) : (
        <span style={{ fontSize: "1ren", display: "inline-block" }}>
          {animated?.[0] ?? ""}
        </span>
      )}{" "}
      {end}
    </h1>
  );
}
