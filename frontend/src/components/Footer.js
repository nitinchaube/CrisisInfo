import { AppBar, Box, Toolbar, Typography, Link } from '@mui/material';

function Header() {
  return (
    <Typography variant="body2">
          View on{' '}
          <Link
            href="https://github.com/your-username/event-graph-visualizer"
            target="_blank"
            color="inherit"
            underline="always"
          >
            GitHub
          </Link>
        </Typography>
  );
}

export default Header;