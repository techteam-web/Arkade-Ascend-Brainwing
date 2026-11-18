// The Tower is the home screen (client, 18 Nov 2026): the site opens straight
// on the orbit, and the menu is the bar of pills at the foot (BottomNav).
// Pages with `group: 'resources'` leave the menu and are listed on the
// Resources page instead. `menu: false` keeps a page off the menu (client,
// 18 Nov 2026: The Tower, being home, and Amenities); those
// pages still open from their links and addresses.
export const routes = [
  { id: 'tower', path: '/', menu: false, label: 'The Tower', hint: 'Architecture in the round', scene: 'tower', preview: '/gallery/exterior/cam02-twilight-1600.webp', previewNote: 'Architect’s impression' },
  { id: 'about', path: '/about-us', label: 'About Us', hint: '40+ Years of Creating Happy Spaces For Happy Faces', scene: 'plum', preview: '/logo/arkade-white.png', previewLogo: true },
  { id: 'neu-gen', path: '/neu-gen', label: 'Neu Gen Life', hint: 'The vision', scene: 'arrival', preview: '/neu-gen/landmark-1600.webp' },
  { id: 'residences', path: '/residences', label: 'Residences', hint: 'Find your residence', scene: 'residences', preview: '/gallery/exterior/cam27-evening-1600.webp', previewNote: 'Architect’s impression' },
  { id: 'specifications', path: '/specifications', label: 'Specifications', hint: 'Crafted in detail', scene: 'plum', preview: '/brochure/specs/living-dining.webp' },
  { id: 'amenities', path: '/amenities', menu: false, label: 'Amenities', hint: 'Life beyond home', scene: 'amenities', preview: '/brochure/amenities/lap-pool.webp' },
  { id: 'views', path: '/views', label: 'Views', hint: 'The city from above', scene: 'views', preview: '/views/evening/still.webp' },
  { id: 'location', path: '/location', label: 'Location', hint: 'The city at your command', scene: 'cream', tone: 'light', preview: '/brochure/location-map.webp' },
  { id: 'gallery', path: '/gallery', label: 'Gallery', hint: 'Curated visions of Ascend', scene: 'gallery', preview: '/gallery/exterior/cam12-day-1600.webp', previewNote: 'Architect’s impression' },
  { id: 'resources', path: '/resources', label: 'Resources', hint: 'Film, brochure, plans and the ecodeck', scene: 'plum', preview: '/e-brochure/p05-1800.webp?v=2' },
  { id: 'av-video', path: '/av-video', group: 'resources', label: 'AV Video', hint: 'Arkade Ascend on film', scene: 'views', preview: '/gallery/exterior/cam27-evening-1600.webp', previewNote: 'Architect’s impression' },
  { id: 'e-brochure', path: '/e-brochure', group: 'resources', label: 'E Brochure', hint: 'Arkade Ascend, page by page', scene: 'brochure', tone: 'light', preview: '/e-brochure/p05-1800.webp?v=2', previewNote: 'Architect’s impression' },
  { id: 'floor-plans', path: '/floor-plans', group: 'resources', label: 'Floor Plans', hint: 'Every home, floor by floor', scene: 'cream', tone: 'light', preview: '/plans/wing-a/typical-2400.webp' },
  { id: 'ecodeck', path: '/ecodeck', group: 'resources', label: 'Ecodeck', hint: 'Layout, level 5', scene: 'brochure', tone: 'light', preview: '/ecodeck/layout-1600.webp', previewNote: 'Architect’s impression' },
]
export const sections = routes.filter(route => !route.group && route.menu !== false)
export const resources = routes.filter(route => route.group === 'resources')

export const pad = value => String(value).padStart(2, '0')
export const routeIndex = id => routes.findIndex(route => route.id === id)
// A page's place among the menu's sections (-1 off the menu); a Resources page counts as Resources.
export const sectionIndex = id => {
  const route = routes.find(entry => entry.id === id)
  return sections.findIndex(entry => entry.id === (route?.group ?? id))
}
export const routeForPath = pathname =>
  routes.find(route => route.path !== '/' && (pathname === route.path || pathname.startsWith(route.path + '/'))) || routes[0]
