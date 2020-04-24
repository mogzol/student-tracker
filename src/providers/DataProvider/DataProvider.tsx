import React from "react";
import { GoogleContext } from "../GoogleProvider/GoogleProvider";
import AppData, { Communication } from "./AppData";
import fileDialog from "file-dialog";
import FileSaver from "file-saver";

interface DataContext {
  data: AppData;
  loading: boolean;
  saving: boolean;
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
  clearData: () => void;
}

const emptyData = new AppData({});

export const DataContext = React.createContext<DataContext>({
  data: emptyData,
  loading: false,
  saving: false,
  addStudents: () => {},
  removeStudent: () => {},
  addCommunications: () => {},
  removeCommunication: () => {},
  replaceCommunication: () => {},
  exportData: () => {},
  importData: () => {},
  clearData: () => {},
});

export default function DataProvider(props: React.PropsWithChildren<{}>) {
  const googleContext = React.useContext(GoogleContext);
  const [data, setData] = React.useState<AppData>(emptyData);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const savePromiseRef = React.useRef<Promise<void>>(Promise.resolve());
  const lastSavedDataRef = React.useRef<AppData | null>(null);

  // Load data on sign in, clear on sign out
  React.useEffect(() => {
    async function retrieveData() {
      // When loading from Google, we set lastSavedData to prevent re-saving
      lastSavedDataRef.current = AppData.from(await googleContext.getData());
      setData(lastSavedDataRef.current);
      setLoading(false);
    }

    if (!googleContext.signedIn) {
      setData(emptyData);
      lastSavedDataRef.current = null;
    } else if (data === emptyData && !loading) {
      setLoading(true);
      retrieveData();
    }
  }, [googleContext, data, loading]);

  React.useEffect(() => {
    if (googleContext.signedIn && lastSavedDataRef.current && lastSavedDataRef.current !== data) {
      setSaving(true);
      const newSavePromise = savePromiseRef.current.then(async () => {
        await googleContext.setData(data.toJSON());

        // If savePromiseRef is still this promise, then we can set saving false.
        if (savePromiseRef.current === newSavePromise) {
          setSaving(false);
        }
      });

      savePromiseRef.current = newSavePromise;
    }
  }, [googleContext, data]);

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
      data.removeCommunication(name, oldCommunication).addCommunication(name, newCommunication)
    );
  }

  async function importData() {
    const fileList = await fileDialog({ accept: "application/json" });
    if (fileList.length) {
      const decoder = new TextDecoder("utf-8");
      const jsonData = JSON.parse(decoder.decode(new Uint8Array(await fileList[0].arrayBuffer())));

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

  function clearData() {
    setData(AppData.from({}));
  }

  return (
    <DataContext.Provider
      value={{
        data,
        loading,
        saving,
        addStudents,
        removeStudent,
        addCommunications,
        removeCommunication,
        replaceCommunication,
        importData,
        exportData,
        clearData,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
}
