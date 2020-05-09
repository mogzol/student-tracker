export interface Communication {
  date: Date;
  type: string;
  details: string;
}

export interface ActivityData {
  assigned: Date;
  details: string;
  completed: { [studentName: string]: ActivityCompletion };
}

interface Communications {
  [studentName: string]: Communication[];
}

interface Activities {
  [activityName: string]: ActivityData;
}

interface ActivityCompletion {
  date: Date;
  details?: string;
}

interface JsonData {
  communications: object;
  activities: object;
}

function isJsonData(data: any): data is JsonData {
  return (
    data instanceof Object &&
    (data as JsonData).communications instanceof Object &&
    !Array.isArray((data as JsonData).communications) &&
    (data as JsonData).activities instanceof Object &&
    !Array.isArray((data as JsonData).activities)
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

function parseActivityCompletion(data: any): ActivityCompletion | null {
  if (
    !(data instanceof Object) ||
    typeof data.date !== "string" ||
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
    details: data.details,
  };
}

function parseActivity(data: any): ActivityData | null {
  if (
    !(data instanceof Object) ||
    typeof data.assigned !== "string" ||
    typeof data.details !== "string" ||
    !(data.completed instanceof Object)
  ) {
    return null;
  }

  const assigned = new Date(data.assigned);
  if (isNaN(assigned.getTime())) {
    return null;
  }

  const completed: ActivityData["completed"] = {};
  for (const [name, completionData] of Object.entries(data.completed)) {
    const parsed = parseActivityCompletion(completionData);
    if (parsed) {
      completed[name] = parsed;
    }
  }

  return {
    assigned,
    completed,
    details: data.details,
  };
}

export default class AppData {
  public readonly communications: Communications;
  public readonly activities: Activities;

  constructor(communications: Communications, activities: Activities) {
    this.communications = communications;
    this.activities = activities;
  }

  static from(data: unknown): AppData {
    if (!isJsonData(data)) {
      return new AppData({}, {});
    }

    const communications: Communications = {};

    for (const [name, arr] of Object.entries(data.communications)) {
      if (Array.isArray(arr)) {
        const mapped = arr.map(parseCommunication).filter((c) => c) as Communication[];

        communications[name] = mapped.sort(communicationSorter);
      }
    }

    const activities: Activities = {};

    for (const [name, activityData] of Object.entries(data.activities)) {
      const parsed = parseActivity(activityData);
      if (parsed) {
        activities[name] = parsed;
      }
    }

    return new AppData(communications, activities);
  }

  public get studentNames() {
    return Object.keys(this.communications);
  }

  public toJSON() {
    return JSON.stringify({ communications: this.communications });
  }

  public getLastCommunication(name: string) {
    return this.getStudentCommunications(name)?.[0];
  }

  public getStudentCommunications(name: string) {
    return this.communications[name] ?? [];
  }

  public addStudent(name: string): AppData {
    if (this.communications[name]) {
      throw new Error(`Student ${name} already exists`);
    }

    return new AppData({ ...this.communications, [name]: [] }, this.activities);
  }

  public removeStudent(name: string): AppData {
    const newCommunications = { ...this.communications };
    delete newCommunications[name];

    const newActivities = { ...this.activities };
    for (const activity of Object.values(newActivities)) {
      activity.completed = { ...activity.completed };
      delete activity.completed[name];
    }

    return new AppData(newCommunications, newActivities);
  }

  public addCommunication(studentName: string, communication: Communication) {
    return new AppData(
      {
        ...this.communications,
        [studentName]: [...(this.communications[studentName] ?? []), communication].sort(
          communicationSorter
        ),
      },
      this.activities
    );
  }

  public removeCommunication(studentName: string, communication: Communication) {
    return new AppData(
      {
        ...this.communications,
        [studentName]: [...this.communications[studentName]?.filter((c) => c !== communication)],
      },
      this.activities
    );
  }

  public addActivity(name: string, activity: ActivityData) {
    if (this.activities[name]) {
      throw new Error(`Activity ${name} already exists`);
    }

    return new AppData(this.communications, {
      ...this.activities,
      [name]: activity,
    });
  }

  public removeActivity(name: string) {
    const newActivities = { ...this.activities };
    delete newActivities[name];

    return new AppData(this.communications, newActivities);
  }

  public updateActivityCompletion(
    activityName: string,
    studentName: string,
    completionData: ActivityCompletion
  ) {
    if (!this.activities[activityName]) {
      throw new Error(`Activity ${activityName} does not exist`);
    }

    const newCompleted = {
      ...this.activities[activityName].completed,
      [studentName]: completionData,
    };

    return new AppData(this.communications, {
      ...this.activities,
      [activityName]: {
        ...this.activities[activityName],
        completed: newCompleted,
      },
    });
  }
}
