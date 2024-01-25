import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface AppState {
  title1: string;
  settitle1: Dispatch<SetStateAction<string>>;
  timing: string;
  settiming: Dispatch<SetStateAction<string>>;
  hiringstage: string;
  sethiringstage: Dispatch<SetStateAction<string>>;
  first_to_buy: boolean;
  setfirst_to_buy: Dispatch<SetStateAction<boolean>>;
  minbudget: number;
  setminbudget: Dispatch<SetStateAction<number>>;
  maxbudget: number;
  setmaxbudget: Dispatch<SetStateAction<number>>;
  extradetailsText: string;
  setextradetailsText: Dispatch<SetStateAction<string>>;
  pictures: string[];
  setpictures: Dispatch<SetStateAction<string[]>>;
}

const AppContext = createContext<AppState | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}
export const useAppState = (): AppState => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppProvider");
  }
  return context;
};
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [title1, settitle1] = useState<string>("Title goes here");
  const [timing, settiming] = useState<string>("0");
  const [hiringstage, sethiringstage] = useState<string>("0");
  const [first_to_buy, setfirst_to_buy] = useState<boolean>(false);
  const [minbudget, setminbudget] = useState<number>(0);
  const [maxbudget, setmaxbudget] = useState<number>(0);
  const [extradetailsText, setextradetailsText] = useState<string>(
    "extra details goes here"
  );
  const [pictures, setpictures] = useState<string[]>([]);

  const state: AppState = {
    title1,
    settitle1,
    timing,
    settiming,
    hiringstage,
    sethiringstage,
    first_to_buy,
    setfirst_to_buy,
    minbudget,
    setminbudget,
    maxbudget,
    setmaxbudget,
    extradetailsText,
    setextradetailsText,
    pictures,
    setpictures,
  };

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};
