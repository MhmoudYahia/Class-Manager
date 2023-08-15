import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import { COLORS } from "../../utils/colors";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { QuizesTable } from "./QuizesTable";
import { MaterialsSection } from "./MaterialsSection";
import { MarksList } from "./Marks";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import { StudentsList } from "./StudentsList";
import { Announcements } from "./Announcements";
import Tooltip from "@mui/material/Tooltip";
import { setShowAlert, setAlertInfo } from "../../redux/alertSlice";
import { useDispatch, useSelector } from "react-redux";
import { useFetch } from "../../utils/useFetch";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorPage } from "../../utils/ErrorPage";
import { TeachersList } from "./TeachersList";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { fetchWrapper } from "../../utils/fetchWrapper";
import { CardContent } from "@mui/material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export const Class = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const { id } = useParams();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [confirmClassCode, setConfirmClassCode] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOpen2, setDialogOpen2] = useState(false);
  const his = useNavigate();

  useEffect(() => {
    dispatch(
      // redux with alert
      setAlertInfo({
        severity: "success",
        message: "Wellcom To The class 🫡",
      })
    );
    dispatch(setShowAlert(true));
    setTimeout(() => dispatch(setShowAlert(false)), 3000);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const {
    message,
    data: classData,
    loading,
    status,
  } = useFetch(`http://localhost:1445/api/v1/classes/${id}`);

  const {
    message: message2,
    data: marksData,
    loading: loading2,
    status: status2,
  } = useFetch(`http://localhost:1445/api/v1/classes/${id}/marks`);

  if (loading || loading2) {
    return (
      <Skeleton animation="wave" height="50px" style={{ margin: "0 20px" }} />
    );
  }

  if (status !== "success" || status2 !== "success") {
    return <ErrorPage errorMessage={message + message2}></ErrorPage>;
  }

  const handleUnEnroll = async () => {
    const { message, data, status } = await fetchWrapper(
      `/classes/${id}/unenroll`,
      "PATCH"
    );
    if (status === "success") {
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

  const handelDeleteClass = async () => {
    //handle edit material backend

    if (classData.doc.code !== confirmClassCode) {
      dispatch(
        setAlertInfo({
          severity: "error",
          message: "Code Is Wrong",
        })
      );
      dispatch(setShowAlert(true));
      setTimeout(() => {
        dispatch(setShowAlert(false));
      }, 5000);
      return;
    }
    const { message, data, status } = await fetchWrapper(
      `/classes/${id}`,
      "DELETE"
    );

    if (status === "success") {
      dispatch(
        setAlertInfo({
          severity: "success",
          message: "Class has been Deleted successfully",
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

    // hanndel delete at front
    if (status === "success") {
      setDialogOpen(false);
      his("/");
    }
  };
  return (
    <div>
      <Card sx={{ borderRadius: "0px" }}>
        <CardMedia
          sx={{
            height: 300,
            width: "100%",
            objectFit: "cover",
          }}
          image="/imgs/classImgs/cover.jpg"
          title="Class Cover"
        />
        <CardContent
          style={{
            position: "absolute",
            right: "50%",
            transform: "translateX(50%)",
            top: "12%",
            backgroundColor: "rgb(93, 20, 190, 0.9)",
            padding: "28px 50px",
            borderRadius: "5px",
            "box-shadow": "0 0 10px",
          }}
        >
          <Typography fontSize={35} fontWeight={700} color="white">
            {classData.doc.name}
          </Typography>
          <Typography color="#2bdb0f">Code: {classData.doc.code}</Typography>
        </CardContent>
      </Card>

      {(user.__t === "Teacher" || user.__t === "Admin") && (
        <Button
          variant="contained"
          size="small"
          sx={{ position: "absolute", top: "44%", left: "10px" }}
          onClick={(e) => setDialogOpen(true)}
          color="error"
        >
          Delete Class
        </Button>
      )}
      {user.__t === "Student" && (
        <Button
          variant="contained"
          size="small"
          sx={{ position: "absolute", top: "44%", left: "10px" }}
          onClick={(e) => setDialogOpen2(true)}
          color="error"
        >
          UnEnroll
        </Button>
      )}
      <AppBar
        sx={{
          backgroundImage: "linear-gradient(to right bottom, #7dd56f, #28b487)",
        }}
        position="static"
      >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="warning"
          textColor="inherit"
          scrollButtons={true}
          variant="scrollable"
          // scrollButtons="auto"
          // centered
          aria-label="full width tabs example"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Tooltip title="Look At Class Materials">
            <Tab
              disabled={false} //later
              label="Materials"
              {...a11yProps(0)}
            />
          </Tooltip>
          <Tooltip title="Check The Quizes!">
            <Tab
              disabled={false} //later
              label="Quizes"
              {...a11yProps(1)}
            />
          </Tooltip>
          <Tooltip title="Check Your Marks!">
            <Tab
              disabled={false} //later
              label="Marks"
              {...a11yProps(2)}
            />
          </Tooltip>
          <Tooltip title="Students List">
            <Tab
              disabled={false} //later
              label="Students"
              {...a11yProps(3)}
            />
          </Tooltip>
          <Tooltip title="Teachers List">
            <Tab
              disabled={false} //later
              label="Teachers"
              {...a11yProps(4)}
            />
          </Tooltip>
          <Tooltip title="Check New Anouncements!">
            <Tab
              disabled={false} //later
              label="Anouncements"
              {...a11yProps(5)}
            />
          </Tooltip>
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <MaterialsSection
            teacher={user}
            role={user.__t}
            materials={classData.doc.materials}
            classId={classData.doc._id}
          />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <QuizesTable
            quizes={classData.doc.quizes}
            role={user.__t}
            classId={classData.doc._id}
            teacher={user}
          />
        </TabPanel>

        <TabPanel value={value} index={2} dir={theme.direction}>
          <MarksList
            marks={marksData.docs}
            classId={id}
            role={user.__t}
            students={classData.doc.students}
            teacher={user}
          />
        </TabPanel>

        <TabPanel value={value} index={3} dir={theme.direction}>
          <StudentsList
            students={classData.doc.students}
            role={user.__t}
            classId={id}
          />
        </TabPanel>
        <TabPanel value={value} index={4} dir={theme.direction}>
          <TeachersList
            teachers={classData.doc.teachers}
            role={user.__t}
            classId={id}
          />
        </TabPanel>
        <TabPanel value={value} index={5} dir={theme.direction}>
          <Announcements
            announcements={classData.doc.announcements}
            role={user.__t}
            teacher={user}
            classId={id}
          />
        </TabPanel>
      </SwipeableViews>

      {/* Delete Material Dialog */}
      <Dialog open={dialogOpen} onClose={(e) => setDialogOpen(false)}>
        <DialogTitle className="dialog-title">Confirm Delete Class</DialogTitle>
        <DialogContent>
          <Typography marginBottom={3}>
            Type the Class Code To Confirm the Deletion!
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            name="code"
            label="Code"
            type="text"
            fullWidth
            value={confirmClassCode}
            onChange={(e) => setConfirmClassCode(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handelDeleteClass} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogOpen2} onClose={(e) => setDialogOpen2(false)}>
        <DialogTitle className="dialog-title">
          Confirm UnEnroll Class
        </DialogTitle>
        <DialogContent>
          <Typography marginBottom={3}>
            Are you sure you want to UnEnroll?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => setDialogOpen2(false)}>Cancel</Button>
          <Button onClick={handleUnEnroll} color="error">
            Yes UnEnroll
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
