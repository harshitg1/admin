"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Checkbox,
  FormControlLabel,
  IconButton,
  TablePagination,
} from "@mui/material";
import { RiDeleteBin7Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import axios from "axios";

const DataTable = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleCheckboxChange = (id) => {
    const newSelected = toggleSelection(id, selected);
    setSelected(newSelected);
  };

  const toggleSelection = (id, selectedArray) => {
    if (isSelected(id, selectedArray)) {
      return selectedArray.filter((selectedId) => selectedId !== id);
    } else {
      return [...selectedArray, id];
    }
  };

  const isSelected = (id, selectedArray) => selectedArray.indexOf(id) !== -1;

  const handleSelectAllClick = () => {
    setSelectAll(!selectAll);
    setSelected(selectAll ? [] : data.map((item) => item.id));
  };

  const handleEditRow = (id) => {
    // Handle the editing of a row here
    console.log("Editing row with ID:", id);
  };
  const handleDeleteSelected = () => {
    // Handle the deletion of selected rows here
    console.log("Deleting selected rows:", selected);
    // Add logic to delete rows from your API or state
    // After deletion, you may want to refetch data or update the state accordingly
    setSelected([]);
  };

  const renderCheckbox = (id) => (
    <Checkbox
      checked={isSelected(id, selected)}
      onChange={() => handleCheckboxChange(id)}
      color="primary"
    />
  );

  return (
    <div className="m-4 px-28 ">
      <div className="flex pb-10 justify-between ">
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="border p-4 bg-rose-400 rounded-lg ">
          <RiDeleteBin7Line
            className="text-white"
            onClick={handleDeleteSelected}
            disabled={selected.length === 0}
          ></RiDeleteBin7Line>
        </span>
      </div>

      <TableContainer  component={Paper}>
        <Table>
          <TableHead>
            <TableRow >
              <TableCell className=" pl-6" >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectAll}
                      onChange={handleSelectAllClick}
                      color="primary"
                    />
                  }
            
                />
              </TableCell>
              
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .filter((row) =>
                row.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id} selected={isSelected(row.id, selected)}>
                  <TableCell>{renderCheckbox(row.id)}</TableCell>
               
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>
                 
                    <span className="border  py-2.5 rounded-lg">
                      <IconButton onClick={() => handleEditRow(row.id)}>
                        <TbEdit />
                      </IconButton>
                    </span>
                    <span className="border py-2.5 mx-2  rounded-lg ">
                      <IconButton onClick={() => handleDeleteSelected(row.id)}>
                        <RiDeleteBin7Line />
                      </IconButton>
                    </span>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(+event.target.value);
          setPage(0);
        }}
      />
    </div>
  );
};

export default DataTable;
