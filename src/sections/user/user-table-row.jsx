import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import TableCell from '@mui/material/TableCell';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogActions from '@mui/material/DialogActions';

import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';



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

export default function UserTableRow({
  selected,
  name,
  avatarUrl,
  email,
  role,
  handleClick,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  // ------ Edit Modal Open ------

  const [openModal, setModalOpen] = useState(false);
  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setOpen(null);
  };

  // ------ Delete Modal Open -------

  const [Deleteopen, setDeleteOpen] = useState(false);

  const DeleteHandleOpen = () => {
    setDeleteOpen(true);
  };

  const DeleteHandleClose = () => {
    setDeleteOpen(false);
    setOpen(null);
  };

  // ------ View Modal Open ------

  const router = useRouter();

  const handleViewMenu = () => {
    router.push('Dashboard');
  }


  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{role}</TableCell>

        <TableCell>{email}</TableCell>


        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleOpen} sx={{ color: 'green' }}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        {/* ------ Modal Box For Edit Start ------ */}

        <Modal
          open={openModal}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ ...style, width: 500 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" style={{ marginBottom: "12px" }}>
              <Typography variant="h4">Edit Users</Typography>
            </Stack>
            <Grid container spacing={3}>
              <Grid xs={12} sm={6} md={3} style={{ width: "100%" }}>
                <TextField
                  id="outlined-required"
                  label="Name"
                  style={{ width: "100%" }}
                />
              </Grid>

              <Grid xs={12} sm={6} md={3} style={{ width: "100%" }}>
                <TextField
                  required
                  id="outlined-required"
                  label="Email"
                  style={{ width: "100%" }}
                />
              </Grid>

              <Grid xs={12} sm={6} md={3} style={{ width: "100%" }}>
                <TextField
                  required
                  id="outlined-required"
                  label="Password"
                  style={{ width: "100%" }}
                />
              </Grid>

              <Grid xs={12} sm={6} md={3} style={{ width: "100%" }}>
                <TextField
                  id="outlined-required"
                  label="Role"
                  style={{ width: "100%" }}
                />
              </Grid>
            </Grid>
            <Button variant="contained" href="#contained-buttons" style={{ marginTop: "12px", marginRight: "12px" }}>
            <Iconify icon="ph:pencil" />
              Submit
            </Button>
            <Button variant="outlined" onClick={handleClose} style={{ marginTop: "12px" }}>Close</Button>
          </Box>
        </Modal>

        {/* ------ Modal Box For Edit End ------ */}

        <MenuItem onClick={DeleteHandleOpen} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>

        {/* ------ Modal Box For Delete Start ------ */}

        <Dialog
          open={Deleteopen}
          onClose={DeleteHandleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Stack direction="row" alignItems="center" justifyContent="space-center" style={{ margin: "12px", width: "350px", justifyContent: "center" }}>
            <Typography variant="h4">Are You Sure!</Typography>
          </Stack>
          <DialogActions style={{ justifyContent: "center", marginBottom: "12px" }}>
            <Button variant="contained" href="#contained-buttons" onClick={DeleteHandleClose}>
              Agree
            </Button>
            <Button variant="outlined" onClick={DeleteHandleClose} >Disagree</Button>
          </DialogActions>
        </Dialog>

        {/* ------ Modal Box For Delete End ------ */}

        <MenuItem onClick={handleViewMenu} sx={{ color: 'black' }}>
          <Iconify icon="solar:eye-broken" sx={{ mr: 2 }} />
          View
        </MenuItem>




      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  handleClick: PropTypes.func,
  name: PropTypes.any,
  role: PropTypes.any,
  email: PropTypes.any,
  selected: PropTypes.any,
};
