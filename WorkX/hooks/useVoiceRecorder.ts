import { useEffect, useState } from "react";

import {
    AudioModule,
    RecordingPresets,
    setAudioModeAsync,
    useAudioRecorder,
    useAudioRecorderState,
} from "expo-audio";

type UseVoiceRecorderProps = {
    onRecordingComplete?: (uri: string) => void;
};

export function useVoiceRecorder({
    onRecordingComplete,
}: UseVoiceRecorderProps = {}) {
    const recorder = useAudioRecorder(
        RecordingPresets.HIGH_QUALITY,
    );

    const recorderState =
        useAudioRecorderState(recorder);

    const [permissionGranted, setPermissionGranted] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        const setup = async () => {
            try {
                const permission =
                    await AudioModule.requestRecordingPermissionsAsync();

                if (!permission.granted) {
                    setError("Microphone permission denied.");
                    return;
                }

                await setAudioModeAsync({
                    playsInSilentMode: true,
                    allowsRecording: true,
                });

                setPermissionGranted(true);
            } catch (error) {
                console.error("Audio setup error:", error);

                setError(
                    error instanceof Error
                        ? error.message
                        : "Unable to initialize microphone.",
                );
            }
        };

        setup();
    }, []);

    const startRecording = async () => {
        try {
            setError(null);

            if (!permissionGranted) {
                throw new Error(
                    "Microphone permission has not been granted.",
                );
            }

            await recorder.prepareToRecordAsync();

            recorder.record();
        } catch (error) {
            console.error(
                "Start recording error:",
                error,
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to start recording.",
            );
        }
    };

    const stopRecording = async () => {
        try {
            await recorder.stop();

            const uri = recorder.uri;

            if (!uri) {
                throw new Error(
                    "Recording stopped but no audio file was created.",
                );
            }

            onRecordingComplete?.(uri);
            console.log("RECORDED AUDIO URI:", uri);

            return uri;
        } catch (error) {
            console.error(
                "Stop recording error:",
                error,
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to stop recording.",
            );

            return null;
        }
    };

    return {
        isRecording: recorderState.isRecording,
        durationMillis: recorderState.durationMillis,
        permissionGranted,
        error,
        startRecording,
        stopRecording,
    };
}