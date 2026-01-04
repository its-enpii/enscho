'use client';

export function ThemeRegistry({ primaryColor }: { primaryColor: string }) {
  return (
    <style jsx global>{`
      :root {
        --primary-color: ${primaryColor};
      }
    `}</style>
  );
}
