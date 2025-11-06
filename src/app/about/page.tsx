// app/about/page.tsx

export default function AboutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-8">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-16 max-w-3xl w-full text-center">
        <h1 className="text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          About
        </h1>
        <p className="text-gray-600 text-xl mb-6">
          This app demonstrates CRUD functionality using Supabase and Next.js.
        </p>
        <div className="space-y-4 text-gray-500 text-lg">
          <p>Learn how to manage tasks efficiently.</p>
          <p>Understand the integration of backend and frontend.</p>
          <p>Gain experience building full-stack applications.</p>
        </div>
      </div>
    </div>
  );
}
