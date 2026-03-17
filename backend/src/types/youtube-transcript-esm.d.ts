declare module 'youtube-transcript/dist/youtube-transcript.esm.js' {
  export const YoutubeTranscript: {
    fetchTranscript: (
      videoId: string,
      config?: unknown
    ) => Promise<Array<{ text: string; offset: number; duration: number }>>;
  };
}

