export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-blue-600 h-24 rounded-b-lg"></header>
      <main className="p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-gray-50 p-8 rounded-lg shadow">
            <h1 className="text-xl font-bold mb-2">
              Welcome to Acme.
            </h1>
            {/* <div
            className="relative w-0 h-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-black"
            /> */}
            <p className="text-gray-700 mb-4">
              This is the example for the  
              <a href="#" className="text-blue-600 underline">Next.js Learn Course</a>, 
              brought to you by Vercel.
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700">
              Log in
              <span>→</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
