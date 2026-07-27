import { Routes, Route, useNavigate } from 'react-router-dom'
import { Shell } from './components/Shell'
import { ToastProvider } from './components/Toast'
import { AuthProvider, useAuth } from './components/AuthContext'
import { AuthScreen } from './screens/Auth'
import { CommandCenter } from './screens/CommandCenter'
import { Opportunities } from './screens/Opportunities'
import { InquiryDesk } from './screens/InquiryDesk'
import { Inventory } from './screens/Inventory'
import { Demand } from './screens/Demand'
import { Logistics } from './screens/Logistics'
import { Procurement } from './screens/Procurement'
import { Copilot } from './screens/Copilot'
import { Access } from './screens/Access'

function CopilotRoute() {
  const navigate = useNavigate()
  return <Copilot onNavigate={(to) => navigate(to)} />
}

/** The platform itself — only reachable once someone is signed in. */
function Desk() {
  const { user } = useAuth()
  if (!user) return <AuthScreen />

  return (
    <Shell>
      <Routes>
        <Route path="/" element={<CommandCenter />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/inbox" element={<InquiryDesk />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/demand" element={<Demand />} />
        <Route path="/logistics" element={<Logistics />} />
        <Route path="/procurement" element={<Procurement />} />
        <Route path="/copilot" element={<CopilotRoute />} />
        <Route path="/access" element={<Access />} />
      </Routes>
    </Shell>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Desk />
      </AuthProvider>
    </ToastProvider>
  )
}
