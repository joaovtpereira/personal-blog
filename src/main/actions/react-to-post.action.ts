"use server";

import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { isReactionChoice } from "@/domain/entities";
import { CACHE_TAGS } from "@/main/cache/cache-tags";
import { makeReactToPost } from "@/main/factories/use-cases/use-cases";
import { REACTION_FORM_FIELDS as F, type ReactionFormState } from "@/presentation/components/ReactionButtons/reaction-form-state";

/** IP do visitante (Vercel preenche x-forwarded-for); só é usado, com hash, para o limite de tentativas. */
async function visitorKey(): Promise<string> {
  const list = await headers();
  return list.get("x-forwarded-for")?.split(",")[0]?.trim() || list.get("x-real-ip") || "anonimo";
}

/**
 * Funciona com e sem JavaScript: o formulário envia a reação tocada e a anterior (guardada no navegador).
 * Depois de gravar, expira o cache dos totais deste post para quem reagiu ver o número certo.
 */
export async function reactToPostAction(_: ReactionFormState, formData: FormData): Promise<ReactionFormState> {
  const postId = String(formData.get(F.postId) ?? "");
  const choice = formData.get(F.choice);
  const previous = formData.get(F.previous);
  if (!postId || !isReactionChoice(choice)) return { status: "failed" };

  try {
    const result = await makeReactToPost().execute({
      postId,
      choice,
      previous: isReactionChoice(previous) ? previous : null,
      visitorKey: await visitorKey(),
    });
    if (result.status === "limited") return { status: "limited" };
    if (result.status === "invalid") return { status: "failed" };
    updateTag(CACHE_TAGS.postReactions(postId));
    return { status: "ok", reactions: result.reactions, choice: result.choice };
  } catch (error) {
    console.error("[reações] falha ao registrar", error);
    return { status: "failed" };
  }
}
