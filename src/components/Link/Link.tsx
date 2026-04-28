interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
  title?: string;
}

export function Link({ href, children, className, ...props }: LinkProps) {
  const pathname = typeof window === "undefined" ? "/" : window.location.pathname;
  const isActive = href === "/" ? pathname === href : pathname.startsWith(href);
  const combinedClassName = `${className || ""} ${isActive ? "is-active" : ""}`.trim();

  return (
    <a href={href} className={combinedClassName || undefined} {...props}>
      {children}
    </a>
  );
}
