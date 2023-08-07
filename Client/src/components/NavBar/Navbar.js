import "./navbbr.css";
import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import InputAdornment from "@mui/material/InputAdornment";
import Skeleton from "@mui/material/Skeleton";
import GroupIcon from "@mui/icons-material/Group";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { TextField, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import SchoolIcon from "@mui/icons-material/School";
import { COLORS } from "../../utils/colors";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { fetchWrapper } from "../../utils/fetchWrapper";
import Alert from "../../utils/alert";
import { useDispatch, useSelector } from "react-redux";
import { useFetch } from "../../utils/useFetch";
import { clearUser, setUser, setLoading } from "../../redux/userSlice";
import { setAlertInfo, setShowAlert } from "../../redux/alertSlice";
import { setReceiver, setShowChat } from "../../redux/chatSlice";

export const Navbar = () => {
  const dispatch = useDispatch();
  const his = useNavigate();
  const { showChat } = useSelector((state) => state.chat);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [showPass1, setShowPass1] = React.useState(false);
  const [showPass2, setShowPass2] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [showContacts, setShowContacts] = React.useState(false);
  const [contacts, setContacts] = React.useState([]);
  const [user, setUserInfo] = React.useState(null);

  const { status, data, message, loading } = useFetch(
    "http://localhost:1445/api/v1/users/me"
  );
  // get contacts
  const { data: d2 } = useFetch(
    "http://localhost:1445/api/v1/chats/getContacts"
  );

  React.useEffect(() => {
    dispatch(setLoading(loading));
  }, [loading]);

  React.useEffect(() => {
    if (status === "success") {
      setUserInfo(data.doc);
      dispatch(setUser(data.doc));
    }
  }, [status]);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = (id) => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleToggleShowPass2 = () => {
    setShowPass2(!showPass2);
  };
  const handleToggleShowPass1 = () => {
    setShowPass1(!showPass1);
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();

    const { message, data, status } = await fetchWrapper(
      `/users/changePassword`,
      "PATCH",
      JSON.stringify({
        currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      }),
      { "Content-Type": "application/json" }
    );

    if (status === "success") {
      dispatch(
        setAlertInfo({
          severity: "success",
          message: "Your Password has been Changed successfully 🫡",
        })
      );
      dispatch(setShowAlert(true));
      setTimeout(() => {
        dispatch(setShowAlert(false));
      }, 3000);
      handleDialogClose();
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
  const handleLogOut = async () => {
    const { message, data, status, loading } = await fetchWrapper(
      "/users/signout",
      "PATCH"
    );
    if (status === "success") {
      dispatch(clearUser());
      dispatch(
        setAlertInfo({
          severity: "success",
          message: "Logged Out Successfully😟",
        })
      );
      his("/signin");
      window.location.reload(true);
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

  if (loading) {
    return (
      <Skeleton animation="wave" height="50px" style={{ margin: "0 20px" }} />
    );
  }
  const handleChatWith = (receiver) => {
    // console.log(Object.assign( receiver));
    dispatch(setReceiver(Object.assign(receiver)));
    dispatch(setShowChat(true));
  };
  return (
    <div className="navbar">
      <React.Fragment>
        <Box>
          <Link to="/">
            <Tooltip title="Home">
              <Typography
                className="class-manager"
                sx={{
                  minWidth: 100,
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  color: "white",
                }}
              >
                Class Manager
              </Typography>
            </Tooltip>
          </Link>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            gap: 1,
          }}
        >
          {!user && (
            <>
              <Link to="/signin">
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    borderRadius: "20px",
                    padding: "5px 15px",
                    backgroundColor: COLORS.mainColor,
                  }}
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    borderRadius: "20px",
                    padding: "5px 15px",
                    backgroundColor: COLORS.mainColor,
                  }}
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}

          {user && (
            <>
              <Typography sx={{ minWidth: 100, fontWeight: 500 }}>
                {user.name}
              </Typography>

              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <Avatar
                    sx={{ width: 39, height: 39 }}
                    src={`/imgs/users/${user.photo}`}
                  >
                    M
                  </Avatar>
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Link to="/me" style={{ color: "#111" }}>
            <MenuItem>
              <Avatar sx={{ backgroundColor: COLORS.mainColor }} /> Profile
            </MenuItem>
          </Link>
          <Link to="/" style={{ color: "#111" }}>
            <MenuItem>
              <LibraryBooksIcon
                sx={{ color: COLORS.mainColor, marginRight: 1 }}
              />{" "}
              My Classes
            </MenuItem>
          </Link>
          <MenuItem onClick={handleDialogOpen}>
            <LockIcon sx={{ marginRight: 1, color: COLORS.mainColor }} /> Change
            Password
          </MenuItem>

          {user && user.__t === "Student" && (
            <Link to="/myMarks" style={{ color: "#111" }}>
              <MenuItem>
                <SchoolIcon sx={{ marginRight: 1, color: COLORS.mainColor }} />{" "}
                My Marks
              </MenuItem>
            </Link>
          )}
          <MenuItem onClick={(e) => setShowContacts(true)}>
            <GroupIcon sx={{ marginRight: 1, color: COLORS.mainColor }} /> Chats
          </MenuItem>
          <Divider />
          <Link to="/signup" style={{ color: "#111" }}>
            <MenuItem>
              <ListItemIcon>
                <PersonAdd fontSize="small" sx={{ color: COLORS.mainColor }} />
              </ListItemIcon>
              Add another account
            </MenuItem>
          </Link>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Settings fontSize="small" sx={{ color: COLORS.mainColor }} />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem onClick={handleLogOut}>
            <ListItemIcon>
              <Logout fontSize="small" sx={{ color: COLORS.mainColor }} />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </React.Fragment>

      {showContacts && (
        <Box
          sx={{
            position: "fixed",
            bottom: "15px",
            right: showChat ? "42%" : "7px",
            zIndex: 50,
            width: "20%",
            padding: "10px",
          }}
        >
          <Paper sx={{ padding: 2, backgroundColor: "#edededf0" }}>
            <Typography
              textTransform="uppercase"
              marginBottom="20px"
              color={COLORS.mainColor}
              sx={{ textDecoration: "underline" }}
              fontWeight="600"
            >
              Chats
            </Typography>
            {d2 &&
              d2.contacts.map((contact) => (
                <Button
                  fullWidth
                  color="secondary"
                  onClick={() => handleChatWith(contact)}
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                    textTransform: "capitalize",
                    gap: "9px",
                    marginBottom: 1,
                  }}
                >
                  <Avatar
                    alt={contact.name}
                    src={`/imgs/users/${contact.photo}`}
                  />
                  <Typography>{contact.name}</Typography>
                </Button>
              ))}
          </Paper>
          <IconButton
            onClick={() => setShowContacts(false)}
            size="large"
            color="secondary"
            sx={{ position: "absolute", right: "7px", top: "5px" }}
          >
            <DoubleArrowIcon />
          </IconButton>
        </Box>
      )}

      {/* Dialog for deleting rows */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle className="dialog-title">Delete Quiz</DialogTitle>
        <DialogContent>
          <Typography variant="h5" gutterBottom align="center">
            Change Password
          </Typography>
          <form>
            <TextField
              label="Current Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextField
              label="New Password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type={showPass2 ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggleShowPass2}
                      edge="end"
                      style={{ width: "50px" }}
                    >
                      {showPass2 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showPass1 ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggleShowPass1}
                      edge="end"
                      style={{ width: "50px" }}
                    >
                      {showPass1 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleChangePassword} variant="contained">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
