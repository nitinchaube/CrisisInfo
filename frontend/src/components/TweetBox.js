import { Paper, TextField, Button, Box } from '@mui/material';

function TweetBox() {
  return (
    <Paper sx={{ p: 2 }}>
      <Box display="flex" gap={2}>
        <TextField fullWidth label="Submit a Tweet" variant="outlined" />
        <Button variant="contained">Submit</Button>
      </Box>
    </Paper>
  );
}

export default TweetBox;
