import { useEffect, useRef, useState, useCallback } from 'react';
import { Centrifuge } from 'centrifuge';
import { axiosCallerWithToken } from '@/lib/helpers';

interface UploadProgress {
  percentage: number;
  status: 'preparing' | 'uploading' | 'processing' | 'completed' | 'error';
  message?: string;
  error_message?: string | null;
  current_row?: number;
  total_rows?: number;
}

interface DatasetProcessedData {
  dataset_id: string;
  dataset_reference: string;
  total_rows: number;
  rows_cleaned?: number;
  rows_rejected?: number;
  fields_detected?: number;
  status: string;
  type: string;
  error_summary?: Array<{
    error_message: string;
    count: number;
    rows: number[];
  }>;
  [key: string]: any;
}

interface UseCentrifugoProps {
  url: string;
  onProgress?: (progress: UploadProgress) => void;
  onDatasetProcessed?: (data: DatasetProcessedData) => void;
}

// Token management functions  
const getConnectionToken = async () => {
  try {
    // Make request directly to the proxy path
    const response = await axiosCallerWithToken.get('/modules/websockets/token');
    const token = response.data.data?.token;
    return token;
  } catch (error) {
    console.error('[Centrifugo] Error getting connection token:', error);
    throw error;
  }
};

const getSubscriptionToken = async (channel: string) => {
  try {
    // Make request directly to the proxy path
    const response = await axiosCallerWithToken.post('/modules/websockets/channels/token', {
      channel: channel,
    });
    const token = response.data.data.token;
    return token;
  } catch (error) {
    console.error(`[Centrifugo] Error getting subscription token for ${channel}:`, error);
    throw error;
  }
};

export const useCentrifugo = ({ url, onProgress, onDatasetProcessed }: UseCentrifugoProps) => {
  const centrifugeRef = useRef<Centrifuge | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    if (centrifugeRef.current) {
      return; // Already connected
    }

    try {
      // Create Centrifuge instance with token authentication
      const centrifuge = new Centrifuge(url, {
        getToken: getConnectionToken,
        debug: false, // Disable debug logs
      });

      // Set up event listeners
      centrifuge.on('connected', () => {
        setIsConnected(true);
        setError(null);
      });

      centrifuge.on('connecting', () => {
        setError(null);
      });

      centrifuge.on('disconnected', () => {
        setIsConnected(false);
      });

      centrifuge.on('error', (ctx) => {
        console.error('[Centrifugo] Connection error:', ctx.error?.message);
        setError(ctx.error?.message || 'Connection error');
        setIsConnected(false);
      });

      // Connect to Centrifugo
      centrifuge.connect();
      centrifugeRef.current = centrifuge;
      
    } catch (err) {
      console.error('[Centrifugo] Failed to initialize:', err);
      setError(`Failed to initialize connection: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [url]);

  const subscribeToChannel = useCallback((channel: string) => {
    if (!centrifugeRef.current) {
      console.warn('[Centrifugo] Client not initialized, cannot subscribe to channel:', channel);
      return null;
    }

    try {
      // Check if subscription already exists
      const existingSubscription = centrifugeRef.current.getSubscription(channel);
      if (existingSubscription) {
        return existingSubscription;
      }
      
      // Create subscription with token authentication
      const sub = centrifugeRef.current.newSubscription(channel, {
        getToken: () => getSubscriptionToken(channel),
      });

      // Set up subscription event listeners
      sub.on('publication', (ctx) => {
        if (ctx.data) {
          // Check if this is a dataset processing completion event
          if (ctx.data.type === 'cleanup_completed' && ctx.data.status === 'completed') {
            if (onDatasetProcessed) {
              onDatasetProcessed(ctx.data as DatasetProcessedData);
            }
          }
          // Handle progress updates during cleanup
          else if (ctx.data.type === 'cleanup_progress' && onProgress) {
            const progressData: UploadProgress = {
              percentage: ctx.data.progress_percentage || 0,
              status: ctx.data.status === 'processing' ? 'processing' : 'uploading',
              message: ctx.data.error_message 
                ? `Error on row ${ctx.data.current_row}: ${ctx.data.error_message}` 
                : `Processing row ${ctx.data.current_row} of ${ctx.data.total_rows}`,
              error_message: ctx.data.error_message,
              current_row: ctx.data.current_row,
              total_rows: ctx.data.total_rows
            };
            onProgress(progressData);
          }
          // Handle other progress updates (if any)
          else if (onProgress && ctx.data.percentage) {
            const progressData: UploadProgress = {
              percentage: ctx.data.percentage || 0,
              status: ctx.data.status || 'uploading',
              message: ctx.data.message
            };
            onProgress(progressData);
          }
        }
      });

      sub.on('error', (ctx) => {
        console.error(`[Centrifugo] Subscription error for ${channel}:`, ctx.error?.message);
        setError(`Subscription error for ${channel}: ${ctx.error?.message || 'Unknown error'}`);
      });

      // Subscribe to the channel
      sub.subscribe();
      return sub;
    } catch (err) {
      console.error(`[Centrifugo] Failed to subscribe to channel ${channel}:`, err);
      setError(`Failed to subscribe to ${channel}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return null;
    }
  }, [onProgress, onDatasetProcessed]);

  const disconnect = useCallback(() => {
    if (centrifugeRef.current) {
      try {
        centrifugeRef.current.disconnect();
        centrifugeRef.current = null;
      } catch (err) {
        console.error('[Centrifugo] Error during disconnect:', err);
      }
    }
    setIsConnected(false);
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    subscribeToChannel,
    isConnected,
    error
  };
};