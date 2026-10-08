import PageShell from './PageShell'
import PublicationList from './PublicationList'

export default function Publications() {
  return (
    <PageShell title="Publications">
      <PublicationList heading="h1" animate />
    </PageShell>
  )
}
