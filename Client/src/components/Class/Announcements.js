import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
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
  const [editedAnnouncementText, setEditedAnnouncementText] =
    React.useState("");
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = React.useState(null);
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

  const handleDeleteAnnouncement = (id) => {
    // Open delete dialog and set the selected announcement
    setDeleteDialogOpen(true);
    setSelectedAnnouncement(id);
  };

  const confirmDeleteAnnouncement = async () => {
    const { message, data, status } = await fetchWrapper(
      `/classes/${classId}/deleteAnnouncement/${selectedAnnouncement}`,
      "DELETE"
    );

    if (status === "success") {
      dispatch(
        setAlertInfo({
          severity: "success",
          message: "Announcement has been deleted successfully 🫡",
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
      // Delete the selected announcement and close the delete dialog
      const updatedAnnouncements = announcements.filter(
        (announcement) => announcement._id !== selectedAnnouncement
      );
      setAnnouncements(updatedAnnouncements);
      setDeleteDialogOpen(false);
    }
  };

  const handleEditAnnouncement = (announcement) => {
    // Open edit dialog and set the selected announcement
    setEditDialogOpen(true);
    setSelectedAnnouncement(announcement);
    setEditedAnnouncementText(announcement.announcementBody);
  };

  const confirmEditAnnouncement = async () => {
    const { message, data, status } = await fetchWrapper(
      `/classes/${classId}/editAnnouncement/${selectedAnnouncement._id}`,
      "PATCH",
      JSON.stringify({
        announcementBody: editedAnnouncementText,
      }),
      { "Content-Type": "application/json" }
    );

    if (status === "success") {
      dispatch(
        setAlertInfo({
          severity: "success",
          message: "Announcement has been Edited successfully 🫡",
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
      // Update the selected announcement and close the edit dialog
      const updatedAnnouncements = announcements.map((announcement) =>
        announcement._id === selectedAnnouncement._id
          ? {
              ...selectedAnnouncement,
              announcementBody: editedAnnouncementText,
            }
          : announcement
      );
      setAnnouncements(updatedAnnouncements);
      setEditDialogOpen(false);
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
            position: "relative",
          }}
        >
          <TextField
            label="New Announcement"
            value={newAnnouncementText}
            onChange={(event) => setNewAnnouncementText(event.target.value)}
            sx={{ mr: 1, marginBottom: 3, width: "80%" }}
            multiline
          />
          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            sx={{
              width: "fit-content",
              position: "absolute",
              right: "2%",
              top: "12%",
            }}
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
            {role === "Teacher" && (
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEditAnnouncement(announcement)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteAnnouncement(announcement._id)}
                >
                  Delete
                </Button>
              </Box>
            )}
          </Box>
        ))}
      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        aria-labelledby="edit-dialog-title"
      >
        <DialogTitle className="dialog-title">Edit Announcement</DialogTitle>
        <DialogContent>
          <TextField
            style={{ marginBottom: "20px" }}
            autoFocus
            margin="dense"
            label="Announcement Text"
            type="text"
            fullWidth
            required={true}
            value={editedAnnouncementText}
            onChange={(e) => setEditedAnnouncementText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => confirmEditAnnouncement()} color="secondary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle className="dialog-title">Delete Announcement</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this announcement?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteAnnouncement} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
