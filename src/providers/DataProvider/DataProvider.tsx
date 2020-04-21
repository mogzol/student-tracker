import React from "react";
import { GoogleContext } from "../GoogleProvider/GoogleProvider";
import AppData, { Communication } from "./AppData";
import fileDialog from "file-dialog";
import FileSaver from "file-saver";

interface DataContext {
  data: AppData;
  addStudents: (names: string[]) => void;
  removeStudent: (name: string) => void;
  addCommunications: (names: string[], communication: Communication) => void;
  removeCommunication: (name: string, communication: Communication) => void;
  replaceCommunication: (
    name: string,
    oldCommunication: Communication,
    newCommunication: Communication
  ) => void;
  exportData: () => void;
  importData: () => void;
}

const emptyData = new AppData({});

export const DataContext = React.createContext<DataContext>({
  data: emptyData,
  addStudents: () => {},
  removeStudent: () => {},
  addCommunications: () => {},
  removeCommunication: () => {},
  replaceCommunication: () => {},
  exportData: () => {},
  importData: () => {},
});

export default function DataProvider(props: React.PropsWithChildren<{}>) {
  const googleContext = React.useContext(GoogleContext);
  const [data, setData] = React.useState<AppData>(emptyData);
  const [loading, setLoading] = React.useState(false);

  // Load data on sign in, clear on sign out
  React.useEffect(() => {
    async function retrieveData() {
      // setData(AppData.from(await googleContext.getData()));
      setData(AppData.from({}));
      setLoading(false);
    }

    if (!googleContext.signedIn) {
      setData(emptyData);
    } else if (data === emptyData && !loading) {
      setLoading(true);
      retrieveData();
    }
  }, [googleContext, data, loading]);

  function addStudents(names: string[]) {
    let newData: AppData = data;

    for (const name of names) {
      newData = newData.addStudent(name);
    }

    // If no errors occurred, set data
    setData(newData);
  }

  function removeStudent(name: string) {
    setData(data.removeStudent(name));
  }

  function addCommunications(names: string[], communication: Communication) {
    let newData: AppData = data;
    for (const name of names) {
      newData = newData.addCommunication(name, communication);
    }

    // If no errors occurred, set data
    setData(newData);
  }

  function removeCommunication(name: string, communication: Communication) {
    setData(data.removeCommunication(name, communication));
  }

  function replaceCommunication(
    name: string,
    oldCommunication: Communication,
    newCommunication: Communication
  ) {
    setData(
      data
        .removeCommunication(name, oldCommunication)
        .addCommunication(name, newCommunication)
    );
  }

  async function importData() {
    const fileList = await fileDialog({ accept: "application/json" });
    if (fileList.length) {
      const decoder = new TextDecoder("utf-8");
      const jsonData = JSON.parse(
        decoder.decode(new Uint8Array(await fileList[0].arrayBuffer()))
      );

      setData(AppData.from(jsonData));
    }
  }

  function exportData() {
    const blob = new Blob([data.toJSON()], {
      type: "application/json;charset=utf-8",
    });

    const curDate = new Date();
    const padNum = (n: number) => String(n).padStart(2, "0");
    const dateString =
      curDate.getFullYear() +
      "-" +
      padNum(curDate.getMonth() + 1) +
      "-" +
      padNum(curDate.getDate()) +
      "_" +
      padNum(curDate.getHours()) +
      padNum(curDate.getMinutes());

    FileSaver.saveAs(blob, `Student Tracker Export (${dateString}).json`);
  }

  return (
    <DataContext.Provider
      value={{
        data,
        addStudents,
        removeStudent,
        addCommunications,
        removeCommunication,
        replaceCommunication,
        importData,
        exportData,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
}
