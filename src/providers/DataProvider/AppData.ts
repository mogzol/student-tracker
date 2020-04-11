export interface Communication {
  date: Date;
  type: string;
  details: string;
}

interface Communications {
  [studentName: string]: Communication[];
}

// Sort function for sorting communications newest to oldest
function communicationSorter(a: Communication, b: Communication) {
  return b.date.getTime() - a.date.getTime();
}

function parseCommunication(data: any): Communication | null {
  if (
    !(data instanceof Object) ||
    typeof data.date !== "number" ||
    typeof data.type !== "string" ||
    typeof data.details !== "string"
  ) {
    return null;
  }

  const date = new Date(data.date);

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
    const communications: Communications = {};

    if (data instanceof Object && !Array.isArray(data)) {
      for (const [name, arr] of Object.entries(data)) {
        if (Array.isArray(arr)) {
          const mapped = arr
            .map(parseCommunication)
            .filter((c) => c) as Communication[];

          communications[name] = mapped.sort(communicationSorter);
        }
      }
    }

    return new AppData(communications);
  }

  public get names() {
    return Object.keys(this.communications);
  }

  public getLastCommunication(name: string) {
    return this.getCommunications(name)?.[0];
  }

  public getCommunications(name: string) {
    return this.communications[name];
  }

  public addStudent(name: string): AppData {
    if (this.communications[name]) {
      return this;
    }

    return new AppData({ ...this.communications, [name]: [] });
  }

  public addCommunication(name: string, communication: Communication) {
    return new AppData({
      ...this.communications,
      [name]: [...(this.communications[name] ?? []), communication].sort(
        communicationSorter
      ),
    });
  }
}
