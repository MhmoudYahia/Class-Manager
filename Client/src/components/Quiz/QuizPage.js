import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { COLORS } from "../../utils/colors";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import { ErrorPage } from "../../utils/ErrorPage";
import { fetchWrapper } from "../../utils/fetchWrapper";
import { useFetch } from "../../utils/useFetch";
import Skeleton from "@mui/material/Skeleton";
import { useDispatch, useSelector } from "react-redux";
import { setAlertInfo, setShowAlert } from "../../redux/alertSlice";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  color: theme.palette.text.primary,
}));

const QuizPage = (/*{ doc }*/) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const [selectedAnswers, setSelectedAnswers] = React.useState({});
  const [isSelectedAnswersCorrect, setisSelectedAnswersCorrect] =
    React.useState({});
  const [totalMark, setTotalMark] = React.useState(0);
  const [marksObtained, setMarksObtained] = React.useState(0);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [remainingTime, setRemainingTime] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const timeoutId = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timeoutId);
  }, []);

  React.useEffect(() => {
    if (remainingTime === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [remainingTime]);

  const {
    message,
    data: quizData,
    loading,
    status,
  } = useFetch(`http://localhost:1445/api/v1/quizes/${id}`);

  React.useEffect(() => {
    if (status === "success") {
      setRemainingTime(parseInt(quizData.doc.duration * 60));
    }
    if (quizData.isSubmitted) {
      dispatch(
        setAlertInfo({
          severity: "success",
          message: "Done!😶‍🌫️",
        })
      );
      dispatch(setShowAlert(true));
      setTimeout(() => {
        dispatch(setShowAlert(false));
      }, 5000);
      setIsSubmitted(true);
      quizData.doc.submissions.forEach((sub, i) => {
        if (sub.student._id.toString() === user._id.toString()) {
          setMarksObtained(sub.markValue);
          sub.selectedAnswers.forEach((answerS) => {
            setSelectedAnswers((prevState) => ({
              ...prevState,
              [answerS.question.toString()]: answerS.answer,
            }));
            setisSelectedAnswersCorrect((prevState) => ({
              ...prevState,
              [answerS.question.toString()]: answerS.isCorrect,
            }));
          });
        }
      });
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

  const handleDialogOpen = (id) => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleAnswerSelect = (questionId, answer) => {
    // if (!isSubmitted) {
    if (!answer) answer = "";

    setSelectedAnswers({
      ...selectedAnswers,
      [questionId.toString()]: answer,
    });
    // }
  };

  const handleSubmit = async () => {
    let submissionQuestions = [];
    const newMarksObtained = quizData.doc.questions.reduce(
      (total, question, index) => {
        const selectedAnswer = selectedAnswers[question._id];
        submissionQuestions[index] = {};
        submissionQuestions[index].answer = selectedAnswer;
        submissionQuestions[index].question = question._id;
        if (selectedAnswer && selectedAnswer === question.correctAnswer) {
          submissionQuestions[index].isCorrect = true;
          return total + question.questionMark;
        }
        submissionQuestions[index].isCorrect = false;
        return total;
      },
      0
    );

    const { message, data, status } = await fetchWrapper(
      `/quizes/${id}/submit`,
      "PATCH",
      JSON.stringify({
        markValue: newMarksObtained,
        selectedAnswers: submissionQuestions,
      }),
      { "Content-Type": "application/json" }
    );
    if (status === "success") {
      dispatch(
        setAlertInfo({
          severity: "success",
          message: "Quiz has been submitted successfully🫡",
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
    // frontend submit button

    if (status === "success") {
      handleDialogOpen();
      setMarksObtained(newMarksObtained);
      setTotalMark(
        quizData.doc.questions.reduce(
          (total, question) => total + question.questionMark,
          0
        )
      );
      setIsSubmitted(true);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handelReEnter = async () => {
    const { message, data, status } = await fetchWrapper(
      `/quizes/${id}/reEnterQuiz`,
      "PATCH"
    );
    if (status !== "success") {
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
    } else {
      window.location.reload();
    }
  };
  return (
    <Box sx={{ p: 2, margin: "10px" }}>
      {isSubmitted && quizData.doc.canReSubmit && (
        <Button
          onClick={handelReEnter}
          variant="contained"
          sx={{ position: "absolute", left: "14px", top: "85px" }}
          color="secondary"
        >
          ReEnter
        </Button>
      )}
      <Typography variant="h4" gutterBottom textTransform="capitalize">
        {quizData.doc.subject} Quiz
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">
          Published on {new Date(quizData.doc.publishAt).toLocaleDateString()}{" "}
          at {new Date(quizData.doc.publishAt).toLocaleTimeString()}
        </Typography>
        <Typography variant="subtitle1">
          Duration: {quizData.doc.duration} minutes
        </Typography>
        {isSubmitted && (
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              sx={{ marginTop: 2 }}
              onClick={() => setDialogOpen(true)}
            >
              Show My Mark
            </Button>
          </Box>
        )}
        {!isSubmitted && (
          <Typography
            variant="subtitle1"
            sx={{
              position: "fixed",
              top: "11%",
              right: " 1%",
              border: "2px solid blueviolet",
              padding: "5px 10px",
              backgrounColor: "#fff3f4",
              boxShadow: "0 0 5px 1px #4d36be",
            }}
          >
            {formatTime(remainingTime)}
          </Typography>
        )}
      </Box>

      <Box sx={{ mb: 2 }}>
        {quizData &&
          quizData.doc.questions.map((question) => (
            <Box
              key={question._id}
              sx={{
                mb: 2,
                border: "2px solid blueviolet",
                padding: "21px",
                backgroundColor: `${
                  isSelectedAnswersCorrect[question._id] === true
                    ? "aliceblue"
                    : isSelectedAnswersCorrect[question._id] === false
                    ? "#ff00002e"
                    : "aliceblue"
                }`,
              }}
            >
              <Typography
                variant="subtitle1"
                align="start"
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Typography
                  sx={{ fontWeight: "bold", mb: 1, color: "#2c86ff" }}
                >
                  {question.question}?
                </Typography>{" "}
                <Typography align="end" color="#00be3d">
                  {question.questionMark} marks
                </Typography>
              </Typography>
              <RadioGroup
                aria-label={question.question}
                name={question._id}
                value={selectedAnswers[question._id] || ""}
                onChange={(event) =>
                  handleAnswerSelect(question._id, event.target.value)
                }
              >
                {question.options.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio />}
                    label={option}
                    disabled={isSubmitted}
                  />
                ))}
              </RadioGroup>
              {isSubmitted && (
                <Typography
                  color="#18ce47"
                  align="left"
                  margin="10px 0"
                  fontWeight="500"
                >
                  Correct Answer: {question.correctAnswer}
                </Typography>
              )}
            </Box>
          ))}
      </Box>
      {!isSubmitted && (
        <Box sx={{ mb: 2 }}>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      )}
      {/* Dialog  */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle className="dialog-title">Quiz Result</DialogTitle>

        <DialogContent style={{ width: "300px" }}>
          <TableContainer
            component={Paper}
            style={{ marginRight: 10, width: "80%", margin: "auto" }}
          >
            <Table aria-label="class table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">
                    Marks Obtained
                  </StyledTableCell>
                  <StyledTableCell align="center">Total Mark</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableCell align="center"> {marksObtained}</TableCell>

                <TableCell align="center">
                  {quizData.doc.maxMarkValue}
                </TableCell>
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="body1" sx={{ mb: 1, mt: 2 }} align="center">
            {`${
              marksObtained > quizData.doc.maxMarkValue
                ? "Congraturations 🫡"
                : "Good Lock Next Time😂"
            }`}
          </Typography>
        </DialogContent>
        <DialogActions>
          
          <Button onClick={handleDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuizPage;
