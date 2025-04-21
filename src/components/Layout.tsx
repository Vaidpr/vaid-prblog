
import Navbar from "@/components/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20">{children}</main>
      <footer className="bg-gray-100 dark:bg-gray-900 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-primary mb-4">Vaidpr</h3>
              <p className="text-gray-600 dark:text-gray-400">
                A community-driven blog platform for sharing knowledge and insights.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4 text-gray-800 dark:text-gray-200">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/login" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
                    Login
                  </a>
                </li>
                <li>
                  <a href="/dashboard" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
                    Dashboard
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4 text-gray-800 dark:text-gray-200">Contact</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                contact@vaidpr.com
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                123 Blog Street, Content City
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-6 text-center text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Vaidpr Blog. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
