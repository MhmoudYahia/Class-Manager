import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { COLORS } from "../../utils/colors";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import dayjs from "dayjs";
import Tooltip from "@mui/material/Tooltip";
import { setAlertInfo, setShowAlert } from "../../redux/alertSlice";
import { useDispatch } from "react-redux";
import { fetchWrapper } from "../../utils/fetchWrapper";
import { Link, useNavigate } from "react-router-dom";

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
const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export const QuizesTable = ({ role, quizes: initQuizes, classId, teacher }) => {
  const [quizes, setQuizes] = useState(initQuizes);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [numOptions, setNumOptions] = useState(null); // Define the number of options here
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(Array(numOptions).fill(""));
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [open, setOpen] = useState(false);
  const [quizSubject, setQuizSubject] = useState("");
  const [maxMarkValue, setMaxMarkValue] = useState(0);
  const [canReSubmit, setCanReSubmit] = useState(false);
  const [quizMaxMark, setQuizMaxMark] = useState("");
  const [quizPublishDate, setQuizPublishDate] = useState(
    new Date(new Date() + 1000 * 60 * 60 * 24)
  );
  const [duration, setDuration] = useState(null);

  const handleAddOption = (index, value) => {
    setOptions((prevOptions) => {
      const newOptions = [...prevOptions];
      newOptions[index] = value;
      return newOptions;
    });
  };
  const [questions, setQuestions] = useState([]);
  const handleAddQuestionClick = () => {
    if (options.includes(correctAnswer) === false) {
      dispatch(
        setAlertInfo({
          severity: "error",
          message: "Correct Answer is not in the options!",
        })
      );
      dispatch(setShowAlert(true));
      setTimeout(() => {
        dispatch(setShowAlert(false));
      }, 5000);
    }
    const newQuestion = {
      question,
      options,
      correctAnswer,
      questionMark,
    };
    setMaxMarkValue(maxMarkValue + parseInt(questionMark));
    setQuestions([...questions, newQuestion]);
    // Handle adding the new question to the quiz here
    setNumOptions(0);
    setNumOptions(null);
    setQuestion("");
    setQuestionMark(null);
    setOptions(Array(numOptions).fill(""));
    setCorrectAnswer("");
  };

  const handleAddQuizClick = async () => {
    // Handle adding the new question to the quiz here

    if (questions.length === 0) {
      dispatch(
        setAlertInfo({
          severity: "error",
          message: "Enter Questions, Quiz is empty!",
        })
      );
      dispatch(setShowAlert(true));
      setTimeout(() => {
        dispatch(setShowAlert(false));
      }, 5000);

      return;
    }

    const { message, data, status } = await fetchWrapper(
      `/quizes`,
      "POST",
      JSON.stringify({
        questions,
        subject: quizSubject,
        duration,
        class: classId,
        teacher: teacher._id,
        publishAt: quizPublishDate,
        maxMarkValue,
        canReSubmit,
      }),
      { "Content-Type": "application/json" }
    );

    if (status === "success") {
      dispatch(
        setAlertInfo({
          severity: "success",
          message: "Quiz has been added successfully🫡",
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
      setOpen(false);
      setQuestions([]);
      const temp = {
        _id: data.doc._id,
        teacher,
        publishAt: data.doc.publishAt,
        subject: data.doc.subject,
      };
      setQuizes([...quizes, temp]);
    }
    //api request add quiz
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submissionsDialogOpen, setSubmissionsDialogOpen] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState(null);
  const [questionMark, setQuestionMark] = useState(null);
  const handleDeleteQuiz = async () => {
    const { message, data, status } = await fetchWrapper(
      `/quizes/${deleteRowId}`,
      "DELETE"
    );

    if (status === "success") {
      dispatch(
        setAlertInfo({
          severity: "success",
          message: "Quiz has been deleted successfully🫡",
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

    // frontend
    if (status === "success") {
      setQuizes(quizes.filter((quiz) => quiz._id !== deleteRowId));
      setDeleteRowId(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteDialogOpen = (id) => {
    setDeleteRowId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteRowId(null);
    setDeleteDialogOpen(false);
  };

  const handleSubbmissionsDialogOpen = (submissions, maxMark) => {
    setSubmissionsDialogOpen(true);
    setSubmissions(submissions);
    setQuizMaxMark(maxMark);
  };

  const handleSubbmissionsDialogClose = () => {
    setSubmissionsDialogOpen(false);
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
        Class Quizes
      </Typography>
      <TableContainer
        component={Paper}
        style={{ marginRight: 10, width: "80%", margin: "auto" }}
      >
        <Table sx={{ minWidth: 500 }} aria-label="class table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Date</StyledTableCell>
              <StyledTableCell align="center">Subject</StyledTableCell>
              <StyledTableCell align="center">Teacher</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quizes &&
              quizes
                // .filter((quiz) => new Date(quiz.publishAt) <= new Date()) // filter quizzes based on publishAt value
                .map((quiz) => (
                  <StyledTableRow key={quiz._id}>
                    <TableCell component="th" scope="row" align="center">
                      {new Date(quiz.publishAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </TableCell>
                    <TableCell align="center">{quiz.subject}</TableCell>
                    <TableCell align="center">{quiz.teacher.name}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Delete">
                        {role === "Teacher" && (
                          <IconButton
                            color="error"
                            aria-label="delete"
                            onClick={() => handleDeleteDialogOpen(quiz._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Tooltip>

                      <Tooltip title="Start The Quiz!">
                        {role === "Student" && (
                          // <Link to={`quizes/${quiz._id}`}>
                          <IconButton
                            color="success"
                            aria-label="go"
                            onClick={() =>
                              (window.location.href = `http://localhost:3000/quizes/${quiz._id}`)
                            }
                          >
                            <ContentPasteGoIcon />
                          </IconButton>
                          // </Link>
                        )}
                      </Tooltip>
                      <Tooltip title="Quiz is closed now">
                        {/* {role === "Student" && (
                          <Button
                            variant="contained"
                            color="error"
                            size=
                            sx={{ cursor: "default" }}
                          >
                            Closed
                          </Button>
                        )} */}
                      </Tooltip>
                      {role === "Teacher" && (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() =>
                            handleSubbmissionsDialogOpen(
                              quiz.submissions,
                              quiz.maxMarkValue
                            )
                          }
                        >
                          Submissions
                        </Button>
                      )}
                    </TableCell>
                  </StyledTableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      {role === "Teacher" && (
        <Button
          variant="contained"
          size="medium"
          sx={{
            margin: 5,
          }}
          onClick={handleOpen}
          style={{ color: "primary" }}
        >
          Add Quiz
        </Button>
      )}

      {/* Dialog for deleting rows */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle className="dialog-title">Delete Quiz</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this Quiz?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteQuiz} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for show subbmissions rows */}
      <Dialog
        open={submissionsDialogOpen}
        onClose={handleSubbmissionsDialogClose}
      >
        <DialogTitle align="center" className="dialog-title">
          Submissions
        </DialogTitle>
        <Typography margin={2} align="center" fontWeight={600} color="#1bc400">Maximam Mark is {quizMaxMark}</Typography>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="class table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">
                    Submission Date
                  </StyledTableCell>
                  <StyledTableCell align="center">Student</StyledTableCell>
                  <StyledTableCell align="center">Marks</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submissions &&
                  submissions.map((submission) => (
                    <StyledTableRow key={submission._id}>
                      <TableCell component="th" scope="row" align="center">
                        {new Date(submission.submittedAt).toLocaleString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          }
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {submission.student.name}
                      </TableCell>
                      <TableCell align="center">
                        {submission.markValue}
                      </TableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubbmissionsDialogClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for add quiz */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle align="center" className="dialog-title">
          Create Quiz
        </DialogTitle>
        <DialogContent>
          <TextField
            style={{ marginBottom: "20px" }}
            autoFocus
            margin="dense"
            label="Subject"
            type="text"
            fullWidth
            required={true}
            value={quizSubject}
            onChange={(e) => setQuizSubject(e.target.value)}
          />
          <TextField
            style={{ marginBottom: "20px" }}
            margin="dense"
            label="Duration in minutes"
            type="text"
            fullWidth
            required={true}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Publish Time"
                value={quizPublishDate}
                onChange={(val) => setQuizPublishDate(new Date(val))}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
          <DialogTitle align="center">Add Questions</DialogTitle>
          <TextField
            margin="dense"
            label="Question"
            type="text"
            fullWidth
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Number Of Options"
            type="number"
            fullWidth
            value={numOptions}
            onChange={(e) => {
              setNumOptions(
                isNaN(parseInt(e.target.value)) || parseInt(e.target.value) < 0
                  ? null
                  : parseInt(e.target.value) > 8
                  ? 8
                  : parseInt(e.target.value)
              );
            }}
          />
          {numOptions &&
            numOptions > 0 &&
            [...Array(numOptions)].map((_, index) => (
              <TextField
                key={index}
                margin="dense"
                label={`Option ${index + 1}`}
                type="text"
                fullWidth
                value={options[index]}
                onChange={(e) => handleAddOption(index, e.target.value)}
              />
            ))}
          <TextField
            margin="dense"
            label="Correct Answer"
            type="text"
            fullWidth
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Question Mark"
            type="text"
            fullWidth
            value={questionMark}
            onChange={(e) => setQuestionMark(e.target.value)}
          />
          <TextField
            select
            label="Student"
            value={canReSubmit}
            onChange={(e) => {
              setCanReSubmit(e.target.value);
            }}
            fullWidth
            margin="normal"
            variant="outlined"
          >
            <MenuItem key={1} value={true}>
              true
            </MenuItem>

            <MenuItem key={2} value={false}>
              false
            </MenuItem>
          </TextField>
        </DialogContent>
        <StyledButton onClick={handleAddQuestionClick}>
          Add Question
        </StyledButton>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleAddQuizClick} variant="contained">
            Add Quiz
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
