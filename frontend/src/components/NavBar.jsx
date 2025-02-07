import { Search, Truck, Heart, ShoppingBag, User, Rotate3d, Menu, CircleX } from "lucide-react";
import DynamicButton from "./DynamicButton";
import { useState } from "react";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      {/* Branding */}
      <div className="w-full h-fit px-6 py-4 justify-between items-center flex">
        <div className="flex gap-x-16 w-fit">
          <div className="text-black text-3xl font-bold font-['Stardom']">FitViz</div>
          <div className="hidden md:flex rounded-lg px-2 border items-center gap-2">
            <Search />
            <input className="w-full h-full outline-none" type="text" />
          </div>
        </div>

        {/* navbar */}

        <Menu className={`md:hidden`} onClick={() => setMenuOpen(!menuOpen)} />
        <nav
          className={`${
            menuOpen ? "fixed md:static" : "hidden"
          } bg-(--overlay-color) p-4 md:p-0 rounded-4xl md:rounded-none outline-4 md:outline-none outline-white md:bg-transparent md:flex top-1/2 left-1/2 -translate-x-1/2 md:translate-0 -translate-y-1/2 z-50 gap-x-4`}
        >
          <span className="block relative md:hidden text-center font-bold text-2xl mb-4 mt-2">
            Menu <CircleX className="fixed -top-1 -right-1" onClick={() => setMenuOpen(!menuOpen)} />{" "}
          </span>
          {[
            { text: "Track Order", icon: Truck },
            { text: "Wishlist", icon: Heart },
            { text: "Cart", icon: ShoppingBag },
            { text: "Account", icon: User, showText: false },
          ].map(({ text, icon, showText }, index) => (
            <DynamicButton
              customClasses={"text-nowrap my-4 md:my-0"}
              key={index}
              text={text}
              Icon={icon}
              showText={menuOpen ? !showText : showText}
              paddingX="px-4"
              paddingY="py-0.5"
              styles={{
                base: "background-transparent",
                hover: "bg-green-600",
                active: "bg-green-700",
                outline: "",
              }}
            />
          ))}
        </nav>
      </div>

      <div className="w-full bg-[#fafafa] h-fit px-6 py-2 gap-4 justify-between items-center flex">
        <div className="flex gap-x-4">
          {["Kids Glasses", "Screen Glasses", "Zero Power", "Sunglasses", "Progressive", "Contact Lenses"].map(
            (text, index) => (
              <DynamicButton
                key={index}
                text={text}
                Glasses
                paddingX="px-0"
                paddingY="py-0"
                showIcon={false}
                styles={{ base: "bg-transparant text-black" }}
              />
            )
          )}
        </div>
        <div className="flex gap-x-4">
          <DynamicButton
            text="Try on Face in 3D"
            paddingX="px-5"
            paddingY="py-2"
            showIcon={true}
            Icon={Rotate3d}
            iconPosition="right"
            styles={{ base: "bg-black text-white" }}
          />
        </div>
      </div>
    </>
  );
}

export default NavBar;
