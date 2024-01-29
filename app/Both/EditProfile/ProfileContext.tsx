import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface ProfileState {
  title1: string;
  settitle1: Dispatch<SetStateAction<string>>;
  timing: string;
  settiming: Dispatch<SetStateAction<string>>;
  timing1: string;
  settiming1: Dispatch<SetStateAction<string>>;
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
  const [title1, settitle1] = useState<string>("Title goes here");
  const [timing, settiming] = useState<string>("0");

  const state: ProfileState = {
    title1,
    settitle1,
    timing,
    settiming,
  };

  return (
    <ProfileContext.Provider value={state}>{children}</ProfileContext.Provider>
  );
};
