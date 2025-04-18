import { Link } from 'react-router-dom'

export const Header = () => {
  return (
    <header className="border-b shadow-sm p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">
          📷 Image Uploader
        </Link>
      </div>
    </header>
  )
}
