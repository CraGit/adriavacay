"use client";
import React from "react";
import { TypeAnimation } from "react-type-animation";

export default function TextAnimation({ start, animated, end }) {
  return (
    <h1 className="font-semibold text-white lg:leading-normal leading-normal text-4xl lg:text-6xl mb-6">
      {start} <br />
      <TypeAnimation
        sequence={[
          // Same substring at the start will only be typed out once, initially
          animated[0],
          1000, // wait 1s before replacing "Mice" with "Hamsters"
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
      />{" "}
      {end}
    </h1>
  );
}
