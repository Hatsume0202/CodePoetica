import type { ReactNode } from 'react';
import type { TabId } from '../types';
import TabBar from './TabBar';

interface LayoutProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  children: ReactNode;
}

export default function Layout({ activeTab, onTabChange, children }: LayoutProps) {
  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-icon">✨</span>
            CodePoetica
          </h1>
          <p className="app-subtitle">Where Code Becomes Poetry</p>
        </div>
        <TabBar activeTab={activeTab} onTabChange={onTabChange} />
      </header>

      <main className="app-main">
        {children}
      </main>

      <footer className="app-footer">
        <p>
          CodePoetica — Transforming logic into lyrical art ✨
        </p>
        <p className="footer-credit">
          Built with React + TypeScript + Vite | MIT License
        </p>
      </footer>
    </div>
  );
}
