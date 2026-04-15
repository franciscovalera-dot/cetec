/**
 * PÁGINA DE GLOSARIO — Términos tecnológicos A-Z
 */
import { getGlossaryTerms } from '@/lib/sanity'
import PortableTextRenderer from '@/components/PortableTextRenderer'

export const revalidate = 60
export const metadata = { title: 'Glosario' }

export default async function GlosarioPage() {
  const terms = await getGlossaryTerms()

  const grouped = terms.reduce<Record<string, typeof terms>>((acc, term) => {
    const letter = term.term[0].toUpperCase()
    if (!acc[letter]) acc[letter] = []
    acc[letter].push(term)
    return acc
  }, {})
  const letters = Object.keys(grouped).sort()

  return (
    <>
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
          <p className="text-sm text-gray-400 tracking-widest uppercase mb-4">Observatorio Tecnológico CETEC</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">Glosario de términos<br />tecnológicos</h1>
          <p className="mt-5 text-gray-500 max-w-2xl mx-auto leading-relaxed">El glosario del Observatorio Tecnológico de CETEC reúne definiciones clave del sector del plástico, calzado y agroalimentario para facilitar la comprensión de conceptos técnicos y normativos.</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {letters.length > 0 && (
          <nav className="flex flex-wrap gap-2 mb-10 sticky top-20 bg-gray-50 py-3 z-10 rounded-lg">
            {letters.map((letter) => (
              <a key={letter} href={`#letra-${letter}`} className="w-8 h-8 flex items-center justify-center text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 transition-colors">{letter}</a>
            ))}
          </nav>
        )}

        <div className="space-y-12">
          {letters.map((letter) => (
            <section key={letter} id={`letra-${letter}`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">{letter}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {grouped[letter].map((term) => (
                  <article key={term._id} id={term.slug.current} className="p-5 bg-white rounded-2xl border border-gray-200">
                    <h3 className="text-base font-bold text-gray-900">{term.term}</h3>
                    {term.category && <span className="text-xs text-orange-600 font-medium">{term.category.name}</span>}
                    <div className="mt-2 text-sm text-gray-600 leading-relaxed"><PortableTextRenderer value={term.definition} /></div>
                    {term.relatedTerms && term.relatedTerms.length > 0 && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                        <span>Ver también:</span>
                        {term.relatedTerms.map((rt) => (<a key={rt.slug.current} href={`#${rt.slug.current}`} className="text-orange-600 hover:underline">{rt.term}</a>))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        {terms.length === 0 && <p className="text-center text-gray-500 py-20">El glosario está vacío.</p>}
      </div>
    </>
  )
}
