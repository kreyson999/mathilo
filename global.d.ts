interface Window {
    exportWhiteboardCanvas?: () => string | null;
    saveWhiteboardCanvas?: () => Promise<void>;
  }