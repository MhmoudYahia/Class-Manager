import * as React from "react";
import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { DataGrid } from "@mui/x-data-grid";
import { COLORS } from "../../utils/colors";
import { useFetch } from "../../utils/useFetch";

export const StudentsList = ({ students }) => {
  const rows = students.map((student) => ({
    ...student,
    id: student._id,
  }));

  const [nbRows, setNbRows] = React.useState(3);
  const removeRow = () => setNbRows((x) => Math.max(0, x - 1));
  const addRow = () => setNbRows((x) => Math.min(100, x + 1));
  const columns = [
    { field: "_id", headerName: "ID", width: 400 },
    { field: "name", headerName: "Name", width: 350 },
    { field: "email", headerName: "Email", width: 400 },
    {
      field: "chat",
      headerName: "Chat",
      width: 100,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleChat(params.row)}
        >
          Chat
        </Button>
      ),
    },
  ];

  function handleChat(row) {
    // Implement your chat functionality here, using the row data
    console.log("Chat with", row.name);
  }

  return (
    <>
      {" "}
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
        Students
      </Typography>
      <Box sx={{ width: "100%" }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Button size="small" onClick={removeRow}>
            Remove a row
          </Button>
          <Button size="small" onClick={addRow}>
            Add a row
          </Button>
        </Stack>

        <DataGrid
          rows={rows.slice(0, nbRows)}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 4,
              },
            },
          }}
          autoHeight
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
          filterMode="client"
        />
      </Box>
    </>
  );
};
