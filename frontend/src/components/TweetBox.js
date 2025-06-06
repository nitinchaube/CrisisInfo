// import { Paper, TextField, Button, Box } from '@mui/material';
// import { useState } from 'react';

// function TweetBox() {
//   const [tweet, setTweet] = useState('')
//   const [loading, setLoading] = useState(false)
//   return (
//     <Paper sx={{ p: 2 }}>
//       <Box display="flex" gap={2}>
//         <TextField fullWidth label="Submit a Tweet" variant="outlined" />
//         <Button variant="contained">Submit</Button>
//       </Box>
//     </Paper>
//   );
// }

// export default TweetBox;
import React, { useState } from 'react';
import { Paper, TextField, Button, Box } from '@mui/material';

function TweetBox() {
  const [tweet, setTweet] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!tweet.trim()) return; // ignore empty submissions

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/submitTweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tweet }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit tweet');
      }

      console.log(response)
      setTweet('');
      alert('Tweet submitted successfully!');
    } catch (error) {
      console.error(error);
      alert('Error submitting tweet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box display="flex" gap={2}>
        <TextField
          fullWidth
          label="Submit a Tweet"
          variant="outlined"
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
          disabled={loading}
        />
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
    </Paper>
  );
}

export default TweetBox;
