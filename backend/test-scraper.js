import { getSubtitles } from 'youtube-captions-scraper';

getSubtitles({
  videoID: 'MKEgjHqq4sE',
  lang: 'hi'
}).then(captions => {
  console.log(captions.slice(0, 5));
}).catch(err => {
  console.error("Error:", err.message || err);
});
