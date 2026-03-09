import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { BuilderCanvas } from "@/components/builder/Canvas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Layers, Plus, Trash2, Edit2, Layout, Calendar, Clock, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

type View = "list" | "editor";

interface PageData {
  id: string;
  name: string;
  updatedAt: string;
  thumbnail?: string;
}

export default function LandingPages() {
  const [view, setView] = useState<View>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [pages, setPages] = useState<PageData[]>([
    { id: "1", name: "Modern Hero Page", updatedAt: "2024-03-20T10:00:00Z" },
    { id: "2", name: "SaaS Product Landing", updatedAt: "2024-03-19T15:30:00Z" },
  ]);

  const handleCreateNew = () => {
    setView("editor");
  };

  const handleEdit = (id: string) => {
    setView("editor");
  };

  const handleBack = () => {
    setView("list");
  };

  if (view === "editor") {
    return (
      <DndProvider backend={HTML5Backend}>
        <BuilderCanvas onBack={handleBack} />
      </DndProvider>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Layout className="w-6 h-6" />
              </div>
              Landing Pages
            </h1>
            <p className="text-gray-500 mt-1">Design, build and publish high-converting pages in minutes.</p>
          </div>
          <Button 
            onClick={handleCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all font-bold text-lg group"
          >
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Create New Page
          </Button>
        </div>

        {/* Stats & Search */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                placeholder="Search your pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-7 rounded-2xl border-gray-100 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-around">
            <div className="text-center">
              <div className="text-2xl font-black text-gray-900">{pages.length}</div>
              <div className="text-[10px] uppercase font-bold text-gray-400">Total Pages</div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <div className="text-2xl font-black text-blue-600">12.4k</div>
              <div className="text-[10px] uppercase font-bold text-gray-400">Total Views</div>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {pages.map((page) => (
            <div 
              key={page.id}
              className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col border-b-4 border-b-transparent hover:border-b-blue-500"
            >
              {/* Preview */}
              <div className="h-48 bg-gray-50 relative overflow-hidden flex items-center justify-center p-8">
                 <div className="w-full h-full bg-white rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 text-gray-300 group-hover:scale-105 group-hover:border-blue-200 group-hover:text-blue-200 transition-all">
                    <Layout className="w-10 h-10" />
                    <span className="text-xs font-bold uppercase tracking-widest">No Preview Available</span>
                 </div>
                 <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors pointer-events-none" />
              </div>
              
              {/* Info */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{page.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Updated {new Date(page.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none font-bold px-3">Live</Badge>
                </div>

                <div className="flex items-center gap-2 mt-auto">
                  <Button 
                    onClick={() => handleEdit(page.id)}
                    className="flex-1 bg-gray-900 hover:bg-black text-white rounded-xl py-5 font-bold shadow-lg shadow-gray-200"
                  >
                    Edit Page
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-12 h-12 rounded-xl border border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all p-0 flex items-center justify-center"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* New Page Trigger Card */}
          <button 
            onClick={handleCreateNew}
            className="group rounded-[2.5rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-12 hover:border-blue-500 hover:bg-blue-50/30 transition-all gap-4 text-gray-400 hover:text-blue-600"
          >
            <div className="w-16 h-16 rounded-full bg-gray-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors shadow-inner">
              <Plus className="w-8 h-8" />
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">Create New Page</div>
              <div className="text-xs font-medium opacity-60">Start with a blank canvas</div>
            </div>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
