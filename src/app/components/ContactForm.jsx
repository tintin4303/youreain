"use client";
import { useRef } from "react";
import emailjs from "emailjs-com";

export default function ContactForm({ apartmentId, apartmentTitle }) {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", form.current, "YOUR_PUBLIC_KEY")
      .then(() => {
        alert("Sent! Check LINE.");
        form.current.reset();
      })
      .catch(() => alert("Failed."));
  };

  return (
    <form ref={form} onSubmit={sendEmail} className="glass glass-card space-y-5">
      <input type="hidden" name="apartment_id" value={apartmentId} />
      <input type="hidden" name="apartment_title" value={apartmentTitle} />

      <input type="text" name="user_name" placeholder="Your Name" required className="glass-input" />
      <div className="glass-input flex items-center">
        <span className="text-green-600 font-bold px-2">LINE</span>
        <input type="text" name="line_id" placeholder="yourlineid" required className="flex-1 bg-transparent outline-none" />
      </div>
      <input type="email" name="user_email" placeholder="Email (optional)" className="glass-input" />
      <textarea name="message" rows="4" placeholder="When to view?" required className="glass-input" />

      <button type="submit" className="glass-btn w-full py-4 text-lg">
        Send via LINE
      </button>
    </form>
  );
}