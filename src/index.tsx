import React from "react";
import ReactDOM from "react-dom";
import GoogleProvider, { GoogleContext } from "providers/GoogleProvider/GoogleProvider";
import DataProvider from "providers/DataProvider/DataProvider";
import RequireLogin from "components/RequireLogin/RequireLogin";
import HeaderActions from "components/HeaderActions/HeaderActions";
import StudentList from "components/StudentList/StudentList";
import StudentDetails from "components/StudentDetails/StudentDetails";
import "./index.scss";

function App() {
  const googleContext = React.useContext(GoogleContext);
  const [studentName, setStudentName] = React.useState<string | null>(null);

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
      <div className="main box flex-center">
        <RequireLogin>
          <StudentDetails name={studentName} onBack={() => setStudentName(null)} />
          <StudentList onStudentSelected={setStudentName} />
        </RequireLogin>
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
