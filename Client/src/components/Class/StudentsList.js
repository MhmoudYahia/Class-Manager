import * as React from "react";
import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { DataGrid , GridToolbar} from "@mui/x-data-grid";
import { COLORS } from "../../utils/colors";
import { useFetch } from "../../utils/useFetch";
import { useDispatch } from "react-redux";
import { setReceiver, setShowChat } from "../../redux/chatSlice";


export const StudentsList = ({ students }) => {
  const dispatch = useDispatch();
  const rows = students.map((student) => ({
    ...student,
    id: student._id,
  }));

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
    dispatch(setReceiver(row));
    dispatch(setShowChat(true));
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
    
        
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          pageSizeOptions={[4]}
          checkboxSelection
          disableRowSelectionOnClick
          components={{
            Toolbar: GridToolbar,
          }}
        />
    
      </Box>
    </>
  );
};
