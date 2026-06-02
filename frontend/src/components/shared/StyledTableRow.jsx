import { TableRow, styled, alpha } from "@mui/material";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: alpha(theme.palette.action.hover, 0.3),
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.action.hover, 0.5),
  },
}));

export default StyledTableRow;