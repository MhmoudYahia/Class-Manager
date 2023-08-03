import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { COLORS } from "../../utils/colors";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { fetchWrapper } from "../../utils/fetchWrapper";
import { useDispatch } from "react-redux";
import { setAlertInfo, setShowAlert } from "../../redux/alertSlice";
import { Tooltip } from "@mui/material";

export const MaterialsSection = ({ role, materials: m, classId }) => {
  const [materials, setMaterials] = useState(m);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [newMaterial, setNewMaterial] = useState({
    description: "",
    link: "",
  });

  const handleAddDialogOpen = () => {
    setAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handleEditDialogOpen = (material) => {
    setSelectedMaterial(material);
    setNewMaterial(material);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleDeleteDialogOpen = (material) => {
    setSelectedMaterial(material);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const dispatch = useDispatch();
  const handleAddMaterial = async () => {
    // handle backend
    const { message, data, status } = await fetchWrapper(
      `/classes/${classId}/addMaterial`,
      "POST",
      JSON.stringify(newMaterial),
      { "Content-Type": "application/json" }
    );

    if (status === "success") {
      dispatch(
        setAlertInfo({
          severity: "success",
          message: "Material added successfully 🫡",
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

    // handle frontend
    if (status === "success") {
      setMaterials([...materials, newMaterial]);
      setNewMaterial({
        description: "",
        link: "",
      });
      handleAddDialogClose();
    }
  };

  const handleEditMaterial = async () => {
    //handle edit material backend
    const { message, data, status } = await fetchWrapper(
      `/classes/${classId}/editMaterial/${selectedMaterial._id}`,
      "PATCH",
      JSON.stringify(newMaterial),
      { "Content-Type": "application/json" }
    );

    if (status === "success") {
      dispatch(
        setAlertInfo({
          severity: "success",
          message: "Material Updated successfully 🫡",
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

    //handel frontend
    if (status === "success") {
      const updatedMaterials = materials.map((material) =>
        material._id === selectedMaterial._id ? newMaterial : material
      );
      setMaterials(updatedMaterials);
      setSelectedMaterial(null);
      setNewMaterial({
        description: "",
        link: "",
      });
      handleEditDialogClose();
    }
  };

  const handleDeleteMaterial = async () => {
    //handle edit material backend
    const { message, data, status } = await fetchWrapper(
      `/classes/${classId}/deleteMaterial/${selectedMaterial._id}`,
      "DELETE"
    );

    if (status === "success") {
      dispatch(
        setAlertInfo({
          severity: "success",
          message: "Material Deleted successfully 🫡",
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
      const updatedMaterials = materials.filter(
        (material) => material._id !== selectedMaterial._id
      );
      setMaterials(updatedMaterials);
      setSelectedMaterial(null);
      handleDeleteDialogClose();
    }
  };

  const handleNewMaterialChange = (event) => {
    const { name, value } = event.target;
    setNewMaterial((prevMaterial) => ({
      ...prevMaterial,
      [name]: value,
    }));
  };
  return (
    <div>
      <Typography
        gutterBottom
        variant="h5"
        component="div"
        style={{
          marginTop: 50,
          fontWeight: 700,
          marginBottom: 30,
          textTransform: "uppercase",
          textDecoration: "underline",
          color: COLORS.mainColor,
        }}
      >
        Class Materials
      </Typography>
      <Container sx={{ margin: "auto" }}>
        {role === "Teacher" && (
          <Button
            variant="contained"
            sx={{
              cursor: "pointer",
              marginBottom: "10px",
              border: "2px solid #8a2be2",
              // padding: "14px",
              // borderRadius: "11px",
            }}
            onClick={handleAddDialogOpen}
          >
            Add New Material
          </Button>
        )}
        {materials.map((material) => (
          <Card
            sx={{
              display: "flex",
              margin: "10px",
              minHeight: "70px",
              border: "2px solid #8a2be2",
              padding: "14px",
              backgroundColor: "#c1e2ffd4",
              borderRadius: "11px",
            }}
          >
            <Tooltip title="Open Material">
              <CardActionArea href={material.link} target="_blank">
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {material.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Tooltip>
            {role === "Teacher" && (
              <CardActions>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleEditDialogOpen(material)}
                  style={{ color: COLORS.primary }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  onClick={() => handleDeleteDialogOpen(material)}
                  style={{ color: COLORS.error }}
                >
                  Delete
                </Button>
              </CardActions>
            )}
          </Card>
        ))}
      </Container>
      {/* Add Material Dialog */}
      <Dialog open={addDialogOpen} onClose={handleAddDialogClose}>
        <DialogTitle className="dialog-title">Add New Material</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={newMaterial.description}
            onChange={handleNewMaterialChange}
          />
          <TextField
            margin="dense"
            name="link"
            label="Link"
            type="text"
            fullWidth
            value={newMaterial.link}
            onChange={handleNewMaterialChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button
            onClick={handleAddMaterial}
            disabled={!newMaterial.description || !newMaterial.link}
            color="success"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Material Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle className="dialog-title">Edit Material</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={newMaterial.description}
            onChange={handleNewMaterialChange}
          />
          <TextField
            margin="dense"
            name="link"
            label="Link"
            type="text"
            fullWidth
            value={newMaterial.link}
            onChange={handleNewMaterialChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button
            onClick={handleEditMaterial}
            disabled={!newMaterial.description || !newMaterial.link}
            color="success"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Material Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle className="dialog-title">Delete Material</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the material "
            {selectedMaterial?.description}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteMaterial} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
