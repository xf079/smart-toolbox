import { createContext, useState } from 'react';
import type { PageView } from './types';

export const FileTransmissionContext =
  createContext<FileTransmissionContextType>({
    pageView: 'default',
    setPageView: () => {},
  });

export interface FileTransmissionContextType {
  pageView: PageView;
  setPageView: (view: PageView) => void;
}

export const FileTransmissionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [pageView, setPageView] = useState<PageView>('default');

  return (
    <FileTransmissionContext value={{ pageView, setPageView }}>
      {children}
    </FileTransmissionContext>
  );
};
