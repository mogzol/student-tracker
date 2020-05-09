import React from "react";
import ReactDOM from "react-dom";
import GoogleProvider, { GoogleContext } from "providers/GoogleProvider/GoogleProvider";
import DataProvider from "providers/DataProvider/DataProvider";
import RequireLogin from "components/RequireLogin/RequireLogin";
import HeaderActions from "components/HeaderActions/HeaderActions";
import StudentList from "components/StudentList/StudentList";
import StudentDetails from "components/StudentDetails/StudentDetails";
import "./index.scss";
import Sidebar, { SidebarTabs } from "components/Sidebar/Sidebar";

function App() {
  const googleContext = React.useContext(GoogleContext);
  const [studentName, setStudentName] = React.useState<string | null>(null);
  const [currentTab, setCurrentTab] = React.useState<SidebarTabs>();

  React.useEffect(() => {
    if (!googleContext.signedIn) {
      setStudentName(null);
    }
  }, [googleContext.signedIn]);

  return (
    <div className="app">
      <div className="header">
        <HeaderActions />
        <div className="title">Student Communication Tracker</div>
        <div className="sub">By Morgan Zolob</div>
      </div>
      <div className="main flex-center horizontal">
        <Sidebar selected={SidebarTabs.Communications} />
        <div className="box fill flex-center">
          <RequireLogin>
            <StudentDetails name={studentName} onBack={() => setStudentName(null)} />
            <StudentList onStudentSelected={setStudentName} />
          </RequireLogin>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <GoogleProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </GoogleProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
