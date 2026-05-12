import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Budgetin - Home",
  description: "Home",
}

export default async function HomePage() {
  return (
    <div>
      <header></header>
      <main></main>
      <footer></footer>
    </div>
  )
}
