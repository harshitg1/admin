"use client";
import  { useState, useEffect } from 'react';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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

  const handleDeleteSelected = () => {
    // Handle the deletion of selected rows here
    console.log('Deleting selected rows:', selected);
    // Add logic to delete rows from your API or state
    // After deletion, you may want to refetch data or update the state accordingly
    setSelected([]);
  };

  const handleEditRow = (id) => {
    // Handle the editing of a row here
    console.log('Editing row with ID:', id);
  };

  const renderCheckbox = (id) => (
    <Checkbox
      checked={isSelected(id, selected)}
      onChange={() => handleCheckboxChange(id)}
      color="primary"
    />
  );

  return (
    <div>
      <FormControlLabel
        control={<Checkbox checked={selectAll} onChange={handleSelectAllClick} color="primary" />}
        label="Select All"
      />
      <TextField
        label="Search"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <IconButton onClick={handleDeleteSelected} disabled={selected.length === 0}>
        <DeleteIcon />
      </IconButton>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{renderCheckbox('selectAll')}</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Action</TableCell>
              {/* Add more table headers based on your API response */}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .filter((row) => row.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id} selected={isSelected(row.id, selected)}>
                  <TableCell>{renderCheckbox(row.id)}</TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDeleteSelected(row.id)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditRow(row.id)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  {/* Add more table cells based on your API response */}
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
