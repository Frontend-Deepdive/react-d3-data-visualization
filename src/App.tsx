import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CandleData from './components/CandleData';

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
    </QueryClientProvider>
  );
}

export default App;
