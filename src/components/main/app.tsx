import { FileTransmission } from '@/applications';
import { ThemeProvider } from '@/components/provider/theme-provider';

export function App() {
  return (
    <ThemeProvider>
      <div>
        <FileTransmission />
      </div>
    </ThemeProvider>
  );
}
