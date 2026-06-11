export default function LibraryContent() {
  const books = [
    "Sahih Bukhari",
    "Riyad-us-Saliheen",
    "Tafseer Ibn Kathir",
    "Islamic History",
  ];

  return (
    <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
      <h1 className="text-3xl text-white font-bold mb-4">
        Library
      </h1>

      <div className="space-y-2 text-green-100">
        {books.map((b) => (
          <p key={b}>📚 {b}</p>
        ))}
      </div>
    </div>
  );
}