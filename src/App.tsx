import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ChartSecond from './components/ChartSecond/ChartSecond';

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ChartSecond />
    </QueryClientProvider>
  );
}

export default App;
