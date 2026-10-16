import type { LessonCommentModel, PostCommentModel } from "@/domain/models";
import { getFirestoreOrNull } from "@/infra/firebase/firebase-admin";
import {
  FirestoreCommentStore,
  FirestoreRateLimiter,
  FirestoreReactionCounterStore,
  InMemoryCommentStore,
  InMemoryRateLimiter,
  InMemoryReactionCounterStore,
} from "@/infra/feedback";
import { LESSON_COMMENTS_MOCK, POST_COMMENTS_MOCK } from "@/infra/mocks";
import type { CommentStore, RateLimiter, ReactionCounterStore } from "@/shared/feedback";

/*
 * Comentários e reações ficam no Firestore quando as credenciais do Firebase estão no ambiente
 * (ver .env.example). Sem elas (desenvolvimento local), tudo fica em memória até reiniciar o servidor.
 */

/** Reações: no máximo 20 toques por visitante e post a cada 10 minutos. */
const REACTION_LIMIT = { limit: 20, windowSeconds: 600 };

let memory: {
  postComments: CommentStore<PostCommentModel>;
  lessonComments: CommentStore<LessonCommentModel>;
  reactions: ReactionCounterStore;
  limiter: RateLimiter;
} | null = null;

const inMemory = () =>
  (memory ??= {
    postComments: new InMemoryCommentStore([...POST_COMMENTS_MOCK], "post_id"),
    lessonComments: new InMemoryCommentStore([...LESSON_COMMENTS_MOCK], "lesson_id"),
    reactions: new InMemoryReactionCounterStore(),
    limiter: new InMemoryRateLimiter(REACTION_LIMIT.limit, REACTION_LIMIT.windowSeconds),
  });

export const makePostCommentStore = (): CommentStore<PostCommentModel> => {
  const db = getFirestoreOrNull();
  return db ? new FirestoreCommentStore<PostCommentModel>(db, "post_comments", "post_id") : inMemory().postComments;
};

export const makeLessonCommentStore = (): CommentStore<LessonCommentModel> => {
  const db = getFirestoreOrNull();
  return db ? new FirestoreCommentStore<LessonCommentModel>(db, "lesson_comments", "lesson_id") : inMemory().lessonComments;
};

export const makeReactionCounterStore = (): ReactionCounterStore => {
  const db = getFirestoreOrNull();
  return db ? new FirestoreReactionCounterStore(db) : inMemory().reactions;
};

export const makeReactionRateLimiter = (): RateLimiter => {
  const db = getFirestoreOrNull();
  return db ? new FirestoreRateLimiter(db, REACTION_LIMIT.limit, REACTION_LIMIT.windowSeconds) : inMemory().limiter;
};
