// Redesign CSS for live site pages. Imported (not <link>ed) so Next bundles it
// into <head> as render-blocking CSS — prevents a flash of unstyled HTML on load
// and on client-side navigation. Fonts are linked once in app/[locale]/layout.tsx.
import './styles/blocks-scroll.css'
import './styles/blocks-site.css'

export default function BlocksStyles() {
  return null
}
