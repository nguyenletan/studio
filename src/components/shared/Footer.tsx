export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 py-8 text-center text-muted-foreground">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} CS Skins.</p>
        {/*<p className="text-sm">Created for demonstration purposes.</p>*/}
      </div>
    </footer>
  );
}
