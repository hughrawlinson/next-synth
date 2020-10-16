import React, { useRef } from 'react';
import { Synth, Note } from './synth';

function undefinedIfNotClient(provider: () => any) {
  if (typeof window === 'undefined') {
    return undefined;
  }
  return provider();
}

type SynthHookResult = {
  loading: true
} | {
  loading: false
} & {
  playNote: (note: Note) => void
}

export function useSynth(): SynthHookResult {
  const audioContext = useRef(undefinedIfNotClient(() => new AudioContext()));
  const synth = useRef(undefinedIfNotClient(() => new Synth({ audioContext: audioContext.current })))

  if (typeof audioContext.current == 'undefined' || typeof synth.current == 'undefined') {
    return {
      loading: true
    }
  }

  return {
    loading: false,
    playNote(note: Note) {
      synth.current.playNote(note);
    }
  }
}