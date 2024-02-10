"use client";

import type { ElementRef, KeyboardEvent } from "react";
import type { OnProgressProps } from "react-player/base";
import { useCallback, useMemo, useRef, useState } from "react";
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
import ReactPlayer from "react-player";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@acme/ui/components/ui/dropdown-menu";

interface Props {
  src: string;
  onCompleted?: () => void;
}

const playbacks = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export function Video({ src, onCompleted }: Props) {
  const videoRef = useRef<ElementRef<typeof ReactPlayer>>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  // const [seeking, setSeeking] = useState(false);
  const [buffer, setBuffer] = useState(false);
  const [pip, setPip] = useState(false);

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

  // const seekMouseDown = useCallback(() => setSeeking(true), []);

  // const seekMouseUp = useCallback(
  //   (value: number) => {
  //     setSeeking(false);
  //     seek(value);
  //   },
  //   [seek],
  // );

  const volumeChange = useCallback((value: number) => {
    setVolume(value);
    setMuted(value === 0);
  }, []);

  const muteUnmute = useCallback(() => {
    setMuted((prev) => !prev);
  }, []);

  // const setControlsShownDebounced = useDebouncedCallback((value: boolean) => {
  //   setControlsShown(value);
  // }, 1000);

  // const onMouseMove = useCallback(() => {
  //   setControlsShown(true);
  //   setControlsShownDebounced(false);
  // }, [setControlsShownDebounced]);

  const onProgress = ({ playedSeconds, loadedSeconds }: OnProgressProps) => {
    // if (seeking) {
    //   return;
    // }

    setPlayed(playedSeconds);
    setLoaded(loadedSeconds);
  };

  const onBuffer = () => setBuffer(true);
  const onBufferEnd = () => setBuffer(false);

  const onEnded = () => {
    setPlaying(false);
    onCompleted?.();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === " " || e.key === "k") {
      playPause();
    } else if (e.key === "m") {
      muteUnmute();
    } else if (e.key === "ArrowLeft") {
      rewind();
    } else if (e.key === "ArrowRight") {
      fastForward();
    }
  };

  const onFullScreen = useCallback(() => {
    const player = videoRef.current?.getInternalPlayer();
    if (!player) {
      return;
    }

    if (player.requestFullscreen) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      player.requestFullscreen();
    } else if (player.msRequestFullscreen) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      player.msRequestFullscreen();
    } else if (player.mozRequestFullScreen) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      player.mozRequestFullScreen();
    } else if (player.webkitRequestFullscreen) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      player.webkitRequestFullscreen();
    }
  }, []);

  const onPictureInPicture = useCallback(() => {
    setPip(true);
  }, []);

  const playedPercentage = (played / duration) * 100;
  const loadedPercentage = (loaded / duration) * 100;

  const [isDragging, setIsDragging] = useState(false);

  const onHandleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    let rect = target.getBoundingClientRect();

    if (target.id === "played" || target.id === "loaded") {
      rect = target.parentElement!.getBoundingClientRect();
    }

    const x = e.clientX - rect.left + 1;
    const percentage = (x / rect.width) * 100;
    const newPlayedSeconds = (percentage / 100) * duration;

    seek(newPlayedSeconds);
  };

  return (
    <div className="relative size-full">
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
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
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
            <button onClickCapture={onPictureInPicture}>
              <PictureInPicture />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <ListVideo />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {playbacks.map((rate) => (
                  <DropdownMenuItem
                    key={rate}
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
            <button onClickCapture={onFullScreen}>
              <Maximize />
            </button>
          </div>
        </div>
      </div>
      <div
        onClick={playPause}
        onKeyDown={onKeyDown}
        role="button"
        tabIndex={0}
        className="outline-none active:outline-none"
      >
        <ReactPlayer
          ref={videoRef}
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
  if (hours) {
    //if video have hours
    return `${hours}:${minutes.toString().padStart(2, "0")} `;
  } else return `${minutes}:${seconds}`;
};
