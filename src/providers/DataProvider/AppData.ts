export interface Communication {
  date: Date;
  type: string;
  details: string;
}

interface Communications {
  [studentName: string]: Communication[];
}

interface JsonData {
  communications: object;
}

function isJsonData(data: any): data is JsonData {
  return (
    data instanceof Object &&
    (data as JsonData).communications instanceof Object &&
    !Array.isArray((data as JsonData).communications)
  );
}

// Sort function for sorting communications newest to oldest
function communicationSorter(a: Communication, b: Communication) {
  return b.date.getTime() - a.date.getTime();
}

function parseCommunication(data: any): Communication | null {
  if (
    !(data instanceof Object) ||
    typeof data.date !== "string" ||
    typeof data.type !== "string" ||
    typeof data.details !== "string"
  ) {
    return null;
  }

  const date = new Date(data.date);
  if (isNaN(date.getTime())) {
    return null;
  }

  return {
    date,
    type: data.type,
    details: data.details,
  };
}

export default class AppData {
  private communications: Communications;

  constructor(communications: Communications) {
    this.communications = communications;
  }

  static from(data: unknown): AppData {
    if (!isJsonData(data)) {
      return new AppData({});
    }

    const communications: Communications = {};

    for (const [name, arr] of Object.entries(data.communications)) {
      if (Array.isArray(arr)) {
        const mapped = arr.map(parseCommunication).filter((c) => c) as Communication[];

        communications[name] = mapped.sort(communicationSorter);
      }
    }

    return new AppData(communications);
  }

  public get names() {
    return Object.keys(this.communications);
  }

  public toJSON() {
    return JSON.stringify({ communications: this.communications });
  }

  public getLastCommunication(name: string) {
    return this.getCommunications(name)?.[0];
  }

  public getCommunications(name: string) {
    return this.communications[name] ?? [];
  }

  public addStudent(name: string): AppData {
    if (this.communications[name]) {
      throw new Error(`Student ${name} already exists`);
    }

    return new AppData({ ...this.communications, [name]: [] });
  }

  public removeStudent(name: string): AppData {
    const newCommunications = { ...this.communications };
    delete newCommunications[name];

    return new AppData(newCommunications);
  }

  public addCommunication(name: string, communication: Communication) {
    return new AppData({
      ...this.communications,
      [name]: [...(this.communications[name] ?? []), communication].sort(communicationSorter),
    });
  }

  public removeCommunication(name: string, communication: Communication) {
    return new AppData({
      ...this.communications,
      [name]: [...this.communications[name]?.filter((c) => c !== communication)],
    });
  }
}
