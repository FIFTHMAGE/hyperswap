export const MobileNav = () => (
  <nav className="md:hidden fixed bottom-0 w-full bg-white border-t">
    <div className="flex justify-around py-2">
      {['Swap', 'Portfolio', 'Liquidity', 'More'].map((item) => (
        <button key={item} className="px-4 py-2 text-sm">
          {item}
        </button>
      ))}
    </div>
  </nav>
);
