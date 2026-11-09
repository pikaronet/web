import React, { useEffect, useImperativeHandle, useRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

type PlayerProps = {
    src?: string;
    autoPlay?: boolean;
};

export type PlayerHandle = {
    play: () => Promise<void> | void;
};

const Player = React.forwardRef<PlayerHandle, PlayerProps>(({ src, autoPlay = false }, ref) => {
    const playerRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
        play: async () => {
            const audio = playerRef.current?.audio?.current;
            if (!audio || !src) return;

            try {
                await audio.play();
            } catch {
                // Browsers may block autoplay until a user gesture occurs.
            }
        },
    }), [src]);

    useEffect(() => {
        const audio = playerRef.current?.audio?.current;
        if (!audio || !src) return;

        audio.pause();
        audio.currentTime = 0;

        if (autoPlay) {
            const playPromise = audio.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => undefined);
            }
        }
    }, [src, autoPlay]);

    if (!src) return null;

    return (
        <div className="player-wrapper">
            <AudioPlayer
                ref={playerRef}
                autoPlay={autoPlay}
                src={src}
            />
        </div>
    );
});

Player.displayName = 'Player';

export default Player;