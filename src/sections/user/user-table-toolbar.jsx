import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogActions from '@mui/material/DialogActions';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableToolbar({ numSelected, filterName, onFilterName }) {
   // ------ Delete Modal Open -------

   const [Deleteopen, setDeleteOpen] = useState(false);

   const DeleteHandleOpen = () => {
     setDeleteOpen(true);
   };
 
   const DeleteHandleClose = () => {
     setDeleteOpen(false);
   };
 
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <OutlinedInput
          value={filterName}
          onChange={onFilterName}
          placeholder="Search user..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={DeleteHandleOpen}>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
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
        </Tooltip>
        
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

UserTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};
