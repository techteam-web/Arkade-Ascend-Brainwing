import { useShell } from '../app/ShellContext.js'
import { pad, resources } from '../app/routes.js'
import { ArrowIcon } from '../components/Brand.jsx'
import { PageHeading } from '../components/PageKit.jsx'

// Resources (client, 18 Nov 2026): the AV video, the E Brochure, the floor
// plans and the ecodeck, gathered off the menu into one page. Each picture is
// shown whole in a framed window (never cropped: the pictures run from a book
// spread to a wide floor plate), with its caption below. Four across on
// laptops, two on tablets, one on phones.
export default function ResourcesPage() {
  const { go } = useShell()

  return <section className="page page-scroll grid grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)] gap-[clamp(1.25rem,4vh,3rem)]">
    <PageHeading id="resources" title="Resources" subtitle="Film, brochure, plans and the ecodeck" />

    <ul className="grid grid-cols-1 gap-[clamp(0.75rem,1.4vw,1.25rem)] [align-content:safe_center] sm:grid-cols-2 lg:grid-cols-4">
      {resources.map((route, index) => <li key={route.id} data-reveal className="flex min-w-0">
        <button type="button" onClick={() => go(route.path)} aria-label={`${route.label}: ${route.hint}`}
          className="group flex w-full flex-col overflow-hidden rounded-md border border-gold-500/25 bg-plum-900/45 text-left shadow-[0_30px_60px_-40px_rgba(0,0,0,.9)] transition-[border-color,background-color] duration-500 hover:border-gold-400/70 hover:bg-plum-900/70 focus-visible:border-gold-400">
          {/* The picture, whole, in a quiet plum window. */}
          <span className="relative block aspect-[16/10] overflow-hidden bg-[radial-gradient(ellipse_at_50%_40%,#3d2a2f,#1b1113_80%)]">
            <img src={route.preview} alt="" loading="lazy" draggable="false"
              className="absolute inset-x-[7%] top-[6%] h-[78%] w-[86%] select-none object-contain drop-shadow-[0_14px_22px_rgba(0,0,0,.45)] transition-[scale] duration-1000 ease-silk group-hover:scale-[1.03] group-focus-visible:scale-[1.03] motion-reduce:transition-none" />
            {route.previewNote && <span className="absolute bottom-[3%] right-3 text-[0.46rem] uppercase tracking-[0.22em] text-ivory/55">{route.previewNote}</span>}
          </span>
          <span className="flex flex-1 items-center gap-4 border-t border-gold-500/20 px-[clamp(0.9rem,1.4vw,1.25rem)] py-[clamp(0.8rem,1.8vh,1.1rem)]">
            <span className="num shrink-0 self-start pt-1 text-[0.66rem] tracking-[0.16em] text-gold-300">{pad(index + 1)}</span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-[clamp(1.2rem,min(1.7vw,3.4vh),1.75rem)] uppercase leading-none text-ivory">{route.label}</span>
              <span className="mt-1.5 block text-[0.56rem] uppercase leading-[1.6] tracking-[0.2em] text-gold-200/70">{route.hint}</span>
            </span>
            <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full max-xl:lg:hidden border border-gold-500/40 text-gold-200 transition-colors duration-500 group-hover:border-gold-400 group-hover:bg-gold-500 group-hover:text-espresso group-focus-visible:border-gold-400 group-focus-visible:bg-gold-500 group-focus-visible:text-espresso">
              <ArrowIcon className="h-2 w-5 fill-none stroke-current stroke-[1.2]" />
            </span>
          </span>
        </button>
      </li>)}
    </ul>
  </section>
}
