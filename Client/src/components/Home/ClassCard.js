import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Link, useNavigate } from "react-router-dom";
import { fetchWrapper } from "../../utils/fetchWrapper";
import { setShowAlert, setAlertInfo } from "../../redux/alertSlice";
import { useDispatch } from "react-redux";

export const ClassCard = ({ clss, user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

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
            <CardContent style={{ height: "106px" }}>
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
          <CardActions sx={{ justifyContent: "end", gap: 1 }}>
            {user.__t === "Student" && (
              <Button
                size="small"
                color="error"
                onClick={(e) => setDialogOpen(true)}
                variant="outlined"
              >
                Unenroll
              </Button>
            )}
            <Link to={`/classes/${clss._id}`}>
              <Button variant="outlined" size="small" color="primary">
                Enter
              </Button>
            </Link>
          </CardActions>
        </Card>
      )}

      <Dialog open={dialogOpen} onClose={(e) => setDialogOpen(false)}>
        <DialogTitle className="dialog-title">
          Confirm UnEnroll Class
        </DialogTitle>
        <DialogContent>
          <Typography marginBottom={3}>
            Are you sure you want to UnEnroll?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUnEnroll} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
