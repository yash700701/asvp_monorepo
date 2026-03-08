"use client"

import { useState } from "react"

export default function SettingsPage() {

  const [frequency, setFrequency] = useState("daily")
  const [maxQueries, setMaxQueries] = useState(20)

  const [sources, setSources] = useState({
    gpt: true,
    claude: true,
    perplexity: true,
    gemini: false
  })

  const [alerts, setAlerts] = useState({
    visibilityDrop: true,
    negativeSentiment: true,
    brandMissing: true,
    competitorOvertake: false
  })

  const [retention, setRetention] = useState(90)
  const [deleteRaw, setDeleteRaw] = useState(true)

  const team = [
    { name: "Yash", role: "Owner" },
    { name: "Rahul", role: "Analyst" }
  ]

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">

      <h1 className="text-2xl font-semibold">Settings</h1>

      {/* Brand Monitoring */}
      <section className="bg-white border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-lg">Brand Monitoring</h2>

        <div className="space-y-3">

          <div>
            <label className="text-sm font-medium">Default Query Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="mt-1 border rounded-md px-3 py-2 w-full"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Max Queries Per Brand</label>
            <input
              type="number"
              value={maxQueries}
              onChange={(e) => setMaxQueries(Number(e.target.value))}
              className="mt-1 border rounded-md px-3 py-2 w-full"
            />
          </div>

          <div>
            <p className="text-sm font-medium">AI Sources</p>

            <div className="grid grid-cols-2 gap-2 mt-2">

              {Object.entries(sources).map(([key, value]) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() =>
                      setSources({
                        ...sources,
                        [key]: !value
                      })
                    }
                  />
                  {key.toUpperCase()}
                </label>
              ))}

            </div>
          </div>

        </div>
      </section>


      {/* Alerts */}
      <section className="bg-white border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-lg">Alerts & Notifications</h2>

        <div className="space-y-2">

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={alerts.visibilityDrop}
              onChange={() =>
                setAlerts({ ...alerts, visibilityDrop: !alerts.visibilityDrop })
              }
            />
            Visibility drop &gt; 10%
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={alerts.negativeSentiment}
              onChange={() =>
                setAlerts({ ...alerts, negativeSentiment: !alerts.negativeSentiment })
              }
            />
            Negative sentiment spike
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={alerts.brandMissing}
              onChange={() =>
                setAlerts({ ...alerts, brandMissing: !alerts.brandMissing })
              }
            />
            Brand not mentioned
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={alerts.competitorOvertake}
              onChange={() =>
                setAlerts({ ...alerts, competitorOvertake: !alerts.competitorOvertake })
              }
            />
            Competitor overtakes brand
          </label>

        </div>
      </section>


      {/* Team Management */}
      <section className="bg-white border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-lg">Team Management</h2>

        <div className="space-y-2">

          {team.map((member, i) => (
            <div
              key={i}
              className="flex justify-between border-b pb-2 text-sm"
            >
              <span>{member.name}</span>
              <span className="text-gray-500">{member.role}</span>
            </div>
          ))}

        </div>

        <button className="text-sm bg-black text-white px-3 py-1 rounded-md">
          Invite Member
        </button>

      </section>


      {/* Data & Privacy */}
      <section className="bg-white border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-lg">Data & Privacy</h2>

        <div>
          <label className="text-sm font-medium">Store answers for</label>

          <select
            value={retention}
            onChange={(e) => setRetention(Number(e.target.value))}
            className="mt-1 border rounded-md px-3 py-2 w-full"
          >
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
            <option value={180}>180 days</option>
            <option value={365}>1 year</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={deleteRaw}
            onChange={() => setDeleteRaw(!deleteRaw)}
          />
          Delete raw answers after parsing
        </label>

      </section>


      {/* Save Button */}
      <div className="flex justify-end">
        <button className="bg-black text-white px-6 py-2 rounded-lg">
          Save Settings
        </button>
      </div>

    </div>
  )
}