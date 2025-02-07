export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} Weather Clock. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="/about" className="text-sm text-gray-500 hover:text-gray-900">
              关于
            </a>
            <a href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">
              隐私政策
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 