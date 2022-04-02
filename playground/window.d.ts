export {};
declare global {
  interface Window {
    initWithoutBridge?: () => void;
    initWithBridge?: () => void;
  }
}
