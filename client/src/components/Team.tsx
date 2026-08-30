import React, { useEffect, useState } from 'react';
import { teamApi } from '../api/auth';

interface TeamMemberData {
  _id?: string;
  name: string;
  role: string;
  image: string;
  linkedinUrl: string;
}

const Team: React.FC = () => {
  const [team, setTeam] = useState<TeamMemberData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback initial seeded team data
  const fallbackTeam: TeamMemberData[] = [
    {
      name: 'Gaurav Sharma',
      role: 'Co-Founder',
      image: 'images/Gaurav new.png',
      linkedinUrl: 'https://www.linkedin.com/in/gaurav-sharma-60341379/',
    },
    {
      name: 'Aakash Andhare',
      role: 'Vice President - Delivery',
      image: 'images/Aakashnew.png',
      linkedinUrl: 'https://www.linkedin.com/in/aakashandhare/',
    },
  ];

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await teamApi.getTeam();
        if (response.success && response.data && response.data.length > 0) {
          setTeam(response.data);
        } else {
          setTeam(fallbackTeam);
        }
      } catch (error) {
        console.error('Error loading team members:', error);
        setTeam(fallbackTeam);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <section id="team" className="py-24 bg-slate-50 relative border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-sky-600 uppercase tracking-wider inline-block border-b-2 border-sky-600 pb-1.5 mb-4">
            OUR TEAM
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Meet the Minds Behind Jobizza
          </h3>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Passionate experts providing personalized, attentive, and skilled technology recruitment support.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
            {team.map((member, index) => {
              const linkedin = member.linkedinUrl || '#';
              return (
                <div
                  key={member._id || index}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-100 overflow-hidden group transition-all duration-300"
                >
                  {/* Member Image wrapper */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <a href={linkedin} target="_blank" rel="noopener noreferrer">
                      <img
                        src={member.image || 'images/Gaurav new.png'}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'images/Gaurav new.png';
                        }}
                      />
                    </a>
                  </div>

                  {/* Member info */}
                  <div className="p-5 text-center space-y-1">
                    <h4 className="text-base font-bold text-slate-800 hover:text-sky-600 transition-colors">
                      <a href={linkedin} target="_blank" rel="noopener noreferrer">
                        {member.name}
                      </a>
                    </h4>
                    <p className="text-xs font-semibold text-sky-500 uppercase tracking-wide">
                      {member.role}
                    </p>
                    {member.linkedinUrl && (
                      <div className="pt-3">
                        <a
                          href={linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-sky-600 font-bold tracking-wider uppercase transition-colors"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                          LinkedIn
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Team;
