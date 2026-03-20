"use client";

import { signOut } from "next-auth/react";
import { LogOut, MessageSquarePlus, Stethoscope, History } from "lucide-react";

export function Sidebar({ session }: { session: any }) {
  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen h-[100dvh]">
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Stethoscope className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">MediBot</h2>
          <p className="text-[10px] text-emerald-400 font-medium uppercase tracking-widest">Verified System</p>
        </div>
      </div>
      
      <div className="px-4 py-2">
        <button 
          onClick={() => window.location.href = '/'} 
          className="w-full flex items-center gap-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-lg px-3 py-2.5 transition-colors border border-blue-500/20 shadow-sm"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span className="text-sm font-medium">New Consultation</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-gray-800">
        <div className="flex items-center gap-2 mb-3 text-gray-500 px-1">
          <History className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Recent History</span>
        </div>
        <div className="space-y-1">
          {/* Static placeholders, later could be fetched from DB */}
          <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 transition-colors truncate">
            Patient Diagnosis 12/04
          </button>
          <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 transition-colors truncate">
            Cardiology Interaction
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-between bg-gray-800/50 rounded-xl p-3 border border-gray-700/50">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-inner">
              {session?.user?.name?.[0] || 'D'}
            </div>
            <div className="truncate pr-2">
              <p className="text-sm font-medium text-white truncate">{session?.user?.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{session?.user?.email}</p>
            </div>
          </div>
          <button 
            onClick={() => signOut()} 
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors shrink-0"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
