import {useEffect } from "react";
import socket from "./socket";

const useSocketSetup = () => {
  useEffect(() => {
    socket.connect();
    socket.on("connect_error", () => {
      console.log("connnect_error");
    });
    return () => {
      socket.off("connect_error");
    };
  }, []);
};

export default useSocketSetup;
