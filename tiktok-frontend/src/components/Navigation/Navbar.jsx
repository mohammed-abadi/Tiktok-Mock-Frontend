import { Home, Search, PlusSquare, MessageSquare, User } from "lucide-react"

const Navbar = ({ onTabChange, onUploadClick }) => {
  return (
    <div className="fixed bottom-0 w-full bg-black border-t border-gray-800 flex justify-around items-center py-3 z-50 text-white">
      <Home
        onClick={() => onTabChange("home")}
        className="cursor-pointer hover:scale-110 transition"
      />
      <Search className="cursor-pointer" />
      <div
        onClick={onUploadClick}
        className="bg-white rounded-lg p-1 px-3 cursor-pointer"
      >
        <PlusSquare color="black" fill="black" />
      </div>
      <MessageSquare
        onClick={() => onTabChange("chat")}
        className="cursor-pointer"
      />
      <User
        onClick={() => onTabChange("profile")}
        className="cursor-pointer hover:scale-110 transition"
      />
    </div>
  )
}
export default Navbar
