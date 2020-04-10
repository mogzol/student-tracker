import React from "react";
import { GoogleContext } from "../GoogleProvider/GoogleProvider";

interface DataContext {
  data: object;
}

export const DataContext = React.createContext<DataContext>({
  data: {},
});

export default function DataProvider(props: React.PropsWithChildren<{}>) {
  const googleContext = React.useContext(GoogleContext);

  React.useEffect(() => {
    if (!googleContext.signedIn) {
      return;
    }
  }, [googleContext.signedIn]);

  return null;
}
