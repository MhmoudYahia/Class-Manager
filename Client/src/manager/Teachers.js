import React from "react";
import { TeachersList } from "../components/Class/TeachersList";
import { Skeleton } from "@mui/material";
import { ErrorPage } from "../utils/ErrorPage";
import { useFetch } from "../utils/useFetch";

export const Teachers = () => {
  const { message, data, loading, status } = useFetch(
    `/api/v1/teachers`
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
      <TeachersList teachers={data.docs} role="Admin" />
    </>
  );
};
