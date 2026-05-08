import { ThemeProvider } from './layout/theme-toggle';
import Landing from './components/Landing';

export default function App() {
  return (
    <ThemeProvider>
      <Landing />
    </ThemeProvider>
  );
}