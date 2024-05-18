import { Box, Divider, Stack, Typography } from "@mui/material";

interface WidgetProps {
  icon: React.JSX.Element;
  title: string;
  value: number;
}

const Widget: React.FC<WidgetProps> = ({ icon, title, value }) => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "350px",
        display: "inline-block",
        height: "200px",
        backgroundColor: "primary.light",
        padding: "15px",
        borderRadius: "5px",
        border: `solid 2px`,
        borderColor: "divider",
      }}
    >
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        gap={1}
        mb={1.5}
      >
        {icon}
        <Typography component="h4" variant="h3" sx={{ color: "common.white" }}>
          {title}
        </Typography>
      </Stack>

      <Divider />

      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        gap={1}
      >
        <Typography
          component="h4"
          variant="h1"
          sx={{
            margin: "30px 0 30px 0",
            color: "common.white",
            textAlign: "center",
          }}
        >
          {value}
        </Typography>
      </Stack>
    </Box>
  );
};

export default Widget;
