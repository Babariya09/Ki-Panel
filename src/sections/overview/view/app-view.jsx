import axios from 'axios';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
// import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { BASE_URL } from 'src/Base_Url/Baseurl';

// import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableEmptyRows from 'src/sections/user/table-empty-rows';

// import { useRouter } from 'src/routes/hooks';

import DashTabelRow from './DashTabelRow';
import DashTabelHead from './DashTabelHead';
import AppWidgetSummary from '../app-widget-summary';
import { emptyRows, applyFilter, getComparator } from '../util';


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
export default function AppView() {

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [apiData, setApiData] = useState([]);

  const [taskData, setTaskData] = useState([]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  // -------------- GET USER BY TOKEN ----------------- //

  useEffect(() => {
    if (token) {
      const apiUrl = `${BASE_URL}user/profile/${token}`;

      axios.get(apiUrl)
        .then(response => {
          console.log('API Response:', response.data);

          const { createdAt, updatedAt, ...otherData } = response.data.data;

          const createdDate = new Date(createdAt);
          const updatedDate = new Date(updatedAt);

          const formattedCreatedDate = createdDate.toISOString().split('T')[0];
          const formattedUpdatedDate = updatedDate.toISOString().split('T')[0];

          setApiData([{ ...otherData, createdAt: formattedCreatedDate, updatedAt: formattedUpdatedDate }]);
        })
        .catch(error => {
          console.error('API Error:', error);
        });
    }
  }, [token]);

  // ------------------ GET USER TASK LIST BY TOKEN ------------------- //

  useEffect(() => {
    const taskApiUrl = `${BASE_URL}task/listOne/${token}`;
    axios.get(taskApiUrl)
      .then(response => {
        console.log('Task API Response:', response.data.task);

        const formattedTaskData = response.data.task.map(taskItem => {
          const { createdAt, updatedAt, ...otherData } = taskItem;

          const updatedAtDate = new Date(updatedAt);
          const updatedAtTime = updatedAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          console.log(updatedAtTime);

          const formattedCreatedDate = createdAt ? createdAt.split('T')[0] : null;
          const formattedUpdatedDate = updatedAt ? updatedAt.split('T')[0] : null;

          return { ...otherData, createdAt: formattedCreatedDate, updatedAt: formattedUpdatedDate, Time: updatedAtTime };
        });

        setTaskData(formattedTaskData);

      })
      .catch(error => {
        console.error('Task API Error:', error);
      });
  }, [token]);

  const renderTaskDescription = (description) => {
    const tasks = description.split(',').map((task, index) => (
      <li key={index} style={{ listStylePosition: "inside" }}>{task.trim()}</li>
    ));

    return <ul style={{ padding: "0" }}>{tasks}</ul>;
  };



  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };


  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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


  // const dataFiltered = applyFilter({
  //   inputData: taskData,
  //   comparator: getComparator(order, orderBy),
  // });

  // ------ Edit Modal Open ------

  const [openModal, setModalOpen] = useState(false);
  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  return (


    <Container>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back 👋
        </Typography>

        <Grid container spacing={3}>

          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="View User"
              // total={1352831}
              color="info"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
              onClick={handleOpen}
              style={{ cursor: 'pointer', alignItems: "center" }}
            />
          </Grid>

          {/* ------ Modal Box For View User Email or Password ------ */}

          <Modal
            open={openModal}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
          >
            <Box sx={{ ...style, width: 500 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" style={{ marginBottom: "12px" }}>
                <Typography variant="h4">User Detail</Typography>
              </Stack>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3} style={{ width: "100%" }}>
                  {apiData[0] && <p>Name: <span style={{ color: "red" }}>{apiData[0].name}</span></p>}
                </Grid>

                <Grid item xs={12} sm={6} md={3} style={{ width: "100%" }}>
                  {apiData[0] && <p>Email: <span style={{ color: "red" }}>{apiData[0].email}</span></p>}
                </Grid>

                <Grid item xs={12} sm={6} md={3} style={{ width: "100%" }}>
                  {apiData[0] && <p>Password: <span style={{ color: "red" }}>{apiData[0].password}</span></p>}
                </Grid>
              </Grid>
              <Button variant="outlined" onClick={handleClose} style={{ marginTop: "12px" }}>Close</Button>
            </Box>
          </Modal>

          {/* ------ Modal Box For View User Email or Password ------ */}


          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Weekly Sales"
              total={714000}
              color="success"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Item Orders"
              total={1723315}
              color="warning"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Bug Reports"
              total={234}
              color="error"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
            />
          </Grid>

        </Grid>

      </Container>

      <Card style={{ marginTop: "20px" }}>


        <Scrollbar >
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <DashTabelHead
                order={order}
                orderBy={orderBy}
                rowCount={taskData.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'Date', label: 'Date' },
                  { id: 'Time', label: 'Time' },
                  { id: 'Description', label: 'Description' },
                ]}
              />
              <TableBody>
                {taskData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <DashTabelRow
                      key={row._id}
                      Date={row.createdAt.toString()}
                      Time={row.Time}
                      Description={renderTaskDescription(row.description)}
                      handleClick={(event) => handleClick(event, row._id)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, taskData.length)}
                />
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={taskData.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}

