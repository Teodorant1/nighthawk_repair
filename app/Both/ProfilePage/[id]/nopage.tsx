import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useProfileState } from "./ProfileContext";
import { Props1, parcel } from "@/projecttypes";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { ClickedPosition } from "@/projecttypes";
import { profileSubCategory, sub_category } from "@prisma/client";

const SellerProfile = ({ params: { id } }: Props1) => {
  const context = useProfileState();
  const { status, data: session } = useSession();
  const [showmap, setshowmap] = useState<boolean>(false);
  const [showSCadder, setshowSCadder] = useState<boolean>(true);

  const parcel1: parcel = {
    method: "getCategories",
  };
  useEffect(() => {
    axios.post("/api/profileEditor", parcel1).then((resp) => {
      context.setall_categories(resp.data);
    });
  }, []);
  useEffect(() => {
    let my_Sub_CategoriesParcel: parcel = {
      method: "getMYSubcategories",
      userID: id,
    };
    axios.post("/api/profileEditor", my_Sub_CategoriesParcel).then((resp) => {
      context.setmy_Sub_Categories(resp.data);
    });
  }, []);
  useEffect(() => {
    let my_Sub_CategoriesParcel: parcel = {
      method: "getSubcategories",
      userID: id,
    };
    axios.post("/api/profileEditor", my_Sub_CategoriesParcel).then((resp) => {
      context.setall_subcategories(resp.data);
    });
  }, []);
  useEffect(() => {
    let my_Sub_CategoriesParcel: parcel = {
      method: "getLocation",
      userID: id,
    };
    axios.post("/api/profileEditor", my_Sub_CategoriesParcel).then((resp) => {
      context.setUserLoc(resp.data);
    });
  }, []);

  function GreaterCategoryBox() {
    function check_IF_PresentInMyInterests(subcategory: sub_category) {
      if (
        context.my_Sub_Categories.some(
          (sub_category1) => subcategory.name === sub_category1.subcategory
        )
      ) {
        return false;
      }
      return true;
    }

    function AddProfileSubcat(category: string, subcategory: string) {
      let update_my_categories: parcel = {
        method: "AddProfileSubcat",
        userID: session?.user.sub,
        category: category,
        subcategory: subcategory,
      };
      axios.post("/api/profileEditor", update_my_categories).then((resp) => {
        context.setmy_Sub_Categories(resp.data);
      });
    }

    function DeleteProfileSubcat(
      category: string,
      subcategory: string,
      subcatID: string
    ) {
      let delete_my_category: parcel = {
        method: "DeleteProfileSubcat",
        userID: session?.user.sub,
        category: category,
        subcategory: subcategory,
        id: subcatID,
      };
      axios.post("/api/profileEditor", delete_my_category).then((resp) => {
        context.setmy_Sub_Categories(resp.data);
      });
    }

    return (
      <div className='ml-3 center outline text-center font-bold py-2 px-4 rounded-md my-5'>
        {/* {context.my_Sub_Categories.length} {context.all_subcategories.length} */}
        {context.my_Sub_Categories?.length! > 0 && (
          <div className='ml-3 center outline text-center font-bold py-2 px-4  rounded-sm my-5'>
            <h1>INTERESTED IN: </h1>
            {context.my_Sub_Categories!.map((sub_category) => (
              <div
                key={sub_category.id}
                onClick={() => {}}
                className='ml-3 center outline text-center font-bold py-2 px-4 rounded-sm my-5'
              >
                {sub_category.subcategory}
                {""} {""} |{""} Category: {sub_category.category}{" "}
                {session?.user.sub === id && (
                  <button
                    onClick={() => {
                      DeleteProfileSubcat(
                        sub_category.category,
                        sub_category.subcategory,
                        sub_category.id
                      );
                    }}
                    className='ml-3 center bg-red-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
                  >
                    DELETE{" "}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}{" "}
        {context.my_Sub_Categories?.length! === 0 && (
          <div className='ml-3 center outline text-center font-bold py-2 px-4 rounded-sm my-5'>
            <h1>NO SUBCATEGORIES ADDED YET</h1>
          </div>
        )}{" "}
        {session?.user.sub === id && (
          <button
            onClick={() => {
              if (showSCadder === false) {
                setshowSCadder(true);
              }
              if (showSCadder === true) {
                setshowSCadder(false);
              }
            }}
            className='ml-3 center  bg-blue-950  text-white text-center font-bold py-2 px-4 rounded-full my-5'
          >
            {" "}
            Click here to toggle the dropdown list of Interests{" "}
          </button>
        )}
        {session?.user.sub === id && showSCadder === true && (
          <div>
            {context.all_subcategories.length > 0 && (
              <div className='ml-3 center outline text-center font-bold py-2 px-4 rounded-sm my-5'>
                <h1>ADD NEW SUBCATEGORIES HERE</h1>

                {context.all_subcategories!.map((sub_category) => (
                  <>
                    {" "}
                    {check_IF_PresentInMyInterests(sub_category) && (
                      <div
                        key={sub_category.id}
                        className='ml-3 center outline text-center font-bold py-2 px-4 rounded-sm my-5'
                      >
                        {sub_category.name}/ Category: {sub_category.categoryID}{" "}
                        <button
                          onClick={() => {
                            AddProfileSubcat(
                              sub_category.categoryID,
                              sub_category.name
                            );
                          }}
                          className='ml-3 center bg-blue-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
                        >
                          ADD THIS INTEREST{" "}
                        </button>
                      </div>
                    )}
                  </>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

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

      let update_location_parcel: parcel = {
        method: "setLocation",
        userID: id,
        lat: event.latLng!.lat(),
        long: event.latLng!.lng(),
      };
      axios.post("/api/profileEditor", update_location_parcel);
    };

    return (
      // <div>PLACEHOLDER</div>
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
    );
  };

  return (
    <div>
      <div>
        {" "}
        <GreaterCategoryBox />
        {session?.user.sub === id && (
          <>
            {" "}
            <button
              onClick={() => {
                if (showmap === false) {
                  setshowmap(true);
                }
                if (showmap === true) {
                  setshowmap(false);
                }
              }}
              className='ml-3 center  bg-blue-950  text-white text-center font-bold py-2 px-4 rounded-full my-5'
            >
              {" "}
              Click here to toggle the map{" "}
            </button>
            {showmap === true && (
              <div>
                {" "}
                <div> Current Radius : {context.UserLoc.TravelRange} KM</div>
                <button
                  onClick={() => {}}
                  className='ml-3 center  bg-blue-950  text-white text-center font-bold py-2 px-4 rounded-full my-5'
                >
                  {" "}
                  Click here to update Radius{" "}
                </button>
                <div>
                  {" "}
                  <GoogleMapsComponent />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SellerProfile;
