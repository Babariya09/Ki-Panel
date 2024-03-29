import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';




export default function DashTabelRow({
    Date,
    Time,
    Description
}) {

    return (
        <TableRow hover>
            <TableCell component="th" scope="row" padding="none" style={{ padding: "20px" }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography variant="subtitle2" noWrap>
                        {Date}
                    </Typography>
                </Stack>
            </TableCell>
            <TableCell>{Time}</TableCell>
            <TableCell>{Description}</TableCell>
        </TableRow>
    );
}

DashTabelRow.propTypes = {
    Date: PropTypes.any,
    Time: PropTypes.any,
    Description: PropTypes.any,
};
