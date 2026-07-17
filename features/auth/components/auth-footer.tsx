export default function AuthFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="max-w-xs mx-auto">
      <p className="text-center text-xs tracking-wide text-muted-foreground">
        © {year} Budgetin. Crafted with ❤️ for better financial habits. All
        rights reserved.
      </p>
    </footer>
  )
}
