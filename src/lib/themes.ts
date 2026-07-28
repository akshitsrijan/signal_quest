export type Theme =
  | "SPEECH_AUDIO_AI"
  | "COMPUTER_VISION"
  | "BIOMEDICAL_SIGNALS"
  | "AI_ML"
  | "WIRELESS_IOT"
  | "SUSTAINABLE_TECH"
  | "OPEN_INNOVATION"
  | "EMBEDDED_SYSTEMS";

export const THEMES: { id: Theme; label: string; description: string }[] = [
  {
    id: "SPEECH_AUDIO_AI",
    label: "Speech, Audio & AI",
    description: "Voice interfaces, audio processing, and language models.",
  },
  {
    id: "COMPUTER_VISION",
    label: "Computer Vision",
    description: "Image and video understanding, object detection, and more.",
  },
  {
    id: "BIOMEDICAL_SIGNALS",
    label: "Biomedical Signals",
    description: "EEG, ECG, and other signals from the human body.",
  },
  {
    id: "AI_ML",
    label: "AI & ML",
    description: "General machine learning models and applications.",
  },
  {
    id: "WIRELESS_IOT",
    label: "Wireless & IoT",
    description: "Connected devices, sensors, and wireless protocols.",
  },
  {
    id: "SUSTAINABLE_TECH",
    label: "Sustainable Tech",
    description: "Hardware and software for a greener future.",
  },
  {
    id: "OPEN_INNOVATION",
    label: "Open Innovation",
    description: "Anything goes — bring an idea that doesn't fit a box.",
  },
  {
    id: "EMBEDDED_SYSTEMS",
    label: "Embedded Systems",
    description: "Firmware, microcontrollers, and hardware-software co-design.",
  },
];

export const THEME_LABELS = Object.fromEntries(
  THEMES.map((theme) => [theme.id, theme.label]),
) as Record<Theme, string>;
