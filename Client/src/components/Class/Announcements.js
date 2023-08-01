import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { format } from "date-fns";
import { COLORS } from "../../utils/colors";
import SendIcon from "@mui/icons-material/Send";
import { fetchWrapper } from "../../utils/fetchWrapper";
import { setAlertInfo, setShowAlert } from "../../redux/alertSlice";
import { useDispatch } from "react-redux";

export const Announcements = ({
  announcements: initialAnnouncements,
  role,
  teacher,
  classId,
}) => {
  const dispatch = useDispatch();
  const [announcements, setAnnouncements] =
    React.useState(initialAnnouncements);
  const [newAnnouncementText, setNewAnnouncementText] = React.useState("");

  const handleNewAnnouncementSubmit = async (event) => {
    event.preventDefault();

    const { message, data, status } = await fetchWrapper(
      `/classes/${classId}/addAnnouncement`,
      "POST",
      JSON.stringify({
        teacher: teacher._id,
        announcementBody: newAnnouncementText,
      }),
      { "Content-Type": "application/json" }
    );

    if (status === "success") {
      dispatch(
        setAlertInfo({
          severity: "success",
          message: "Announcement has been Sent successfully 🫡",
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

    // handle frontend
    if (status === "success") {
      const newAnnouncement = {
        teacher, // replace with actual teacher name
        announcementBody: newAnnouncementText,
        createdAt: Date.now(),
      };
      setAnnouncements([...announcements, newAnnouncement]);
      setNewAnnouncementText("");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        gutterBottom
        variant="h5"
        component="div"
        style={{
          marginTop: 50,
          fontWeight: 700,
          marginBottom: 30,
          textTransform: "uppercase",
          textDecoration: "underline",
          color: COLORS.mainColor,
        }}
      >
        Anouncements
      </Typography>

      {role === "Teacher" && (
        <form
          onSubmit={handleNewAnnouncementSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            label="New Announcement"
            value={newAnnouncementText}
            onChange={(event) => setNewAnnouncementText(event.target.value)}
            sx={{ mr: 1, marginBottom: 3, width: "80%" }}
          />
          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            sx={{ width: "fit-content" }}
          >
            Send
          </Button>
        </form>
      )}
      {announcements && announcements.length === 0 && (
        <Typography margin={5}>No Announcements Yet</Typography>
      )}
      <Divider
        sx={{
          my: 2,
        }}
      />
      {announcements &&
        announcements.map((announcement) => (
          <Box
            key={announcement._id}
            sx={{
              mb: 2,
              border: "2px solid blueviolet",
              padding: "14px",
              backgroundColor: "aliceblue",
              borderRadius: "11px",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              {announcement.teacher.name} ({announcement.teacher.email})
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {announcement.announcementBody}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {format(new Date(announcement.createdAt), "MMM dd, hh:mm a")}
            </Typography>
          </Box>
        ))}
    </Box>
  );
};
