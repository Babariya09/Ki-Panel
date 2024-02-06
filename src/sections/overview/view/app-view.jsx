import { useState } from 'react';

import Card from '@mui/material/Card';
// import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
// import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashUSer } from 'src/_mock/dash';

// import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableEmptyRows from 'src/sections/user/table-empty-rows';

import DashTabelRow from './DashTabelRow';
import DashTabelHead from './DashTabelHead';
import AppWidgetSummary from '../app-widget-summary';
import { emptyRows, applyFilter, getComparator } from '../util';


// ----------------------------------------------------------------------

export default function AppView() {

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [rowsPerPage, setRowsPerPage] = useState(5);


  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = DashUSer.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
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


  const dataFiltered = applyFilter({
    inputData: DashUSer,
    comparator: getComparator(order, orderBy),
  });


  return (


    <Container>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back 👋
        </Typography>

        <Grid container spacing={3}>
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
              title="New Users"
              total={1352831}
              color="info"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
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
                rowCount={DashUSer.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'Date', label: 'Date' },
                  { id: 'Description', label: 'Description' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <DashTabelRow
                      key={row.id}
                      Date={row.Date.toString()}
                      Description={row.Description}
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => handleClick(event, row.name)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, DashUSer.length)}
                />
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={DashUSer.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}

