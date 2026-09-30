import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPath } from "../utils/paths";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Film,
  ArrowRight,
  Clock,
} from "lucide-react";

const STORIES_DATA = [
  {
    id: 1,
    videoSrc: "/videos/story-1.mp4",
    title: "Chapter I: The Artisanal Alchemy",
    subtitle: "From Petal to Precious Sillage",
    duration: "Story Reel",
    category: "Craftsmanship & Origin",
    description:
      "Witness the devotion, botanical precision, and exquisite craftsmanship behind each handcrafted bottle of Tiana Luxora. Every drop is blended with rare essential oils, slow-macerated to capture timeless presence.",
    highlights: [
      "Ethically Sourced Indian Botanicals",
      "Hand-Poured & Slow Maceration Process",
      "Artisanal Blends with 25%+ High Oil Sillage",
    ],
    accentNote: "Amber & Bulgarian Rose Accord",
  },
  {
    id: 2,
    videoSrc: "/videos/story-2.mp4",
    title: "Chapter II: Sillage of Pure Elegance",
    subtitle: "Luxury That Speaks Before You Do",
    duration: "Story Reel",
    category: "Signature Aesthetics",
    description:
      "A cinematic journey celebrating the woman who moves through life with poise, dignity, and unforgettable aura. Crafted to leave a lasting impression of sophisticated opulence wherever you step.",
    highlights: [
      "Long-Lasting 12+ Hour Olfactory Retention",
      "Cruelty-Free & Dermatologically Safe",
      "Handcrafted by Skilled Women Artisans",
    ],
    accentNote: "Royal Oud & Golden Saffron",
  },
];

const StoryPage = () => {
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);

  const activeStory = STORIES_DATA[activeStoryIdx];

  // Auto-play when active story changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [activeStoryIdx]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return "00:00";
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins < 10 ? "0" : ""}${mins}:${
      remainingSecs < 10 ? "0" : ""
    }${remainingSecs}`;
  };

  return (
    <div className="py-6 sm:py-10 animate-fade-in flex flex-col min-h-screen min-h-[100dvh]">
      <div className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 w-full">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-primary/60 mb-6 font-medium">
          <Link to={getPath("/")} className="hover:text-accent transition-colors">
            Home
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-primary font-bold">Brand Cinema & Stories</span>
        </nav>

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-primary tracking-tight mb-3">
            The Stories Behind Our Scents
          </h1>
          <p className="text-sm sm:text-base text-primary/70 font-light leading-relaxed">
            Immerse yourself in the visual artistry, craftsmanship, and soul of
            Tiana Luxora. Every film unveils the alchemy behind our signature creations.
          </p>
          <div className="w-20 h-0.5 bg-accent/40 mx-auto mt-5 rounded-full" />
        </div>

        {/* Main Featured Cinema Showcase */}
        <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-primary/10 shadow-[0_20px_60px_rgba(131,37,78,0.08)] overflow-hidden p-4 sm:p-7 md:p-9 mb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-center">
            {/* Video Player Column */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="relative w-full max-w-[440px] sm:max-w-[480px] aspect-[9/16] sm:aspect-[4/5] md:aspect-[3/4] max-h-[640px] rounded-3xl overflow-hidden bg-black shadow-2xl group border border-white/20">
                {/* Video Element */}
                <video
                  ref={videoRef}
                  src={activeStory.videoSrc}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={togglePlay}
                  onTimeUpdate={handleTimeUpdate}
                  loop
                  playsInline
                  autoPlay
                  muted={isMuted}
                />

                {/* Subtle Ambient Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                {/* Top Video Header Tag */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                  <span className="bg-black/40 backdrop-blur-md text-white/90 text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                    <Film size={12} className="text-accent" />
                    <span>{activeStory.category}</span>
                  </span>
                  <span className="bg-black/40 backdrop-blur-md text-white/90 text-[10px] font-mono px-2.5 py-1 rounded-full border border-white/10">
                    {formatTime(currentTime)}
                  </span>
                </div>

                {/* Center Play/Pause Large Overlay Button */}
                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause Video" : "Play Video"}
                  className={`absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xl cursor-pointer ${
                    isPlaying
                      ? "opacity-0 group-hover:opacity-90"
                      : "opacity-100 scale-100 bg-primary/80"
                  }`}
                >
                  {isPlaying ? (
                    <Pause size={28} className="fill-white" />
                  ) : (
                    <Play size={28} className="fill-white translate-x-0.5" />
                  )}
                </button>

                {/* Bottom Custom Video Controls */}
                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between gap-3 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlay}
                      className="text-white hover:text-accent transition-colors cursor-pointer p-1"
                      aria-label="Play/Pause"
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="text-white hover:text-accent transition-colors cursor-pointer p-1"
                      aria-label="Mute/Unmute"
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex-1 mx-2">
                    <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-accent h-full transition-all duration-150 rounded-full"
                        style={{
                          width: `${
                            duration > 0 ? (currentTime / duration) * 100 : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleFullscreen}
                    className="text-white hover:text-accent transition-colors cursor-pointer p-1"
                    aria-label="Fullscreen"
                  >
                    <Maximize2 size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Story Details Column */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
              <div className="space-y-2">
                <span className="text-accent text-xs font-bold uppercase tracking-[0.25em] flex items-center gap-1.5">
                  <Clock size={13} />
                  <span>{activeStory.category}</span>
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-tight">
                  {activeStory.title}
                </h2>
                <p className="text-sm font-medium text-accent italic font-serif">
                  "{activeStory.subtitle}"
                </p>
              </div>

              <p className="text-primary/75 text-sm sm:text-base leading-relaxed font-light">
                {activeStory.description}
              </p>

              <div className="pt-2">
                <Link
                  to={getPath("/shop")}
                  style={{ backgroundColor: "#83254e", color: "#ffffff" }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest shadow-md hover:shadow-lg hover:opacity-95 hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer text-white"
                >
                  <span>Explore Featured Perfumes</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Both Video Stories Cards Grid */}
        <div>
          <div className="text-center mb-8">
            <span className="text-accent text-xs font-bold uppercase tracking-[0.2em] block mb-1">
              Visual Archive
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              All Cinema Films
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {STORIES_DATA.map((story, idx) => {
              const isCurrent = idx === activeStoryIdx;
              return (
                <div
                  key={story.id}
                  onClick={() => {
                    setActiveStoryIdx(idx);
                    window.scrollTo({ top: 150, behavior: "smooth" });
                  }}
                  className={`bg-white/80 backdrop-blur-md rounded-3xl border overflow-hidden transition-all duration-300 p-5 sm:p-6 cursor-pointer group hover:-translate-y-1 ${
                    isCurrent
                      ? "border-accent ring-2 ring-accent/30 shadow-lg"
                      : "border-primary/10 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-5 bg-black">
                    <video
                      src={story.videoSrc}
                      className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      muted
                      playsInline
                      loop
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md border border-white/50 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-primary transition-all shadow-md">
                        <Play size={20} className="fill-white translate-x-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10">
                      Story 0{idx + 1}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-accent text-[11px] font-bold uppercase tracking-wider block">
                      {story.category}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-primary group-hover:text-accent transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-primary/70 line-clamp-2 leading-relaxed">
                      {story.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryPage;
