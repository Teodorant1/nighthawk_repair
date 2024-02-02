import {
  Certificate,
  Review,
  category,
  profileSubCategory,
  sub_category,
  user,
} from "@prisma/client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { UserLoc, reviewCounter } from "@/projecttypes";

interface ProfileState {
  show: string;
  setshow: Dispatch<SetStateAction<string>>;
  all_categories: category[];
  setall_categories: Dispatch<SetStateAction<category[]>>;
  all_subcategories: sub_category[];
  setall_subcategories: Dispatch<SetStateAction<sub_category[]>>;
  hidden_Categories: category[];
  sethidden_Categories: Dispatch<SetStateAction<category[]>>;
  my_Sub_Categories: profileSubCategory[];
  setmy_Sub_Categories: Dispatch<SetStateAction<profileSubCategory[]>>;
  reviews: Review[];
  setreviews: Dispatch<SetStateAction<Review[]>>;
  certificates: Certificate[];
  setcertificates: Dispatch<SetStateAction<Certificate[]>>;
  UserLoc: UserLoc;
  setUserLoc: Dispatch<SetStateAction<UserLoc>>;
  reviewCounter: reviewCounter;
  setreviewCounter: Dispatch<SetStateAction<reviewCounter>>;
}

const ProfileContext = createContext<ProfileState | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}
export const useProfileState = (): ProfileState => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileState must be used within an ProfileProvider");
  }
  return context;
};
export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
}) => {
  const [show, setshow] = useState<string>("none");
  const [all_categories, setall_categories] = useState<category[]>([]);
  const [all_subcategories, setall_subcategories] = useState<sub_category[]>(
    []
  );
  const [hidden_Categories, sethidden_Categories] = useState<category[]>([]);
  const [my_Sub_Categories, setmy_Sub_Categories] = useState<
    profileSubCategory[]
  >([]);
  const [reviews, setreviews] = useState<Review[]>([]);
  const [certificates, setcertificates] = useState<Certificate[]>([]);
  const [UserLoc, setUserLoc] = useState<UserLoc>({
    TravelRange: 0,
    latitude: 0,
    longitude: 0,
  });
  const [reviewCounter, setreviewCounter] = useState<reviewCounter>({
    ones: 0,
    twos: 0,
    threes: 0,
    fours: 0,
    fives: 0,
    average: 0,
  });

  const state: ProfileState = {
    show,
    setshow,
    all_categories,
    setall_categories,
    all_subcategories,
    setall_subcategories,
    hidden_Categories,
    sethidden_Categories,
    my_Sub_Categories,
    setmy_Sub_Categories,
    reviews,
    setreviews,
    certificates,
    setcertificates,
    UserLoc,
    setUserLoc,
    reviewCounter,
    setreviewCounter,
  };

  return (
    <ProfileContext.Provider value={state}>{children}</ProfileContext.Provider>
  );
};
