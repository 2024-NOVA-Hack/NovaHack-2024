import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#632b6c] to-[#c76b98]">
      <main className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold text-white">Meditate.ai</h1>
        <input
          type="text"
          placeholder="Enter your thoughts..."
          className="w-full max-w-lg p-4 text-lg text-[#632b6c] 
          bg-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#c76b98]"
        />
      </main>
    </div>
  );
}
