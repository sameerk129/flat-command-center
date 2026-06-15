"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NoSSR } from "@/components/common/no-ssr";
import { ContactCard } from "@/components/contacts/contact-card";
import { ContactFormDialog } from "@/components/contacts/contact-form";
import { useContacts } from "@/store/use-contacts";
import { cn } from "@/lib/utils";

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-56 rounded-lg shimmer" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-44 rounded-2xl shimmer" />
        ))}
      </div>
    </div>
  );
}

export default function ContactsPage() {
  const contacts = useContacts((s) => s.contacts);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    contacts.forEach((c) => set.add(c.category));
    return Array.from(set);
  }, [contacts]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return contacts.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.notes.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      const matchesFilter = filter === "All" || c.category === filter;
      return matchesQuery && matchesFilter;
    });
  }, [contacts, query, filter]);

  return (
    <NoSSR fallback={<Skeleton />}>
      <PageHeader
        eyebrow="Important Contacts"
        title="People who keep 2164 running"
        description="The plumber, the electrician, the hospital. Tap to call or copy a number — never panic again."
        actions={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search contacts…"
                className="pl-9 w-full sm:w-56"
              />
            </div>
            <Button variant="primary" onClick={() => setOpen(true)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4" /> Add contact
            </Button>
          </div>
        }
      />

      <div className="-mx-4 sm:mx-0 px-4 sm:px-0 mb-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-1.5 w-max sm:w-auto sm:flex-wrap">
          {categories.map((c) => {
            const active = filter === c;
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={cn(
                  "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition whitespace-nowrap",
                  active
                    ? "border-[#a855f7]/40 bg-[#a855f7]/12 text-[#d8b4fe]"
                    : "border-white/[0.08] bg-white/[0.025] text-white/65 hover:text-white"
                )}
              >
                {c}
                {c !== "All" && (
                  <Badge variant="outline" className="ml-2 text-[10px]">
                    {contacts.filter((x) => x.category === c).length}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        {filtered.map((c, i) => (
          <ContactCard key={c.id} contact={c} delay={i * 0.03} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16">
            <div className="text-5xl mb-3">🔍</div>
            <div className="text-white/65 font-medium">No contacts match that filter.</div>
            <div className="text-white/40 text-sm mt-1">Try clearing search or add a new contact.</div>
          </div>
        )}
      </div>

      <ContactFormDialog open={open} onOpenChange={setOpen} />
    </NoSSR>
  );
}
