"use client";

import Image from "next/image";
import { useState } from "react";

export function PhotoGallery({ property }: { property: any }) {
  const [mainImage, setMainImage] = useState(
    property?.images?.[0] || property.image
  );
  const thumbnails = property?.images?.slice(1) ?? [
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
  ];

  console.log(mainImage);

  return (
    <div>
      <div className="relative h-[400px] md:h-[600px]">
        <Image
          src={mainImage}
          alt="Main property image"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
          priority
        />
      </div>
      <div className="mt-4 flex space-x-4 overflow-x-auto">
        {thumbnails.map((thumb, index) => (
          <Image
            key={index}
            src={thumb}
            alt={`Thumbnail ${index + 1}`}
            width={100}
            height={100}
            className="rounded cursor-pointer"
            onClick={() => setMainImage(thumb)}
          />
        ))}
      </div>
    </div>
  );
}
