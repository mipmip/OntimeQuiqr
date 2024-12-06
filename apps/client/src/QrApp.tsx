import { BrowserRouter } from 'react-router-dom';
//import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ontimeQueryClient } from './common/queryClient';
import { connectSocket } from './common/utils/socket';
//import theme from './theme/theme';
import QrAppRouter from './QrAppRouter';
import { baseURI } from './externals';

connectSocket();

function QrApp() {
  return (
    <QueryClientProvider client={ontimeQueryClient}>
      <BrowserRouter basename={baseURI}>
        <div className='App'>
          <QrAppRouter />
          <ReactQueryDevtools initialIsOpen={false} />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default QrApp;
