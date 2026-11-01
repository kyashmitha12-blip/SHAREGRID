import { lazy, Suspense, useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedResources } from './components/FeaturedResources';
import { HowItWorks } from './components/HowItWorks';
import { BenefitsSection } from './components/BenefitsSection';
import { InstitutionalTrust } from './components/InstitutionalTrust';
import { Footer } from './components/Footer';
import { ResourceModal } from './components/ResourceModal';
import { ListResourceModal } from './components/ListResourceModal';
import { AuthModal } from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import { ResourceItem, SearchFilters } from './types/resource';

const DirectoryPage = lazy(() => import('./components/DirectoryPage').then(module => ({ default: module.DirectoryPage })));
const ResourceDetailPage = lazy(() => import('./components/ResourceDetailPage').then(module => ({ default: module.ResourceDetailPage })));
const DashboardLayout = lazy(() => import('./components/dashboard/DashboardLayout').then(module => ({ default: module.DashboardLayout })));

export function App() {
  const { resources } = useAuth();
  const [currentView, setCurrentView] = useState<'home' | 'directory' | 'resource-detail' | 'dashboard'>('home');
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [quickInspectResource, setQuickInspectResource] = useState<ResourceItem | null>(null);
  const [listModalOpen, setListModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('resources');

  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    city: 'All Locations',
    operatorRequired: false,
    academicSubsidized: false,
    sortBy: 'recommended'
  });

  // Handle browser URL hash for direct links and browser back navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#directory') {
        setCurrentView('directory');
      } else if (hash === '#dashboard') {
        setCurrentView('dashboard');
      } else if (hash.startsWith('#resource-')) {
        const id = hash.replace('#resource-', '');
        const found = resources.find(r => r.id === id);
        if (found) {
          setSelectedResource(found);
          setCurrentView('resource-detail');
        }
      } else if (hash === '#home' || hash === '') {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [resources]);

  // Handle global keyboard shortcuts (e.g. '/' for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (currentView !== 'directory') {
          setCurrentView('directory');
          window.location.hash = '#directory';
        }
        setTimeout(() => {
          const searchInput = document.querySelector('input[placeholder*="Search by equipment"]') as HTMLInputElement ||
            document.querySelector('input[placeholder*="SEM, NMR"]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
            searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView]);

  // Update search filters
  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      query: '',
      category: 'all',
      city: 'All Locations',
      operatorRequired: false,
      academicSubsidized: false,
      sortBy: 'recommended'
    });
  };

  // Filter & Sort resources for homepage featured section
  const filteredHomeResources = useMemo(() => {
    return resources.filter(item => {
      // Category filter
      if (filters.category !== 'all' && item.category !== filters.category) {
        return false;
      }

      // City filter
      if (filters.city !== 'All Locations' && item.location.city !== filters.city) {
        return false;
      }

      // Academic subsidized filter
      if (filters.academicSubsidized && !item.pricing.subsidizedForAcademia) {
        return false;
      }

      // Operator assistance filter
      if (filters.operatorRequired && !item.operatorAssistance) {
        return false;
      }

      // Text query match (title, code, description, institution, specs)
      if (filters.query.trim()) {
        const q = filters.query.toLowerCase().trim();
        const inTitle = item.title.toLowerCase().includes(q);
        const inCode = item.code.toLowerCase().includes(q);
        const inDesc = item.description.toLowerCase().includes(q);
        const inInst = item.institution.name.toLowerCase().includes(q);
        const inCity = item.location.city.toLowerCase().includes(q);
        const inSpecs = item.specifications.some(
          s => s.label.toLowerCase().includes(q) || s.value.toLowerCase().includes(q)
        );

        if (!inTitle && !inCode && !inDesc && !inInst && !inCity && !inSpecs) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-low') {
        const rateA = a.pricing.hourlyRate || (a.pricing.dailyRate ? a.pricing.dailyRate / 8 : 9999);
        const rateB = b.pricing.hourlyRate || (b.pricing.dailyRate ? b.pricing.dailyRate / 8 : 9999);
        return rateA - rateB;
      }
      if (filters.sortBy === 'price-high') {
        const rateA = a.pricing.hourlyRate || (a.pricing.dailyRate ? a.pricing.dailyRate / 8 : 0);
        const rateB = b.pricing.hourlyRate || (b.pricing.dailyRate ? b.pricing.dailyRate / 8 : 0);
        return rateB - rateA;
      }
      if (filters.sortBy === 'availability') {
        if (a.availability.status === 'available' && b.availability.status !== 'available') return -1;
        if (b.availability.status === 'available' && a.availability.status !== 'available') return 1;
        return a.availability.leadTimeDays - b.availability.leadTimeDays;
      }
      if (a.featured && !b.featured) return -1;
      if (b.featured && !a.featured) return 1;
      return b.institution.rating - a.institution.rating;
    });
  }, [filters, resources]);

  const handleSelectResourceForDetail = (resource: ResourceItem) => {
    setSelectedResource(resource);
    setCurrentView('resource-detail');
    window.location.hash = `#resource-${resource.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToDirectory = () => {
    setCurrentView('directory');
    window.location.hash = '#directory';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
    window.location.hash = '#home';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateDashboard = () => {
    setCurrentView('dashboard');
    window.location.hash = '#dashboard';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchShortcut = () => {
    if (currentView === 'home') {
      const searchEl = document.querySelector('input[placeholder*="SEM, NMR"]') as HTMLElement;
      if (searchEl) {
        searchEl.focus();
        searchEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        handleNavigateToDirectory();
      }
    } else if (currentView === 'directory') {
      const searchEl = document.querySelector('input[placeholder*="Search by equipment"]') as HTMLElement;
      searchEl?.focus();
      searchEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      handleNavigateToDirectory();
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col selection:bg-accent-lime selection:text-forest-950 font-sans">
      {/* Navigation */}
      <Navbar
        onSearchClick={handleSearchShortcut}
        onListResourceClick={() => setListModalOpen(true)}
        onSignInClick={() => setAuthModalOpen(true)}
        activeSection={activeSection}
        currentView={currentView}
        onNavigateHome={handleNavigateHome}
        onNavigateDirectory={handleNavigateToDirectory}
        onNavigateDashboard={handleNavigateDashboard}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        <Suspense fallback={<div className="min-h-[40vh]" aria-label="Loading page" />}>
        {currentView === 'home' && (
          <>
            {/* Hero Section with Search Integration */}
            <Hero
              filters={filters}
              onFilterChange={handleFilterChange}
              totalResults={filteredHomeResources.length}
              onExploreClick={() => {
                const el = document.getElementById('resources');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onListClick={() => setListModalOpen(true)}
            />

            {/* Featured & Filterable Resources Directory on Home */}
            <FeaturedResources
              resources={filteredHomeResources}
              filters={filters}
              onFilterChange={handleFilterChange}
              onSelectResource={handleSelectResourceForDetail}
              onResetFilters={handleResetFilters}
              onOpenDirectory={handleNavigateToDirectory}
            />

            {/* How It Works Section */}
            <HowItWorks />

            {/* Benefits Section */}
            <BenefitsSection />

            {/* Institutional Trust & Compliance Section */}
            <InstitutionalTrust />
          </>
        )}

        {currentView === 'directory' && (
          <DirectoryPage
            resources={resources}
            onSelectResource={handleSelectResourceForDetail}
            initialCategory={filters.category}
          />
        )}

        {currentView === 'resource-detail' && selectedResource && (
          <ResourceDetailPage
            resource={selectedResource}
            onBack={handleNavigateToDirectory}
            onSelectRelatedResource={handleSelectResourceForDetail}
            allResources={resources}
            onNavigateToDashboard={handleNavigateDashboard}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardLayout
            onBackToDirectory={handleNavigateToDirectory}
            onOpenLoginModal={() => setAuthModalOpen(true)}
          />
        )}
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Modals */}
      <ResourceModal
        resource={quickInspectResource}
        onClose={() => setQuickInspectResource(null)}
      />

      <ListResourceModal
        isOpen={listModalOpen}
        onClose={() => setListModalOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccessRedirectToDashboard={handleNavigateDashboard}
      />
    </div>
  );
}

export default App;
