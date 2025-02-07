import { Search, Truck, Heart, ShoppingBag, User, Rotate3d } from "lucide-react";
import DynamicButton from "./DynamicButton";

function NavBar() {
  return (
    <>
      <div className="w-full h-fit px-6 py-4 justify-between items-center flex">
        <div className="flex gap-x-16 w-fit">
          <div className="text-black text-3xl font-normal font-['Stardom']">FitViz</div>
          <div className="rounded-lg px-2 border items-center gap-2 flex">
            <Search />
            <input className="w-full h-full outline-none" type="text" />
          </div>
        </div>

        <div>
          <div className="flex gap-x-4">
            {[
              { text: "Track Order", icon: Truck },
              { text: "Wishlist", icon: Heart },
              { text: "Cart", icon: ShoppingBag },
              { text: "Account", icon: User, showText: false },
            ].map(({ text, icon, showText }, index) => (
              <DynamicButton
                key={index}
                text={text}
                Icon={icon}
                showText={showText}
                paddingX="px-4"
                paddingY="py-0.5"
                onClick={() => console.log("Button clicked!")}
                styles={{
                  base: "background-transparent",
                  hover: "bg-green-600",
                  active: "bg-green-700",
                  outline: "",
                }}
              />
            ))}
          </div>
        </div>
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
          <DynamicButton text="Try on Face in 3D" paddingX="px-5" paddingY="py-2" showIcon={true} Icon={Rotate3d} iconPosition="right" styles={{ base: "bg-black text-white" }} />
        </div>
      </div>
    </>
  );
}

export default NavBar;
