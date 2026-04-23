export const cleanSongTitle = (url) => {
  if (!url) return "";
  const decoded = decodeURIComponent(url.split('/').pop());
  return decoded.replace(/\.mp3$/i, "");
};