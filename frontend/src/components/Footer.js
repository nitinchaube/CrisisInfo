import React from 'react';
import { 
  Box, 
  Typography, 
  Link, 
  Container,
  Divider
} from '@mui/material';
import { 
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon
} from '@mui/icons-material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        py: 3,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2
        }}>
          {/* Copyright */}
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ textAlign: { xs: 'center', md: 'left' } }}
          >
            © 2024 Event Intelligence Dashboard. All rights reserved.
          </Typography>

          {/* Links */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <Link 
              href="https://github.com/nitinchaube" 
              target="_blank"
              rel="noopener noreferrer"
              color="text.secondary" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' }
              }}
            >
              <GitHubIcon fontSize="small" />
              GitHub
            </Link>
            
            <Link 
              href="mailto:nitinchaube08@gmail.com" 
              color="text.secondary" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' }
              }}
            >
              <EmailIcon fontSize="small" />
              Contact
            </Link>
          </Box>

          {/* Version */}
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ textAlign: { xs: 'center', md: 'right' } }}
          >
            v1.0.0
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;