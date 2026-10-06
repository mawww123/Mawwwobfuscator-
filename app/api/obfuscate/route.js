import { NextResponse } from "next/server";

/**
 * Obfuscator Lua sederhana:
 * - Mengubah source code menjadi Base64
 * - Membungkus dalam fungsi loadstring yang di-decode ulang
 * - Menambahkan variabel acak & junk code agar panjang dan tidak terbaca
 * - Tetap kompatibel dengan Delta (mendukung loadstring)
 */
function obfuscateLua(code) {
  // Encode ke Base64
  const base64Code = Buffer.from(code).toString("base64");

  // Helper untuk variabel acak
  const randVar = () =>
    "_" + Math.random().toString(36).substring(2, 15);

  const v1 = randVar();
  const v2 = randVar();
  const v3 = randVar();
  const v4 = randVar();
  const v5 = randVar();
  const v6 = randVar();

  // Junk code (tidak berpengaruh, hanya memperpanjang)
  const junk = `
local ${v5} = "junk_" .. tostring(math.random(1, 999999))
local ${v6} = #${v5} + 42
`.trim();

  // Script utama yang dihasilkan
  const obfuscated = `
-- Mawww Obfuscator Protected
${junk}
local ${v1} = "${base64Code}"
local ${v2} = function(s)
    local b = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    s = string.gsub(s, '[^'..b..'=]', '')
    return (s:gsub('.', function(x)
        if (x == '=') then return '' end
        local r, f = '', (b:find(x) - 1)
        for i = 6, 1, -1 do r = r .. (f % 2^i - f % 2^(i-1) > 0 and '1' or '0') end
        return r
    end):gsub('%d%d%d?%d?%d?%d?%d?%d?', function(x)
        if (#x ~= 8) then return '' end
        local c = 0
        for i = 1, 8 do c = c + (x:sub(i,i) == '1' and 2^(8-i) or 0) end
        return string.char(c)
    end))
end
local ${v3} = ${v2}(${v1})
local ${v4} = loadstring or load
${v4}(${v3})()
  `.trim();

  return obfuscated;
}

export async function POST(req) {
  try {
    const { code } = await req.json();

    if (!code || code.trim() === "") {
      return NextResponse.json(
        { error: "Kode Lua tidak boleh kosong." },
        { status: 400 }
      );
    }

    const obfuscatedCode = obfuscateLua(code);

    // Simulasi proses berat (delay 1 detik)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({ result: obfuscatedCode });
  } catch (error) {
    console.error("Obfuscate error:", error);
    return NextResponse.json(
      { error: "Gagal melakukan obfuscate. Coba lagi." },
      { status: 500 }
    );
  }
    }
