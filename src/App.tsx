import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { LayoutProvider } from '@/contexts/LayoutContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { MainLayout } from '@/layouts/MainLayout'
import { OnboardingLayout } from '@/layouts/OnboardingLayout'

import HomePage from '@/pages/HomePage'
import SearchPage from '@/pages/SearchPage'
import EventsPage from '@/pages/EventsPage'
import ArtistsPage from '@/pages/ArtistsPage'
import ArtistPage from '@/pages/ArtistPage'
import BookingPage from '@/pages/BookingPage'
import MyPage from '@/pages/MyPage'
import NotificationsPage from '@/pages/NotificationsPage'
import OnboardingPage from '@/pages/OnboardingPage'
import TransferDetailPage from '@/pages/TransferDetailPage'
import MembershipPage from '@/pages/MembershipPage'
import StyleGuidePage from '@/pages/StyleGuidePage'

function App() {
  return (
    <BrowserRouter>
      <TooltipProvider delayDuration={300}>
        <NotificationProvider>
          <LayoutProvider>
            <Routes>
              {/* Onboarding: full-screen, no sidebar */}
              <Route element={<OnboardingLayout />}>
                <Route path="/onboarding" element={<OnboardingPage />} />
              </Route>

              {/* Main layout: sidebar + top bar */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/artists" element={<ArtistsPage />} />
                <Route path="/artists/:artistId/transfers/:listingId" element={<TransferDetailPage />} />
                <Route path="/artists/:artistId/*" element={<ArtistPage />} />
                <Route path="/events/:eventId" element={<BookingPage />} />
                <Route path="/membership" element={<MembershipPage />} />
                <Route path="/my-page/*" element={<MyPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/style-guide" element={<StyleGuidePage />} />
              </Route>
            </Routes>
          </LayoutProvider>
        </NotificationProvider>
      </TooltipProvider>
    </BrowserRouter>
  )
}

export default App
