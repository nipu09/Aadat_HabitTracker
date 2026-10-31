import Logo from "../common/Logo.jsx";

// Two-column auth screen: a form column and a coloured panel.
// panelSide="right" -> login layout, panelSide="left" -> create account layout.
export default function AuthLayout({
  panelSide = "right",
  panelColor = "bg-mint",
  panel,
  children,
}) {
  const panelEl = (
    <aside
      className={`hidden flex-1 items-center justify-center px-12 lg:flex ${panelColor}`}
    >
      <div className="w-full max-w-[424px]">{panel}</div>
    </aside>
  );

  return (
    <div className="flex min-h-screen">
      {panelSide === "left" && panelEl}
      <main className="relative flex flex-1 flex-col bg-canvas px-6 py-8 sm:px-12">
        <Logo size="lg" />
        <div className="mx-auto flex w-full max-w-[405px] flex-1 flex-col justify-center py-10">
          {children}
        </div>
      </main>
      {panelSide === "right" && panelEl}
    </div>
  );
}
