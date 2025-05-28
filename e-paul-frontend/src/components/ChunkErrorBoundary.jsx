import React from 'react';
import { Alert, AlertIcon, AlertTitle, AlertDescription, Box, Button } from '@chakra-ui/react';

class ChunkErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null,
            errorInfo: null 
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ChunkErrorBoundary caught an error:', error, errorInfo);
        
        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // Check if it's a chunk loading error
        if (error.name === 'ChunkLoadError' || 
            error.message && error.message.includes('Loading chunk') ||
            error.message && error.message.includes('Loading CSS chunk')) {
            
            console.log('Chunk loading error detected, reloading page...');
            
            // Small delay before reload to show user feedback
            setTimeout(function() {
                window.location.reload();
            }, 1500);
        }
    }

    handleReload() {
        window.location.reload();
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box p={4} maxW="md" mx="auto" mt={8}>
                    <Alert status="error" flexDirection="column" alignItems="center" textAlign="center">
                        <AlertIcon boxSize="40px" mr={0} />
                        <AlertTitle mt={4} mb={1} fontSize="lg">
                            Ladefehler
                        </AlertTitle>
                        <AlertDescription maxWidth="sm" mb={4}>
                            Die Seite wird automatisch neu geladen...
                        </AlertDescription>
                        <Button colorScheme="red" size="sm" onClick={this.handleReload.bind(this)}>
                            Jetzt neu laden
                        </Button>
                    </Alert>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ChunkErrorBoundary;