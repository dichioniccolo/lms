"use client";

import type { ElementRef, KeyboardEvent, MouseEvent } from "react";
import type { OnProgressProps } from "react-player/base";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import {
  Check,
  ListVideo,
  Loader2,
  Maximize,
  Pause,
  PictureInPicture,
  Play,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import ReactPlayer, { ReactPlayerProps } from "react-player";

import { cn } from "@acme/ui";
import { AspectRatio } from "@acme/ui/components/ui/aspect-ratio";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@acme/ui/components/ui/dropdown-menu";
import { useDebouncedCallback } from "@acme/ui/hooks/use-debounced-callback";

interface Props {
  src: string;
  onCompleted?: () => void;
}

const playbacks = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

// Extract the instance type of ReactPlayer
type ReactPlayerInstance = InstanceType<typeof ReactPlayer>;

export function Video({ src, onCompleted }: Props) {
  const fullScreenRef = useRef<ElementRef<"div">>(null);
  const videoRef = useRef<ReactPlayerInstance | null>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [buffer, setBuffer] = useState(false);
  const [pip, setPip] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [mouseMovingHover, setMouseMovingHover] = useState(false);

  const currentTime = videoRef.current?.getCurrentTime() ?? 0;
  const duration = videoRef.current?.getDuration() ?? 0;

  const formatCurrentTime = useMemo(
    () => formatTime(currentTime),
    [currentTime],
  );
  const formatDuration = useMemo(() => formatTime(duration), [duration]);

  const playPause = useCallback(() => setPlaying((prev) => !prev), []);

  const rewind = useCallback(
    () => videoRef.current?.seekTo(currentTime - 5),
    [currentTime],
  );
  const fastForward = useCallback(
    () => videoRef.current?.seekTo(currentTime + 5),
    [currentTime],
  );

  const seek = useCallback((value: number) => {
    const played = value;

    setPlayed(played);
    videoRef.current?.seekTo(played);
  }, []);

  const volumeChange = useCallback((value: number) => {
    setVolume(value);
    setMuted(value === 0);
  }, []);

  const muteUnmute = useCallback(() => {
    setMuted((prev) => !prev);
  }, []);

  const onProgress = ({ playedSeconds, loadedSeconds }: OnProgressProps) => {
    if (seeking) {
      return;
    }

    setPlayed(playedSeconds);
    setLoaded(loadedSeconds);
  };

  const onBuffer = useCallback(() => setBuffer(true), []);
  const onBufferEnd = useCallback(() => setBuffer(false), []);

  const onEnded = useCallback(() => {
    setPlaying(false);
    onCompleted?.();
  }, [onCompleted]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "k") {
        playPause();
      } else if (e.key === "m") {
        muteUnmute();
      } else if (e.key === "ArrowLeft") {
        rewind();
      } else if (e.key === "ArrowRight") {
        fastForward();
      }
    },
    [fastForward, muteUnmute, playPause, rewind],
  );

  const onFullScreen = useCallback(async () => {
    if (!fullScreen) {
      await fullScreenRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, [fullScreen]);

  const onPictureInPicture = useCallback(() => {
    setPip(true);
  }, []);

  const playedPercentage = (played / duration) * 100;
  const loadedPercentage = (loaded / duration) * 100;

  const onHandleSeek = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;

      let rect = target.getBoundingClientRect();

      if (target.id === "played" || target.id === "loaded") {
        rect = target.parentElement!.getBoundingClientRect();
      }

      const x = e.clientX - rect.left + 1;
      const percentage = (x / rect.width) * 100;
      const newPlayedSeconds = (percentage / 100) * duration;

      setSeeking(true);
      seek(newPlayedSeconds);
    },
    [duration, seek],
  );

  useEffect(() => {
    const handle = () => {
      setFullScreen((prev) => !prev);
    };

    const ref = fullScreenRef.current;

    ref?.addEventListener("fullscreenchange", handle);

    return () => {
      ref?.removeEventListener("fullscreenchange", handle);
    };
  }, []);

  const disableMovingHover = useDebouncedCallback(
    () => setMouseMovingHover(false),
    1000,
  );
  const enableMovingHover = () => {
    disableMovingHover.cancel();
    setMouseMovingHover(true);
  };

  return (
    <AspectRatio ratio={16 / 9}>
      <div
        ref={fullScreenRef}
        className={cn("bg-slate-800", {
          "size-full": !fullScreen,
          "h-screen w-screen": fullScreen,
        })}
        onMouseLeave={disableMovingHover}
        onMouseEnter={enableMovingHover}
      >
        {buffer && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/10">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-2 px-4 py-2 text-white">
          <div
            role="progressbar"
            tabIndex={0}
            className="relative h-[3px] w-full cursor-pointer overflow-hidden rounded-lg bg-gray-700 transition-all hover:h-2"
            onMouseMove={(e) => {
              if (!isDragging) {
                return;
              }
              onHandleSeek(e);
            }}
            onMouseDown={(e) => {
              onHandleSeek(e);
              setIsDragging(true);
            }}
            onMouseUp={() => {
              setIsDragging(false);
              setSeeking(false);
            }}
            onMouseLeave={() => {
              setIsDragging(false);
              setSeeking(false);
            }}
          >
            <div
              id="played"
              className="absolute left-0 top-0 h-full bg-gray-400"
              style={{
                width: `${loadedPercentage}%`,
              }}
            />
            <div
              id="loaded"
              className="absolute left-0 top-0 h-full bg-white"
              style={{
                width: `${playedPercentage}%`,
              }}
            />
          </div>
          {(mouseMovingHover || !playing) && (
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <button onClickCapture={playPause}>
                  {playing ? <Pause /> : <Play />}
                </button>
                <div className="group flex items-center justify-center">
                  <div className="flex h-full items-center justify-center">
                    <button onClickCapture={muteUnmute}>
                      {(muted || volume === 0) && <VolumeX />}
                      {!muted && (
                        <>
                          {volume > 0 && volume < 0.35 && <Volume />}
                          {volume >= 0.35 && volume < 0.7 && <Volume1 />}
                          {volume >= 0.7 && <Volume2 />}
                        </>
                      )}
                    </button>
                  </div>
                  <Slider.Root
                    className="relative ml-2 hidden h-5 w-[100px] touch-none select-none items-center group-hover:flex"
                    defaultValue={[volume]}
                    onValueChange={(v) => volumeChange(v[0] ?? 0)}
                    max={1}
                    min={0}
                    step={0.01}
                  >
                    <Slider.Track className="relative h-[3px] grow rounded-full bg-gray-400">
                      <Slider.Range className="absolute h-full rounded-full bg-white" />
                    </Slider.Track>
                    <Slider.Thumb
                      className="hidden h-4 w-4 rounded-full bg-white outline-none hover:bg-slate-300 focus:outline-none active:outline-none group-hover:block"
                      aria-label="Volume"
                    />
                  </Slider.Root>
                </div>
                <div className="w-32">
                  <span>{formatCurrentTime}</span>
                  <span> / </span>
                  <span>{formatDuration}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {ReactPlayer.canEnablePIP(src) && (
                  <button onClickCapture={onPictureInPicture}>
                    <PictureInPicture />
                  </button>
                )}
                {!fullScreen && (
                  <DropdownMenu>
                    <DropdownMenuTrigger onClick={enableMovingHover}>
                      <ListVideo />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent onMouseEnter={enableMovingHover}>
                      {playbacks.map((rate, index) => (
                        <DropdownMenuItem
                          key={index}
                          onClick={() => setPlaybackRate(rate)}
                        >
                          {rate === 1 ? "Normal" : `${rate}x`}
                          {playbackRate === rate && (
                            <DropdownMenuShortcut>
                              <Check className="h-4 w-4" />
                            </DropdownMenuShortcut>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                <button onClickCapture={onFullScreen}>
                  <Maximize />
                </button>
              </div>
            </div>
          )}
        </div>
        <div
          onClick={playPause}
          onKeyDown={onKeyDown}
          role="button"
          tabIndex={0}
          className="aspect-video outline-none active:outline-none"
        >
          <ReactPlayer
            ref={(player) => (videoRef.current = player)}
            width="100%"
            height="100%"
            url={src}
            playing={playing}
            muted={muted}
            volume={volume}
            playbackRate={playbackRate}
            pip={pip}
            onProgress={onProgress}
            onEnded={onEnded}
            onBuffer={onBuffer}
            onBufferEnd={onBufferEnd}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnablePIP={() => setPip(true)}
            onDisablePIP={() => setPip(false)}
            fallback={
              <div className="flex h-[300px] w-full items-center justify-center bg-slate-800">
                <Loader2 className="size-8 animate-spin text-secondary" />
              </div>
            }
            controls={false}
          />
        </div>
      </div>
    </AspectRatio>
  );
}

const formatTime = (time: number) => {
  //formarting duration of video
  if (isNaN(time)) {
    return "0:00";
  }

  const date = new Date(time * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");

  if (hours > 0) {
    //if video have hours
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds}`;
  } else return `${minutes.toString().padStart(2, "0")}:${seconds}`;
};
