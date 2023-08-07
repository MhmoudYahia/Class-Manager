import React, { useEffect, useState } from "react";
import { ClassCard } from "./ClassCard";
import { Typography, TextField, Button, Box, Grid } from "@mui/material";
import { COLORS } from "../../utils/colors";
import Alert from "../../utils/alert";
import { fetchWrapper } from "../../utils/fetchWrapper";
import { useFetch } from "../../utils/useFetch";
import { Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import { setShowAlert, setAlertInfo } from "../../redux/alertSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export const HomeClasses = () => {
  const user = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const his = useNavigate();
  const [code, setCode] = useState("");
  const [className, setClassName] = useState("");

  const handleEnroll = async (event) => {
    event.preventDefault();

    const { message, data, status } = await fetchWrapper(
      `/classes/enroll`,
      "PATCH",
      JSON.stringify({
        code,
      }),
      { "Content-Type": "application/json" }
    );

    if (status === "success") {
      dispatch(
        setAlertInfo({
          severity: "success",
          message: "Enrolled successfully🫡✌️",
        })
      );
      dispatch(setShowAlert(true));
      setTimeout(() => {
        dispatch(setShowAlert(false));
      }, 3000);
    } else {
      dispatch(
        setAlertInfo({
          severity: "error",
          message,
        })
      );
      dispatch(setShowAlert(true));
      setTimeout(() => {
        dispatch(setShowAlert(false));
      }, 5000);
    }

    if (status === "success") {
      setMyClasses([...myClasses, data.class]);
      his(`classes/${data.class._id}`);
    }
  };
  const handleCreateClass = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const { message, data, status } = await fetchWrapper(
      "/classes",
      "POST",
      formData
    );
    if (status === "success") {
      dispatch(
        setAlertInfo({
          severity: "success",
          message: "Class has been Created successfully🫡",
        })
      );
      dispatch(setShowAlert(true));
      setTimeout(() => {
        dispatch(setShowAlert(false));
      }, 3000);
    } else {
      dispatch(
        setAlertInfo({
          severity: "error",
          message,
        })
      );
      dispatch(setShowAlert(true));
      setTimeout(() => {
        dispatch(setShowAlert(false));
      }, 5000);
    }

    if (status === "success") {
      setMyClasses([...myClasses, data.class]);
      his(`classes/${data.class._id}`);
    }
  };

  const [myClasses, setMyClasses] = useState([]);
  const { message, data, status, loading } = useFetch(
    "http://localhost:1445/api/v1/classes/getMyClasses"
  );

  useEffect(() => {
    if (status === "success") setMyClasses(data.myClasses);
  }, [status]);

  return (
    <div>
      {user.__t === "Teacher" && (
        <Box //teacher
          component="form"
          onSubmit={handleCreateClass}
          noValidate
          sx={{ mt: 1, margin: "71px auto", width: "25%" }}
        >
          <TextField
            margin="normal"
            fullWidth
            id="code"
            label="Code"
            name="code"
            autoComplete="code"
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            id="name"
            label="Class Name"
            name="name"
            autoComplete="name"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />

          <Button
            variant="outlined"
            component="label"
            fullWidth
            style={{ marginTop: 10 }}
          >
            Upload Image Cover
            <input type="file" hidden name="coverImage" required />
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, "background-color": COLORS.mainColor }}
          >
            Create Class
          </Button>
        </Box>
      )}
      {user.__t === "Student" && (
        <Box
          component="form"
          onSubmit={handleEnroll}
          noValidate
          sx={{ mt: 1, margin: "71px auto", width: "25%" }}
        >
          <TextField
            margin="normal"
            fullWidth
            id="code"
            label="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoComplete="code"
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, "background-color": COLORS.mainColor }}
          >
            Enroll
          </Button>
        </Box>
      )}

      <hr />
      <Typography
        gutterBottom
        variant="h5"
        component="div"
        style={{
          marginTop: 20,
          fontWeight: 700,
          textDecoration: "underline",
          color: COLORS.mainColor,
          textTransform: "uppercase",
        }}
      >
        My Classes
      </Typography>
      <div style={{ margin: " 20px 5px", display: "flex", flexWrap: "wrap" }}>
        {loading && (
          <Skeleton
            animation="wave"
            height="50px"
            style={{ margin: "0 20px" }}
          />
        )}
        {!loading &&
          myClasses &&
          myClasses.map((Oclass) => {
            return <Link to={`/classes/${Oclass._id}`}><ClassCard  clss={Oclass} user={user} /></Link>;
          })}
      </div>
    </div>
  );
};
