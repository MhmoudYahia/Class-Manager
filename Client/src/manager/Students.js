import React from "react";
import { StudentsList } from "../components/Class/StudentsList";
import { Skeleton } from "@mui/material";
import { ErrorPage } from "../utils/ErrorPage";
import { useFetch } from "../utils/useFetch";

export const Students = ({}) => {
  const { message, data, loading, status } = useFetch(
    `http://localhost:1445/api/v1/students`
  );

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
      <StudentsList students={data.docs} role="Admin" />
    </>
  );
};
