import { useFetch } from "../../utils/useFetch";
import { Delete, Edit } from "@mui/icons-material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography, IconButton, Skeleton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { COLORS } from "../../utils/colors";
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

export const MyMarks = () => {
  const {
    message,
    data: marksData,
    loading,
    status,
  } = useFetch(`http://localhost:1445/api/v1/marks`);

  const [marks, setMarks] = useState([]);

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

  return (
    <>
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
        My marks
      </Typography>
      <TableContainer
        component={Paper}
        style={{ width: "95%", margin: "20px auto" }}
      >
        <Table sx={{ minWidth: 500 }} aria-label="class table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Date</StyledTableCell>
              <StyledTableCell align="center">Class Name</StyledTableCell>
              <StyledTableCell align="center">Class Code</StyledTableCell>
              <StyledTableCell align="center">Subject</StyledTableCell>
              <StyledTableCell align="center">Teacher</StyledTableCell>
              <StyledTableCell align="center">Mark Obtained</StyledTableCell>
              <StyledTableCell align="center">Max. Mark</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {marks && marks.length === 0 ? (
              <Typography variant="subtitle1">No marks found.</Typography>
            ) : (
              marks &&
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
                  <TableCell align="center">{mark.class.name}</TableCell>
                  <TableCell align="center">{mark.class.code}</TableCell>
                  <TableCell align="center">{mark.subject}</TableCell>
                  <TableCell align="center">{mark.teacher.name}</TableCell>
                  <TableCell align="center">{mark.marksValue}</TableCell>
                  <TableCell align="center">{mark.maxMark}</TableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
