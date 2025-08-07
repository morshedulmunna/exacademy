"use client";

import React, { useState } from "react";
import { ChevronDown, Grid3X3, Search, FileText, ArrowLeft } from "lucide-react";

import { Draft, PublishedArticle } from './types';

import { DraftSelectHandler, NewDraftHandler, SearchHandler } from './types';

interface BlogSidebarProps {
  onDraftSelect?: DraftSelectHandler;
  onNewDraft?: NewDraftHandler;
  onSearch?: SearchHandler;
}

export default function BlogSidebar({ onDraftSelect, onNewDraft, onSearch }: BlogSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    submitted: true,
    drafts: true,
    published: true,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const myDrafts: Draft[] = [{ id: "1", title: "Untitled", isActive: true }];

  const publishedArticles: PublishedArticle[] = [
    { id: "1", title: "How Closures Work Und..." },
    { id: "2", title: "Go vs Rust (Tokio): Stack..." },
    { id: "3", title: "Step by Step Setup Server..." },
    { id: "4", title: "Must be Learn DSA in 2025" },
    { id: "5", title: "JavaScript Dev fundamental" },
    { id: "6", title: "Fundamental of Javascript" },
    { id: "7", title: "Understanding the Promise..." },
    { id: "8", title: "Understanding the Differen..." },
    { id: "9", title: "Understanding Temporal De..." },
    { id: "10", title: "Embracing the React Functi..." },
    { id: "11", title: "Microservice Architecture D..." },
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleDraftClick = (draftId: string) => {
    onDraftSelect?.(draftId);
  };

  const handleNewDraft = () => {
    onNewDraft?.();
  };

  return (
    <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">MM</span>
            </div>
            <span className="text-sm font-medium">Morshedul Mun...</span>
          </div>
          <div className="flex items-center space-x-2">
            <ChevronDown className="w-4 h-4 text-gray-400" />
            <Grid3X3 className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search drafts..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* New Draft Button */}
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={handleNewDraft}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
        >
          <FileText className="w-4 h-4" />
          <span>New draft</span>
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto">
        {/* Submitted Drafts */}
        <div className="border-b border-gray-700">
          <button
            onClick={() => toggleSection("submitted")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-700 transition-colors"
          >
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              SUBMITTED DRAFTS (0)
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                expandedSections.submitted ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedSections.submitted && (
            <div className="px-4 pb-4">
              <p className="text-sm text-gray-500">No submitted drafts</p>
            </div>
          )}
        </div>

        {/* My Drafts */}
        <div className="border-b border-gray-700">
          <button
            onClick={() => toggleSection("drafts")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-700 transition-colors"
          >
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              MY DRAFTS (1)
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                expandedSections.drafts ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedSections.drafts && (
            <div className="px-4 pb-4">
              {myDrafts.map((draft) => (
                <div
                  key={draft.id}
                  onClick={() => handleDraftClick(draft.id)}
                  className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-colors ${
                    draft.isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">{draft.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Published Articles */}
        <div className="border-b border-gray-700">
          <button
            onClick={() => toggleSection("published")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-700 transition-colors"
          >
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              PUBLISHED (31)
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                expandedSections.published ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedSections.published && (
            <div className="px-4 pb-4 max-h-64 overflow-y-auto">
              {publishedArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center space-x-3 p-2 rounded-md cursor-pointer hover:bg-gray-700 transition-colors"
                >
                  <div className="w-4 h-4 border border-gray-500 rounded-sm"></div>
                  <span className="text-sm text-gray-300">{article.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-700">
        <div className="space-y-2">
          <button className="w-full text-left text-sm text-gray-400 hover:text-white transition-colors">
            View deleted articles
          </button>
          <button className="w-full text-left text-sm text-gray-400 hover:text-white transition-colors">
            Blog dashboard
          </button>
          <button className="w-full flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to home</span>
          </button>
        </div>
      </div>
    </div>
  );
} 