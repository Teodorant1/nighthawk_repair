"use client";

import React, { useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { ClickedPosition, CloudinaryResult } from "@/projecttypes";
import { CldUploadWidget } from "next-cloudinary";

const GoogleMapsComponent: React.FC = () => {
  const mapContainerStyle = {
    width: "100%",
    height: "700px",
  };

  const [clickedPosition, setClickedPosition] =
    useState<ClickedPosition | null>({ lat: 0, lng: 0 });

  const mapRef = useRef<GoogleMap | null>(null);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    const clickedPosition: ClickedPosition = {
      lat: event.latLng!.lat(),
      lng: event.latLng!.lng(),
    };
    setClickedPosition(clickedPosition);
  };

  // useEffect(() => {
  //   // Log the Google Map instance to the console for reference (optional)
  //   console.log("Google Map instance:", mapRef.current);
  // }, []);

  return (
    // <div>PLACEHOLDER</div>
    <>
      {" "}
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={clickedPosition!}
          zoom={2}
          onClick={handleMapClick}
          onLoad={(map: any) => {
            mapRef.current = map;
          }}
        >
          {clickedPosition && (
            <Marker
              position={{ lat: clickedPosition.lat, lng: clickedPosition.lng }}
            />
          )}
        </GoogleMap>
        {clickedPosition && (
          <div>
            <h3>Clicked Coordinates:</h3>
            <p>Latitude: {clickedPosition.lat.toFixed(6)}</p>
            <p>Longitude: {clickedPosition.lng.toFixed(6)}</p>
          </div>
        )}
      </LoadScript>
      <CldUploadWidget
        uploadPreset='bqhf0bxn'
        onUpload={(result, widget) => {
          if (result.event !== "success") {
            return;
          }
          // const info = result.info as CloudinaryResult;
          // const pictures21 = [...pictures2, String(info.public_id)];
          // setpictures2(pictures21);
        }}
      >
        {({ open }) => (
          <button
            onClick={() => open()}
            className='m-5 center bg-green-800 text-white  text-center font-bold py-4 px-20 rounded-full '
          >
            Upload
          </button>
        )}
      </CldUploadWidget>{" "}
    </>
  );
};

export default GoogleMapsComponent;
