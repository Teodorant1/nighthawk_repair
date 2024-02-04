import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useProfileState } from "./ProfileContext";
import {
  CloudinaryResult,
  Props1,
  parcel,
  reviewCounter,
} from "@/projecttypes";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { ClickedPosition } from "@/projecttypes";
import { Review, sub_category, workGalleryPicture } from "@prisma/client";
import { CldImage, CldUploadWidget } from "next-cloudinary";

import { trpc } from "@/app/_trpc/client";

const SellerProfile = ({ params: { id } }: Props1) => {
  const context = useProfileState();
  const { status, data: session } = useSession();
  const [showmap, setshowmap] = useState<boolean>(false);
  const [showSCadder, setshowSCadder] = useState<boolean>(true);
  const [result1, setResult1] = React.useState<user | null>(null);

  interface user {
    name: string;
    role: string;
  }

  const mutation = trpc.procedureeeeeeeeeeee.useMutation({
    onSuccess: (c) => {
      // let c1: user = c;
      setResult1(c.user);
    },
  });
  const handleLogin = async () => {
    try {
      mutation.mutate({
        name: "John Doe",
      });

      // Access the data returned by the mutation
    } catch (error) {
      console.error("Mutation failed:", error);
    }
  };

  useEffect(() => {
    let getcertificatesParcel: parcel = {
      method: "getcertificates",
      userID: id,
    };

    axios.post("/api/profileEditor", getcertificatesParcel).then((resp) => {
      context.setcertificates(resp.data);
    });
  }, []);

  useEffect(() => {
    let getworkgalleryParcel: parcel = {
      method: "getworkgallery",
      userID: id,
    };

    axios.post("/api/profileEditor", getworkgalleryParcel).then((resp) => {
      context.setworkGalleryPictures(resp.data);
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

  async function GetReviewCounter(reviews: Review[]): Promise<reviewCounter> {
    // Calculate the sum of all ratings
    const totalScore = reviews.reduce((sum, review) => sum + review.rating, 0);
    // Calculate the average grade
    const averageGrade = totalScore / reviews.length;

    // Initialize an object to store the count for each score
    const scoreCounts: { [key: string]: number } = {};

    // Iterate through the reviews and count the occurrences of each score
    reviews.forEach((review) => {
      const { rating } = review;

      // If the score is not in the count object, initialize it with 1, otherwise increment the count
      scoreCounts[rating] = (scoreCounts[rating] || 0) + 1;
    });

    scoreCounts[6] = averageGrade;

    // Print the counts for each score
    console.log(averageGrade);
    console.log(scoreCounts);

    let RevCount: reviewCounter = {
      ones: scoreCounts["1"],
      twos: scoreCounts["2"],
      threes: scoreCounts["3"],
      fours: scoreCounts["4"],
      fives: scoreCounts["5"],
      average: scoreCounts["6"],
    };

    return RevCount;
  }

  useEffect(() => {
    let my_Sub_CategoriesParcel: parcel = {
      method: "getreviews",
      userID: id,
    };
    axios
      .post("/api/profileEditor", my_Sub_CategoriesParcel)
      .then(async (resp) => {
        context.setreviews(resp.data);
        if (resp.data.length > 0) {
          const revcount = await GetReviewCounter(resp.data);
          console.log("revcount", revcount);
          context.setreviewCounter(revcount);
        }
      })
      .then(() => {
        console.log(context.reviewCounter);
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
                  <div key={sub_category.id}>
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
                  </div>
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

  interface ImageCarouselProps {
    images: workGalleryPicture[];
  }

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
        {" "}
        {images.length > 0 && (
          <>
            {" "}
            <div className='flex items-center justify-center'>
              <button
                className='ml-3 center  bg-blue-950  text-white text-center font-bold py-2 px-4 rounded-full my-5'
                onClick={handlePrevImage}
              >
                Previous
              </button>
              <button
                className='ml-3 center  bg-blue-950  text-white text-center font-bold py-2 px-4 rounded-full my-5'
                onClick={handleNextImage}
              >
                Next
              </button>{" "}
              {session?.user.sub === id && (
                <button
                  onClick={() => {
                    let deletePicParcel: parcel = {
                      method: "removeworkgalleryPic",
                      id: images[currentImageIndex].id,
                      userID: session.user.sub,
                    };
                    setCurrentImageIndex(1);
                    axios
                      .post("/api/profileEditor", deletePicParcel)
                      .then((resp) => {
                        context.setworkGalleryPictures(resp.data);
                      });
                  }}
                  className='ml-3 center  bg-red-600  text-white text-center font-bold py-2 px-4 rounded-full my-5'
                >
                  DELETE THIS PICTURE
                </button>
              )}
            </div>{" "}
            <CldImage
              src={images[currentImageIndex].cloudinaryID}
              alt={`Image ${currentImageIndex + 1}`}
              width={600}
              height={600}
            />
          </>
        )}
      </div>
    );
  };

  function ReviewBox() {
    return (
      <div className='outline text-center font-bold py-2 px-4 rounded-sm my-5'>
        {context.reviewCounter.average !== 0 && (
          <>
            {" "}
            <button className='ml-3 center  bg-blue-950  text-white text-center font-bold py-2 px-4 rounded-full my-5'>
              {" "}
              Average Rating: {context.reviewCounter.average}
            </button>{" "}
            {context.reviewCounter.ones && (
              <button className='ml-3 center  bg-blue-950  text-white text-center font-bold py-2 px-4 rounded-full my-5'>
                Number of 1 star reviews : {context.reviewCounter.ones}
              </button>
            )}
            {context.reviewCounter.twos && (
              <button className='ml-3 center  bg-blue-950  text-white text-center font-bold py-2 px-4 rounded-full my-5'>
                Number of 2 star reviews : {context.reviewCounter.twos}
              </button>
            )}{" "}
            {context.reviewCounter.threes && (
              <button className='ml-3 center  bg-blue-950  text-white text-center font-bold py-2 px-4 rounded-full my-5'>
                Number of 3 star reviews : {context.reviewCounter.threes}
              </button>
            )}{" "}
            {context.reviewCounter.fours && (
              <button className='ml-3 center  bg-blue-950  text-white text-center font-bold py-2 px-4 rounded-full my-5'>
                Number of 4 star reviews : {context.reviewCounter.fours}
              </button>
            )}{" "}
            {context.reviewCounter.fives && (
              <button className='ml-3 center  bg-blue-950  text-white text-center font-bold py-2 px-4 rounded-full my-5'>
                Number of 5 star reviews : {context.reviewCounter.fives}
              </button>
            )}
          </>
        )}
        {context.reviews.length === 0 && <h1>THIS PERSON HAS NO REVIEWS</h1>}

        {context.reviews.length > 0 && (
          <>
            {" "}
            <h1>LIST OF REVIEWS</h1>{" "}
            <div className='outline text-center font-bold py-2 px-4 rounded-sm my-5'>
              {context.reviews.map((review) => (
                <div
                  className='outline font-bold rounded-sm mx-auto w-5/6'
                  key={review.id}
                >
                  <div className=' mx-auto  w-[100%]'>
                    {" "}
                    <div className='px-10'>JOB ID: {review.Job_Id}</div>{" "}
                    <div className='px-10'>
                      {" "}
                      DATE: {review.date_created.toString()}
                    </div>
                    <div className='px-10'>RATING: {review.rating}</div>{" "}
                  </div>{" "}
                  <div className='px-10'>COMMENT: {review.reviewText}</div>{" "}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  function CertificateBox() {
    return (
      <div className='ml-3 center outline text-center font-bold py-2 px-4 rounded-md my-5'>
        {context.certificates.length === 0 && (
          <h1>This user currently has no Certificates</h1>
        )}
        {context.certificates.length > 0 && (
          <div>
            <h1>CERTIFICATES</h1>
            {context.certificates.map((certificate) => (
              <div
                key={certificate.id}
                className='ml-3 center outline text-center font-bold py-2 px-4 rounded-md my-5'
              >
                {certificate.name} / {certificate.Link}{" "}
                {session?.user.sub === id && (
                  <button
                    onClick={() => {
                      let DeletecertificateParcel: parcel = {
                        method: "Deletecertificate",
                        userID: id,
                        id: certificate.id,
                      };

                      axios
                        .post("/api/profileEditor", DeletecertificateParcel)
                        .then((resp) => {
                          context.setcertificates(resp.data);
                        });
                    }}
                    className='ml-3 center bg-red-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
                  >
                    DELETE{" "}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {session?.user.sub === id && (
          <>
            <h1>Create new certificates here</h1>
            <input
              className='outline text-center font-bold py-2 px-4 rounded-full my-5'
              id='CertificateName'
              placeholder='Certificate Name Goes Here'
            />{" "}
            <input
              className='outline text-center font-bold py-2 px-4 rounded-full my-5'
              id='Certificatelink'
              placeholder='Certificate link Goes Here'
            />{" "}
            <button
              onClick={() => {
                const CertificateName = (
                  document.getElementById("CertificateName") as HTMLInputElement
                ).value;
                const Certificatelink = (
                  document.getElementById("Certificatelink") as HTMLInputElement
                ).value;

                let update_location_parcel: parcel = {
                  method: "addCertificate",
                  userID: id,
                  certificate: CertificateName,
                  link: Certificatelink,
                };
                axios
                  .post("/api/profileEditor", update_location_parcel)
                  .then((resp) => {
                    context.setcertificates(resp.data);
                  });
              }}
              className='ml-3 center  bg-blue-950  text-white text-center font-bold py-2 px-4 rounded-full my-5'
            >
              {" "}
              Click here to add a new certificate to your profile{" "}
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* <button
        onClick={async () => {
          await handleLogin();
        }}
        className='flex mx-auto w-1/2  justify-center bg-blue-950  text-white text-center font-bold py-2 px-4 rounded-full'
      >
        DO THE TRPC FUNNY
      </button> */}
      {context.UserLoc.isRepairman !== false && (
        <div>
          {" "}
          <ReviewBox />
          <GreaterCategoryBox />
          <CertificateBox />{" "}
          <div className='flex items-center justify-center h-screen'>
            {" "}
            <ImageCarousel images={context.workGalleryPictures} />
          </div>{" "}
          {session?.user.sub === id && (
            <CldUploadWidget
              uploadPreset='bqhf0bxn'
              onUpload={(result, widget) => {
                if (result.event !== "success") {
                  return;
                }
                const info = result.info as CloudinaryResult;

                let image_upload_parcel: parcel = {
                  method: "addworkgallery",
                  id: info.public_id.toString(),
                  userID: session?.user.sub,
                };

                axios
                  .post("/api/profileEditor", image_upload_parcel)
                  .then((resp) => {
                    context.setworkGalleryPictures(resp.data);
                  });
              }}
            >
              {({ open }) => (
                <button
                  onClick={() => open()}
                  className='flex mx-auto w-1/2  justify-center bg-blue-950  text-white text-center font-bold py-2 px-4 rounded-full'
                >
                  Upload
                </button>
              )}
            </CldUploadWidget>
          )}
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
                  <input
                    type='number'
                    className='outline text-center font-bold py-2 px-4 rounded-full my-5'
                    defaultValue={context.UserLoc.TravelRange}
                    id='Radius'
                    placeholder='Radius Goes Here'
                  />{" "}
                  <button
                    onClick={() => {
                      const Radius = (
                        document.getElementById("Radius") as HTMLInputElement
                      ).value;

                      let update_location_parcel: parcel = {
                        method: "setTravelRange",
                        userID: id,
                        radius: Number(Radius),
                      };
                      axios
                        .post("/api/profileEditor", update_location_parcel)
                        .then(() => {
                          context.setUserLoc({
                            ...context.UserLoc,
                            TravelRange: Number(Radius),
                          });
                        });
                    }}
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
              )}{" "}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SellerProfile;
