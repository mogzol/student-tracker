import React from "react";
import { GoogleContext } from "../GoogleProvider/GoogleProvider";
import AppData, { Communication } from "./AppData";

interface DataContext {
  data: AppData;
  addStudent: (name: string) => void;
  addCommunication: (name: string, communication: Communication) => void;
}

const emptyData = new AppData({});

export const DataContext = React.createContext<DataContext>({
  data: emptyData,
  addStudent: () => {},
  addCommunication: () => {},
});

export default function DataProvider(props: React.PropsWithChildren<{}>) {
  const googleContext = React.useContext(GoogleContext);
  const [data, setData] = React.useState<AppData>(emptyData);
  const [loading, setLoading] = React.useState(false);

  // Load data on sign in, clear on sign out
  React.useEffect(() => {
    async function retrieveData() {
      // setData(AppData.from(await googleContext.getData()));
      setData(AppData.from(tempData));
      setLoading(false);
    }

    if (!googleContext.signedIn) {
      setData(emptyData);
    } else if (data === emptyData && !loading) {
      setLoading(true);
      retrieveData();
    }
  }, [googleContext, data, loading]);

  function addStudent(name: string) {
    setData(data.addStudent(name));
  }

  function addCommunication(name: string, communication: Communication) {
    setData(data.addCommunication(name, communication));
  }

  return (
    <DataContext.Provider value={{ data, addStudent, addCommunication }}>
      {props.children}
    </DataContext.Provider>
  );
}

const tempData = {
  Morgan: [
    {
      date: "2020-03-16T08:25:13",
      type: "Email",
      details: "Something new goes here",
    },
    {
      date: "2020-03-22T16:34:55",
      type: "Email",
      details: "Something else here",
    },
    {
      date: "2020-04-02T12:05:01",
      type: "Phone",
      details: "And another one",
    },
  ],
  Terri: [
    {
      date: "2020-03-18T08:34:13",
      type: "Email",
      details: "More things go here",
    },
    {
      date: "2020-03-28T13:12:32",
      type: "Phone",
      details: "Other things here",
    },
    {
      date: "2020-04-03T15:10:01",
      type: "Phone",
      details: "Yet another one",
    },
  ],
  Angus: [
    {
      date: "2020-03-22T06:34:13",
      type: "Email",
      details: "More things go here",
    },
  ],
  Jeffery: [
    {
      date: "2020-03-22T06:34:13",
      type: "Phone",
      details: "More things go here",
    },
  ],
};
