import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  MenuItem,
  Skeleton,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { COLORS } from "../../utils/colors";
import { Delete, Edit } from "@mui/icons-material";
import { useFetch } from "../../utils/useFetch";
import { useDispatch, useSelector } from "react-redux";
import { setAlertInfo, setShowAlert } from "../../redux/alertSlice";
import { fetchWrapper } from "../../utils/fetchWrapper";
import { ErrorPage } from "../../utils/ErrorPage";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  color: theme.palette.text.primary,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide the last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const MarksList = ({ classId, role, students, teacher }) => {
  const [marks, setMarks] = useState([]);
  const dispatch = useDispatch();
  const [selectedMark, setSelectedMark] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [student, setStudent] = useState({});
  const [newMark, setNewMark] = useState({
    subject: "",
    marksValue: "",
    studentId: "",
  });

  const {
    message,
    data: marksData,
    loading,
    status,
  } = useFetch(`http://localhost:1445/api/v1/classes/${classId}/marks`);

  useEffect(() => {
    if (status === "success") {
      setMarks(marksData.docs);
    }
  }, [status]);

  if (loading) {
    return (
      <Skeleton animation="wave" height="50px" style={{ margin: "0 20px" }} />
    );
  }

  if (status !== "success") {
    return <ErrorPage errorMessage={message}></ErrorPage>;
  }

  const handleEditClick = (mark) => {
    setSelectedMark(mark);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setSelectedMark(null);
    setEditDialogOpen(false);
  };

  const handleEditSubmit = async () => {
    const { message, data, status } = await fetchWrapper(
      `/classes/${classId}/marks/${selectedMark._id}`,
      "PATCH",
      JSON.stringify(selectedMark),
      { "Content-Type": "application/json" }
    );

    if (status === "success") {
      dispatch(
        setAlertInfo({
          severity: "success",
          message: "Mark has been Updated successfully🫡",
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
      setMarks((prevMarks) =>
        prevMarks.map((m) =>
          m._id === selectedMark._id ? { ...selectedMark } : m
        )
      );
      handleEditDialogClose();
    }
  };

  const handleDeleteClick = (mark) => {
    setSelectedMark(mark);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setSelectedMark(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteSubmit = async () => {
    const { message, data, status } = await fetchWrapper(
      `/classes/${classId}/marks/${selectedMark._id}`,
      "DELETE"
    );

    if (status === "success") {
      dispatch(
        setAlertInfo({
          severity: "success",
          message: "Mark has been Deleted successfully🫡",
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
      setMarks((prevMarks) =>
        prevMarks.filter((m) => m._id !== selectedMark._id)
      );
      handleDeleteDialogClose();
    }
  };

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
    setNewMark({
      subject: "",
      marksValue: "",
      student: "",
      maxMark: "",
    });
  };

  const handleAddSubmit = async () => {
    const { message, data, status } = await fetchWrapper(
      `/classes/${classId}/marks/addMark`,
      "POST",
      JSON.stringify(newMark),
      { "Content-Type": "application/json" }
    );

    if (status === "success") {
      dispatch(
        setAlertInfo({
          severity: "success",
          message: "Mark has been added successfully🫡",
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

    // handle front
    if (status === "success") {
      const temp = {
        _id: data.doc._id,
        student,
        createdAt: Date.now(),
        maxMark: data.doc.maxMark,
        marksValue: data.doc.marksValue,
        subject: data.doc.subject,
      };
      setMarks((prevMarks) => [...prevMarks, temp]);
      handleAddDialogClose();
    }
  };

  return (
    <div>
      <Typography
        gutterBottom
        variant="h5"
        component="div"
        style={{
          marginTop: 50,
          fontWeight: 700,
          marginBottom: 30,
          textDecoration: "underline",
          textTransform: "uppercase",
          color: COLORS.mainColor,
        }}
      >
        {role === "Student" && "My marks"}
        {role === "Teacher" && "Students Marks"}
      </Typography>
      {marks && marks.length === 0 ? (
        <Typography variant="subtitle1" align="center" margin={3}>
          No Marks Yet.
        </Typography>
      ) : (
        <TableContainer
          component={Paper}
          style={{ width: "95%", margin: "20px auto" }}
        >
          <Table sx={{ minWidth: 500 }} aria-label="class table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Date</StyledTableCell>
                <StyledTableCell align="center">Subject</StyledTableCell>
                {role === "Student" && (
                  <StyledTableCell align="center">Teacher</StyledTableCell>
                )}
                {role === "Teacher" && (
                  <StyledTableCell align="center">Student</StyledTableCell>
                )}
                <StyledTableCell align="center">Mark Obtained</StyledTableCell>
                <StyledTableCell align="center">Max. Mark</StyledTableCell>
                {role === "Teacher" && (
                  <StyledTableCell align="center">Actions</StyledTableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {marks &&
                marks.map((mark) => (
                  <StyledTableRow key={mark._id}>
                    <TableCell component="th" scope="row" align="center">
                      {new Date(mark.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </TableCell>
                    <TableCell align="center">{mark.subject}</TableCell>
                    {role === "Student" && (
                      <TableCell align="center">{mark.teacher.name}</TableCell>
                    )}
                    {role === "Teacher" && (
                      <TableCell align="center">{mark.student.name}</TableCell>
                    )}
                    <TableCell align="center">{mark.marksValue}</TableCell>
                    <TableCell align="center">{mark.maxMark}</TableCell>

                    {role === "Teacher" && (
                      <TableCell align="center">
                        <IconButton
                          edge="end"
                          onClick={() => handleEditClick(mark)}
                          color="success"
                        >
                          {" "}
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          edge="end"
                          onClick={() => handleDeleteClick(mark)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    )}
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {role === "Teacher" && (
        <Button variant="contained" onClick={handleAddClick}>
          Add Mark
        </Button>
      )}

        {/* ///////////dialogs///////////// */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle className="dialog-title">Edit Mark</DialogTitle>
        <DialogContent>
          <TextField
            label="Subject"
            value={selectedMark?.subject || ""}
            onChange={(e) =>
              setSelectedMark((prevMark) => ({
                ...prevMark,
                subject: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Marks Value"
            value={selectedMark?.marksValue || ""}
            onChange={(e) =>
              setSelectedMark((prevMark) => ({
                ...prevMark,
                marksValue: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} color="secondary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ////**************** */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle className="dialog-title">Delete Mark</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this mark?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteSubmit} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* //////////////////// */}
      <Dialog open={addDialogOpen} onClose={handleAddDialogClose}>
        <DialogTitle className="dialog-title">Add Mark</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Student"
            value={student.email}
            onChange={(e) => {
              setStudent(e.target.value);
              setNewMark((prevMark) => ({
                ...prevMark,
                student: e.target.value._id,
              }));
            }}
            fullWidth
            margin="normal"
            variant="outlined"
          >
            {students &&
              students.map((student) => (
                <MenuItem key={student._id} value={student}>
                  <Tooltip title={student.name}>{student.email}</Tooltip>
                </MenuItem>
              ))}
          </TextField>
          <TextField
            label="Subject"
            value={newMark.subject}
            onChange={(e) =>
              setNewMark((prevMark) => ({
                ...prevMark,
                subject: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Marks Value"
            type="number"
            value={newMark.marksValue}
            onChange={(e) =>
              setNewMark((prevMark) => ({
                ...prevMark,
                marksValue: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            type="number"
            label="Max. Mark Value"
            value={newMark?.maxMark || ""}
            onChange={(e) =>
              setNewMark((prevMark) => ({
                ...prevMark,
                maxMark: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button onClick={handleAddSubmit} color="secondary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
