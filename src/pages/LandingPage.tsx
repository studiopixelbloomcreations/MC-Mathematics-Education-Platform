import { Link } from 'react-router-dom'
import { AnnouncementsTicker } from '../components/landing/AnnouncementsTicker'
import { ClassesSection } from '../components/landing/ClassesSection'
import { ContactSection } from '../components/landing/ContactSection'
import { FeedbackSection } from '../components/landing/FeedbackSection'
import { HallOfFameSection } from '../components/landing/HallOfFameSection'
import { HeroSection } from '../components/landing/HeroSection'
import { MissionVisionSection } from '../components/landing/MissionVisionSection'
import { TeamSection } from '../components/landing/TeamSection'
import { TopNav } from '../components/layout/TopNav'
import { useLandingData } from '../hooks/useLandingData'
import { useAuth } from '../providers/auth-context'

export function LandingPage() {
  const { data } = useLandingData()
  const { profile } = useAuth()

  return (
    <div>
      <TopNav />
      <HeroSection />
      <HallOfFameSection entries={data.hallOfFame} />
      <MissionVisionSection />
      <ClassesSection classes={data.classes} />
      <FeedbackSection feedback={data.feedback} />
      <TeamSection members={data.teamMembers} />
      <AnnouncementsTicker announcements={data.announcements} />
      <ContactSection />

      <div className="fixed bottom-4 right-4 z-30">
        <Link
          to={profile ? '/userdashboard' : '/signup'}
          className="glass-panel inline-flex rounded-full px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/30 hover:text-white"
        >
          {profile ? 'Open Dashboard' : 'Sign Up'}
        </Link>
      </div>
    </div>
  )
}
