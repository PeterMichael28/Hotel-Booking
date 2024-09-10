import './App.css';
import AppRouter from './routes/AppRouter';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppContextProvider } from './contexts/AppContext.tsx';

const queryClient = new QueryClient({
 defaultOptions: {
  queries: {
   retry: 0,
  },
 },
});

function App() {
 return (
  <QueryClientProvider client={queryClient}>
   <AppContextProvider>
    <AppRouter />;
   </AppContextProvider>
  </QueryClientProvider>
 );
}

export default App;
