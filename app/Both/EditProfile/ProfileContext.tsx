import { Certificate, Review, category, sub_category } from "@prisma/client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface ProfileState {
  show: string;
  setshow: Dispatch<SetStateAction<string>>;
  all_categories: category[];
  setall_categories: Dispatch<SetStateAction<category[]>>;
  all_subcategories: sub_category[];
  setall_subcategories: Dispatch<SetStateAction<sub_category[]>>;
  hidden_Categories: category[];
  sethidden_Categories: Dispatch<SetStateAction<category[]>>;
  hidden_Sub_Categories: sub_category[];
  sethidden_Sub_Categories: Dispatch<SetStateAction<sub_category[]>>;
  reviews: Review[];
  setreviews: Dispatch<SetStateAction<Review[]>>;
  certificates: Certificate[];
  setcertificates: Dispatch<SetStateAction<Certificate[]>>;
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
  const [hidden_Sub_Categories, sethidden_Sub_Categories] = useState<
    sub_category[]
  >([]);
  const [reviews, setreviews] = useState<Review[]>([]);
  const [certificates, setcertificates] = useState<Certificate[]>([]);

  const state: ProfileState = {
    show,
    setshow,
    all_categories,
    setall_categories,
    all_subcategories,
    setall_subcategories,
    hidden_Categories,
    sethidden_Categories,
    hidden_Sub_Categories,
    sethidden_Sub_Categories,
    reviews,
    setreviews,
    certificates,
    setcertificates,
  };

  return (
    <ProfileContext.Provider value={state}>{children}</ProfileContext.Provider>
  );
};
