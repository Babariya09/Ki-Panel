import axios from 'axios';
import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { BASE_URL } from 'src/Base_Url/Baseurl';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';



// ----------------------------------------------------------------------
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function UserPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openModal, setModalOpen] = useState(false);

  const [apiData, setApiData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: '',
  });

  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    role: '',
  });



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}user/list`);
        console.log("Api", response.data.user);
        setApiData(response.data.user);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means the effect runs once after the initial render

  if (loading) {
    // You can add a loading indicator here if needed
    return <div>Loading...</div>;
  }

  if (error) {
    // Handle error display
    return <div>Error loading data from the API</div>;
  }

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = apiData.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, email) => {
    const selectedIndex = selected.indexOf(email);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, email);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  console.log("apiData", apiData);

  const dataFiltered = applyFilter({
    inputData: apiData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  console.log("dataFiltered=>", dataFiltered);

  const notFound = !dataFiltered.length && !!filterName;

  // ------ New User Create Modal Open ------

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setValidationErrors({
      name: '',
      email: '',
      role: '',
    });
  };

  // ------- ADD USER API CALLING --------- //
  const handleAddUser = async () => {
    try {
      const errs = {};

      if (!newUserData.name) {
        errs.name = 'Name is required.';
      }

      if (!newUserData.email) {
        errs.email = 'Email is required.';
      } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(newUserData.email)) {
          errs.email = 'Invalid email address.';
        }
      }

      if (!newUserData.role) {
        errs.role = 'Role is required.';
      }

      setValidationErrors(errs);

      if (Object.values(errs).some(err => err)) {
        console.error('Validation failed.');
        return;
      }

      const userData = { ...newUserData };

      const response = await axios.post(`${BASE_URL}user/register`, userData);

      console.log('User added successfully:', response.data);

      toast.success('User registered successfully!', {
        position: "top-right",
        autoClose: 3000, // Close the toast after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      handleClose();
    } catch (err) {
      console.error('Error adding user:', err);
    }
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Users</Typography>

        <Button variant="contained" onClick={handleOpen} color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          New User
        </Button>


        {/* ------ Modal Box For New User Create Start ------ */}

        <Modal
          open={openModal}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ ...style, width: 500 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" style={{ marginBottom: "12px" }}>
              <Typography variant="h4">Add Users</Typography>
            </Stack>
            <Grid container spacing={3}>
              <Grid xs={12} sm={6} md={3} style={{ width: "100%" }}>
                <TextField
                  id="outlined-required"
                  label="Name"
                  style={{ width: "100%" }}
                  value={newUserData.name}
                  onChange={(e) => {
                    setNewUserData({ ...newUserData, name: e.target.value });
                    setValidationErrors({ ...validationErrors, name: '' }); // Clear error when typing
                  }}
                  error={Boolean(validationErrors.name)}
                  helperText={validationErrors.name}
                />
              </Grid>

              <Grid xs={12} sm={6} md={3} style={{ width: "100%" }}>
                <TextField
                  required
                  id="outlined-required"
                  label="Email"
                  style={{ width: "100%" }}
                  value={newUserData.email}
                  onChange={(e) => {
                    setNewUserData({ ...newUserData, email: e.target.value });
                    setValidationErrors({ ...validationErrors, email: '' }); // Clear error when typing
                  }}
                  error={Boolean(validationErrors.email)}
                  helperText={validationErrors.email}
                />
              </Grid>

              <Grid xs={12} sm={6} md={3} style={{ width: "100%" }}>
                <TextField
                  id="outlined-required"
                  label="Role"
                  style={{ width: "100%" }}
                  value={newUserData.role}
                  onChange={(e) => {
                    setNewUserData({ ...newUserData, role: e.target.value });
                    setValidationErrors({ ...validationErrors, role: '' }); // Clear error when typing
                  }}
                  error={Boolean(validationErrors.role)}
                  helperText={validationErrors.role}
                />
              </Grid>
            </Grid>
            <Button variant="contained" onClick={handleAddUser} style={{ marginTop: "12px", marginRight: "12px" }}>
              <Iconify icon="ic:baseline-plus" />
              Add User
            </Button>
            <Button variant="outlined" onClick={handleClose} style={{ marginTop: "12px" }}>Close</Button>
          </Box>
        </Modal>

        {/* ------ Modal Box For New User Create End ------ */}


      </Stack>
        {/* --------- Tostar Container Start ----------- */}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        {/* --------- Tostar Container End ----------- */}

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={apiData.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'role', label: 'Role' },
                  { id: 'email', label: 'Email' },
                  {
                    id: 'action', label: 'Action', style: {
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center' // Optional if you want to center vertically
                      /* Add other custom styles here */
                    }
                  },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      name={row.name}
                      role={row.role}
                      email={row.email}
                      avatarUrl={row.avatarUrl}
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => handleClick(event, row.name)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, apiData.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={apiData.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}