import React, { useEffect, useImperativeHandle, useRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

type PlayerProps = {
    src?: string;
    autoPlay?: boolean;
    onNext?: (event: React.SyntheticEvent) => void;
    onPrevious?: (event: React.SyntheticEvent) => void;
    onEnded?: (event: Event) => void;
};

export type PlayerHandle = {
    play: () => Promise<void> | void;
};

const Player = React.forwardRef<PlayerHandle, PlayerProps>(({
    src,
    autoPlay = false,
    onNext,
    onPrevious,
    onEnded,
}, ref) => {
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
        if (!audio) return;

        audio.pause();
        audio.currentTime = 0;

        if (src && autoPlay) {
            const playPromise = audio.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => undefined);
            }
        }
    }, [src, autoPlay]);

    return (
        <div className={`player-wrapper${src ? '' : ' player-wrapper--disabled'}`}>
            <p className="text-left lowercase!">{src ? src.split('/').pop() : '404'}</p>
            <AudioPlayer
                ref={playerRef}
                autoPlay={Boolean(src && autoPlay)}
                src={src}
                showDownloadProgress={false}
                showJumpControls={false}
                showSkipControls={true}
                onClickNext={onNext}
                onClickPrevious={onPrevious}
                onEnded={onEnded}
                showFilledVolume={true}
                volume={0.20}
            />
        </div>
    );
});

Player.displayName = 'Player';

export default Player;