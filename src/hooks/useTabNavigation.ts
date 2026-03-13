import { useLocation, useNavigate } from 'react-router-dom'

/**
 * Derives the active tab from the current pathname and provides a handler
 * to navigate between tabs.
 *
 * @param basePath  - e.g. "/artists/gdragon" or "/my-page"
 * @param tabMap    - ordered list of { suffix, tab } where suffix is the URL
 *                    segment (e.g. "community") and tab is the value used
 *                    by the Tabs component. The last entry is treated as the
 *                    default tab (when no suffix matches).
 * @param defaultTab - the tab value to use when no suffix matches
 */
export function useTabNavigation(
  basePath: string,
  tabs: { suffix: string; tab: string }[],
  defaultTab: string,
) {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const activeTab =
    tabs.find((t) => t.suffix && pathname.endsWith(`/${t.suffix}`))?.tab ?? defaultTab

  const handleTabChange = (value: string) => {
    navigate(value === defaultTab ? basePath : `${basePath}/${value}`)
  }

  return { activeTab, handleTabChange }
}
