// src/components/ProjectsDirectory.jsx
import React from "react";

const PROJECTS = [
  { name: "WWF France", url: "https://www.wwf.fr/", category: "Biodiversité" },
  { name: "Greenpeace", url: "https://www.greenpeace.org/france/", category: "Climat" },
  { name: "Fondation GoodPlanet", url: "https://www.goodplanet.org/fr/", category: "Éducation" },
  { name: "Rewild", url: "https://rewild.org/", category: "Nature" },
  { name: "Aider les abeilles", url: "https://www.lesabeilles.org/", category: "Pollinisateurs" },
];

export default function ProjectsDirectory() {
  return (
    <div className="mt-6 p-6 rounded-3xl bg-gradient-to-r from-green-50 via-white to-yellow-50 shadow-lg space-y-4">
      <h2 className="text-2xl font-bold text-center text-green-800">Projets et associations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {PROJECTS.map((proj, idx) => (
          <button
            key={idx}
            className="bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700 transition"
            onClick={() => window.open(proj.url, "_blank")}
          >
            {proj.name} {proj.category && `(${proj.category})`}
          </button>
        ))}
      </div>
    </div>
  );
}
