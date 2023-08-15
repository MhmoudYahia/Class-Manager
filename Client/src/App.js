import "./App.css";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import Alert from "./utils/alert";

import Skeleton from "@mui/material/Skeleton";
import { Navbar } from "./components/NavBar/Navbar";
import { SignIn } from "./components/logging/SignIn";
import { SignUp } from "./components/logging/SignUp";
import { ForgetPassword } from "./components/logging/ForgetPassword";
import { ResetPassword } from "./components/logging/ResetPassword";
import { HomeClasses } from "./components/Home/MyClasses";
import { Class } from "./components/Class/Class";
import { ProfilePage } from "./components/User/Profile";
import { MarksList } from "./components/Class/Marks";
import QuizPage from "./components/Quiz/QuizPage";
import { useFetch } from "./utils/useFetch";
import { Page404 } from "./utils/Page404";
import { Stack } from "@mui/material";
import { ChatBar } from "./components/chat/chat";
import { useSelector } from "react-redux";
import { MyMarks } from "./components/User/AllMyMarks";
import { Teachers } from "./manager/Teachers";
import { Students } from "./manager/Students";

function App() {
  const { showAlert, alertInfo } = useSelector((state) => state.alert);
  const { showChat, receiver } = useSelector((state) => state.chat);
  const user = useSelector((state) => state.user.userData);
  const loading = useSelector((state) => state.user.loading);

  return (
    <div className="App">
      {showAlert && (
        <Alert
          severity={alertInfo.severity}
          title={alertInfo.title}
          message={alertInfo.message}
        />
      )}
      <Router>
        <Navbar />
        {showChat && (
          <ChatBar sender={user} receiver={receiver} />
        )}
        {loading && (
          <Stack spacing={2} margin={2}>
            <>
              <Skeleton animation="wave" height={200} variant="rounded" />
              <Skeleton animation="wave" variant="rounded" />
              <Skeleton animation="wave" variant="rounded" />
            </>
          </Stack>
        )}

        {!loading && (
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/resetPassword/:resetToken"
              element={<ResetPassword />}
            />
            <Route path="/forgetPassword" element={<ForgetPassword />} />
            <Route path="/" element={user ? <HomeClasses /> : <Page404 />} />
            <Route
              path="/classes/:id"
              element={user ? <Class /> : <Page404 />}
            />
            <Route path="/me" element={user ? <ProfilePage /> : <Page404 />} />
            <Route path="/myMarks" element={user ? <MyMarks /> : <Page404 />} />
            <Route path="/teachers" element={user ? <Teachers /> : <Page404 />} />
            <Route path="/students" element={user ? <Students /> : <Page404 />} />
            <Route
              path="/quizes/:id"
              element={user ? <QuizPage /> : <Page404 />}
            />
            <Route path="*" element={<Page404 />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App;
