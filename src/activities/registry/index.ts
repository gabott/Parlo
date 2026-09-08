import type { ComponentType } from "react";
import type { ActivityKind } from "../../domain/attempts";
import { AudioTextSelectRenderer, DictationRenderer, GuidedSpeakingRenderer, MatchingRenderer, MeaningSelectRenderer, PresentationDialogueRenderer, SentenceBuildRenderer, TextAudioSelectRenderer, TypedRecallRenderer } from "../renderers/ActivityRenderers";

export const activityRendererRegistry: Record<ActivityKind, ComponentType<any>> = {
  presentation: PresentationDialogueRenderer, meaning_select: MeaningSelectRenderer, audio_text_select: AudioTextSelectRenderer,
  text_audio_select: TextAudioSelectRenderer, matching: MatchingRenderer, sentence_build: SentenceBuildRenderer,
  typed_recall: TypedRecallRenderer, dictation: DictationRenderer, guided_speaking: GuidedSpeakingRenderer,
};
export * from "../renderers/ActivityRenderers";
