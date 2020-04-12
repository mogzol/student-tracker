import React from "react";
import * as api from "./apiHelper";
import Modal from "components/Modal/Modal";

interface GoogleContext {
  ready: boolean;
  signedIn: boolean;
  signingIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => void;
  getData: () => Promise<object | void>;
  setData: (data: object) => Promise<void>;
  clearData: () => Promise<void>;
}

// Set up empty initial context
export const GoogleContext = React.createContext<GoogleContext>({
  ready: false,
  signedIn: false,
  signingIn: false,
  signIn: async () => {},
  signOut: () => {},
  getData: async () => {},
  setData: async () => {},
  clearData: async () => {},
});

export default function GoogleProvider(props: React.PropsWithChildren<{}>) {
  const [ready, setReady] = React.useState(false);
  const [signingIn, setSigningIn] = React.useState<boolean>(false);
  const [signedIn, setSignedIn] = React.useState<boolean>(false);

  // API errors currently just lock up the app with an error message and require a refresh. Not the
  // greatest error handling, but hey it's better than nothing.
  const [error, setError] = React.useState<any>(null);

  React.useEffect(() => {
    api.initializeApi().then(() => {
      api.watchSignedIn(setSignedIn);
      setReady(true);
    });
  }, []);

  // Set up our API interaction functions
  async function signIn() {
    setSigningIn(true);
    try {
      await api.signIn();
    } finally {
      setSigningIn(false);
    }
  }

  // Helper to wraps API calls in a try/catch and set an error if the call fails
  async function wrapApi<T>(apiFunc: () => Promise<T>): Promise<T | void> {
    if (error) return; // If there's already an error, don't allow any more API calls
    try {
      return await apiFunc();
    } catch (e) {
      setError(e);
      console.error(e);
    }
  }

  async function getData() {
    return await wrapApi(async () => {
      const files = await api.getFileList();
      return await api.downloadFile(files?.[0]?.id);
    });
  }

  async function setData(data: object) {
    if (error) return;
    return await wrapApi(async () => {
      const files = await api.getFileList();
      await api.upsertData(files?.[0]?.id, data);
    });
  }

  async function clearData() {
    if (error) return;
    return await wrapApi(async () => {
      let files = await api.getFileList();
      while (files.length) {
        await Promise.all(files.map((file) => api.deleteFile(file.id)));
        files = await api.getFileList();
      }
    });
  }

  return (
    <>
      {error && (
        <Modal icon="fas fa-exclamation-triangle danger">
          <span>
            An error occurred communicating with Google. Please refresh the page
            and try again.
            {(error.message || error.result?.error?.message) && (
              <>
                <br />
                <br />
                <strong>Error Details:</strong>{" "}
                {error.message || error.result?.error?.message}
              </>
            )}
          </span>
        </Modal>
      )}
      <GoogleContext.Provider
        value={{
          ready,
          signedIn,
          signingIn,
          signIn,
          signOut: api.signOut,
          setData,
          getData,
          clearData,
        }}
      >
        {props.children}
      </GoogleContext.Provider>
    </>
  );
}
