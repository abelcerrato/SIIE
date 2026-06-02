import { CardContent, styled } from "@mui/material";

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(3),
  "&:last-child": {
    paddingBottom: theme.spacing(3),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
    "&:last-child": {
      paddingBottom: theme.spacing(2),
    },
  },
}));

export default StyledCardContent;