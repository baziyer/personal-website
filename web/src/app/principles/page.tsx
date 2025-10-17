"use client";

import { useMemo, useState, useEffect } from "react";
import principlesData from "@/data/principles.json";
import topicsData from "@/data/topics.json";
import sourcesData from "@/data/sources.json";
import { useSearchParams, useRouter } from "next/navigation";

type Topic = { id: string; name: string };
type Principle = { id: string; title: string; summary: string; topics: string[]; sources?: string[] };
type Source = { id: string; title: string; type: string; author?: string; link?: string; topics?: string[]; takeaway?: string };

export default function PrinciplesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const allTopics: Topic[] = topicsData.topics as unknown as Topic[];
  const allPrinciples: Principle[] = principlesData.principles as unknown as Principle[];
  const allSources: Source[] = sourcesData.sources as unknown as Source[];

  const paramTopic = searchParams.get("topic") || "";
  const [activeTopic, setActiveTopic] = useState<string>(paramTopic);

  useEffect(() => {
    // Keep URL in sync when local state changes
    const params = new URLSearchParams(window.location.search);
    if (activeTopic) {
      params.set("topic", activeTopic);
    } else {
      params.delete("topic");
    }
    const qs = params.toString();
    router.replace(qs ? `/principles?${qs}` : "/principles");
  }, [activeTopic, router]);

  const filteredPrinciples = useMemo(() => {
    if (!activeTopic) return allPrinciples;
    return allPrinciples.filter((p) => p.topics?.includes(activeTopic));
  }, [allPrinciples, activeTopic]);

  const getTopicName = (id: string) => allTopics.find((t) => t.id === id)?.name || id;

  const getRelatedSources = (principle: Principle): Source[] => {
    const topicSet = new Set(principle.topics || []);
    // union: explicit sources by id + any source sharing topics
    const explicit = new Set((principle.sources || []).map((s) => s));
    const related = allSources.filter((s) => {
      if (explicit.has(s.id)) return true;
      const st = new Set(s.topics || []);
      for (const t of topicSet) {
        if (st.has(t)) return true;
      }
      return false;
    });
    return related.slice(0, 5);
  };

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Principles & Topics</h1>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Beliefs, operating heuristics, and the ideas I return to. Filter by topic to explore
            related sources.
          </p>
        </div>

        {/* Topic Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <button
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              !activeTopic ? "bg-accent1 text-white" : "bg-white/10 text-foreground hover:bg-white/20"
            }`}
            onClick={() => setActiveTopic("")}
          >
            All topics
          </button>
          {allTopics.map((t) => (
            <button
              key={t.id}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                activeTopic === t.id ? "bg-accent2 text-white" : "bg-white/10 text-foreground hover:bg-white/20"
              }`}
              onClick={() => setActiveTopic(t.id)}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Principles List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrinciples.map((p) => (
            <div key={p.id} className="bg-white/5 dark:bg-black/5 backdrop-blur-sm rounded-xl p-6 border border-accent1-200/30 hover:border-accent1-400 transition-colors">
              <h3 className="text-lg font-semibold text-foreground mb-2">{p.title}</h3>
              <p className="text-foreground/70 mb-4">{p.summary}</p>

              {/* Topic pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {p.topics?.map((t) => (
                  <button
                    key={`${p.id}-${t}`}
                    onClick={() => setActiveTopic(t)}
                    className={`px-2 py-1 rounded-full text-xs ${
                      activeTopic === t ? "bg-accent1 text-white" : "bg-white/10 text-foreground hover:bg-white/20"
                    }`}
                    title={`Filter by ${getTopicName(t)}`}
                  >
                    {getTopicName(t)}
                  </button>
                ))}
              </div>

              {/* Related sources */}
              <div>
                <h4 className="text-sm font-medium text-foreground/80 mb-2">Related sources</h4>
                <ul className="space-y-2">
                  {getRelatedSources(p).map((s) => (
                    <li key={`${p.id}-${s.id}`} className="text-sm">
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-accent1 underline underline-offset-2"
                      >
                        {s.title}
                      </a>
                      {s.author ? <span className="text-foreground/60"> — {s.author}</span> : null}
                      {s.takeaway ? (
                        <div className="text-foreground/60 text-xs">{s.takeaway}</div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


