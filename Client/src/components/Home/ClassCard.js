import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { fetchWrapper } from "../../utils/fetchWrapper";
import { setShowAlert, setAlertInfo } from "../../redux/alertSlice";
import { useDispatch } from "react-redux";

export const ClassCard = ({ clss, user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(false);

  const handleUnEnroll = async () => {
    const { message, data, status } = await fetchWrapper(
      `/classes/${clss._id}/unenroll`,
      "PATCH"
    );
    if (status === "success") {
      setDisabled(true);
      dispatch(
        setAlertInfo({
          severity: "success",
          title: "Unenrollment",
          message: "Done ✌️",
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
          title: "Unenrollment",
          message,
        })
      );
      dispatch(setShowAlert(true));

      setTimeout(() => {
        dispatch(setShowAlert(false));
      }, 5000);
    }
  };
  return (
    <>
      {!disabled && (
        <Card sx={{ width: 285, margin: 1, display: `` }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image="/imgs/classImgs/cover.jpg"
              alt="class cover"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {clss.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Code: {clss.code}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Teacher: {clss.teachers[0].name}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            {user.__t === "Student" && (
              <Button size="small" color="error" onClick={handleUnEnroll}>
                Unenroll
              </Button>
            )}
            <Button
              size="small"
              color="primary"
              onClick={() => navigate(`/classes/${clss._id}`)}
            >
              Enter
            </Button>
          </CardActions>
        </Card>
      )}
    </>
  );
};
