import { TableCell, styled } from "@mui/material";
import color from "../color";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  "&.MuiTableCell-head": {
    fontWeight: "bold",
    backgroundColor: color.primary,
    color: color.white,
  },
}));

export default StyledTableCell;