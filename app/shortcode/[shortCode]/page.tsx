// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function RedirectPage({
//   params,
// }: {
//   params: { shortCode: string };
// }) {
//   const router = useRouter();
//   const shortCode = params.shortCode;

//   useEffect(() => {
//     const handleRedirect = async () => {
//       try {
//         const res = await fetch(`/api/url/${shortCode}`, {
//           cache: "no-store",
//         });

//         if (!res.ok) {
//           console.error("Error fetching redirect URL");
//           router.push("/404");
//           return;
//         }

//         const data = await res.json();

//         if (data?.longUrl) {
//           window.location.href = data.longUrl;
//         } else {
//           router.push("/404");
//         }
//       } catch (error) {
//         console.error("Redirect failed:", error);
//         router.push("/404");
//       }
//     };

//     handleRedirect();
//   }, [shortCode, router]);

//   return <p>Redirecting to your link...</p>;
// }


// import { redirect } from "next/navigation";

// export default async function RedirectPage({
//   params,
// }: {
//   params: { shortCode: string };
// }) {
//    const shortcode =  params.shortCode;
//   const res = await fetch(`${process.env.DOMAIN}/api/url/${shortcode}`, {
//     cache: "no-store",
//   });

//   if (!res.ok) {
//     redirect("/404");
//   }

//   const data = await res.json();

//   if (data?.longUrl) {
//     redirect(data.longUrl);
//   } else {
//     redirect("/404");
//   }
// }

// import { redirect } from "next/navigation";

// export default async function RedirectPage(props: {
//   params: { shortCode: string };
// }) {
//   const { params } = props;
//   const shortcode = params.shortCode;

//   const res = await fetch(`${process.env.DOMAIN}/api/url/${shortcode}`, {
//     cache: "no-store",
//   });

//   if (!res.ok) {
//     redirect("/404");
//   }

//   const data = await res.json();

//   if (data?.longUrl) {
//     redirect(data.longUrl);
//   } else {
//     redirect("/404");
//   }
// }

// import { redirect } from "next/navigation";

// export default async function RedirectPage({
//   params,
// }: {
//   params: { shortCode: string };
// }) {
//   // ✅ Awaiting params is not necessary here if it's passed correctly
//   const shortcode = params.shortCode;

//   const res = await fetch(`${process.env.DOMAIN}/api/url/${shortcode}`, {
//     cache: "no-store",
//   });

//   if (!res.ok) {
//     redirect("/404");
//   }

//   const data = await res.json();

//   if (data?.longUrl) {
//     redirect(data.longUrl);
//   } else {
//     redirect("/404");
//   }
// }

// import { redirect } from "next/navigation";

// export default async function RedirectPage(props: {
//   params: { shortCode: string };
// }) {
//   const shortcode = props.params.shortCode;

//   const res = await fetch(`${process.env.DOMAIN}/api/url/${shortcode}`, {
//     cache: "no-store",
//   });

//   if (!res.ok) {
//     redirect("/404");
//   }

//   const data = await res.json();

//   if (data?.longUrl) {
//     redirect(data.longUrl);
//   } else {
//     redirect("/404");
//   }
// }


// export const dynamic = "force-dynamic"; // 👈 Add this at the top

// import { redirect } from "next/navigation";

// export default async function RedirectPage({
//   params,
// }: {
//   params: { shortCode: string };
// }) {
//   const shortcode = params.shortCode;

//   const res = await fetch(`${process.env.DOMAIN}/api/url/${shortcode}`, {
//     cache: "no-store",
//   });

//   if (!res.ok) {
//     redirect("/404");
//   }

//   const data = await res.json();

//   if (data?.longUrl) {
//     redirect(data.longUrl);
//   } else {
//     redirect("/404");
//   }
// }


export const dynamic = "force-dynamic"; // 👈 Ensures dynamic resolution

import { redirect } from "next/navigation";

export default async function RedirectPage({
  params,
}: {
  params: { shortCode: string };
}) {
  // ✅ Awaiting params if Next.js treats it as a Promise
  const resolvedParams = await Promise.resolve(params);
  const shortcode = resolvedParams.shortCode;

  const res = await fetch(`${process.env.DOMAIN}/api/url/${shortcode}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/404");
  }

  const data = await res.json();

  if (data?.longUrl) {
    redirect(data.longUrl);
  } else {
    redirect("/404");
  }
}


