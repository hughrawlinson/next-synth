import { useRef, useState, useEffect } from 'react';
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

/*
 * Since client side rehydration needs to render the same content as the pre-render
 * does, we need to have a way to have useSynth know to return the loading state
 * the first time, and then the actual response immediately after.
 */
function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  });

  return hasMounted;
}

export function useSynth(): SynthHookResult {
  const hasMounted = useHasMounted();
  const audioContext = useRef(undefinedIfNotClient(() => new AudioContext()));
  const synth = useRef<Synth>(undefinedIfNotClient(() => new Synth({ audioContext: audioContext.current })))

  if (typeof audioContext.current == 'undefined' || typeof synth.current == 'undefined' || !hasMounted) {
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