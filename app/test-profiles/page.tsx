import { supabase } from "@/app/lib/supabase";

export default async function TestProfilesPage() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*");

  if (error) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>profiles 읽기 실패</h1>
        <pre>{error.message}</pre>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px" }}>
      <h1>오늘복 profiles 테스트</h1>

      <p>Supabase profiles 테이블에서 데이터를 읽어왔어요.</p>

      <pre
        style={{
          background: "#f4f4f4",
          padding: "20px",
          borderRadius: "12px",
          whiteSpace: "pre-wrap",
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}