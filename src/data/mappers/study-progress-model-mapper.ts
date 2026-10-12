import type { StudyProgress } from "@/domain/entities";
import type { StudyProgressMapper } from "@/domain/mappers";
import type { StudyProgressModel } from "@/domain/models";

export class StudyProgressModelMapper implements StudyProgressMapper {
  toEntity(model: StudyProgressModel): StudyProgress {
    return {
      studyId: model.study_id,
      completedLessonIds: [...new Set(model.completed_lessons)],
      updatedAt: model.updated_at,
    };
  }

  toModel(entity: StudyProgress): StudyProgressModel {
    return {
      study_id: entity.studyId,
      completed_lessons: [...entity.completedLessonIds],
      updated_at: entity.updatedAt,
    };
  }
}
