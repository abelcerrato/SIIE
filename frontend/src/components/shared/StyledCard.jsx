import { Card, styled } from "@mui/material";


const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[6],
  },
}));

export default StyledCard;