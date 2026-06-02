import { Box, Skeleton } from "@mui/material";

const ChartSkeleton = ({ height = 250 }) => (
  <Box sx={{ width: "100%", height }}>
    <Skeleton
      variant="rectangular"
      width="100%"
      height={height - 40}
      sx={{ borderRadius: 2 }}
    />
    <Skeleton variant="text" width="60%" sx={{ mx: "auto", mt: 1 }} />
    <Skeleton variant="text" width="40%" sx={{ mx: "auto" }} />
  </Box>
);

export default ChartSkeleton;