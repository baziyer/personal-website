"use client";

import principlesData from "@/data/principles.json";
import sourcesData from "@/data/sources.json";

type Principle = { 
  id: string; 
  title: string; 
  description: string; 
  readings: string[] 
};

type Source = { 
  id: string; 
  title: string; 
  author: string 
};

export default function PrinciplesPage() {
  const allPrinciples: Principle[] = principlesData.principles;
  const allSources: Source[] = sourcesData.sources;

  const getSourceById = (id: string): Source | undefined => {
    return allSources.find(source => source.id === id);
  };

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Ideas I&apos;m interested in</h1>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Beliefs, operating heuristics, and the ideas I return to. Click on any principle to explore related readings.
          </p>
        </div>

        {/* Principles List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPrinciples.map((principle) => (
            <div key={principle.id} className="bg-white/5 dark:bg-black/5 backdrop-blur-sm rounded-xl p-6 border border-accent1-200/30 hover:border-accent1-400 transition-colors">
              <h3 className="text-lg font-semibold text-foreground mb-3">{principle.title}</h3>
              <p className="text-foreground/70 mb-4">{principle.description}</p>

              {/* Readings */}
              {principle.readings.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-accent1 mb-2">Readings:</h4>
                  <ul className="space-y-2">
                    {principle.readings.map((readingId) => {
                      const source = getSourceById(readingId);
                      return source ? (
                        <li key={readingId} className="text-sm text-foreground/80">
                          <span className="font-medium">{source.title}</span>
                          <span className="text-foreground/60"> by {source.author}</span>
                        </li>
                      ) : null;
                    })}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}