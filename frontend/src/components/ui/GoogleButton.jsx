import { FcGoogle } from "react-icons/fc";



export default function GoogleButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-line bg-white text-[15px] font-medium transition-colors hover:bg-lilac-light"
    >
      < FcGoogle />
      Continue with Google
    </button>
  );
}
