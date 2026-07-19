import { Track } from "../../generated/prisma";

export const TRACKS: { id: Track; label: string; description: string }[] = [
  {
    id: Track.SPEECH_AUDIO_AI,
    label: "Speech, Audio & AI",
    description: "Voice interfaces, audio processing, and language models.",
  },
  {
    id: Track.COMPUTER_VISION,
    label: "Computer Vision",
    description: "Image and video understanding, object detection, and more.",
  },
  {
    id: Track.BIOMEDICAL_SIGNALS,
    label: "Biomedical Signals",
    description: "EEG, ECG, and other signals from the human body.",
  },
  {
    id: Track.AI_ML,
    label: "AI & ML",
    description: "General machine learning models and applications.",
  },
  {
    id: Track.WIRELESS_IOT,
    label: "Wireless & IoT",
    description: "Connected devices, sensors, and wireless protocols.",
  },
  {
    id: Track.SUSTAINABLE_TECH,
    label: "Sustainable Tech",
    description: "Hardware and software for a greener future.",
  },
];

export const TRACK_LABELS = Object.fromEntries(
  TRACKS.map((track) => [track.id, track.label]),
) as Record<Track, string>;
