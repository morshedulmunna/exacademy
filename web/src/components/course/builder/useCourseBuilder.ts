"use client";

import { useEffect, useState } from "react";
import type { Module, Lesson, LessonContent } from "./types";
import type { FileUploadResult } from "@/hooks/useCourseContentUpload";
import { apiCreateDeepModules, apiListModulesDeep } from "./services/api";
import { moduleSchema } from "./services/schemas";
import { transformDeepModulesResponse } from "./services/transformers";
import { buildCreateModulePayload, sanitizePayload } from "./services/payload";
import { deleteModuleAction } from "@/actions/modules/delete-module-action";
import { deleteLessonAction } from "@/actions/lessons/delete-lesson-action";
import toast from "react-hot-toast";
// toast and API calls are intentionally not used when only logging payloads

// Ensure crypto.randomUUID is available
const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

type LessonTab = "resources" | "questions" | "assignment" | null;

export interface UseCourseBuilderArgs {
  courseId?: string;
}

export default function useCourseBuilder({ courseId }: UseCourseBuilderArgs) {
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());
  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [draggedModule, setDraggedModule] = useState<string | null>(null);
  const [draggedLesson, setDraggedLesson] = useState<{ moduleId: string; lessonId: string } | null>(null);
  const [lessonActiveTab, setLessonActiveTab] = useState<Record<string, LessonTab>>({});
  const [submittingModuleId, setSubmittingModuleId] = useState<string | null>(null);
  // Delete confirmation modal state
  type DeleteTarget = { kind: "module"; moduleId: string } | { kind: "lesson"; moduleId: string; lessonId: string };
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; target: DeleteTarget | null }>({ isOpen: false, target: null });

  useEffect(() => {
    loadModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  // Safety check to ensure modules are serializable
  const safeSetModules = (newModules: Module[]) => {
    try {
      // Test serialization to catch any non-serializable data
      JSON.stringify(newModules);
      setModules(newModules);
    } catch (error) {
      console.error("Modules contain non-serializable data:", error);
      // Fallback to empty array if serialization fails
      setModules([]);
    }
  };

  // Safe version of functional setModules
  const safeSetModulesFn = (updater: (prev: Module[]) => Module[]) => {
    setModules((prev) => {
      try {
        const newModules = updater(prev);
        // Test serialization to catch any non-serializable data
        JSON.stringify(newModules);
        return newModules;
      } catch (error) {
        console.error("Modules contain non-serializable data:", error);
        // Fallback to previous state if serialization fails
        return prev;
      }
    });
  };

  const loadModules = async () => {
    if (!courseId) {
      setModules([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiListModulesDeep(courseId);

      // Validate response structure
      if (response && typeof response === "object" && "success" in response) {
        if (response.success && response.data) {
          const transformedModules: Module[] = transformDeepModulesResponse(response);
          safeSetModules(transformedModules);
        } else {
          console.error("API returned error:", response.message);
          setModules([]);
        }
      } else {
        console.error("Unexpected response format:", response);
        setModules([]);
      }

      // Keep all modules collapsed by default after load
      setExpandedModules(new Set());
    } catch (error) {
      console.error("Error loading modules:", error);
      setModules([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleModuleExpansion = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) newExpanded.delete(moduleId);
    else newExpanded.add(moduleId);
    setExpandedModules(newExpanded);
  };

  const toggleLessonExpansion = (lessonId: string) => {
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonId)) newExpanded.delete(lessonId);
    else newExpanded.add(lessonId);
    setExpandedLessons(newExpanded);
  };

  // Drag & Drop: Modules
  const handleModuleDragStart = (e: React.DragEvent, moduleId: string) => {
    setDraggedModule(moduleId);
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList.add("opacity-50", "scale-95");
  };
  const handleModuleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-50", "scale-95");
    setDraggedModule(null);
  };
  const handleModuleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    e.currentTarget.classList.add("border-blue-400", "bg-blue-50", "dark:bg-blue-900/20");
  };
  const handleModuleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("border-blue-400", "bg-blue-50", "dark:bg-blue-900/20");
  };
  const handleModuleDrop = (e: React.DragEvent, targetModuleId: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-400", "bg-blue-50", "dark:bg-blue-900/20");
    if (!draggedModule || draggedModule === targetModuleId) return;

    const draggedIndex = modules.findIndex((m) => m.id === draggedModule);
    const targetIndex = modules.findIndex((m) => m.id === targetModuleId);
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newModules = [...modules];
    const [draggedModuleData] = newModules.splice(draggedIndex, 1);
    newModules.splice(targetIndex, 0, draggedModuleData);

    const updatedModules = newModules.map((module, index) => ({ ...module, position: index + 1 }));
    safeSetModules(updatedModules);
    try {
      const payload = {
        courseId,
        modules: updatedModules.map((m) => ({ id: m.id, position: m.position })),
      };
    } catch (err) {
      console.error("Failed to log module positions", err);
    }
    setDraggedModule(null);
  };

  // Drag & Drop: Lessons
  const handleLessonDragStart = (e: React.DragEvent, moduleId: string, lessonId: string) => {
    setDraggedLesson({ moduleId, lessonId });
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList.add("opacity-50", "scale-95");
  };
  const handleLessonDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-50", "scale-95");
    setDraggedLesson(null);
  };
  const handleLessonDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    e.currentTarget.classList.add("border-green-400", "bg-green-50", "dark:bg-green-900/20");
  };
  const handleLessonDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("border-green-400", "bg-green-50", "dark:bg-green-900/20");
  };
  const handleLessonDrop = (e: React.DragEvent, targetModuleId: string, targetLessonId: string) => {
    e.preventDefault();
    if (!draggedLesson) return;
    const { moduleId: sourceModuleId, lessonId: sourceLessonId } = draggedLesson;
    if (sourceLessonId === targetLessonId) return;

    const sourceModule = modules.find((m) => m.id === sourceModuleId);
    const targetModule = modules.find((m) => m.id === targetModuleId);
    if (!sourceModule || !targetModule) return;

    const sourceLessonIndex = sourceModule.lessons.findIndex((l) => l.id === sourceLessonId);
    const targetLessonIndex = targetModule.lessons.findIndex((l) => l.id === targetLessonId);
    if (sourceLessonIndex === -1 || targetLessonIndex === -1) return;

    if (sourceModuleId !== targetModuleId) return;

    const newModules = [...modules];
    const sourceModuleIndex = newModules.findIndex((m) => m.id === sourceModuleId);
    const [movedLesson] = newModules[sourceModuleIndex].lessons.splice(sourceLessonIndex, 1);
    newModules[sourceModuleIndex].lessons.splice(targetLessonIndex, 0, movedLesson);
    // Re-index lessons positions within the module after drop
    newModules[sourceModuleIndex].lessons = newModules[sourceModuleIndex].lessons.map((lesson, index) => ({ ...lesson, position: index + 1 }));

    safeSetModules(newModules);
    setDraggedLesson(null);
  };

  const createModule = async () => {
    try {
      const payload = { title: "New Module", description: "", position: modules.length + 1 } as any;
      const backendId = `tmp_${generateId()}`;
      const newModule: Module = { id: backendId, title: payload.title, description: payload.description, position: payload.position, lessons: [] };
      const next = [...modules, newModule];
      safeSetModules(next);
      setExpandedModules((prev) => new Set([...prev, newModule.id]));
    } catch (error) {
      console.error("Error creating module:", error);
    }
  };

  const updateModule = async (moduleId: string, data: Partial<Module>) => {
    try {
      const next = modules.map((m) => (m.id === moduleId ? { ...m, ...data } : m));
      safeSetModules(next);
      setEditingModule(null);
    } catch (error) {
      console.error("Error updating module:", error);
    }
  };

  /**
   * Permanently remove a module and its lessons from local state.
   * Caller is expected to confirm with the user before invoking.
   */
  const deleteModule = async (moduleId: string) => {
    try {
      // Call the backend API to delete the module
      await deleteModuleAction(moduleId);

      // Update local state after successful deletion
      const next = modules.filter((m) => m.id !== moduleId);
      // Re-index remaining modules' positions starting from 1
      const reindexed = next.map((module, index) => ({ ...module, position: index + 1 }));
      safeSetModules(reindexed);
    } catch (error) {
      console.error("Error deleting module:", error);
      // Re-throw the error so the UI can handle it appropriately
      throw error;
    }
  };

  const createLesson = async (moduleId: string) => {
    try {
      const module = modules.find((m) => m.id === moduleId);
      const lessonPosition = module ? module.lessons.length + 1 : 1;
      const id = `tmp_${generateId()}`;
      const newLesson: Lesson = { id, title: "New Lesson", description: "", content: "", video_url: "", video_source: "url", video_file: null, duration: "0m", position: lessonPosition, is_free: false, published: false, contents: [], questions: [], assignment: null };
      const next = modules.map((m) => (m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m));
      safeSetModules(next);
      setEditingLesson(newLesson.id);
    } catch (error) {
      console.error("Error creating lesson:", error);
    }
  };

  const createModuleWithLesson = async () => {
    try {
      const moduleId = `tmp_${generateId()}`;
      const newModule: Module = {
        id: moduleId,
        title: "New Module",
        description: "",
        position: modules.length + 1,
        lessons: [],
      };
      const lessonId = `tmp_${generateId()}`;
      const newLesson: Lesson = {
        id: lessonId,
        title: "New Lesson",
        description: "",
        content: "",
        video_url: "",
        video_source: "url",
        video_file: null,
        duration: "0m",
        position: 1,
        is_free: false,
        published: false,
        contents: [],
        questions: [],
        assignment: null,
      };

      const composed: Module = { ...newModule, lessons: [newLesson] };
      const next = [...modules, composed];
      safeSetModules(next);
      setExpandedModules((prev) => new Set([...prev, composed.id]));
      setEditingModule(moduleId);

      // Compose and log payload in requested format (snake_case keys)
      const payload: any = {
        course_id: courseId ?? "",
        title: composed.title,
        description: composed.description ?? "",
        position: composed.position,
        lessons: (composed.lessons ?? []).map((l, lessonIndex) => ({
          title: l.title,
          description: l.description ?? null,
          content: l.content ?? null,
          video_url: l.video_url ?? null,
          duration: l.duration,
          position: l.position ?? lessonIndex + 1,
          is_free: !!l.is_free,
          published: !!l.published,
          contents: (l.contents ?? []).map((c, contentIndex) => ({
            title: c.title,
            content_type: c.type,
            url: c.url,
            file_size: c.size ?? undefined,
            filename: c.filename,
            position: contentIndex + 1,
          })),
          questions: (l.questions ?? []).map((q, qIndex) => ({
            question_text: q.text,
            position: qIndex + 1,
            options: (q.options ?? []).map((o, oIndex) => ({
              option_text: o.text,
              is_correct: !!o.is_correct,
              position: oIndex + 1,
            })),
          })),
          assignment: l.assignment
            ? {
                title: l.assignment.title,
                description: l.assignment.description ?? "",
              }
            : null,
        })),
      };
      try {
        await moduleSchema.validate(payload, { abortEarly: false });
      } catch (err: any) {
        // Do not block creation of the local draft, only warn
        const msg = (err?.errors as string[])?.[0] || "Validation failed";
        toast.error(msg);
      }
    } catch (error) {
      console.error("Error creating module with lesson:", error);
    }
  };

  const submitLessons = async (moduleId: string) => {
    try {
      const module = modules.find((m) => m.id === moduleId);
      if (!module) return;
      setSubmittingModuleId(moduleId);
      const consolePayload = {
        courseId,
        module: {
          id: module.id,
          title: module.title,
          description: module.description,
          position: module.position,
          lessons: module.lessons.map((l) => ({
            id: l.id,
            title: l.title,
            description: l.description,
            content: l.content,
            video_url: l.video_url,
            duration: l.duration,
            position: l.position,
            is_free: l.is_free,
            published: l.published,
            contents: l.contents,
            questions: l.questions,
            assignment: l.assignment,
          })),
        },
      };
    } catch (error) {
      console.error("Error submitting lessons:", error);
    } finally {
      setSubmittingModuleId(null);
    }
  };

  const createModuleAndAllLessons = async (moduleId: string) => {
    // Prevent multiple simultaneous calls
    if (submittingModuleId === moduleId) {
      return;
    }

    try {
      const module = modules.find((m) => m.id === moduleId);
      if (!module || !courseId) return;
      setSubmittingModuleId(moduleId);

      const payload = buildCreateModulePayload(courseId, {
        ...module,
        position: module.position ?? modules.findIndex((m) => m.id === moduleId) + 1,
      } as Module);

      const sanitizedPayload = sanitizePayload(payload);

      try {
        await moduleSchema.validate(sanitizedPayload, { abortEarly: false });
      } catch (err: any) {
        const msg = (err?.errors as string[])?.[0] || "Validation failed";
        console.error("Validation failed:", err);
        toast.error(msg);
        throw err;
      }

      const finalPayload = sanitizePayload(sanitizedPayload);

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("API call timeout")), 30000); // 30 seconds timeout
      });

      const apiPromise = apiCreateDeepModules(finalPayload.course_id, finalPayload);
      const res = await Promise.race([apiPromise, timeoutPromise]);

      // Handle the response
      if (res && typeof res === "object" && "success" in res) {
        if (res.success) {
          // Success - you can handle the response data here if needed
          console.log("Module created successfully:", res.data);
          toast.success("Module created successfully!");
        } else {
          // API returned an error
          const errorMessage = res.message || "Failed to create module";
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
      } else {
        // Unexpected response format
        console.error("Unexpected API response format:", res);
        toast.error("Unexpected response from server");
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error creating module and lessons:", error);
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    } finally {
      setSubmittingModuleId(null);
    }
  };

  const updateLesson = async (moduleId: string, lessonId: string, data: Partial<Lesson>) => {
    try {
      const next = modules.map((m) => (m.id === moduleId ? { ...m, lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, ...data } : l)) } : m));
      safeSetModules(next);
      setEditingLesson(null);
    } catch (error) {
      console.error("Error updating lesson:", error);
    }
  };

  /**
   * Permanently remove a lesson from a module in local state.
   * Caller is expected to confirm with the user before invoking.
   */
  const deleteLesson = async (moduleId: string, lessonId: string) => {
    try {
      // Call the backend API to delete the lesson
      await deleteLessonAction(lessonId);

      // Update local state after successful deletion
      const next = modules.map((m) => {
        if (m.id !== moduleId) return m;
        // Remove lesson and re-index positions starting from 1
        const reindexedLessons = m.lessons.filter((l) => l.id !== lessonId).map((lesson, index) => ({ ...lesson, position: index + 1 }));
        return { ...m, lessons: reindexedLessons };
      });

      safeSetModules(next);
    } catch (error) {
      console.error("Error deleting lesson:", error);
      // Re-throw the error so the UI can handle it appropriately
      throw error;
    }
  };

  /**
   * Open the delete confirmation modal for a module.
   */
  const openDeleteModuleModal = (moduleId: string) => {
    setDeleteModal({ isOpen: true, target: { kind: "module", moduleId } });
  };

  /**
   * Open the delete confirmation modal for a lesson.
   */
  const openDeleteLessonModal = (moduleId: string, lessonId: string) => {
    setDeleteModal({ isOpen: true, target: { kind: "lesson", moduleId, lessonId } });
  };

  /**
   * Close the delete confirmation modal without taking action.
   */
  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, target: null });
  };

  /**
   * Confirm current deletion in the modal and perform the action.
   */
  const confirmDelete = async () => {
    const target = deleteModal.target;
    if (!target) return;
    try {
      if (target.kind === "module") {
        await deleteModule(target.moduleId);
        toast.success("Module deleted successfully!");
      } else {
        await deleteLesson(target.moduleId, target.lessonId);
        toast.success("Lesson deleted successfully!");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete. Please try again.";
      toast.error(errorMessage);
    } finally {
      setDeleteModal({ isOpen: false, target: null });
    }
  };

  const addContentToLesson = async (moduleId: string, lessonId: string, fileResult: FileUploadResult) => {
    try {
      const newContent: LessonContent = {
        id: generateId(),
        title: fileResult.originalName,
        type: fileResult.type,
        url: fileResult.url,
        size: fileResult.size,
        filename: fileResult.filename,
      };
      safeSetModulesFn((prev) => {
        const updatedModules = prev.map((m) =>
          m.id === moduleId
            ? {
                ...m,
                lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, contents: [...(l.contents ?? []), newContent] } : l)),
              }
            : m
        );
        return updatedModules;
      });
      setLessonActiveTab((prev) => ({ ...prev, [lessonId]: "resources" }));
    } catch (error) {
      console.error("Error adding content to lesson:", error);
    }
  };

  const addQuestion = (moduleId: string, lessonId: string) => {
    safeSetModulesFn((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lessonId
                  ? {
                      ...l,
                      questions: [
                        ...(l.questions ?? []),
                        {
                          id: generateId(),
                          text: "New question",
                          options: [
                            { id: generateId(), text: "Option 1", is_correct: true },
                            { id: generateId(), text: "Option 2", is_correct: false },
                          ],
                        },
                      ],
                    }
                  : l
              ),
            }
          : m
      )
    );
    setLessonActiveTab((prev) => ({ ...prev, [lessonId]: "questions" }));
  };

  const updateQuestion = (moduleId: string, lessonId: string, questionId: string, text: string) => {
    safeSetModulesFn((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, questions: (l.questions ?? []).map((q) => (q.id === questionId ? { ...q, text } : q)) } : l)),
            }
          : m
      )
    );
  };

  const deleteQuestion = (moduleId: string, lessonId: string, questionId: string) => {
    let remaining = 0;
    let hasAssignment = false;
    let hasResources = false;
    safeSetModulesFn((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) => {
                if (l.id !== lessonId) return l;
                const nextQuestions = (l.questions ?? []).filter((q) => q.id !== questionId);
                remaining = nextQuestions.length;
                hasAssignment = !!l.assignment;
                hasResources = (l.contents?.length ?? 0) > 0;
                return { ...l, questions: nextQuestions };
              }),
            }
          : m
      )
    );
    setLessonActiveTab((prev) => {
      if (prev[lessonId] !== "questions") return prev;
      if (remaining > 0) return prev;
      const nextTab: LessonTab = hasAssignment ? "assignment" : hasResources ? "resources" : null;
      return { ...prev, [lessonId]: nextTab };
    });
  };

  const addOption = (moduleId: string, lessonId: string, questionId: string) => {
    safeSetModulesFn((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lessonId
                  ? {
                      ...l,
                      questions: (l.questions ?? []).map((q) =>
                        q.id === questionId
                          ? {
                              ...q,
                              options: [...q.options, { id: generateId(), text: "New option", is_correct: false }],
                            }
                          : q
                      ),
                    }
                  : l
              ),
            }
          : m
      )
    );
  };

  const updateOptionText = (moduleId: string, lessonId: string, questionId: string, optionId: string, text: string) => {
    safeSetModulesFn((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lessonId
                  ? {
                      ...l,
                      questions: (l.questions ?? []).map((q) =>
                        q.id === questionId
                          ? {
                              ...q,
                              options: q.options.map((o) => (o.id === optionId ? { ...o, text } : o)),
                            }
                          : q
                      ),
                    }
                  : l
              ),
            }
          : m
      )
    );
  };

  const setCorrectOption = (moduleId: string, lessonId: string, questionId: string, optionId: string) => {
    safeSetModulesFn((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lessonId
                  ? {
                      ...l,
                      questions: (l.questions ?? []).map((q) =>
                        q.id === questionId
                          ? {
                              ...q,
                              options: q.options.map((o) => ({ ...o, is_correct: o.id === optionId })),
                            }
                          : q
                      ),
                    }
                  : l
              ),
            }
          : m
      )
    );
  };

  const deleteOption = (moduleId: string, lessonId: string, questionId: string, optionId: string) => {
    safeSetModulesFn((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lessonId
                  ? {
                      ...l,
                      questions: (l.questions ?? []).map((q) => {
                        if (q.id !== questionId) return q;
                        const remaining = q.options.filter((o) => o.id !== optionId);
                        if (remaining.length > 0 && !remaining.some((o) => o.is_correct)) {
                          remaining[0] = { ...remaining[0], is_correct: true };
                        }
                        return { ...q, options: remaining };
                      }),
                    }
                  : l
              ),
            }
          : m
      )
    );
  };

  const enableAssignment = (moduleId: string, lessonId: string) => {
    safeSetModulesFn((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, assignment: { id: generateId(), title: "", description: "" } } : l)),
            }
          : m
      )
    );
    setLessonActiveTab((prev) => ({ ...prev, [lessonId]: "assignment" }));
  };

  const removeAssignment = (moduleId: string, lessonId: string) => {
    let hasQuestions = false;
    let hasResources = false;
    safeSetModulesFn((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) => {
                if (l.id !== lessonId) return l;
                hasQuestions = (l.questions?.length ?? 0) > 0;
                hasResources = (l.contents?.length ?? 0) > 0;
                return { ...l, assignment: null };
              }),
            }
          : m
      )
    );
    setLessonActiveTab((prev) => {
      if (prev[lessonId] !== "assignment") return prev;
      const nextTab: LessonTab = hasQuestions ? "questions" : hasResources ? "resources" : null;
      return { ...prev, [lessonId]: nextTab };
    });
  };

  const updateAssignmentField = (moduleId: string, lessonId: string, field: "title" | "description", value: string) => {
    safeSetModulesFn((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lessonId
                  ? {
                      ...l,
                      assignment: { id: l.assignment?.id ?? generateId(), title: field === "title" ? value : l.assignment?.title ?? "", description: field === "description" ? value : l.assignment?.description },
                    }
                  : l
              ),
            }
          : m
      )
    );
  };

  return {
    // state
    modules,
    expandedModules,
    expandedLessons,
    editingModule,
    setEditingModule,
    editingLesson,
    setEditingLesson,
    isLoading,
    draggedModule,
    draggedLesson,
    lessonActiveTab,
    setLessonActiveTab,
    submittingModuleId,
    deleteModal,
    // actions
    toggleModuleExpansion,
    toggleLessonExpansion,
    handleModuleDragStart,
    handleModuleDragEnd,
    handleModuleDragOver,
    handleModuleDragLeave,
    handleModuleDrop,
    handleLessonDragStart,
    handleLessonDragEnd,
    handleLessonDragOver,
    handleLessonDragLeave,
    handleLessonDrop,
    createModule,
    updateModule,
    deleteModule,
    createLesson,
    deleteLesson,
    createModuleWithLesson,
    submitLessons,
    createModuleAndAllLessons,
    updateLesson,
    openDeleteModuleModal,
    openDeleteLessonModal,
    closeDeleteModal,
    confirmDelete,
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
  };
}
