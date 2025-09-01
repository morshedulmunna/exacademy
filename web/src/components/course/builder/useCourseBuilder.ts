"use client";

import { useEffect, useState } from "react";
import type { Module, Lesson, LessonContent } from "./types";
import type { FileUploadResult } from "@/hooks/useCourseContentUpload";
import { apiCreateDeepModules, apiListModulesDeep } from "./services/api";
import { moduleSchema } from "./services/schemas";
import { transformDeepModulesResponse } from "./services/transformers";
import { buildCreateModulePayload, sanitizePayload } from "./services/payload";
import toast from "react-hot-toast";
// toast and API calls are intentionally not used when only logging payloads

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

  const loadModules = async () => {
    if (!courseId) {
      setModules([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiListModulesDeep(courseId);
      const transformedModules: Module[] = transformDeepModulesResponse(response);
      setModules(transformedModules);

      // Auto-expand modules that have lessons
      const modulesWithLessons = new Set(transformedModules.filter((module) => module.lessons.length > 0).map((module) => module.id));
      setExpandedModules(modulesWithLessons);
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
    setModules(updatedModules);
    try {
      const payload = {
        courseId,
        modules: updatedModules.map((m) => ({ id: m.id, position: m.position })),
      };
      console.log("[DRAG&DROP] Update module positions (simulate backend):", payload);
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
    newModules[sourceModuleIndex].lessons = newModules[sourceModuleIndex].lessons.map((lesson, index) => ({ ...lesson, position: index + 1 }));

    setModules(newModules);
    setDraggedLesson(null);
  };

  const createModule = async () => {
    try {
      const payload = { title: "New Module", description: "", position: modules.length + 1 } as any;
      const backendId = `tmp_${crypto.randomUUID()}`;
      const newModule: Module = { id: backendId, title: payload.title, description: payload.description, position: payload.position, lessons: [] };
      const next = [...modules, newModule];
      setModules(next);
      setExpandedModules((prev) => new Set([...prev, newModule.id]));
      console.log("Created module (local):", newModule);
    } catch (error) {
      console.error("Error creating module:", error);
    }
  };

  const updateModule = async (moduleId: string, data: Partial<Module>) => {
    try {
      const next = modules.map((m) => (m.id === moduleId ? { ...m, ...data } : m));
      setModules(next);
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
      const next = modules.filter((m) => m.id !== moduleId);
      setModules(next);
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };

  const createLesson = async (moduleId: string) => {
    try {
      const module = modules.find((m) => m.id === moduleId);
      const lessonPosition = module ? module.lessons.length + 1 : 1;
      const id = `tmp_${crypto.randomUUID()}`;
      const newLesson: Lesson = { id, title: "New Lesson", description: "", content: "", video_url: "", video_source: "url", video_file: null, duration: "0m", position: lessonPosition, is_free: false, published: false, contents: [], questions: [], assignment: null };
      const next = modules.map((m) => (m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m));
      setModules(next);
      setEditingLesson(newLesson.id);
    } catch (error) {
      console.error("Error creating lesson:", error);
    }
  };

  const createModuleWithLesson = async () => {
    try {
      const moduleId = `tmp_${crypto.randomUUID()}`;
      const newModule: Module = {
        id: moduleId,
        title: "New Module",
        description: "",
        position: modules.length + 1,
        lessons: [],
      };
      const lessonId = `tmp_${crypto.randomUUID()}`;
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
      setModules(next);
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
      console.log("[COURSE BUILDER] Create Module payload:", payload);
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
      console.log("Submitting lessons (local only):", consolePayload);
    } catch (error) {
      console.error("Error submitting lessons:", error);
    } finally {
      setSubmittingModuleId(null);
    }
  };

  const createModuleAndAllLessons = async (moduleId: string) => {
    // Prevent multiple simultaneous calls
    if (submittingModuleId === moduleId) {
      console.log("Already submitting module:", moduleId);
      return;
    }

    try {
      const module = modules.find((m) => m.id === moduleId);
      if (!module || !courseId) return;
      setSubmittingModuleId(moduleId);

      console.log("Creating module and lessons for:", moduleId, "with lessons count:", module.lessons.length);

      const payload = buildCreateModulePayload(courseId, {
        ...module,
        position: module.position ?? modules.findIndex((m) => m.id === moduleId) + 1,
      } as Module);

      const sanitizedPayload = sanitizePayload(payload);

      try {
        console.log("Payload prepared:", JSON.stringify(sanitizedPayload, null, 2));
      } catch (serializeError) {
        console.error("Error serializing payload:", serializeError);
        console.log("Payload structure:", {
          course_id: sanitizedPayload.course_id,
          title: sanitizedPayload.title,
          lessons_count: sanitizedPayload.lessons.length,
          lessons: sanitizedPayload.lessons.map((l: any) => ({ id: l.title, title: l.title })),
        });
      }

      try {
        await moduleSchema.validate(sanitizedPayload, { abortEarly: false });
        console.log("Validation passed");
      } catch (err: any) {
        const msg = (err?.errors as string[])?.[0] || "Validation failed";
        console.error("Validation failed:", err);
        toast.error(msg);
        throw err;
      }

      console.log("Calling createDeepModules API...");

      const finalPayload = sanitizePayload(sanitizedPayload);

      console.log("Final payload size:", JSON.stringify(finalPayload).length, "characters");

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("API call timeout")), 30000); // 30 seconds timeout
      });

      const apiPromise = apiCreateDeepModules(finalPayload.course_id, finalPayload);
      const res = await Promise.race([apiPromise, timeoutPromise]);

      console.log("API response:", res);

      if (res?.success === false) {
        toast.error(res.message || "Failed to create module");
      } else {
        toast.success("Module created successfully");
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
      console.log("Updating lesson:", lessonId, "in module:", moduleId, "with data:", data);
      const next = modules.map((m) => (m.id === moduleId ? { ...m, lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, ...data } : l)) } : m));
      setModules(next);
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
      console.log("Deleting lesson:", lessonId, "from module:", moduleId);
      const next = modules.map((m) => (m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m));
      console.log("Updated modules after deletion:", next);

      setModules(next);
    } catch (error) {
      console.error("Error deleting lesson:", error);
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
      } else {
        await deleteLesson(target.moduleId, target.lessonId);
      }
    } finally {
      setDeleteModal({ isOpen: false, target: null });
    }
  };

  const addContentToLesson = async (moduleId: string, lessonId: string, fileResult: FileUploadResult) => {
    try {
      const newContent: LessonContent = {
        id: crypto.randomUUID(),
        title: fileResult.originalName,
        type: fileResult.type,
        url: fileResult.url,
        size: fileResult.size,
        filename: fileResult.filename,
      };
      setModules((prev) => {
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
    setModules((prev) =>
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
                          id: crypto.randomUUID(),
                          text: "New question",
                          options: [
                            { id: crypto.randomUUID(), text: "Option 1", is_correct: true },
                            { id: crypto.randomUUID(), text: "Option 2", is_correct: false },
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
    setModules((prev) =>
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
    setModules((prev) =>
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
    setModules((prev) =>
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
                              options: [...q.options, { id: crypto.randomUUID(), text: "New option", is_correct: false }],
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
    setModules((prev) =>
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
    setModules((prev) =>
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
    setModules((prev) =>
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
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, assignment: { id: crypto.randomUUID(), title: "", description: "" } } : l)),
            }
          : m
      )
    );
    setLessonActiveTab((prev) => ({ ...prev, [lessonId]: "assignment" }));
  };

  const removeAssignment = (moduleId: string, lessonId: string) => {
    let hasQuestions = false;
    let hasResources = false;
    setModules((prev) =>
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
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lessonId
                  ? {
                      ...l,
                      assignment: { id: l.assignment?.id ?? crypto.randomUUID(), title: field === "title" ? value : l.assignment?.title ?? "", description: field === "description" ? value : l.assignment?.description },
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
