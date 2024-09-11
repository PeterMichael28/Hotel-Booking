import './App.css';
import AppRouter from './routes/AppRouter';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppContextProvider } from './contexts/AppContext.tsx';
import { SearchContextProvider } from './contexts/SearchContext.tsx';

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
    <SearchContextProvider>
     <AppRouter />;
    </SearchContextProvider>
   </AppContextProvider>
  </QueryClientProvider>
 );
}

export default App;
