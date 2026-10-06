"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const [inputCode, setInputCode] = useState("");
  const [outputCode, setOutputCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleObfuscate = async () => {
    if (!inputCode.trim()) {
      alert("Masukkan script Lua terlebih dahulu!");
      return;
    }

    setLoading(true);
    setOutputCode("");
    setCopied(false);

    try {
      const res = await fetch("/api/obfuscate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inputCode }),
      });

      const data = await res.json();

      if (data.result) {
        setOutputCode(data.result);
      } else {
        alert(data.error || "Terjadi kesalahan.");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menghubungi server.");
    }

    setLoading(false);
  };

  const handleCopy = () => {
    if (!outputCode) return;
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      {/* Overlay gelap */}
      <div className="absolute inset-0 bg-black/70 z-0"></div>

      <div className="relative z-10 w-full max-w-6xl">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            mawww <span className="text-purple-400">obfuscator</span>
          </h1>

          <div>
            {status === "loading" ? (
              <span className="text-gray-300">Memuat...</span>
            ) : session ? (
              <div className="flex items-center gap-4">
                <span className="text-white text-sm">
                  Halo, <strong>{session.user.name}</strong>
                </span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("github")}
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-semibold transition"
              >
                Login dengan GitHub
              </button>
            )}
          </div>
        </header>

        {/* Konten utama */}
        {session ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Panel Input */}
            <div className="bg-gray-900/80 backdrop-blur-md p-6 rounded-xl border border-purple-500/30 shadow-2xl">
              <h2 className="text-xl text-white mb-4 font-semibold">
                📜 Script Original (Lua)
              </h2>
              <textarea
                className="w-full h-80 p-4 bg-black/50 text-green-400 font-mono text-sm rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 resize-none"
                placeholder="-- Masukkan script Lua Anda di sini..."
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                spellCheck={false}
              />
              <button
                onClick={handleObfuscate}
                disabled={loading}
                className="mt-4 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Sedang Mengobfuscate...
                  </span>
                ) : (
                  "🔒 Obfuscate Script!"
                )}
              </button>
            </div>

            {/* Panel Output */}
            <div className="bg-gray-900/80 backdrop-blur-md p-6 rounded-xl border border-purple-500/30 shadow-2xl">
              <h2 className="text-xl text-white mb-4 font-semibold">
                🛡️ Hasil Obfuscate (Protected)
              </h2>
              <textarea
                readOnly
                className="w-full h-80 p-4 bg-black/50 text-purple-300 font-mono text-xs rounded-lg border border-gray-700 focus:outline-none resize-none"
                placeholder="Hasil obfuscate akan muncul di sini..."
                value={outputCode}
              />
              <button
                onClick={handleCopy}
                disabled={!outputCode}
                className={`mt-4 w-full font-bold py-3 rounded-lg transition ${
                  !outputCode
                    ? "bg-gray-600 cursor-not-allowed text-gray-400"
                    : copied
                    ? "bg-green-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {copied ? "✅ Tersalin!" : "📋 Copy Script"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900/80 backdrop-blur-md p-10 rounded-xl border border-purple-500/30 text-center shadow-2xl max-w-lg mx-auto">
            <h2 className="text-2xl text-white mb-4">🔐 Akses Ditolak</h2>
            <p className="text-gray-300 mb-6">
              Anda harus login terlebih dahulu untuk menggunakan layanan{" "}
              <strong>mawww obfuscator</strong>.
            </p>
            <button
              onClick={() => signIn("github")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition"
            >
              Login Sekarang
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-10 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} mawww obfuscator — Support Delta &
          Executor Lainnya
        </footer>
      </div>
    </main>
  );
        }
