import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Chart from './components/Chart/Chart';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold mb-6">업비트 시세 캔들</h1>
        <Chart />
      </div>
    </QueryClientProvider>
  );
}

export default App;
