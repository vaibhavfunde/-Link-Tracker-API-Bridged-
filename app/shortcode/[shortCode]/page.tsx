"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectPage({
  params,
}: {
  params: { shortCode: string };
}) {
  const router = useRouter();
  const shortCode = params.shortCode;

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const res = await fetch(`/api/url/${shortCode}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("Error fetching redirect URL");
          router.push("/404");
          return;
        }

        const data = await res.json();

        if (data?.longUrl) {
          window.location.href = data.longUrl;
        } else {
          router.push("/404");
        }
      } catch (error) {
        console.error("Redirect failed:", error);
        router.push("/404");
      }
    };

    handleRedirect();
  }, [shortCode, router]);

  return <p>Redirecting to your link...</p>;
}

