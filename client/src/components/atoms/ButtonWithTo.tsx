'use client';
import { useRouter } from 'next/navigation';

function ButtonWithTo({
  children,
  to,
}: {
  children: React.ReactNode;
  to: string;
}) {
  const router = useRouter();

  return (
    <button type="button" onClick={() => router.push(to)}>
      {children}
    </button>
  );
}

export default ButtonWithTo;
