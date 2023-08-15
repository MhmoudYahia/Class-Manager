import * as React from "react";
import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { COLORS } from "../../utils/colors";
import { useDispatch } from "react-redux";
import { setReceiver, setShowChat } from "../../redux/chatSlice";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import TextField from "@mui/material/TextField";
import { fetchWrapper } from "../../utils/fetchWrapper";
import { setAlertInfo, setShowAlert } from "../../redux/alertSlice";

export const TeachersList = ({ teachers, role, classId }) => {
  const dispatch = useDispatch();
  const [DialogOpen, setDialogOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const rows = teachers.map((student) => ({
    ...student,
    id: student._id,
  }));
  const columns = [
    { field: "_id", headerName: "ID", width: 400 },
    { field: "name", headerName: "Name", width: 350 },
    { field: "email", headerName: "Email", width: 400 },
    {
      field: "chat",
      headerName: "Chat",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleChat(params.row)}
        >
          Chat
        </Button>
      ),
    },
  ];

  function handleChat(row) {
    // Implement your chat functionality here, using the row data
    dispatch(setReceiver(row));
    dispatch(setShowChat(true));
  }
  const handleAddTeacher = async () => {
    const { message, data, status } = await fetchWrapper(
      `/classes/${classId}/addUser`,
      "PATCH",
      JSON.stringify({
        email,
      }),
      { "Content-Type": "application/json" }
    );

    if (status === "success") {
      dispatch(
        setAlertInfo({
          severity: "success",
          message: "Teacher has been added successfully 🫡",
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
  };
  return (
    <>
      <Typography
        gutterBottom
        variant="h5"
        component="div"
        style={{
          marginTop: 50,
          fontWeight: 700,
          textTransform: "uppercase",
          marginBottom: 30,
          textDecoration: "underline",
          color: COLORS.mainColor,
        }}
      >
        Teachers
      </Typography>
      {role === "Teacher" && (
        <Button
          variant="contained"
          color="secondary"
          style={{ marginBottom: 20 }}
          endIcon={<GroupAddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Add Student
        </Button>
      )}
      <Box sx={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          pageSizeOptions={[4]}
          checkboxSelection
          disableRowSelectionOnClick
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </Box>
      {/* Dialog for deleting rows */}
      <Dialog open={DialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle className="dialog-title">Add Student</DialogTitle>
        <DialogContent>
          Enter the email of the student to add him to the class
          <TextField
            style={{ marginBottom: "20px" }}
            margin="dense"
            label="email"
            type="text"
            fullWidth
            required={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddTeacher} variant="contained">
            Add
          </Button>
          <Button onClick={() => setDialogOpen(false)}>close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
