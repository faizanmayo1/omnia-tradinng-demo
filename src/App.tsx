import { Routes, Route, useNavigate } from 'react-router-dom'
import { Shell } from './components/Shell'
import { ToastProvider } from './components/Toast'
import { CommandCenter } from './screens/CommandCenter'
import { Opportunities } from './screens/Opportunities'
import { Inventory } from './screens/Inventory'
import { Demand } from './screens/Demand'
import { Logistics } from './screens/Logistics'
import { Procurement } from './screens/Procurement'
import { Copilot } from './screens/Copilot'

function CopilotRoute() {
  const navigate = useNavigate()
  return <Copilot onNavigate={(to) => navigate(to)} />
}

export default function App() {
  return (
    <ToastProvider>
      <Shell>
        <Routes>
          <Route path="/" element={<CommandCenter />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/demand" element={<Demand />} />
          <Route path="/logistics" element={<Logistics />} />
          <Route path="/procurement" element={<Procurement />} />
          <Route path="/copilot" element={<CopilotRoute />} />
        </Routes>
      </Shell>
    </ToastProvider>
  )
}
