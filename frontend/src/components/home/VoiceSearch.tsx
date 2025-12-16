import { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

const VoiceSearch = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if browser supports Web Speech API
    setIsSupported(
      "webkitSpeechRecognition" in window || "SpeechRecognition" in window
    );
  }, []);

  const startListening = () => {
    if (!isSupported) {
      console.warn("Speech recognition not supported in this browser");
      return;
    }

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log("Voice search:", transcript);
      // You can add navigation or search functionality here
      // For example: navigate to search results with the transcript
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    // The recognition will stop automatically when onend is called
  };

  return (
    <div className="w-full max-w-md mb-4 sm:mb-6">
      <div
        className={cn(
          "relative flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-full",
          "bg-[#FDEDDF] border border-[#FEB464]/30",
          "transition-all duration-300",
          isListening && "ring-2 ring-[#FEB464] ring-opacity-50"
        )}
      >
        {/* Orange rounded button on the left */}
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={!isSupported}
          className={cn(
            "flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full",
            "bg-[#FEB464] hover:bg-[#FEB464]/90",
            "flex items-center justify-center",
            "transition-all duration-300",
            "shadow-sm hover:shadow-md",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            isListening && "animate-pulse"
          )}
          aria-label={isListening ? "Stop listening" : "Start voice search"}
        >
          {isListening ? (
            <MicOff className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          ) : (
            <Mic className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          )}
        </button>

        {/* Voice Search text */}
        <span className="flex-1 text-sm sm:text-base font-sans font-medium text-[#8B4513]">
          Voice Search
        </span>
      </div>
    </div>
  );
};

export default VoiceSearch;

