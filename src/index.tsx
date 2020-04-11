import React from "react";
import ReactDOM from "react-dom";
import GoogleProvider from "providers/GoogleProvider/GoogleProvider";
import DataProvider from "providers/DataProvider/DataProvider";
import RequireLogin from "components/RequireLogin/RequireLogin";
import HeaderActions from "components/HeaderActions/HeaderActions";
import StudentTable from "components/StudentList/StudentList";
import "./index.scss";

function App() {
  return (
    <div className="app">
      <div className="header">
        <HeaderActions />
        <div className="title">Student Communication Tracker</div>
        <div className="sub">By Morgan Zolob</div>
      </div>
      <div className="main box flex-center">
        <RequireLogin>
          <StudentTable />
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
