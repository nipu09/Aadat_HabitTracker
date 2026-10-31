import React from 'react'

const Footer = () => {
  return (
    <footer className="mx-auto flex w-full max-w-[874px] flex-col gap-3 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between md:px-0">
      <p>© Aadat. A little, every day.</p>
      <nav className="flex gap-6" aria-label="Footer">
        <a href="#" className="hover:text-ink">Privacy</a>
        <a href="#" className="hover:text-ink">Terms</a>
        <a href="#" className="hover:text-ink">Contact</a>
      </nav>
    </footer>
  )
}

export default Footer;