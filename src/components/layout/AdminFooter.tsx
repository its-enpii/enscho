export function AdminFooter() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-600">
          <p>
            &copy; {new Date().getFullYear()} SMK Enscho. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Developed by{" "}
            <span className="font-medium text-slate-700">Enpii Studio</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
