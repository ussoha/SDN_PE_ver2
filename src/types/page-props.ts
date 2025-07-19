export interface PageProps {
  params: { id: string; tab: string }
  searchParams?: Record<string, string>
}
