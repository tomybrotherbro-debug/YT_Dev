import { Request, Response } from 'express';

function extractVideoId(urlOrId: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  for (const pattern of patterns) {
    const match = urlOrId.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function getTranscript(req: Request, res: Response): Promise<void> {
  const { url } = req.body;

  if (!url) {
    res.status(400).json({ error: 'YouTube URL is required' });
    return;
  }

  const videoId = extractVideoId(url);
  if (!videoId) {
    res.status(400).json({ error: 'Invalid YouTube URL' });
    return;
  }

  try {
    const { YoutubeTranscript } = await import('youtube-transcript');
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    const transcript = transcriptItems.map((item: { text: string }) => item.text).join(' ');
    res.json({ transcript, videoId });
  } catch (error: any) {
    console.error('Transcript error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch transcript' });
  }
}

export async function summarize(req: Request, res: Response): Promise<void> {
  const { transcript, language = 'tanglish' } = req.body;

  if (!transcript) {
    res.status(400).json({ error: 'Transcript is required' });
    return;
  }

  // --- Try OpenAI API key first ---
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    try {
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey });

      const promptText = buildPrompt(transcript, language);
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: promptText }],
        max_tokens: 500,
      });

      const summary = completion.choices[0]?.message?.content || 'Could not generate summary';
      res.json({ summary, mode: 'openai' });
      return;
    } catch (error: any) {
      console.error('OpenAI error:', error.message);
    }
  }

  // --- Fall back: Return prompt to frontend for manual ChatGPT linking ---
  const prompt = buildPrompt(transcript, language);
  res.json({ prompt, mode: 'chatgpt-link' });
}

// ---- Helpers ----

function buildPrompt(transcript: string, language: string): string {
  const content = transcript.slice(0, 4000);

  if (language === 'tanglish') {
    return `You are a helpful assistant that summarizes YouTube video transcripts in Tanglish (a natural mix of Tamil and English, like how Tamil people speak in everyday conversation).

Summarize the following transcript in Tanglish. Use Tamil words naturally mixed with English (not a word-for-word translation). Keep it around 150-200 words. Use bullet points for key points.

Transcript:
${content}`;
  }

  return `Summarize the following YouTube transcript in ${language} in 150-200 words with key bullet points:

Transcript:
${content}`;
}
