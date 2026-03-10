import { useSelector } from "react-redux";
import MenuItemCard from "./MenuItemCart";

export default function MenuGrid() {

  const { items } = useSelector(s => s.menu);

  console.log("items",items);
  

  return (
    <div className="
      grid gap-4
      grid-cols-2
      sm:grid-cols-3
      lg:grid-cols-4
    ">
      {items.map(item => (
        <MenuItemCard key={item._id} item={item}/>
      ))}
    </div>
  );
}
