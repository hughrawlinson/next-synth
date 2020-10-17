import React, { useRef } from 'react';
import { Synth, Note, Params } from './synth';

function undefinedIfNotClient(provider: () => any) {
  if (typeof window === 'undefined') {
    return undefined;
  }
  return provider();
}

type LoadingSynth = {
  loading: true
}

export type LoadedSynth = {
  loading: false,
  playNote: (note: Note) => void,
  params: Params
}

export function isLoadedSynth(synth: SynthHookResult): synth is LoadedSynth {
  return !synth.loading;
}

type SynthHookResult = LoadingSynth | LoadedSynth;

export function useSynth(): SynthHookResult {
  const audioContext = useRef(undefinedIfNotClient(() => new AudioContext()));
  const synth = useRef<Synth>(undefinedIfNotClient(() => new Synth({ audioContext: audioContext.current })))

  if (typeof audioContext.current == 'undefined' || typeof synth.current == 'undefined') {
    return {
      loading: true
    }
  }

  return {
    loading: false,
    playNote(note: Note) {
      synth.current.playNote(note);
    },
    params: synth.current.getParams()
  }
}