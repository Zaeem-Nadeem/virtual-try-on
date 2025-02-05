function NavBar() {
  return (
    <>
      <div className="w-96 h-24 px-6 py-4 justify-between items-center inline-flex">
        <div className="justify-start items-center gap-16 flex">
          <div className="text-black text-5xl font-normal font-['Stardom']">FitViz</div>
          <div className="w-96 h-12 px-3.5 py-2.5 rounded-lg border border-stone-950 justify-end items-center gap-2 flex overflow-hidden">
            <div className="w-6 h-6 p-0.5 justify-center items-center flex overflow-hidden" />
          </div>
        </div>
        <div className="justify-start items-center gap-8 flex">
          <div className="justify-start items-center gap-2 flex">
            <div className="w-6 h-6 px-0.5 py-1 justify-center items-center flex overflow-hidden" />
            <div className="text-black text-xl font-normal font-['Satoshi Variable']">Track Order</div>
          </div>
          <div className="justify-center items-center gap-2 flex">
            <div className="w-6 px-0.5 py-0.5 flex-col justify-center items-center gap-2 inline-flex overflow-hidden" />
            <div className="text-black text-xl font-normal font-['Satoshi Variable']">Wishlist</div>
          </div>
          <div className="justify-center items-center gap-2 flex">
            <div className="w-6 h-6 justify-center items-center flex overflow-hidden">
              <div className="grow shrink basis-0 self-stretch px-0.5 py-0.5 justify-center items-center inline-flex overflow-hidden" />
            </div>
            <div className="text-black text-xl font-normal font-['Satoshi Variable']">Cart</div>
          </div>
          <div className="w-6 h-6 px-1 py-0.5 justify-center items-center flex overflow-hidden" />
        </div>
      </div>
    </>
  );
}

export default NavBar;
