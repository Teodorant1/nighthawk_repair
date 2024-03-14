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
import { FaStar } from "react-icons/fa6";
import { GrCertificate } from "react-icons/gr";
import { FaImages } from "react-icons/fa";

const SellerProfile = ({ params: { id } }: Props1) => {
  const context = useProfileState();
  const { status, data: session } = useSession();
  const [showmap, setshowmap] = useState<boolean>(false);
  const [showSCadder, setshowSCadder] = useState<boolean>(false);

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
      <div className='m-2 center outline text-center font-bold p-2 rounded-md '>
        {/* {context.my_Sub_Categories.length} {context.all_subcategories.length} */}
        {context.my_Sub_Categories?.length! > 0 && (
          <div className=' m-2 center  text-center font-bold p-2  rounded-sm '>
            <div>
              {" "}
              <button className=' bg-green-400 text-white p-5 rounded-md'>
                INTERESTS:{" "}
              </button>
            </div>

            {context.my_Sub_Categories!.map((sub_category) => (
              <button
                key={sub_category.id}
                onClick={() => {}}
                className='m-2 center outline text-center font-bold p-2 rounded-sm '
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
                    className='m-2 center bg-red-400 text-white text-center font-bold p-2 rounded-sm '
                  >
                    DELETE{" "}
                  </button>
                )}
              </button>
            ))}
          </div>
        )}{" "}
        {context.my_Sub_Categories?.length! === 0 && (
          <div className='bg-green-400 text-white m-2 center outline text-center font-bold p-2 rounded-sm '>
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
            className='m-2 center outline text-center font-bold p-2 rounded-sm '
          >
            {" "}
            Toggle potential interests{" "}
          </button>
        )}
        {session?.user.sub === id && showSCadder === true && (
          <div>
            {context.all_subcategories.length > 0 && (
              <div className=' m-2  center  text-center font-bold p-2 rounded-sm '>
                <button className='bg-green-400 text-white p-5 rounded-md'>
                  AVAILABLE SUBCATEGORIES
                </button>
                <div className='flex flex-wrap'>
                  {" "}
                  {context.all_subcategories!.map((sub_category) => (
                    <div key={sub_category.id}>
                      {" "}
                      {check_IF_PresentInMyInterests(sub_category) && (
                        <button
                          key={sub_category.id}
                          className=' m-2  center  text-center font-bold p-5 rounded-sm '
                        >
                          <button
                            onClick={() => {
                              AddProfileSubcat(
                                sub_category.categoryID,
                                sub_category.name
                              );
                            }}
                            className='m-2 bg-green-400 text-white center  text-center font-bold p-2 rounded-sm '
                          >
                            ADD {sub_category.name}/ Category:{" "}
                            {sub_category.categoryID}{" "}
                          </button>
                        </button>
                      )}
                    </div>
                  ))}{" "}
                </div>
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
        {session?.user.sub === id && (
          <CldUploadWidget
            uploadPreset='wn6nts4f'
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
                className='flex bg-green-400 text-white mx-auto items-center justify-center  font-bold p-2 rounded-sm'
              >
                <FaImages className='mr-2' /> Upload image
              </button>
            )}
          </CldUploadWidget>
        )}{" "}
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
                  className='m-2 center  bg-red-400  text-white text-center font-bold p-2 rounded-sm '
                >
                  DELETE
                </button>
              )}
            </div>{" "}
            {}
            <CldImage
              src={images[currentImageIndex].cloudinaryID}
              alt={`Image ${currentImageIndex + 1}`}
              width={1000}
              height={1000}
              style={{ width: "1000px", height: "1000px" }}
            />
          </>
        )}
      </div>
    );
  };
  interface RatingComponentProps {
    rating: number;
  }

  const RatingComponent: React.FC<RatingComponentProps> = ({ rating }) => {
    const maxRating = 5; // Assuming maximum rating is 5

    // Generate an array of length equal to maxRating
    const starIcons = Array.from({ length: maxRating }, (_, index) => (
      <FaStar
        key={index}
        className={index < rating ? "text-yellow-400" : "text-gray-400"}
      />
    ));

    return <div className='flex flex-wrap'>{starIcons}</div>;
  };
  function ReviewBox() {
    return (
      <div className='items-center justify-center w-screen text-center font-bold p-2 rounded-md '>
        {context.reviewCounter.average !== 0 && (
          <div className='flex items-center justify-center w-screen'>
            {" "}
            <button className='flex items-center justify-center m-2 bg-green-400 text-white center  text-center font-bold p-2 rounded-sm '>
              {" "}
              Average: {context.reviewCounter.average} {""}{" "}
              <FaStar className=' text-yellow-400' />
            </button>{" "}
            {context.reviewCounter.ones && (
              <button className='flex items-center justify-center m-2 bg-green-400 text-white center  text-center font-bold p-2 rounded-sm '>
                <FaStar className=' text-yellow-400' /> :{" "}
                {context.reviewCounter.ones}
              </button>
            )}
            {context.reviewCounter.twos && (
              <button className='flex items-center justify-center m-2 bg-green-400 text-white center  text-center font-bold p-2 rounded-sm '>
                <FaStar className=' text-yellow-400' />
                <FaStar className=' text-yellow-400' />:{" "}
                {context.reviewCounter.twos}
              </button>
            )}{" "}
            {context.reviewCounter.threes && (
              <button className='flex items-center justify-center m-2 bg-green-400 text-white center  text-center font-bold p-2 rounded-sm '>
                <FaStar className=' text-yellow-400' />
                <FaStar className=' text-yellow-400' />
                <FaStar className=' text-yellow-400' /> :{" "}
                {context.reviewCounter.threes}
              </button>
            )}{" "}
            {context.reviewCounter.fours && (
              <button className='flex items-center justify-center m-2 bg-green-400 text-white center  text-center font-bold p-2 rounded-sm '>
                <FaStar className=' text-yellow-400' />
                <FaStar className=' text-yellow-400' />
                <FaStar className=' text-yellow-400' />
                <FaStar className=' text-yellow-400' /> :{" "}
                {context.reviewCounter.fours}
              </button>
            )}{" "}
            {context.reviewCounter.fives && (
              <button className='flex items-center justify-center m-2 bg-green-400 text-white center  text-center font-bold p-2 rounded-sm '>
                <FaStar className=' text-yellow-400' />
                <FaStar className=' text-yellow-400' />
                <FaStar className=' text-yellow-400' />
                <FaStar className=' text-yellow-400' />
                <FaStar className=' text-yellow-400' /> :{" "}
                {context.reviewCounter.fives}
              </button>
            )}
          </div>
        )}
        {context.reviews.length === 0 && (
          <button className='flex items-center justify-center bg-green-400 text-white p-5'>
            THIS PERSON HAS NO REVIEWS
          </button>
        )}

        {context.reviews.length > 0 && (
          <div>
            {" "}
            <button className='  rounded-md p-2 bg-green-400 text-white'>
              REVIEWS
            </button>{" "}
            <div className=' text-center font-bold p-2 rounded-sm '>
              {context.reviews.map((review) => (
                <div
                  className='  m-2 outline font-bold rounded-sm mx-auto w-5/6'
                  key={review.id}
                >
                  <div className=' mx-auto  w-[100%]'>
                    {" "}
                    <div className='px-10 bg-green-400 text-white flex flex-1'>
                      <div>JOB ID: {review.Job_Id}</div>
                      <div className='mx-5'>
                        {" "}
                        DATE: {review.date_created.toString()}
                      </div>
                    </div>{" "}
                    <div className='px-10'></div>
                    <div className='px-10'>
                      <RatingComponent rating={review.rating} />
                    </div>{" "}
                  </div>{" "}
                  <div className='px-10'>COMMENT: {review.reviewText}</div>{" "}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  function CertificateBox() {
    return (
      <div className='m-2 outline center  text-center font-bold p-2 rounded-md '>
        {context.certificates.length === 0 && (
          <button className='bg-green-400 text-white p-5 rounded-md'>
            This user currently has no Certificates
          </button>
        )}
        {context.certificates.length > 0 && (
          <div className='items-center justify-center w-screen'>
            <div className='flex items-center justify-center w-screen'>
              {" "}
              <button className='flex justify-center items-center bg-green-400 text-white p-5 rounded-md'>
                <GrCertificate />
                CERTIFICATES
              </button>
            </div>

            {context.certificates.map((certificate) => (
              <div
                key={certificate.id}
                className='m-2  center  text-center font-bold p-2 rounded-md '
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
                    className='m-2 center bg-red-400 text-white text-center font-bold p-2 rounded-sm '
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
            <input
              className='outline text-center font-bold p-2 rounded-sm m-2 '
              id='CertificateName'
              placeholder='Certificate Name Goes Here'
            />{" "}
            <input
              className='outline text-center font-bold p-2 rounded-sm m-2  '
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
              className='m-2 center   text-center font-bold p-2 rounded-sm bg-green-400  text-white p-5'
            >
              {" "}
              ADD CERTIFICATE{" "}
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      {context.UserLoc.isRepairman === true && (
        <div>
          {" "}
          <ReviewBox />
          <GreaterCategoryBox />
          <CertificateBox />{" "}
          {context.workGalleryPictures && (
            <div className='flex items-center justify-center h-auto'>
              {" "}
              <ImageCarousel images={context.workGalleryPictures} />
            </div>
          )}
          {session?.user.sub === id && (
            <div className='flex items-center justify-center w-screen'>
              <div>
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
                    className='m-2 center bg-green-400 text-white text-center font-bold p-2 rounded-sm '
                  >
                    {" "}
                    TOGGLE MAP{" "}
                  </button>{" "}
                </>
              </div>
            </div>
          )}
          {showmap === true && (
            <div>
              {" "}
              <div className='flex items-center justify-center  w-screen'>
                <div className=' p-6 rounded-lg shadow-lg'>
                  {" "}
                  <div> Current Radius : {context.UserLoc.TravelRange} KM</div>
                  <input
                    type='number'
                    className='outline text-center font-bold p-2 rounded-sm '
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
                        .then((resp) => {
                          console.log(resp.data);
                          context.setUserLoc({
                            ...context.UserLoc,
                            TravelRange: Number(Radius),
                          });
                        });
                    }}
                    className='m-2 center  bg-blue-950  text-white text-center font-bold p-2 rounded-sm '
                  >
                    {" "}
                    Update Radius{" "}
                  </button>
                </div>
              </div>
              <div>
                {" "}
                <GoogleMapsComponent />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SellerProfile;
