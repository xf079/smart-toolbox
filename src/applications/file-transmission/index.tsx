import { FileTransmissionProvider } from './context';
import { FileTransmissionContent } from './file-transmission';

export function FileTransmission() {
  return (
    <FileTransmissionProvider>
      <FileTransmissionContent />
    </FileTransmissionProvider>
  );
}
