import LZString from "lz-string";

const CLIENT_ID = process.env.CLIENT_ID;
const API_KEY = process.env.API_KEY;

const SCOPES = "https://www.googleapis.com/auth/drive.appdata";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

function checkResponse(response: gapi.client.Response<any>) {
  if (!response.status || response.status >= 300) {
    throw new Error("API returned status code" + response.status);
  }
}

export async function initializeApi() {
  // Loads both client and auth2 together to save time
  const loadPromise = new Promise<void>((res) => gapi.load("client:auth2", res));
  await loadPromise;

  // Once loaded, we can initialize the API with our keys
  await gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    scope: SCOPES,
    discoveryDocs: DISCOVERY_DOCS,

    // This is is passed to the auth2 init, prevents us asking for permissions we don't need
    // @ts-ignore Because the types don't know about it
    fetch_basic_profile: false, // eslint-disable-line @typescript-eslint/camelcase
  });
}

export function watchSignedIn(onChange: (val: boolean) => void) {
  const authInstance = gapi.auth2.getAuthInstance();
  authInstance.isSignedIn.listen(onChange);

  // We also trigger the change function immediately with the current value
  onChange(authInstance.isSignedIn.get());
}

export async function signIn() {
  return gapi.auth2.getAuthInstance().signIn();
}

export function signOut() {
  return gapi.auth2.getAuthInstance().signOut();
}

export async function getFileList(): Promise<gapi.client.drive.File[]> {
  const response = await gapi.client.drive.files.list({
    spaces: "appDataFolder",
    fields: "files(id, name, modifiedTime)",
    orderBy: "modifiedTime desc",
    pageSize: 1, // 1 doesn't work for some reason. There should only ever be 1 file anyways.
  });

  checkResponse(response);
  return response.result.files ?? [];
}

export async function deleteFile(fileId?: string) {
  if (!fileId) return;
  const response = await gapi.client.drive.files.delete({ fileId });
  checkResponse(response);
}

// Inspired by https://stackoverflow.com/a/35182924/1687909
export async function upsertData(fileId: string | undefined, jsonData: string) {
  const boundary = "-------314159265358979323846";
  const delimiterJSON = `\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n`;
  const delimiterText = `\r\n--${boundary}\r\nContent-Type: text/plain\r\n\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata = {
    name: "data.json",
    mimeType: "application/json",
    ...(!fileId && { parents: ["appDataFolder"] }),
  };

  const compressedData = LZString.compressToUTF16(jsonData);

  const multipartRequestBody =
    delimiterJSON + JSON.stringify(metadata) + delimiterText + compressedData + closeDelimiter;

  const response = await gapi.client.request({
    path: `/upload/drive/v3/files/${fileId || ""}`,
    method: fileId ? "PATCH" : "POST",
    params: { uploadType: "multipart" },
    headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
    body: multipartRequestBody,
  });

  checkResponse(response);
  return response;
}

export async function downloadFile(fileId: string | undefined): Promise<object | void> {
  if (!fileId) return;

  const response = await gapi.client.drive.files.get({ fileId, alt: "media" });
  checkResponse(response);

  if (response.result instanceof Object) {
    // Support uncompressed data (for backwards compatibility)
    return response.result;
  } else {
    // Data is likely compressed, decompress it
    const decompressed = LZString.decompressFromUTF16(response.body);
    try {
      const json = JSON.parse(decompressed as string);
      if (json instanceof Object) {
        return json;
      }
    } catch {
      return;
    }
  }
}
