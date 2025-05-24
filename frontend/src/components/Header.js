import { AppBar, Box, Toolbar, Typography } from '@mui/material';

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box
            component="img"
            sx={{ height: 40, mr: 2 }}
            alt="Event Graph Visualizer"
            src="/logo.png"
        />
        <Typography variant="h6">Event Graph Visualizer</Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
