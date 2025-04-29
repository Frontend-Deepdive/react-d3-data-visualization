import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import CandleData from './components/CandleData';

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <CandleData />
    </QueryClientProvider>
  );
}

export default App;
