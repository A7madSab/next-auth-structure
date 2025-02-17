import { createContext, useEffect, useState } from "react"
import { THEMES } from "../constants"

const defaultSettings = {
  direction: "ltr",
  language: "English",
  responsiveFontSizes: true,
  theme: THEMES.ONE_DARK
}

export const restoreSettings = () => {
  let settings = null

  try {
    const storedData = window.localStorage.getItem("settings")

    if (storedData) {
      settings = JSON.parse(storedData)
    }
  } catch (err) {
    console.error(err)
  }

  return settings
}

export const storeSettings = (settings) => {
  window.localStorage.setItem("settings", JSON.stringify(settings))
}

const SettingsContext = createContext({
  settings: defaultSettings,
  saveSettings: () => { }
})

export const SettingsProvider = ({ settings, children }) => {
  const [currentSettings, setCurrentSettings] = useState(settings || defaultSettings)

  const handleSaveSettings = (update = {}) => {
    const mergedSettings = { ...currentSettings, ...update }

    setCurrentSettings(mergedSettings)
    storeSettings(mergedSettings)
  }

  useEffect(() => {
    const restoredSettings = restoreSettings()

    if (restoredSettings) {
      setCurrentSettings(restoredSettings)
    }
  }, [])

  useEffect(() => {
    document.dir = currentSettings.direction
  }, [currentSettings])

  return (
    <SettingsContext.Provider
      value={{
        settings: currentSettings,
        saveSettings: handleSaveSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const SettingsConsumer = SettingsContext.Consumer

export default SettingsContext
