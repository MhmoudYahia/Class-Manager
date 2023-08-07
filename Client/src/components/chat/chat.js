import React, { useState, useEffect, useRef } from "react";
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import { io } from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
// import "emoji-mart/css/emoji-mart.css";

import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  IconButton,
  Skeleton,
  Avatar,
} from "@mui/material";
import { COLORS } from "../../utils/colors";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import { useDispatch, useSelector } from "react-redux";
import { useFetch } from "../../utils/useFetch";
import { ErrorPage } from "../../utils/ErrorPage";
import { setShowChat } from "../../redux/chatSlice";
import { fetchWrapper } from "../../utils/fetchWrapper";
import { setAlertInfo, setShowAlert } from "../../redux/alertSlice";

export const ChatBar = ({ sender: user, receiver }) => {
  const socket = useRef();
  const dispatch = useDispatch();
  const messageContainerRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiSelect = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji.native);
    setShowEmojiPicker(false);
  };


  useEffect(() => {
    if (user) {
      socket.current = io("http://localhost:1445", {
        withCredentials: true,
        autoConnect: false
      });
      socket.current.connect();
      socket.current.emit("add-user", user._id);
    }
    return () => {
      // Clean up the socket connection when the component unmounts
      socket.current.disconnect();
    };
  }, [user]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-receive", (msg) => {
        setArrivalMessage({ fromSelf: false, messageText: msg });
      });
    }
  }, []);
  // Function to scroll to the bottom of the message container
  const scrollToBottom = () => {
    if (messageContainerRef && messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  const {
    message: msgFetch,
    data: chatData,
    loading,
    status,
  } = useFetch(
    `http://localhost:1445/api/v1/chats/${user._id}/${receiver._id}/`
  );

  useEffect(() => {
    if (status === "success") {
      setMessages(chatData.messages);
    }
  }, [status, chatData]);

  useEffect(() => {
    // Scroll to bottom when component mounts or messages are updated
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return (
      <CircularProgress
        color="secondary"
        sx={{ position: "absolute", top: "50%", zIndex: 50 }}
      />
    );
  }

  if (status !== "success") {
    return <ErrorPage errorMessage={msgFetch}></ErrorPage>;
  }

  const toggleChatBar = () => {
    dispatch(setShowChat(false));
  };

  const sendMessage = async (msg) => {
    const {
      message: errMsg,
      data,
      status,
    } = await fetchWrapper(
      `/chats`,
      "POST",
      JSON.stringify({
        sender: user._id,
        receiver: receiver._id,
        messageText: message,
      }),
      { "Content-Type": "application/json" }
    );

    if (status !== "success") {
      dispatch(
        setAlertInfo({
          severity: "error",
          message: errMsg,
        })
      );
      dispatch(setShowAlert(true));
      setTimeout(() => {
        dispatch(setShowAlert(false));
      }, 5000);
    }
    socket.current.emit("send-msg", {
      to: receiver._id,
      from: user._id,
      msg: message,
    });

    const newMessage = { fromSelf: true, messageText: message };
    setMessages([...messages, newMessage]);
    scrollToBottom();
    setMessage("");
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "25px",
        right: 20,
        zIndex: 50,
        width: "40%",
      }}
    >
      <Paper sx={{ padding: 2, backgroundColor: "#edededf0" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <Avatar alt={receiver.name} src={`/imgs/users/${receiver.photo}`} />
          <Typography>{receiver.name}</Typography>
        </Box>
        <Box
          ref={messageContainerRef}
          sx={{
            height: "300px",
            overflowY: "auto",
            marginTop: 1,
            flexDirection: "column",
            display: "flex",
            padding: "7px",
            backgroundImage:
              "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcZ3gbiJvHOCC-L_OMlu12Kjf6OFBgXXlIuo0GeJ4OodW0t7Z3jfMyTZ5pzDR0Ec8oidc&usqp=CAU)",
          }}
        >
          {messages.map((msg, index) => (
            <Typography
              key={index}
              variant="body1"
              sx={{
                width: "fit-content",
                marginBottom: 1,
                padding: 1,
                borderRadius: "4px",
                backgroundColor:
                  msg.fromSelf || msg.sender === user._id
                    ? "#c2c2c2"
                    : "#f3f3f3",
                alignSelf:
                  msg.fromSelf || msg.sender === user._id ? "end" : "start",
              }}
            >
              {msg.messageText}
            </Typography>
          ))}
        </Box>
        <Box sx={{ display: "flex", marginTop: 1, gap: 1 }}>
          <TextField
            label="Message"
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(event) => {
              if (event.key === "Enter") sendMessage();
            }}
            sx={{ flex: 1 }}
          />
          <IconButton
            variant="contained"
            onClick={sendMessage}
            color="secondary"
            sx={{ width: "50px" }}
          >
            <SendIcon />
          </IconButton>
          <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <SentimentSatisfiedAltIcon />
          </IconButton>
        </Box>
        {showEmojiPicker && (
          <EmojiPicker
            onEmojiClick={(emojiObject) => {
              const emoji = emojiObject.emoji;
              setMessage((prevMessage) => prevMessage + emoji);
            }}
          />
        )}
        <IconButton
          onClick={toggleChatBar}
          size="large"
          color="secondary"
          sx={{
            position: "absolute",
            right: "7px",
            top: "13px",
            display: "flex",
          }}
        >
          <DoubleArrowIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};
