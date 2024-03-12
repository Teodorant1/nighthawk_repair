import { ImageCarouselProps } from "@/projecttypes";
import { CldImage } from "next-cloudinary";
import React, { useState } from "react";

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div>
      {images.length > 0 && (
        <>
          {" "}
          <div className='flex flex-wrap items-center justify-center'>
            <div>
              {" "}
              {currentImageIndex + 1}/{images.length}{" "}
            </div>
            <button
              className='m-2 bg-green-400 text-white center   text-center font-bold p-2 rounded-sm '
              onClick={handlePrevImage}
            >
              Previous
            </button>
            <button
              className='m-2 bg-green-400 text-white center   text-center font-bold p-2 rounded-sm '
              onClick={handleNextImage}
            >
              Next
            </button>{" "}
          </div>{" "}
          {}
          <CldImage
            src={images[currentImageIndex].cloudinaryID}
            alt={`Image ${currentImageIndex + 1}`}
            width={1000}
            height={1000}
          />
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
