import type { ContactMessage, ContactTopic } from "@/domain/entities";
import type { ContactMessageMapper } from "@/domain/mappers";
import type { ContactMessageModel } from "@/domain/models";
import { toLocale } from "./locale";

const SUBJECT_BY_TOPIC: Record<ContactTopic, ContactMessageModel["subject_type"]> = {
  project: "projeto",
  chat: "conversa",
  recommendation: "indicacao",
  other: "outro",
};

const TOPIC_BY_SUBJECT: Record<ContactMessageModel["subject_type"], ContactTopic> = {
  projeto: "project",
  conversa: "chat",
  indicacao: "recommendation",
  outro: "other",
};

export class ContactMessageModelMapper implements ContactMessageMapper {
  toEntity(model: ContactMessageModel): ContactMessage {
    return {
      name: model.name,
      email: model.email,
      topic: TOPIC_BY_SUBJECT[model.subject_type],
      message: model.body,
      locale: toLocale(model.locale),
      createdAt: new Date(model.sent_at).toISOString(),
    };
  }

  toModel(entity: ContactMessage): ContactMessageModel {
    return {
      name: entity.name,
      email: entity.email,
      subject_type: SUBJECT_BY_TOPIC[entity.topic],
      body: entity.message,
      locale: entity.locale,
      sent_at: entity.createdAt,
    };
  }
}
