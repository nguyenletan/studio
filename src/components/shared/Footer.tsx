export function Footer() {
  return (
    <footer className="border-border/40 text-muted-foreground mt-auto border-t py-8 text-center">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} CS Skins.</p>
        {/*<p className="text-sm">Created for demonstration purposes.</p>*/}
      </div>
    </footer>
  );
}
