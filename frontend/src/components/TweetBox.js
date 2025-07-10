import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  Send as SendIcon,
  Twitter as TwitterIcon,
  Clear as ClearIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import config from '../config';

function TweetBox() {
  const [tweet, setTweet] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async () => {
    if (!tweet.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/submitTweet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tweet }),
      });
      if (!response.ok) throw new Error('Failed to submit tweet');
      setTweet('');
      setSnackbar({ open: true, message: 'Tweet submitted successfully! AI is analyzing...', severity: 'success' });
      // Trigger refresh of events
      window.dispatchEvent(new Event('refreshEvents'));
    } catch (error) {
      setSnackbar({ open: true, message: 'Error submitting tweet. Please try again.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setTweet('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const characterCount = tweet.length;
  const maxCharacters = 280;
  const isOverLimit = characterCount > maxCharacters;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 1
      }}>
        <TwitterIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Submit Event Tweet
        </Typography>
        <Chip
          label="AI Analysis"
          size="small"
          color="primary"
          variant="outlined"
          icon={<InfoIcon />}
        />
      </Box>

      {/* Input Area */}
      <Box sx={{ position: 'relative' }}>
        <TextField
          fullWidth
          multiline
          rows={2}
          placeholder="Enter a tweet about an event (e.g., 'Major traffic accident on Highway 101 near downtown causing delays')"
          variant="outlined"
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {tweet && (
                  <Tooltip title="Clear">
                    <IconButton
                      size="small"
                      onClick={handleClear}
                      disabled={loading}
                    >
                      <ClearIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            ),
          }}
        />

        {/* Character Counter */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 0.5,
          px: 1
        }}>
          <Typography variant="caption" color="text.secondary">
            Press Enter to submit, Shift+Enter for new line
          </Typography>
          <Typography
            variant="caption"
            color={isOverLimit ? 'error' : 'text.secondary'}
          >
            {characterCount}/{maxCharacters}
          </Typography>
        </Box>

        {/* Progress Bar */}
        {characterCount > 0 && (
          <LinearProgress
            variant="determinate"
            value={(characterCount / maxCharacters) * 100}
            color={isOverLimit ? 'error' : 'primary'}
            sx={{ mt: 0.5, height: 2, borderRadius: 1 }}
          />
        )}
      </Box>

      {/* Submit Button */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        mt: 1,
        gap: 1
      }}>
        <Button
          variant="outlined"
          onClick={handleClear}
          disabled={loading || !tweet}
          sx={{ textTransform: 'none' }}
        >
          Clear
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !tweet.trim() || isOverLimit}
          startIcon={<SendIcon />}
          sx={{
            textTransform: 'none',
            px: 3,
            py: 1
          }}
        >
          {loading ? 'Analyzing...' : 'Submit Tweet'}
        </Button>
      </Box>

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ mt: 1 }}>
          <LinearProgress />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            AI is analyzing your tweet and extracting event information...
          </Typography>
        </Box>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default TweetBox;
