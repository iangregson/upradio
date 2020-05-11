declare module '*.html' {
  const content: string;
  export default content;
}

interface Window {
  webkitAudioContext: typeof AudioContext
}
