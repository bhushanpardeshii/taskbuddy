"use client"
import { useState } from "react"
import { Header } from "./components/header"
import { TaskSection } from "./components/task-section"
import List from "./components/List"

export default function Home() {
  const [expandedSections, setExpandedSections] = useState({
    todo: true,
    inProgress: true,
    completed: true,
  })

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="min-h-screen ">
      <Header />
      <List/>
    </div>
  )
}

