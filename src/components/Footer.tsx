import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border py-6 sm:py-8">
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-4">
        <p className="text-[12px] text-muted sm:text-[13px]">
          &copy; {new Date().getFullYear()} James Kwame Amo
        </p>
        <div className="flex items-center gap-4 sm:gap-5">
          <Link
            href="https://github.com/amo95"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-muted transition-colors hover:text-foreground sm:text-[13px]"
          >
            GitHub
          </Link>
          <Link
            href="https://linkedin.com/in/james-amo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-muted transition-colors hover:text-foreground sm:text-[13px]"
          >
            LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  );
}
