"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import CourseContentUpload from "@/components/ui/CourseContentUpload";
import { Lesson } from "./types";

type TabKey = "resources" | "questions" | "assignment";

type Props = {
  courseId?: string;
  moduleId: string;
  lesson: Lesson;
  activeTab: TabKey | null;
  onChangeActiveTab: (lessonId: string, tab: TabKey | null) => void;
  addContentToLesson: (moduleId: string, lessonId: string, result: any) => void;
  addQuestion: (moduleId: string, lessonId: string) => void;
  updateQuestion: (moduleId: string, lessonId: string, questionId: string, text: string) => void;
  deleteQuestion: (moduleId: string, lessonId: string, questionId: string) => void;
  addOption: (moduleId: string, lessonId: string, questionId: string) => void;
  updateOptionText: (moduleId: string, lessonId: string, questionId: string, optionId: string, text: string) => void;
  setCorrectOption: (moduleId: string, lessonId: string, questionId: string, optionId: string) => void;
  deleteOption: (moduleId: string, lessonId: string, questionId: string, optionId: string) => void;
  enableAssignment: (moduleId: string, lessonId: string) => void;
  removeAssignment: (moduleId: string, lessonId: string) => void;
  updateAssignmentField: (moduleId: string, lessonId: string, field: "title" | "description", value: string) => void;
  getContentIcon: (type: string) => React.ReactNode;
};

export default function LessonOptionalTabs({
  courseId,
  moduleId,
  lesson,
  activeTab,
  onChangeActiveTab,
  addContentToLesson,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  addOption,
  updateOptionText,
  setCorrectOption,
  deleteOption,
  enableAssignment,
  removeAssignment,
  updateAssignmentField,
  getContentIcon,
}: Props) {
  const resourcesCount = lesson.contents?.length ?? 0;
  const questionsCount = lesson.questions?.length ?? 0;
  const hasAssignment = !!lesson.assignment;

  const tabs: Array<{ key: TabKey; label: string }> = [];
  if (resourcesCount > 0 || activeTab === "resources") tabs.push({ key: "resources", label: `Resources${resourcesCount ? ` (${resourcesCount})` : ""}` });
  if (questionsCount > 0) tabs.push({ key: "questions", label: `Questions${questionsCount ? ` (${questionsCount})` : ""}` });
  if (hasAssignment) tabs.push({ key: "assignment", label: "Assignment" });

  if (tabs.length === 0) {
    return (
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">Add optional content to this lesson:</p>
        <div className="flex items-center gap-2">
          <button onClick={() => onChangeActiveTab(lesson.id, "resources")} className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600">
            Add Resources
          </button>
          <button onClick={() => addQuestion(moduleId, lesson.id)} className="px-2 py-1 text-xs rounded bg-blue-600 text-white">
            Add Question
          </button>
          <button onClick={() => enableAssignment(moduleId, lesson.id)} className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600">
            Add Assignment
          </button>
        </div>
      </div>
    );
  }

  const active = activeTab ?? tabs[0]?.key ?? null;

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
        <div className="flex items-center gap-2">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => onChangeActiveTab(lesson.id, t.key)} className={`${active === t.key ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"} text-sm px-2 py-1`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {resourcesCount === 0 && (
            <button onClick={() => onChangeActiveTab(lesson.id, "resources")} className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600">
              Add Resources
            </button>
          )}
          {questionsCount === 0 && (
            <button onClick={() => addQuestion(moduleId, lesson.id)} className="px-2 py-1 text-xs rounded bg-blue-600 text-white">
              Add Question
            </button>
          )}
          {!hasAssignment && (
            <button onClick={() => enableAssignment(moduleId, lesson.id)} className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600">
              Add Assignment
            </button>
          )}
        </div>
      </div>

      {active === "resources" && (
        <div className="space-y-3">
          {resourcesCount > 0 && (
            <div className="space-y-2">
              {(lesson.contents ?? []).map((content) => (
                <div key={content.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded">
                  <div className="flex items-center space-x-2">
                    {getContentIcon(content.type)}
                    <span className="text-sm text-gray-900 dark:text-white">{content.title}</span>
                  </div>
                  <a href={content.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm">
                    View
                  </a>
                </div>
              ))}
            </div>
          )}
          <CourseContentUpload
            courseId={courseId ?? ""}
            lessonId={lesson.id}
            onFileUploaded={(result) => addContentToLesson(moduleId, lesson.id, result)}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4"
            placeholder="Upload lesson resources..."
          />
        </div>
      )}

      {active === "questions" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300">Questions</h6>
            <button onClick={() => addQuestion(moduleId, lesson.id)} className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded">
              <Plus className="w-3 h-3" />
              <span>Add Question</span>
            </button>
          </div>
          <div className="space-y-2">
            {(lesson.questions ?? []).map((q) => (
              <div key={q.id} className="space-y-2 p-2 border border-gray-200 dark:border-gray-600 rounded">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    defaultValue={q.text}
                    onBlur={(e) => updateQuestion(moduleId, lesson.id, q.id, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter question text"
                  />
                  <button onClick={() => deleteQuestion(moduleId, lesson.id, q.id)} className="p-2 text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 ml-4">
                  {(q.options ?? []).map((o) => (
                    <div key={o.id} className="flex items-center space-x-2">
                      <input type="radio" name={`correct-${q.id}`} checked={o.is_correct} onChange={() => setCorrectOption(moduleId, lesson.id, q.id, o.id)} className="text-blue-600" />
                      <input
                        type="text"
                        defaultValue={o.text}
                        onBlur={(e) => updateOptionText(moduleId, lesson.id, q.id, o.id, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Option text"
                      />
                      <button onClick={() => deleteOption(moduleId, lesson.id, q.id, o.id)} className="p-2 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addOption(moduleId, lesson.id, q.id)} className="text-xs text-blue-600 hover:text-blue-800">
                    + Add option
                  </button>
                </div>
              </div>
            ))}
            {(lesson.questions?.length ?? 0) === 0 && <p className="text-xs text-gray-500">No questions added.</p>}
          </div>
        </div>
      )}

      {active === "assignment" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300">Assignment</h6>
            <button onClick={() => removeAssignment(moduleId, lesson.id)} className="text-xs text-red-600 hover:text-red-800">
              Remove
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <input
              type="text"
              defaultValue={lesson.assignment?.title ?? ""}
              onBlur={(e) => updateAssignmentField(moduleId, lesson.id, "title", e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Assignment title"
            />
            <textarea
              defaultValue={lesson.assignment?.description ?? ""}
              onBlur={(e) => updateAssignmentField(moduleId, lesson.id, "description", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={3}
              placeholder="Assignment instructions / description"
            />
          </div>
        </div>
      )}
    </>
  );
}
